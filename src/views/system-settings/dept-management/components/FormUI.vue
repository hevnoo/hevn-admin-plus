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
      <el-col :span="24">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="vFormData.name" placeholder="请输入部门名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="vFormData.code" placeholder="请输入部门编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number
            v-model="vFormData.order"
            :min="0"
            :controls="true"
            placeholder="请输入排序"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <!-- <el-select v-model="vFormData.parentId" placeholder="请选择上级部门" clearable>
            <el-option
              v-for="item in (parentOptions as any[])"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
          <el-tree-select
            v-model="vFormData.parentId"
            :data="parentOptions"
            check-strictly
            :render-after-expand="false"
            placeholder="请选择上级部门"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>

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
  code: [{ required: true, message: "请输入部门编码", trigger: "blur" }],
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
  const res = await api.getList("department", {
    orderBy: [{ order: "asc" }, { createtime: "desc" }],
  });
  const options = res.data.data?.map((item) => ({
    value: item.id,
    label: item.name,
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
