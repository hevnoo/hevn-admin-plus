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
        <el-form-item label="字典名称" prop="dict_name">
          <el-input v-model="vFormData.dict_name" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="dict_value">
          <el-input v-model="vFormData.dict_value" placeholder="请输入字典值"></el-input>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-radio-group v-model="vFormData.language" size="small">
            <el-radio-button
              v-for="(item, index) in languageOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="order">
          <el-input v-model="vFormData.order" type="number" placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-input v-model="vFormData.color" placeholder="请输入颜色"></el-input>
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
import { ElMessage, type FormItemProps, type FormProps } from "element-plus";
import { api } from "@/api";
import dayjs from "dayjs";
import { useVModel } from "@/hooks/useVModel";

interface FormUIProps {
  title?: string;
  formData?: any;
  type?: string;
}
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
  dict_value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
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

const languageOptions = ref([
  { value: "zh", label: "中文" },
  { value: "en", label: "英文" },
]);
// const loadRoles = async () => {
//   try {
//     const res = await api.getList("buttons");
//     bottonOptions.value = res.data.data?.map((item) => ({
//       value: item.id,
//       label: item.dict_name,
//     }));
//   } catch (error) {
//     console.error("加载失败", error);
//   }
// };

// 暴露方法给父组件，方便父组件通过ref实例调用
defineExpose({
  validate,
  resetForm,
  vFormData,
});

// 初始化
onMounted(() => {});
nextTick(() => {
  // loadRoles();
});
</script>

<style scoped lang="scss"></style>
