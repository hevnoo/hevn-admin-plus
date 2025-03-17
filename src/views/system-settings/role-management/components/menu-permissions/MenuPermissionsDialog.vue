<template>
  <el-dialog
    :title="`菜单权限 - ${formData.name}`"
    v-model="showMenuPermissionsDialog"
    width="500px"
    :draggable="true"
    :close-on-click-modal="true"
    destroy-on-close
    @close="handleClose"
  >
    <el-input
      v-model="searchValue"
      placeholder="请输入菜单名称"
      clearable
      style="margin-bottom: 10px"
    ></el-input>
    <el-tree
      ref="treeRef"
      :data="filteredMenuOptions"
      show-checkbox
      node-key="id"
      :default-checked-keys="checkedKeys"
      :props="defaultProps"
      default-expand-all
      check-strictly
    />
    <template #footer>
      <!-- <el-button @click="handleClose">取消</el-button> -->
      <el-button v-if="!expandAll" @click="toggleExpandAll(true)">全部展开</el-button>
      <el-button v-else @click="toggleExpandAll(false)">全部收起</el-button>
      <el-button v-if="!checkAll" @click="handleCheckedAll(true)">全部选择</el-button>
      <el-button v-else @click="handleCheckedAll(false)">全部取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { api } from "@/api";

interface DialogProps {
  showMenuPermissionsDialog: boolean;
  rowData: any;
  menuOptions: any[];
}
const props = withDefaults(defineProps<DialogProps>(), {
  showMenuPermissionsDialog: false,
  rowData: () => ({}),
  menuOptions: () => [],
});

const emit = defineEmits(["update:showMenuPermissionsDialog", "success"]);
const showMenuPermissionsDialog = computed({
  get: () => props.showMenuPermissionsDialog,
  set: (val) => emit("update:showMenuPermissionsDialog", val),
});

const defaultProps = {
  children: "children",
  label: "label",
};

const treeRef = ref<any>();
const checkedKeys = ref<string[]>([]);
const data = computed(() => props.menuOptions);
const searchValue = ref<string>("");

const InitForm = {
  id: "",
};
const formData = ref(JSON.parse(JSON.stringify(InitForm)));

const filteredMenuOptions = computed(() => {
  if (!searchValue.value) return props.menuOptions;
  // return data.value.filter((item) => filterRecursion(item, searchValue.value));
  return filterTree(props.menuOptions);
});

function filterTree(nodes: any[]): any[] {
  const result: any[] = [];

  for (const node of nodes) {
    // 创建新的节点对象，避免修改原始数据
    const newNode = { ...node };
    // 检查当前节点是否匹配
    const isMatch = node.label.toLowerCase().includes(searchValue.value.toLowerCase());
    // 如果有子节点，递归过滤
    if (node.children && node.children.length) {
      newNode.children = filterTree(node.children);
    }
    // 如果当前节点匹配或者子节点中有匹配项，则保留该节点
    if (isMatch || (newNode.children && newNode.children.length)) {
      result.push(newNode);
    }
  }
  return result;
}

// function filterTree(nodes: any[]): any[] {
//   const result: any[] = [];

//   for (const node of nodes) {
//     // 创建新的节点对象，避免修改原始数据
//     const newNode = { ...node };
//     // 检查当前节点是否匹配
//     const isMatch = node.label.toLowerCase().includes(searchValue.value.toLowerCase());
//     // 如果有子节点，递归过滤

//     // 如果当前节点匹配或者子节点中有匹配项，则保留该节点
//     if (isMatch) {
//       result.push(newNode);
//     } else if (newNode.children && newNode.children.length) {
//       result.push(...filterTree(newNode.children));
//     }
//   }
//   return result;
// }

watch(
  [() => props.rowData, () => props.showMenuPermissionsDialog],
  ([newRowData, newShowMenuPermissionsDialog]) => {
    if (newShowMenuPermissionsDialog) {
      formData.value = JSON.parse(JSON.stringify({ ...formData.value, ...newRowData }));
      loadPermissionsMenuList(newRowData.id);
    }
  }
);

const checkAll = ref<boolean>(false);
const expandAll = ref<boolean>(true);
// 展开
const toggleExpandAll = (type: boolean) => {
  if (type) {
    expandAll.value = true;
    Object.values(treeRef.value.store.nodesMap).forEach((v: any) => v.expand());
    return;
  }
  expandAll.value = false;
  Object.values(treeRef.value.store.nodesMap).forEach((v: any) => v.collapse());
};
// 全选
const handleCheckedAll = (checked: boolean) => {
  checkAll.value = checked;
  setCheckedRecursive(data.value, checked);
};
const setCheckedRecursive = (nodes: any, checked: boolean) => {
  for (const node of nodes) {
    treeRef.value.setChecked(node.id, checked);
    if (node.children && node.children.length > 0) {
      setCheckedRecursive(node.children, checked);
    }
  }
};

const handleClose = () => {
  showMenuPermissionsDialog.value = false;
  checkedKeys.value = [];
  checkAll.value = false;
  expandAll.value = true;
};

const handleSubmit = async () => {
  // 获取当前选中的节点keys
  const checkedNodes = treeRef.value.getCheckedKeys();
  // 获取半选中的节点keys（父节点）
  const halfCheckedNodes = treeRef.value.getHalfCheckedKeys();

  // 合并所有选中的节点
  const allSelectedKeys = [...checkedNodes, ...halfCheckedNodes];

  const { id } = formData.value;
  const params = {
    menu: allSelectedKeys,
    include: ["menu"],
  };
  const res = await api.update("roles", id, params);
  if (res.data.code === 200) {
    ElMessage.success("操作成功");
    // 通知父组件操作成功
    emit("success");
    // 关闭对话框
    handleClose();
  } else {
    ElMessage.error("操作失败");
  }
};

const loadPermissionsMenuList = async (roleId: string) => {
  const res = await api.getList("menu", {
    where: {
      roles: { some: { id: roleId } },
    },
    orderBy: [{ order: "asc" }, { createtime: "desc" }],
  });
  // 设置默认选中的节点
  checkedKeys.value = res.data.data?.map((item) => item.id) || [];
};

nextTick(() => {});
</script>

<style scoped lang="scss"></style>
