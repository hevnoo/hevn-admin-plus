import { createRouter, createWebHashHistory } from "vue-router";
import { staticRouter, errorRouter, notFoundRouter } from "@/router/modules/staticRouter";
import { setupRouterGuard } from "./guard";
import { MenuItem } from "./types";
import { loadComponent } from "@/utils/router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRouter, ...errorRouter],
});

// 添加动态路由的方法
export const addDynamicRoutes = async (menuList: MenuItem[]) => {
  try {
    // 添加新的动态路由
    const asyncRoutes = formatMenuToRoute(menuList);
    const layoutRoute = router.getRoutes().find((route) => route.name === "layouts");

    // 先移除所有动态路由
    // asyncRoutes.forEach((route) => {
    //   if (router.hasRoute(route.name)) {
    //     router.removeRoute(route.name);
    //   }
    // });

    // 递归添加路由
    const addRouteRecursively = (routes: any[], parentName?: string) => {
      routes.forEach((route) => {
        if (!router.hasRoute(route.name)) {
          // 保存子路由
          const childrenRoutes = route.children || [];
          // 删除children属性，避免重复添加
          delete route.children;

          // 添加当前路由
          if (parentName) {
            router.addRoute(parentName, route);
          } else if (layoutRoute) {
            router.addRoute("layouts", route);
          } else {
            router.addRoute(route);
          }

          // 递归添加子路由
          if (childrenRoutes.length > 0) {
            addRouteRecursively(childrenRoutes, route.name);
          }
        }
      });
    };
    // 开始递归添加路由
    addRouteRecursively(asyncRoutes);

    // asyncRoutes.forEach((route) => {
    //   if (!router.hasRoute(route.name)) {
    //     if (layoutRoute) {
    //       router.addRoute("layouts", { children: [], ...route });
    //     } else {
    //       router.addRoute({ children: [], ...route });
    //     }
    //   }
    // });

    // 添加404路由（确保在最后添加）
    if (router.hasRoute("404")) {
      router.removeRoute("404");
    }
    router.addRoute(notFoundRouter);

    return true;
  } catch (error) {
    console.error("添加动态路由出错：", error);
    return false;
  }
};

// 格式化菜单为路由格式
const formatMenuToRoute = (menuList: MenuItem[]) => {
  // 将菜单列表转换为树形结构
  const buildMenuTree = (items: MenuItem[], parentId: string | number | null = null): any[] => {
    return items
      .filter((item) => item.parent_id === parentId)
      .map((item) => {
        // 查找当前菜单的子菜单
        const children = buildMenuTree(items, item.id);

        // 构建路由对象
        const route = {
          path: item.path,
          component: loadComponent(item.component),
          redirect: item.redirect,
          name: item.name,
          meta: item.meta,
          hidden: item.hidden,
        };

        // 如果有子菜单，添加到children中
        if (children.length > 0) {
          route["children"] = children;
        }

        return route;
      });
  };

  const routes = buildMenuTree(menuList);

  // const routes = menuList.map((item) => ({
  //   ...item,
  //   path: item.path,
  //   component: loadComponent(item.component),
  //   redirect: item.redirect,
  //   name: item.name,
  //   meta: item.meta,
  //   hidden: item.hidden,
  // }));

  return routes;
};

// 注册路由守卫
setupRouterGuard(router);

export default router;
