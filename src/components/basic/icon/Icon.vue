<template>
  <span :class="iconClass" :style="iconStyle"></span>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "16px",
  },
  color: {
    type: String,
    default: "inherit",
  },
});

const iconClass = computed(() => {
  return `iconfont ${props.icon}`; // 使用阿里图标库的类名
});

const iconStyle = computed(() => {
  return {
    fontSize: props.size,
    color: props.color,
  };
});
</script>

<style scoped lang="scss">
.iconfont {
  display: inline-block;
  font-family: "iconfont"; /* 替换为您的图标库的字体名称 */
}
</style>
