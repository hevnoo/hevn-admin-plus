<template>
  <el-menu
    class="g-menu"
    :default-active="activeMenu"
    :mode="mode"
    :collapse="collapse"
    :unique-opened="uniqueOpened"
    :collapse-transition="collapseTransition"
    :background-color="backgroundColor"
    :text-color="textColor"
    :active-text-color="activeTextColor"
    :default-openeds="defaultOpeneds"
    @select="handleSelect"
    @open="handleOpen"
    @close="handleClose"
  >
    <template v-for="item in menuData" :key="item.path">
      <menu-item :item="item" :base-path="item.path" />
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed, PropType, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import MenuItem from "./components/menuItem.vue";

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

interface MenuProps {
  modelValue: MenuItemType[];
  mode?: "horizontal" | "vertical";
  collapse?: boolean;
  uniqueOpened?: boolean;
  collapseTransition?: boolean;
  backgroundColor?: string;
  textColor?: string;
  activeTextColor?: string;
  defaultOpeneds?: string[];
  router?: boolean;
}
const props = withDefaults(defineProps<MenuProps>(), {
  modelValue: () => [], // 菜单数据，双向绑定
  mode: "vertical", // 菜单模式
  collapse: false, // 是否水平折叠收起菜单
  uniqueOpened: false, // 是否只保持一个子菜单的展开
  collapseTransition: true, // 是否开启折叠动画
  backgroundColor: "#ffffff", // 菜单的背景色
  textColor: "#303133", // 菜单的文字颜色
  activeTextColor: "#409EFF", // 当前激活菜单的文字颜色
  defaultOpeneds: () => [], // 默认展开的菜单数组
  router: true, // 是否路由模式
});

const emit = defineEmits(["select", "open", "close", "update:modelValue"]);

const route = useRoute();
const router = useRouter();

/**
 * 菜单组件支持：
 * 无限层级菜单
 * 路由模式
 * 图标支持
 * 自定义样式
 * 折叠功能
 * 权限控制（通过 hidden 属性）
 * 外部链接支持
 * 完整的类型支持
 */

// 当前激活的菜单
const activeMenu = computed(() => route.path);

// 处理后的菜单数据
const menuData = computed(() => {
  const filterHiddenMenus = (menus: MenuItemType[]): MenuItemType[] => {
    return menus.filter((item) => {
      if (item.meta?.hidden) return false;
      if (item.children) {
        item.children = filterHiddenMenus(item.children);
      }
      return true;
    });
  };
  return filterHiddenMenus(props.modelValue);
});

// 菜单选择事件
const handleSelect = (index: string, indexPath: string[]) => {
  emit("select", index, indexPath);
  if (props.router) {
    router.push(index);
  }
};

// 展开事件
const handleOpen = (index: string, indexPath: string[]) => {
  emit("open", index, indexPath);
};

// 关闭事件
const handleClose = (index: string, indexPath: string[]) => {
  emit("close", index, indexPath);
};
</script>

<style lang="scss" scoped>
// .el-menu {
//   border-right: none;

//   &--collapse {
//     width: 48px;

//     ::v-deep .el-menu-item .el-menu-tooltip__trigger {
//       justify-content: center;
//     }

//     ::v-deep .el-sub-menu__title {
//       justify-content: center;
//     }
//   }
// }
</style>
