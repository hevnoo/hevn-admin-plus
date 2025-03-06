<template>
  <div class="home-wrapper">
    <SearchForm />
    <BaseTable></BaseTable>
  </div>
</template>

<script setup lang="ts">
import { BaseTable } from "@/components/basic";
import SearchForm from "./components/SearchForm.vue";
import { ref, onMounted, computed, watch, watchEffect, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import XEUtils from "xe-utils";
import { storeToRefs } from "pinia";

import request from "@/api/request";
import { api } from "@/api";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

// console.log(locale.value);
const changeLanguage = (lang) => {
  locale.value = lang; // 切换语言
};

const route = useRoute();
const router = useRouter();
// let { token, role, menu } = storeToRefs(userStore);
interface ObjectType {
  [key: string]: any;
}

let roles = ref<any>([]);
let roleIds = ref<any>([]);

const handleRoles = async () => {
  // const res = await api.create("users", {
  //   email: "test@qq.com",
  //   username: "test",
  //   password: "123456",
  //   roles: [roleIds.value[0]],
  // });
  // const res = await api.update("users", {
  //   id: "cm4u2xj1l0003v1uocqdqnnmu",
  //   nickname: "hevn",
  //   roles: [roleIds.value[0]],
  // });
  const res = await api.delete("users", {
    id: "cm4u2xj1l0003v1uocqdqnnmu",
    include: "roles",
  });
  // const res = await api.hardDelete("users", {
  //   id: "cm4u2xj1l0003v1uocqdqnnmu",
  //   include: "roles",
  // });

  const users = await api.getList("users", {
    page: 1,
    pageSize: 10,
    include: ["roles"],
  });

  console.log(res);
};

const main = async () => {
  const rolesRes = await api.getList("roles", {
    page: 1,
    pageSize: 10,
    include: ["users", "menu"],
  });
  roles.value = rolesRes.data.data;
  roleIds.value = roles.value.map((item) => item.id);

  // api
  //   .getList("menu", {
  //     page: 1,
  //     pageSize: 0,
  //     include: ["roles"],
  //   })
  //   .then((res) => {
  //     menu.value = arrayToTree(res.data.data);
  //     console.log("menu:", res, menu.value);
  //   });

  console.log("所有路由:", router.getRoutes());
};
main();
</script>

<style scoped lang="scss">
.test {
  position: relative;
  width: 200px;
  height: 30px;
  background-color: #eeeeee;
  border-radius: 4px;
  z-index: 1;
  &:hover::before {
    content: "";
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 8px;
    right: 8px;
    background-color: #1890ff; // 高亮背景色
    border-radius: 4px;
    z-index: -1;
  }
}
// .test::before:hover {
//   content: "";
//   position: absolute;
//   top: 4px;
//   bottom: 4px;
//   left: 8px;
//   right: 8px;
//   background-color: #1890ff;
// }
</style>
