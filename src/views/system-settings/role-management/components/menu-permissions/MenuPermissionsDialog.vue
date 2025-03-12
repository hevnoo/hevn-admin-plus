<template>
  <el-dialog
    title="菜单权限"
    v-model="showMenuPermissionsDialog"
    width="600px"
    :draggable="true"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <el-tree
      ref="treeRef"
      :data="menuOptions"
      show-checkbox
      node-key="id"
      :default-checked-keys="checkedKeys"
      :props="defaultProps"
      default-expand-all
    />
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { api } from "@/api";
import { arrayToTree } from "@/utils";

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
const data = ref<any[]>([]);

const InitForm = {
  id: "",
};
const formData = ref(JSON.parse(JSON.stringify(InitForm)));

watch(
  [() => props.rowData, () => props.showMenuPermissionsDialog],
  ([newRowData, newShowMenuPermissionsDialog]) => {
    if (newShowMenuPermissionsDialog) {
      formData.value = JSON.parse(JSON.stringify({ ...formData.value, ...newRowData }));
      loadPermissionsMenuList(newRowData.id);
    }
  }
);

const handleClose = () => {
  showMenuPermissionsDialog.value = false;
  data.value = [];
  checkedKeys.value = [];
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
