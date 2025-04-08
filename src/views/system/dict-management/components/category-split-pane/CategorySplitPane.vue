<template>
  <div class="category-container">
    <!-- 搜索表单组件 -->
    <!-- <SearchForm ref="searchFormRef" @search="handleSearch" @reset="handleReset" /> -->
    <div class="top-container">
      <el-button icon="Plus" type="primary" @click="handleAddDialog">添加字典分类</el-button>
      <el-input v-model="searchValue" placeholder="请输入字典名称" clearable />
    </div>

    <vxe-tree
      class="tree-container"
      ref="treeRef"
      transform
      :data="filteredTreeList"
      title-field="name"
      key-field="id"
      parent-field="parent_id"
      :node-config="{
        isHover: true,
        isCurrent: true,
      }"
      :loading="loading"
      @current-change="handleCurrentChange"
    >
      <!-- 操作列 -->
      <template #extra="{ node }">
        <!-- <vxe-button mode="text" status="primary" @click.stop="handleEditDialog(node)">编辑</vxe-button> -->
        <vxe-button v-if="node.parent_id" mode="text" status="primary" @click.stop="handleDelete(node)"
          >删除</vxe-button
        >
      </template>

      <!-- column... -->
    </vxe-tree>

    <!-- 弹窗容器 -->
    <CategoryDialog
      v-model:showFormDialog="dialogConfig.show"
      :type="dialogConfig.type"
      :rowData="dialogConfig.data"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from "vue";
import { api } from "@/api";
import { CategoryDialog } from "./components";
import { ElMessage, ElMessageBox } from "element-plus";

const emit = defineEmits(["current-change"]);

const treeRef = ref<any>();
const loading = ref(false);
const treeList = ref<any[]>([]);
const selectedRows = ref([]);

// 弹窗配置
const dialogConfig = reactive<any>({
  show: false,
  type: "", // add, edit, view
  data: null,
});

const cellRenders = {};

let searchValue = ref("");

const filteredTreeList = computed(() => {
  if (!treeList.value || !Array.isArray(treeList.value)) return [];
  if (!searchValue.value) return treeList.value;
  const Maptree = treeList.value.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
  return treeList.value.reduce((acc, item) => {
    if (item.name.includes(searchValue.value)) {
      if (item.parent_id && !acc.some((item) => item.id === item.parent_id)) {
        acc.push(Maptree[item.parent_id]);
      }
      acc.push(item);
    }
    return acc;
  }, []);
});

// 加载数据
const loadData = async (params: any = {}) => {
  loading.value = true;
  try {
    const res = await api.getList("dict_type", {
      where: {
        name: { contains: params.name },
        value: { contains: params.value },
      },
    });

    treeList.value = Array.isArray(res.data.data) ? setTreeFieldData(res.data.data) : [];

    // 如果需要处理分页
    if (treeRef.value) {
      nextTick(() => {
        treeRef.value.setAllExpandNode(true);
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

function setTreeFieldData(data: any[]): any[] {
  const parentNode = { name: "全部字典", id: "all", value: "all", parent_id: null };
  if (!data || !Array.isArray(data)) return [parentNode];
  for (let item of data) {
    item.name = item.name;
    item.parent_id = parentNode.id;
  }
  return [parentNode, ...data] || [];
}

// 搜索处理
function handleSearch(formData) {
  loadData(formData);
}

const handleReset = () => {
  loadData();
};

// 新增
const handleAddDialog = () => {
  dialogConfig.type = "add";
  dialogConfig.data = null;
  dialogConfig.show = true;
};

// 编辑
const handleEditDialog = (row) => {
  dialogConfig.type = "edit";
  dialogConfig.data = row;
  dialogConfig.show = true;
};

// 查看
const handleViewDialog = (row) => {
  dialogConfig.type = "view";
  dialogConfig.data = row;
  dialogConfig.show = true;
};

// 删除
const handleDelete = async (row) => {
  try {
    ElMessageBox.confirm("确认要删除吗？", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        const res = await api.delete("department", { id: row.id });
        if (res.data.code === 200) {
          loadData();
          ElMessage({
            message: "删除成功",
            type: "success",
            plain: true,
          });
        } else {
          ElMessage.error("删除失败");
        }
      })
      .catch(() => {});
  } catch (err) {
    console.error(err);
  }
};

// 弹窗成功回调
const handleDialogSuccess = () => {
  loadData();
};

// 添加选择行事件处理
function handleCurrentChange(row, data) {
  emit("current-change", row, data);
}

// 初始化
loadData();
</script>

<style lang="scss">
.category-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  .top-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-top: 12px;
  }
  .tree-container {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
// // 选中行高亮样式
// .vxe-table--render-default .vxe-body--row.row--checked {
//   background-color: rgba(64, 158, 255, 0.1);
//   &:hover {
//     background-color: rgba(64, 158, 255, 0.1);
//   }
// }
</style>
