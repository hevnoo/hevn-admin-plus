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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="vFormData.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色值" prop="value">
          <el-input v-model="vFormData.value" placeholder="请输入角色值"></el-input>
        </el-form-item>
        <el-form-item label="按钮" prop="buttonIds">
          <el-select
            v-model="vFormData.buttonIds"
            multiple
            placeholder="请选择按钮"
            :disabled="type === 'view'"
          >
            <el-option
              v-for="(botton, index) in (bottonOptions as any[])"
              :key="botton.value"
              :label="botton.label"
              :value="botton.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="vFormData.description" type="textarea" placeholder="请输入描述"></el-input>
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
const bottonOptions = ref([]);

// 表单验证规则
const rules = {
  value: [{ required: true, message: "请输入角色值", trigger: "blur" }],
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
    const res = await api.getList("buttons");
    bottonOptions.value = res.data.data?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  } catch (error) {
    console.error("加载失败", error);
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

<style scoped lang="scss"></style>
