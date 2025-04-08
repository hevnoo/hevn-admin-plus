<template>
  <BaseLayout
    :sidebar="preferences.sidebar"
    :header="preferences.header"
    @update:sidebar-collapse="
      (value: boolean) => updatePreferences({ sidebar: { collapsed: value } })
    "
  >
    <!-- logo -->
    <template #logo>
      <LayoutLogo
        :collapsed="preferences.sidebar.collapsed"
        :height="preferences.sidebar.logo.height"
      ></LayoutLogo>
    </template>
    <template #header>
      <!-- 头部内容 -->
      <LayoutHeader>
        <template v-if="preferences.breadcrumb.enable" #breadcrumb>
          <Breadcrumb
            :hide-when-only-one="preferences.breadcrumb.hideOnlyOne"
            :show-home="preferences.breadcrumb.showHome"
            :show-icon="preferences.breadcrumb.showIcon"
            :type="preferences.breadcrumb.styleType"
          />
        </template>
        <!-- <UserDropdown></UserDropdown> -->
        <!-- <template #user-dropdown>
          <slot name="user-dropdown"></slot>
        </template>
        <template #notification>
          <slot name="notification"></slot>
        </template> -->
      </LayoutHeader>
    </template>
    <!-- 菜单 -->
    <template #menu>
      <LayoutMenu :collapse="preferences.sidebar.collapsed"></LayoutMenu>
    </template>

    <!-- 主要内容 -->
    <!-- <router-view class="main-content g-view-container"></router-view> -->

    <!-- <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component" class="main-content g-view-container" />
      </transition>
    </router-view> -->

    <router-view v-slot="{ Component, route }" class="main-content g-view-container">
      <transition name="fade" mode="in-out" :appear="true">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, provide } from "vue";
import BaseLayout from "@/layouts/components/base-layout/BaseLayout.vue";
import { LayoutLogo } from "@/layouts/components/logo";
import { LayoutHeader } from "@/layouts/basic/header";
import { LayoutMenu } from "@/layouts/basic/menu";
import { Breadcrumb } from "@/layouts/widgets";
import { useRoute } from "vue-router";

const route = useRoute();

// 用于强制重新渲染路由组件
const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};

provide("reload", reload);

const preferences = reactive({
  sidebar: {
    visible: true, // 需要设置为 true 才会显示侧边栏
    width: 220, // 设置侧边栏宽度
    theme: "light", // 侧边栏主题
    collapsed: false, // 是否折叠
    logo: {
      height: 49, // 添加 logo 高度配置
      padding: 0, // 可选：添加内边距配置
    },
  },
  header: {
    visible: true, // 需要设置为 true 才会显示头部
    height: 49, // 设置头部高度
    theme: "light", // 头部主题
  },
  breadcrumb: {
    enable: true, // 是否启用面包屑
    hideOnlyOne: false, // 是否隐藏单个路由的面包屑
    showHome: false, // 是否显示首页面包屑
    showIcon: true, // 是否显示面包屑图标
    styleType: "normal", // 面包屑样式类型
  },
});

const updatePreferences = (payload: any) => {
  if (payload.sidebar) {
    Object.assign(preferences.sidebar, payload.sidebar);
  }
};

const cachedViews = computed((): any[] => {
  return route.matched.filter((record) => record.meta.keepAlive).map((record) => record.name);
});

// // 获取需要缓存的组件名称列表
// const cachedViews = computed(() => {
//   // 如果当前路由需要被缓存
//   if (route.meta?.keepAlive) {
//     // 获取组件名称 (确保组件有设置 name)
//     const component = route.matched
//       .filter((record) => record.components?.default)
//       .map((record) => record.components?.default)
//       .pop();
//     return component?.name ? [component.name] : [];
//   }
//   return [];
// });
</script>

<style scoped lang="scss">
.main-content {
  position: relative;
  height: 100%;
  box-sizing: border-box; /* padding 和 border 将包含在高度内 */
}
</style>

<style lang="scss">
/* 页面切换动画fade */
.fade-enter-active,
.fade-leave-active {
  // transition: all 0.5s ease;
  transition: all .5s cubic-bezier(0.4, 0, 0.2, 1); /* 更平滑的缓动 */
  // transition: opacity 0.5s ease, transform 0.5s ease !important; /* 强制覆盖 */
}
.fade-leave-active {
  position: absolute; /* 避免旧组件占位影响布局 */
  width: 100%;
}

/* 进入动画 */
.fade-enter-from {
  opacity: 0; // 组件初始先隐藏
  transform: translateX(30px);
}
// .fade-enter {
//   opacity: 0;
//   transform: translateX(-30px);
// }

/* 离开动画，这里没有被正确触发 */
.fade-leave-to {
  opacity: 0; // 组件离开的时候要隐藏掉
  transform: translateX(-30px);
}
</style>
