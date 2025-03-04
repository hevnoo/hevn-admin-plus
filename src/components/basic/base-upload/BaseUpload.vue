<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload"
    :action="`${URL}/api/files/upload`"
    :headers="headers"
    multiple
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="3"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <el-button type="primary">Click to upload</el-button>
    <template #tip>
      <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import { URL } from "@/config";

// 设置请求头
const headers = computed(() => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
}));

const fileList = ref<UploadUserFile[]>([]);

const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
    () => true,
    () => false
  );
};

const handleSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
};

const beforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};

const handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

// 检查文件类型
function checkFile(filePath) {
  let index = filePath.lastIndexOf("."); //获取后缀
  let fileType = filePath.substr(index + 1);
  return fileType;
}
</script>
