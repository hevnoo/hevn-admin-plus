// 1. 后端返回原始菜单数据结构
export interface MenuItem {
  roles: any;
  id: number;
  name: string; // 菜单名称
  path: string; // 路由路径
  component: string; // 组件路径
  redirect?: string; // 重定向
  icon?: string; // 图标
  parent_id: number; // 父级ID
  order: number; // 排序
  hidden?: boolean; // 是否隐藏
  meta?: {
    // 元数据
    title: string;
    icon?: string;
    roles?: string[];
    keepAlive?: boolean;
    [key: string]: any;
  };
}
