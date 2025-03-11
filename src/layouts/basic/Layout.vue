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
    <router-view class="main-content g-view-container"></router-view>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "@/layouts/components/base-layout/BaseLayout.vue";
import { LayoutLogo } from "@/layouts/components/logo";
import { LayoutHeader } from "@/layouts/basic/header";
import { LayoutMenu } from "@/layouts/basic/menu";
import { Breadcrumb } from "@/layouts/widgets";
import { reactive } from "vue";

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
</script>

<style scoped lang="scss">
.main-content {
  height: 100%;
  box-sizing: border-box; /* padding 和 border 将包含在高度内 */
}
</style>
