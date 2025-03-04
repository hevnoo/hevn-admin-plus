<template>
  <template v-if="!item.meta?.hidden">
    <el-sub-menu v-if="hasChildren(item)" :index="resolvePath(basePath)" :popper-append-to-body="true">
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title || item.name }}</span>
      </template>
      <template v-for="child in item.children" :key="child.path">
        <menu-item :item="child" :base-path="resolvePath(child.path)" />
      </template>
    </el-sub-menu>

    <el-menu-item v-else :index="resolvePath(basePath)">
      <el-icon v-if="item.meta?.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta?.title || item.name }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";

interface MenuItemType {
  path: string;
  name: string;
  meta?: {
    title?: string;
    icon?: string;
    hidden?: boolean;
    roles?: string[];
    keepAlive?: boolean;
    [key: string]: any;
  };
  children?: MenuItemType[];
  [key: string]: any;
}

const props = defineProps({
  item: {
    type: Object as PropType<MenuItemType>,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
});

// 判断是否有子菜单
const hasChildren = (item: MenuItemType) => {
  return item.children && item.children.filter((child) => !child.meta?.hidden).length > 0;
};

// 解析路径
const resolvePath = (routePath: string) => {
  // 处理外部链接
  if (/^(https?:|mailto:|tel:)/.test(routePath)) {
    return routePath;
  }

  // 处理绝对路径
  if (routePath.startsWith("/")) {
    return routePath;
  }

  // 处理相对路径
  return props.basePath.replace(/\/+$/, "") + "/" + routePath.replace(/^\/+/, "");
};
</script>

<style scoped lang="scss"></style>
