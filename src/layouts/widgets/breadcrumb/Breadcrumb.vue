<template>
  <el-breadcrumb v-if="showBreadcrumb" separator="/" :separator-icon="ArrowRight">
    <el-breadcrumb-item v-if="showHome" to="/"> 首页 </el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="item.path">
      <el-icon v-if="item.icon && showIcon" size="17">
        <component :is="item.icon" />
      </el-icon>
      <span class="title">{{ item.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";

interface PropsType {
  hideWhenOnly?: boolean; // 是否隐藏单个路由的面包屑
  showHome?: boolean; // 是否显示首页面包屑
  showIcon?: boolean; // 是否显示面包屑图标
  type?: string; // 面包屑样式类型
}
const props = withDefaults(defineProps<PropsType>(), {
  hideWhenOnly: false,
  showHome: false,
  showIcon: false,
  type: "normal",
});

const route = useRoute();

// 计算面包屑数据
const breadcrumbs = computed(() => {
  const resultBreadcrumbs = route.matched
    .map((match) => {
      const { meta, path } = match;
      return {
        title: meta.title || "未命名", // 使用路由的 meta.title
        path: path,
        icon: meta.icon,
      };
    })
    .filter((item) => item.title && item.path !== "/" && item.path !== "/403");

  // 如果只显示一个面包屑并且设置了隐藏
  if (props.hideWhenOnly && resultBreadcrumbs.length === 1) {
    return [];
  }
  return resultBreadcrumbs;
});

// 控制面包屑是否显示
const showBreadcrumb = computed(() => {
  return breadcrumbs.value.length > 1 || props.showHome;
});
</script>

<style scoped lang="scss">
.el-breadcrumb {
  line-height: none;

  .el-icon {
    vertical-align: middle; /* 垂直对齐 */
    padding-right: 4px;
  }
  .title {
    vertical-align: middle; /* 垂直对齐 */
  }

  ::v-deep .el-breadcrumb__inner a,
  ::v-deep .el-breadcrumb__inner.is-link {
    font-weight: normal;
  }
}
</style>
