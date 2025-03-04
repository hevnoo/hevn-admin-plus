<template>
  <div :class="['app-logo', `app-logo--${theme}`, className, { 'is-collapsed': collapsed }]">
    <img v-if="src" :src="src" class="app-logo__image" />
    <span v-if="!collapsed" class="app-logo__text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import type { LogoProps } from "./types";
import { computed } from "vue";

defineOptions({ name: "Logo" });

const props = withDefaults(defineProps<LogoProps>(), {
  collapsed: false,
  height: 49,
  src: "src/assets/vue.svg",
  text: "Admin System",
  theme: "light",
  class: "",
});

const className = computed(() => props.class);
</script>

<style lang="scss" scoped>
$transition: all 0.3s;
.app-logo {
  height: v-bind("props.height + 'px'");
  display: flex;
  align-items: center;
  padding-left: 20px;
  cursor: pointer;
  border-bottom: 1px solid transparent; // #f0f0f0
  transition: $transition;

  &__image {
    width: 30px;
    height: 30px;
    object-fit: contain;
    transition: $transition;
  }

  &__text {
    margin-left: 8px;
    font-size: 16px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    transition: $transition;
  }

  // 亮色主题
  &--light {
    background: #fff;

    .app-logo__text {
      color: #000;
    }
  }

  // 暗色主题
  &--dark {
    background: #001529;

    .app-logo__text {
      color: #fff;
    }
  }
}

.is-collapsed {
  justify-content: center;
  padding-left: 0;
}
</style>
