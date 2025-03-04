import type { VNode } from "vue";

export interface BaseLayoutProps {
  // 布局模式: 'vertical' | 'horizontal' | 'mixed'
  layout?: string;
  // 是否移动端
  isMobile?: boolean;
  // 主题: 'light' | 'dark'
  theme?: string;
  // 头部配置
  header?: {
    visible?: boolean; // 是否显示头部
    height?: number; // 头部高度
    fixed?: boolean; // 是否固定头部
    theme?: string; // 头部主题
  };
  // 侧边栏配置
  sidebar?: {
    visible?: boolean; // 是否显示侧边栏
    width?: number; // 侧边栏宽度
    collapsed?: boolean; // 是否折叠
    theme?: string; // 侧边栏主题
    logo?: {
      height?: number; // 添加 logo 高度配置
      padding?: number; // 可选：添加内边距配置
    };
  };
  // 页脚配置
  footer?: {
    visible?: boolean; // 是否显示页脚
    height?: number; // 页脚高度
    fixed?: boolean; // 是否固定页脚
  };
  // 标签页配置
  tabbar?: {
    visible?: boolean; // 是否显示标签页
    height?: number; // 标签页高度
  };
}

export interface BaseLayoutEmits {
  (e: "update:sidebar-collapse", collapsed: boolean): void;
  (e: "update:collapsed", collapsed: boolean): void;
  (e: "toggleSidebar"): void;
}

export interface BaseLayoutSlots {
  logo?: () => VNode[];
  header?: () => VNode[];
  menu?: () => VNode[];
  tabbar?: () => VNode[];
  footer?: () => VNode[];
  default?: () => VNode[];
}
