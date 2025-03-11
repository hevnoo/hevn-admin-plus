<template>
  <div :class="layoutClass">
    <!-- 侧边栏 -->
    <aside
      v-if="sidebar?.visible"
      :class="[
        'cus-layout-sidebar',
        `cus-layout-sidebar--${sidebar.theme || theme}`,
        { 'cus-layout-sidebar--collapsed': sidebar?.collapsed },
      ]"
      :style="{ width: `${sidebar?.width}px` }"
    >
      <!-- Logo -->
      <div
        class="cus-layout-logo"
        :style="{
          // height: `${sidebar?.logo?.height || 48}px`,
          // padding: `${sidebar?.logo?.padding || 0}px`,
        }"
      >
        <slot name="logo" />
      </div>

      <!-- 菜单 -->
      <div class="cus-layout-menu">
        <slot name="menu" />
      </div>
    </aside>

    <div class="cus-layout-container">
      <!-- 头部 -->
      <header
        v-if="header?.visible"
        :class="[
          'cus-layout-header',
          `cus-layout-header--${header.theme || theme}`,
          { 'cus-layout-header--fixed': header?.fixed },
        ]"
        :style="{ height: `${header?.height}px` }"
      >
        <el-button
          class="g-icon-button cus-layout-header--button"
          :icon="sidebar?.collapsed ? Expand : Fold"
          @click="handleCollapse(!sidebar?.collapsed as boolean)"
        />
        <slot name="header" />
      </header>

      <!-- 标签栏 -->
      <div v-if="tabbar?.visible" class="cus-layout-tabbar" :style="{ height: `${tabbar?.height}px` }">
        <slot name="tabbar" />
      </div>

      <!-- 主内容区 -->
      <main class="cus-layout-main">
        <slot />
      </main>

      <!-- 页脚 -->
      <footer
        v-if="footer?.visible"
        :class="['cus-layout-footer', { 'cus-layout-footer--fixed': footer?.fixed }]"
        :style="{ height: `${footer?.height}px` }"
      >
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BaseLayoutEmits, BaseLayoutProps } from "./types";
import { computed } from "vue";
import { Fold, Expand } from "@element-plus/icons-vue";

defineOptions({ name: "BaseLayout" });

const props = withDefaults(defineProps<BaseLayoutProps>(), {
  layout: "vertical",
  isMobile: false,
  theme: "light",
});

const emit = defineEmits<BaseLayoutEmits>();

// 计算布局样式
const layoutClass = computed(() => {
  const classes: string[] = ["cus-layout"];

  if (props.layout) {
    classes.push(`cus-layout--${props.layout}`);
  }
  if (props.theme) {
    classes.push(`cus-layout--${props.theme}`);
  }
  if (props.isMobile) {
    classes.push("cus-layout--mobile");
  }
  return classes.join(" ");
});

// 切换侧边栏
function handleToggleSidebar() {
  emit("toggleSidebar");
}

// 折叠侧边栏
function handleCollapse(collapsed: boolean) {
  emit("update:sidebar-collapse", collapsed);
}
</script>

<style lang="scss" scoped>
.cus-layout {
  display: flex;
  width: 100%;
  height: 100%;

  // 侧边栏
  &-sidebar {
    position: relative;
    flex-shrink: 0;
    transition: width 0.3s;

    &--light {
      background: #fff;
      border-right: 1px solid #f0f0f0;
    }

    &--dark {
      background: #001529;
      color: #fff;
    }

    &--collapsed {
      // width: 58px !important;
      width: 64px !important;
    }
  }

  // Logo
  &-logo {
    // height: 48px;
    // padding: 16px;
    overflow: hidden;
  }

  // 主容器
  &-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  // 头部
  &-header {
    padding: 0 10px;
    display: flex;
    align-items: center;

    &--light {
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
    }

    &--dark {
      background: #001529;
      color: #fff;
    }

    &--fixed {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
    }
  }

  // 标签栏
  &-tabbar {
    padding: 8px 16px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
  }

  // 主内容区
  &-main {
    flex: 1;
    padding: 16px;
    overflow: auto;
    background-color: #f6f8f9;
  }

  // 页脚
  &-footer {
    padding: 16px;
    text-align: center;
    background: #f0f0f0;

    &--fixed {
      position: fixed;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 100;
    }
  }

  // 移动端适配
  &--mobile {
    .cus-layout-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 200;
      transform: translateX(-100%);

      &--visible {
        transform: translateX(0);
      }
    }
  }
}
</style>
