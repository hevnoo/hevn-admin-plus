<template>
  <el-dialog
    :title="dialogTitle"
    v-model="showDialog"
    width="800px"
    :draggable="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <FormUI ref="formRef" :type="type" v-model:formData="formData" @form-change="handleFormChange" />

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button v-if="type !== 'view'" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import FormUI from "./FormUI.vue";
import { FormDataProps } from "../types";
import { ElMessage } from "element-plus";
import { api } from "@/api";

const props = defineProps<{
  showFormDialog: boolean;
  type: string;
  rowData: any;
}>();

const emit = defineEmits(["update:showFormDialog", "success"]);

// 表单引用
const formRef = ref();

// 表单数据
const formData = ref<FormDataProps>({
  username: "",
  nickname: "",
  email: "",
  phone: "",
  avatar: "",
  roles: [],
  roleIds: [],
  status: true,
});

let originalFormData: any = {}; // 记录原始表单数据，用于比较

// 对话框v-model
const showDialog = computed({
  get: () => props.showFormDialog,
  set: (val) => emit("update:showFormDialog", val),
});

// 对话框标题
const dialogTitle = computed(() => {
  const titles = {
    add: "新增用户",
    edit: "编辑用户",
    view: "用户详情",
  };
  return titles[props.type] || "用户信息";
});

// 监听行数据变化，初始化表单
watch(
  [() => props.rowData, () => props.showFormDialog, () => props.type],
  ([newRowData, newShowDialog, newType]) => {
    // 当对话框打开时，初始化表单数据
    if (newShowDialog) {
      if (newRowData && Object.keys(newRowData).length > 0) {
        // 深拷贝防止直接修改props
        const data = JSON.parse(JSON.stringify(newRowData));
        formData.value = {
          ...data,
          roleIds: data.roles.map((item) => item.id),
        };
        originalFormData = JSON.parse(JSON.stringify(formData.value));
      } else if (newType === "add") {
        // 新增时重置表单
        resetForm();
      }
    }
  },
  { immediate: true, deep: true }
);

// 处理表单数据变化
const handleFormChange = (val) => {};

// 关闭对话框
const handleClose = () => {
  emit("update:showFormDialog", false);
  resetForm();
};

// 重置表单
const resetForm = () => {
  formData.value = {
    username: "",
    nickname: "",
    email: "",
    phone: "",
    // roles: [],
    roleIds: [],
    status: true,
  };

  // 如果表单引用存在，调用其重置方法
  if (formRef.value && formRef.value.resetForm) {
    formRef.value.resetForm();
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    // 调用子组件的验证方法
    const valid = await formRef.value.validate();
    if (!valid) return;

    // 根据类型执行不同的操作
    if (props.type === "add") {
      const { username, nickname, email, phone, password, avatar, status, roleIds } = formData.value;
      const params = {
        username,
        nickname,
        email,
        phone,
        password,
        avatar,
        status,
        roles: roleIds,
        include: ["roles"],
      };
      const res = await api.create("users", params);
      if (res.data.code === 200) {
        ElMessage.success("添加成功");
        // 通知父组件操作成功
        emit("success");
        // 关闭对话框
        handleClose();
      } else {
        ElMessage.error("添加失败");
      }
    } else if (props.type === "edit") {
      const { id, username, nickname, email, phone, avatar, status, roleIds } = formData.value;
      let params: any = {
        nickname,
        phone,
        avatar,
        status,
        roles: roleIds,
        include: ["roles"],
      };
      // 记录表单中被修改的字段
      if (originalFormData.password !== formData.value.password) {
        params.password = formData.value.password;
      }

      const res = await api.update("users", id, params);
      if (res.data.code === 200) {
        ElMessage.success("更新成功");
        // 通知父组件操作成功
        emit("success");
        // 关闭对话框
        handleClose();
      } else {
        ElMessage.error("更新失败");
      }
    }
  } catch (error) {
    console.error("操作失败", error);
    ElMessage.error("操作失败");
  }
};
</script>

<style scoped lang="scss"></style>
