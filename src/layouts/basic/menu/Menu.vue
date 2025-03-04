<template>
  <BaseMenu v-model="menu" mode="vertical" :collapse="false" :unique-opened="true" />
</template>

<script setup lang="ts">
import { BaseMenu } from "@/components/basic";
import { ref } from "vue";
import { arrayToTree } from "@/utils";

const menu = ref<any[]>([]);

const main = async () => {
  const menuList = JSON.parse(localStorage.getItem("menu") || "[]");
  menu.value = arrayToTree(menuList);
};
main();
</script>

<style scoped lang="scss"></style>
