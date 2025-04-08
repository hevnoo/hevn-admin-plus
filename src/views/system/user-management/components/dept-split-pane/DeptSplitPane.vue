<template>
  <div class="category-container">
    <div class="top-container">
      <!-- <el-button icon="Plus" type="primary" @click="handleAddDialog">添加分类</el-button> -->
      <el-input v-model="searchValue" placeholder="请输入" clearable />
    </div>
    <el-tree
      ref="treeRef"
      style="max-width: 100%"
      :data="filteredTreeList"
      node-key="id"
      :default-checked-keys="defaultCheckedKeys"
      :current-node-key="currentNodeKey"
      :props="defaultProps"
      highlight-current
      default-expand-all
      :show-checkbox="false"
      check-strictly
      :expand-on-click-node="false"
      @current-change="handleCurrentChange"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import { api } from "@/api";
import { arrayToTree } from "@/utils";
import { ElMessage, ElMessageBox } from "element-plus";

const emit = defineEmits(["current-change"]);

const defaultProps = {
  children: "children",
  label: "name",
};

const treeRef = ref<any>();
const loading = ref(false);
const treeList = ref<any[]>([]);
const defaultCheckedKeys = ref<string[]>([]); // 勾选框默认选中的节点
const currentNodeKey = ref<any>(); // 当前选中的节点
let searchValue = ref("");

const filteredTreeList = computed(() => {
  if (!searchValue.value) return treeList.value;
  // return data.value.filter((item) => filterRecursion(item, searchValue.value));
  return filterTree(treeList.value, "name");
});

function filterTree(nodes: any[], field: string): any[] {
  const result: any[] = [];

  for (const node of nodes) {
    // 创建新的节点对象，避免修改原始数据
    const newNode = { ...node };
    // 检查当前节点是否匹配
    const isMatch = node[field].toLowerCase().includes(searchValue.value.toLowerCase());
    // 如果有子节点，递归过滤
    if (node.children && node.children.length) {
      newNode.children = filterTree(node.children, field);
    }
    // 如果当前节点匹配或者子节点中有匹配项，则保留该节点
    if (isMatch || (newNode.children && newNode.children.length)) {
      result.push(newNode);
    }
  }
  return result;
}

// 加载数据
const loadData = async (params: any = {}) => {
  loading.value = true;
  try {
    const res = await api.getList("department", {
      where: {
        name: { contains: params.name },
      },
    });

    treeList.value = Array.isArray(res.data.data) ? arrayToTree(res.data.data) : [];
    if (treeList.value.length > 0) {
      nextTick(() => {
        if (treeRef.value) {
          // setCurrentKey(treeList.value[0].id); // 默认选中第一个节点
          // setCurrentNode(treeList.value[0]);
        }
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleNodeClick = (row: any, node: any) => {
  if (row.id === currentNodeKey.value) {
    setCurrentKey(null);
    // setCurrentNode(null);
    row.departmentIds = [];
  } else {
    setCurrentKey(row.id);
    // setCurrentNode(row);

    let allDepartmentIds: string[] = [];
    // 获取所有子节点
    const getAllChildrenIds = (node: any) => {
      let ids: string[] = [];
      if (node.children && node.children.length) {
        node.children.forEach((child: any) => {
          ids.push(child.id);
          ids.push(...getAllChildrenIds(child));
        });
      }
      return ids;
    };
    // 获取当前节点及其所有子节点的ID
    allDepartmentIds = [row.id, ...getAllChildrenIds(row)];
    row.departmentIds = allDepartmentIds;
  }
  emit("current-change", { departmentIds: row.departmentIds, id: row.id }, node);
};

const handleCurrentChange = (row: any, node: any) => {
  // setCurrentKey(row.id);
  // // setCurrentNode(row);
  // let allDepartmentIds: string[] = [];
  // // 获取所有子节点
  // const getAllChildrenIds = (node: any) => {
  //   let ids: string[] = [];
  //   if (node.children && node.children.length) {
  //     node.children.forEach((child: any) => {
  //       ids.push(child.id);
  //       ids.push(...getAllChildrenIds(child));
  //     });
  //   }
  //   return ids;
  // };
  // // 获取当前节点及其所有子节点的ID
  // allDepartmentIds = [row.id, ...getAllChildrenIds(row)];
  // row.departmentIds = allDepartmentIds;
  // emit("current-change", row, node);
};

// 设置当前选中节点
const setCurrentKey = (key: any) => {
  currentNodeKey.value = key;
  if (treeRef.value) {
    treeRef.value.setCurrentKey(key);
  }
};

// 设置当前选中节点
const setCurrentNode = (node: any) => {
  currentNodeKey.value = node.id;
  if (treeRef.value) {
    treeRef.value.setCurrentNode(node);
  }
};

onMounted(() => {
  loadData();
});
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
}
// // 选中行高亮样式
// .vxe-table--render-default .vxe-body--row.row--checked {
//   background-color: rgba(64, 158, 255, 0.1);
//   &:hover {
//     background-color: rgba(64, 158, 255, 0.1);
//   }
// }
</style>
