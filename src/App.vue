<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import { auth } from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";

const useAuth: any = auth();

// 双击esc登出
function logout() {
  let lastKeyPressTime = 0;
  let doubleKeyPressDelay = 500; // 设置双击键间隔的最大时间
  document.addEventListener("keydown", function (event) {
    let currentTime = new Date().getTime();
    if (event.key === "Escape") {
      if (currentTime - lastKeyPressTime <= doubleKeyPressDelay) {
        // 如果两次按键间隔小于阈值，则表示用户按下了两次
        msgBox();
      }
      lastKeyPressTime = currentTime;
    }
  });
}
const msgBox = () => {
  ElMessageBox.confirm("确定要退出登录吗?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "退出登录",
      });
      useAuth.logout();
    })
    .catch(() => {});
};

onMounted(() => {
  nextTick(() => {
    logout();
  });
});
</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="scss">
@use "@/styles/index.scss" as *;
</style>
