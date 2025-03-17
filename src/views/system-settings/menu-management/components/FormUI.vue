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
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="vFormData.parentId"
            :data="parentOptions"
            check-strictly
            :render-after-expand="false"
            placeholder="请选择上级菜单"
            clearable
          />
        </el-form-item>
        <el-form-item label="路由名称" prop="name">
          <el-input v-model="vFormData.name" placeholder="请输入路由名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="vFormData.component" placeholder="请输入组件路径" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-switch v-model="vFormData.hidden" clearable></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="菜单名称" prop="label">
          <el-input v-model="vFormData.label" placeholder="请输入菜单名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="vFormData.path" placeholder="请输入路由路径" clearable></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input v-model="vFormData.redirect" placeholder="请输入重定向" clearable></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="vFormData.icon" placeholder="请输入图标" clearable></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="元信息" prop="meta">
      <el-input v-model="vFormData.meta" type="textarea" placeholder="请输入元信息" clearable></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted, nextTick, computed } from "vue";
import { FormDataProps, FormUIProps } from "../types";
import { ElMessage, type FormItemProps, type FormProps } from "element-plus";
import { api } from "@/api";
import dayjs from "dayjs";
import { useVModel } from "@/hooks/useVModel";
import { arrayToTree } from "@/utils";

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

// 表单验证规则
const rules = {
  label: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
  name: [{ required: true, message: "请输入路由名称", trigger: "blur" }],
  component: [{ required: true, message: "请输入组件路径", trigger: "blur" }],
  meta: [
    {
      validator: (rule: any, value: string, callback: any) => {
        if (!value) {
          callback();
          return;
        }
        try {
          JSON.parse(value);
          callback();
        } catch (e) {
          callback(new Error("请输入有效的 JSON 格式"));
        }
      },
      trigger: "blur",
    },
  ],
};

// 格式化 JSON
const formatJson = (value: string) => {
  try {
    const obj = JSON.parse(value);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return value;
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

const parentOptions = ref<any[]>([]);
const loadParentOptions = async () => {
  const res = await api.getList("menu", {
    where: {
      id: {
        not: vFormData.value.id,
      },
    },
    orderBy: [{ order: "asc" }, { createtime: "desc" }],
  });
  const options = res.data.data?.map((item) => ({
    value: item.id,
    label: item.label,
    id: item.id,
    parent_id: item.parent_id,
  }));
  parentOptions.value = arrayToTree(options, "parent_id", "id");
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
  loadParentOptions();
});
</script>

<style scoped lang="scss"></style>
