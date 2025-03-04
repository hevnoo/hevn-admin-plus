<template>
  <div class="upload">
    <el-button type="primary" @click="handleClick">选择文件</el-button>
    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
    <div v-if="currentFile" class="progress">
      <div>{{ currentFile.name }}</div>
      <el-progress :percentage="uploadProgress" />
      <div class="operations">
        <el-button size="small" type="primary" @click="startUpload" :loading="uploading">
          {{ uploading ? "上传中" : "开始上传" }}
        </el-button>
        <el-button size="small" type="warning" @click="pauseUpload" :disabled="!uploading"> 暂停 </el-button>
        <el-button size="small" type="danger" @click="cancelUpload"> 取消 </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import SparkMD5 from "spark-md5";
import { uploadCheckApi, uploadChunkApi, uploadMergeApi } from "@/api/modules";

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB per chunk
const fileInput = ref<HTMLInputElement | null>(null);
const currentFile = ref<File | null>(null);
const fileHash = ref("");
const chunks = ref<Blob[]>([]); // 分片
const uploadedChunks = ref<Set<number>>(new Set()); // 已上传分片
const uploading = ref(false); // 是否正在上传
const controller = ref<AbortController | null>(null); // 控制器

const uploadProgress = computed(() => {
  if (!chunks.value.length) return 0;
  return Math.round((uploadedChunks.value.size / chunks.value.length) * 100);
});

// 选择文件
const handleClick = () => {
  fileInput.value?.click();
};

// 文件改变时的处理
const handleFileChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files?.length) return;

  currentFile.value = files[0];
  fileHash.value = await calculateHash(files[0]);
  console.log("fileHash:", fileHash.value);
  createFileChunks();

  // 检查是否有未完成的上传
  await checkUploadStatus();
};

// 计算文件hash
// const calculateHash = (file: File): Promise<string> => {
//   return new Promise((resolve) => {
//     const spark = new SparkMD5.ArrayBuffer();
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       spark.append(e.target?.result as ArrayBuffer);
//       resolve(spark.end());
//     };
//     reader.readAsArrayBuffer(file);
//   });
// };
const calculateHash = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const chunks = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = 0;
    let percentage = 0;

    // 创建一个文件阅读器
    const reader = new FileReader();

    // 读取完成后的处理
    reader.onload = (e) => {
      spark.append(e.target?.result as ArrayBuffer);
      currentChunk++;
      // 计算进度
      percentage = Math.round((currentChunk / chunks) * 100);
      // console.log(`Hash计算进度: ${percentage}%`);
      if (currentChunk < chunks) {
        // 继续读取下一块
        loadNext();
      } else {
        // 所有块都已读取完成，计算最终的hash值
        const hash = spark.end();
        resolve(hash);
      }
    };

    // 读取下一块数据
    const loadNext = () => {
      const start = currentChunk * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      reader.readAsArrayBuffer(file.slice(start, end));
    };
    // 开始读取第一块
    loadNext();
  });
};

// 创建文件分片
const createFileChunks = () => {
  if (!currentFile.value) return;

  const file = currentFile.value;
  chunks.value = [];

  // 计算需要的分片数量
  const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
  for (let i = 0; i < chunkCount; i++) {
    const start = i * CHUNK_SIZE;
    const chunk = file.slice(start, start + CHUNK_SIZE);
    chunks.value.push(chunk);
  }
};

// 检查上传状态
const checkUploadStatus = async () => {
  try {
    const response = await uploadCheckApi({
      fileHash: fileHash.value,
      fileName: currentFile.value?.name,
    });

    if (!response.data.shouldUpload) {
      ElMessage.success("该文件已上传");
      return;
    }

    uploadedChunks.value = new Set(response.data.uploadedChunks);
  } catch (error) {
    console.error("检查上传状态失败:", error);
  }
};

// 上传单个分片
const uploadChunk = async (chunk: Blob, index: number) => {
  if (uploadedChunks.value.has(index)) return;

  const formData = new FormData();
  formData.append("chunk", chunk);
  formData.append("hash", `${fileHash.value}-${index}`);
  formData.append("fileHash", fileHash.value);
  formData.append("fileName", currentFile.value?.name || "");
  formData.append("chunkIndex", index.toString());
  formData.append("totalChunks", chunks.value.length.toString());

  try {
    await uploadChunkApi(formData, {
      signal: controller.value?.signal,
    }); // axios取消请求的配置 signal

    // 将已上传的分片索引添加到已上传分片集合中
    uploadedChunks.value.add(index);
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("上传已取消");
      return;
    }
    throw error;
  }
};

// 开始上传
const startUpload = async () => {
  if (!chunks.value.length) return;

  uploading.value = true;
  controller.value = new AbortController();

  try {
    // 上传分片
    const tasks = chunks.value.map((chunk, index) => uploadChunk(chunk, index));
    await Promise.all(tasks); // 等待所有分片上传完成，如果有失败的任务，则抛出错误，后续代码不会执行

    // 所有分片上传完成，通知服务器合并文件
    await uploadMergeApi({
      fileHash: fileHash.value,
      fileName: currentFile.value?.name,
      totalChunks: chunks.value.length,
    });

    ElMessage.success("上传成功");
  } catch (error) {
    console.error("上传失败:", error);
    ElMessage.error("上传失败");
  } finally {
    uploading.value = false;
    controller.value = null;
  }
};

// 暂停上传
const pauseUpload = () => {
  controller.value?.abort();
  uploading.value = false;
};

// 取消上传
const cancelUpload = () => {
  controller.value?.abort(); // 取消请求
  uploading.value = false;
  currentFile.value = null;
  fileHash.value = "";
  chunks.value = [];
  uploadedChunks.value.clear();
  // 重置文件输入框的值
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};
</script>

<style scoped lang="scss">
.upload {
  padding: 20px;
}

.progress {
  margin-top: 20px;
}

.operations {
  margin-top: 10px;
}
</style>
