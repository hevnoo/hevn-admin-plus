<template>
  <div class="search-form">
    <vxe-form :data="formData" :items="(formItems as any[])">
      <template #buttons>
        <vxe-button status="primary" @click="handleSearch">搜索</vxe-button>
        <vxe-button @click="handleReset">重置</vxe-button>
      </template>
    </vxe-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["search", "reset"]);

const formData = ref({
  username: "",
  email: "",
  status: "",
});

const formItems = [
  {
    span: 5,
    field: "username",
    title: "用户名",
    clearable: true,
    itemRender: {
      name: "$input",
      props: {
        clearable: true,
        placeholder: "请输入",
        transfer: true, // 添加 transfer
      },
    },
  },
  {
    span: 5,
    field: "email",
    title: "邮箱",
    itemRender: {
      name: "$input",
      props: {
        clearable: true,
        placeholder: "请输入",
        transfer: true, // 添加 transfer
      },
    },
  },
  {
    span: 5,
    field: "status",
    title: "状态",
    itemRender: {
      name: "$select",
      options: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 },
      ],
      props: {
        clearable: true,
        placeholder: "请选择",
        transfer: true, // 添加 transfer
      },
    },
  },
  {
    span: 9,
    align: "right",
    itemRender: {
      name: "$buttons",
      children: [
        { props: { type: "submit", content: "搜索", status: "primary" }, events: { click: handleSearch } },
        { props: { type: "reset", content: "重置" }, events: { click: handleReset } },
      ],
    },
  },
];

function handleSearch() {
  emit("search", formData.value);
}

function handleReset() {
  for (let key in formData.value) {
    formData.value[key] = "";
  }
  emit("reset");
}

defineExpose({
  formData,
});
</script>
<style scoped lang="scss"></style>
