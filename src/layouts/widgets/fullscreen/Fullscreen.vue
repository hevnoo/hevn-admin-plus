<template>
  <el-button class="g-icon-button" @click="toggleFullScreen">
    <el-icon v-if="!isFullScreen">
      <FullScreen />
    </el-icon>
    <el-icon v-else>
      <FullScreen />
    </el-icon>
  </el-button>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { FullScreen } from "@element-plus/icons-vue";

const isFullScreen = ref(false);

const toggleFullScreen = () => {
  if (!isFullScreen.value) {
    // 请求全屏
    const elem: any = document.documentElement; // 获取文档根元素
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      // Chrome, Safari 和 Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      // IE/Edge
      elem.msRequestFullscreen();
    }
    isFullScreen.value = true;
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari 和 Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
    isFullScreen.value = false;
  }
};

// 处理全屏状态变化
const handleFullScreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement;
};

// 监听全屏状态变化
onMounted(() => {
  document.addEventListener("fullscreenchange", handleFullScreenChange);
  document.addEventListener("mozfullscreenchange", handleFullScreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
  document.addEventListener("msfullscreenchange", handleFullScreenChange);
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", handleFullScreenChange);
  document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
  document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
  document.removeEventListener("msfullscreenchange", handleFullScreenChange);
});
</script>

<style scoped lang="scss"></style>
