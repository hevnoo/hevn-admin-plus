<template>
  <el-form
    ref="formRef"
    :model="vFormData"
    :rules="rules"
    label-width="80px"
    :disabled="type === 'view'"
    @change="(val) => emit('form-change', val)"
  >
    <!-- gutter用于定义栅格列与列的间距 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="vFormData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="vFormData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <template v-if="type !== 'view'">
          <el-form-item label="密码" prop="password">
            <el-input v-model="vFormData.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
        </template>
      </el-col>
      <el-col :span="12">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="vFormData.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="vFormData.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="vFormData.roleIds"
            multiple
            placeholder="请选择角色"
            :disabled="type === 'view'"
          >
            <el-option
              v-for="(role, index) in (roleOptions as any[])"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 根据类型显示不同的字段 -->
    <template v-if="type !== 'add'">
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="vFormData.status"
          :active-value="true"
          :inactive-value="false"
          :disabled="type === 'view'"
        ></el-switch>
      </el-form-item>
    </template>

    <el-form-item label="头像" prop="avatar">
      <el-upload
        class="avatar-uploader"
        :action="`${SERVER_URL}/api/files/upload`"
        :headers="uploadHeaders"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="vFormData.avatar" :src="SERVER_URL + vFormData.avatar" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>

    <!-- 仅在编辑模式显示的字段 -->
    <template v-if="type === 'edit'">
      <el-form-item label="更新时间">
        <span>{{ formatDate(vFormData.updatetime) }}</span>
      </el-form-item>
    </template>

    <!-- 仅在查看模式显示的字段 -->
    <template v-if="type === 'view'">
      <el-form-item label="创建时间">
        <span>{{ formatDate(vFormData.createtime) }}</span>
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted, nextTick, computed } from "vue";
import { FormDataProps, FormUIProps } from "../types";
import { ElMessage, type FormItemProps, type FormProps } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { api } from "@/api";
import dayjs from "dayjs";
import { useVModel } from "@/hooks/useVModel";
import { SERVER_URL } from "@/config";

const props = withDefaults(defineProps<FormUIProps>(), {
  title: "表单",
  formData: () => ({}),
  type: "add", // 添加类型属性，默认为add
});

const emit = defineEmits(["update:formData", "form-change"]);
const vFormData = useVModel(props, "formData", emit);

const labelPosition = ref<FormProps["labelPosition"]>("right");
const itemLabelPosition = ref<FormItemProps["labelPosition"]>("");
const formRef = ref();
const roleOptions = ref([]);

// 表单验证规则
const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  ...(props.type !== "view"
    ? {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      }
    : {}),
  // 根据类型设置不同的验证规则
  ...(props.type !== "view"
    ? {
        roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
      }
    : {}),
};

// 上传头像的请求头
const uploadHeaders = computed(() => {
  return {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
});

const handleAvatarSuccess = (res) => {
  console.log("上传成功", res);
  vFormData.value.avatar = res.url;
};

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  if (!isJPG && !isPNG) {
    ElMessage.error("上传头像图片只能是 JPG 或 PNG 格式!");
  }
};

// 格式化日期
const formatDate = (date) => {
  if (!date) return "--";
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
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

// 加载角色列表
const loadRoles = async () => {
  try {
    const res = await api.getList("roles");
    roleOptions.value = res.data.data?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  } catch (error) {
    console.error("加载角色列表失败", error);
  }
};

// 暴露方法给父组件，方便父组件通过ref实例调用
defineExpose({
  validate,
  resetForm,
  vFormData,
});

// 初始化
onMounted(() => {});
nextTick(() => {
  loadRoles();
});
</script>

<style scoped lang="scss">
// 上传
.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 170px;
  height: 170px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  &:hover {
    border-color: #409eff;
  }
  .avatar {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  :deep(.el-upload) {
    width: 100%;
    height: 100%;
  }
  .el-icon.avatar-uploader-icon {
    width: 100%;
    height: 100%;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
}
</style>
