import PlaceholderComponent from "@/layouts/components/PlaceholderComponent.vue"; // 导入占位符组件
// 首先，使用 Vite 的 import.meta.glob 预加载所有视图组件
const modules = import.meta.glob("@/views/**/*.vue");

/**
 * 加载组件的函数
 * @param component 组件路径
 * @returns 组件
 */
export const loadComponent = (component: string) => {
  // 如果没有组件路径，返回404
  if (!component) {
    return PlaceholderComponent;
    // return () => import("@/components/common/error/404.vue");
  }

  // 格式化组件路径，去除多余连续斜杠
  component = formatComponentPath(component);

  // 将后端返回的路径转换为实际的组件路径
  // 例如: "system/user/index" => "/src/views/system/user/index.vue"
  // const componentPath = `/src/views/${component}.vue`;
  const componentPath = normalizePath(`/src/views/${component}.vue`);

  // 如果找到了组件就返回，否则返回404
  return modules[componentPath] || (() => import("@/components/common/error/404.vue"));

  // 后端返回的菜单数据示例
  // const menu = {
  //   path: '/user',
  //   // ✅ 正确的组件路径格式
  //   component: 'system/user/index',  // 不要带 .vue 后缀
  //   name: 'user',
  //   meta: {
  //     title: '用户管理'
  //   }
  // }

  // // 处理空组件路径
  // if (!component) return;

  // // 处理绝对路径，移除开头的 '/'
  // const path = component.startsWith("/") ? component.slice(1) : component;

  // try {
  //   // 使用 Vite 的动态导入
  //   return () => import(`@/views/${path}.vue`);
  // } catch (error) {
  //   console.error(`Error loading component: ${component}`, error);
  //   // 可以返回一个错误占位组件
  //   return () => import("@/components/common/error/404.vue");
  // }
};

/**
 * 格式化组件路径
 * @param path 原始路径
 */
const formatComponentPath = (path: string): string => {
  if (!path) return "";

  // 移除文件扩展名
  path = path.replace(/\.vue$/, "");

  // 处理相对路径
  if (path.startsWith("../") || path.startsWith("./")) {
    // 假设所有组件都在 views 目录下
    const parts = path.split("/");
    // 移除相对路径部分
    while (parts[0] === ".." || parts[0] === ".") {
      parts.shift();
    }
    return `views/${parts.join("/")}`;
  }

  // 已经是正确格式的路径
  return path;
};

/**
 * 规范化路径中的斜杠
 * 1. 保留 http:// 或 https:// 中的双斜杠
 * 2. 去除其他位置的连续斜杠
 * 3. 可选择是否保留开头的斜杠
 */
export const normalizePath = (path: string, keepStartingSlash = true): string => {
  if (!path) return "";

  // 1. 暂时替换 http(s):// 中的双斜杠为特殊标记
  const preservedPath = path.replace(/(https?:)\/\//g, "$1{{SLASH}}");

  // 2. 处理其他位置的连续斜杠为单斜杠
  const normalizedPath = preservedPath
    .replace(/\/+/g, "/") // 将多个斜杠替换为单个斜杠
    .replace(/^\/+/, keepStartingSlash ? "/" : "") // 处理开头的斜杠
    .replace(/\/+$/, ""); // 移除结尾的斜杠

  // 3. 还原 http(s):// 中的双斜杠
  return normalizedPath.replace(/(https?:){{SLASH}}/g, "$1//");
};
