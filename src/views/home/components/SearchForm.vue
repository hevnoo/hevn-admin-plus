<template>
  <div>
    <vxe-form v-bind="formOptions" v-on="formEvents"></vxe-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { VxeUI, VxeFormProps, VxeFormListeners } from "vxe-pc-ui";

interface FormDataVO {
  name: string;
  nickname: string;
  sex: string;
  age: string;
}

const formOptions = reactive<VxeFormProps<FormDataVO>>({
  data: {
    name: "test1",
    nickname: "Testing",
    sex: "",
    age: "",
  },
  items: [
    { field: "name", title: "名称", itemRender: { name: "VxeInput" } },
    { field: "sex", title: "性别", itemRender: { name: "VxeInput" } },
    { field: "age", title: "年龄", itemRender: { name: "VxeInput" } },
    {
      itemRender: {
        name: "VxeButtonGroup",
        options: [
          { type: "submit", content: "提交", status: "primary" },
          { type: "reset", content: "重置" },
        ],
      },
    },
  ],
});

const formEvents: VxeFormListeners<FormDataVO> = {
  submit() {
    VxeUI.modal.message({ content: "保存成功", status: "success" });
  },
  reset() {
    VxeUI.modal.message({ content: "重置事件", status: "info" });
  },
};
</script>
