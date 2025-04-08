<template>
  <el-dialog
    :title="`重置密码 - ${rowData?.username}`"
    v-model="showResetPasswordDialog"
    width="500px"
    :draggable="true"
    :close-on-click-modal="true"
    destroy-on-close
    @close="handleClose"
  >
    <el-form ref="formRef" :model="passwordForm" :rules="rules" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="passwordForm.password"
              placeholder="请输入密码"
              clearable
              type="password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              placeholder="请再次输入密码"
              clearable
              type="password"
              show-password
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { api } from "@/api";

interface PropTypes {
  showResetPasswordDialog: boolean;
  rowData: any;
}
const props = withDefaults(defineProps<PropTypes>(), {
  showResetPasswordDialog: false,
  rowData: () => ({}),
});

const emit = defineEmits(["update:showResetPasswordDialog", "success"]);
const showResetPasswordDialog = computed({
  get: () => props.showResetPasswordDialog,
  set: (val) => emit("update:showResetPasswordDialog", val),
});

const formRef = ref<any>(null);
const passwordForm = ref({
  password: "",
  confirmPassword: "",
});

const rules = {
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度必须大于6位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== passwordForm.value.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

// 表单验证方法
const validate = async () => {
  if (!formRef.value) return false;
  return await formRef.value
    .validate()
    .then(() => true)
    .catch(() => false);
};

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

const handleClose = () => {
  showResetPasswordDialog.value = false;
};

const handleSubmit = async () => {
  const valid = await validate();
  if (!valid) return;

  const { id } = props.rowData;
  const params = {
    password: passwordForm.value.password,
  };
  const res = await api.update("users", id, params);
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
</script>

<style scoped lang="scss"></style>
