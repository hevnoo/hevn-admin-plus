import { NavigationGuardNext, RouteLocationNormalized, Router } from "vue-router";
import { auth } from "@/store";
import { addDynamicRoutes } from ".";
import { ElMessage } from "element-plus";

const whiteList = ["/login", "/403", "/404"];
// 添加一个标记，避免重复添加路由
let isAddRoutes = false;

export const setupRouterGuard = (router: Router) => {
  // 全局前置守卫
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // 如果需要阻止导航，可以调用 `next(false)`
    //   next()放行;
    const useAuth = auth();
    const token = localStorage.getItem("token");

    // 1. 检查是否在白名单
    if (whiteList.includes(to.path)) {
      next();
      return;
    }

    // 2. 检查是否有token
    if (!token) {
      next("/login");
      return;
    }

    // 3. 如果是登录页面且有token，重定向到首页
    if (to.path === "/login") {
      next("/");
      return;
    }

    // 4. 检查动态路由是否需要添加（只在第一次进入时添加）
    if (useAuth.menu?.length && !isAddRoutes) {
      try {
        await addDynamicRoutes(useAuth.menu);
        isAddRoutes = true; // 标记路由已添加

        // 重要：这里改用 replace 而不是 next
        next({ ...to, replace: true });
        return;
      } catch (error) {
        console.error("添加动态路由失败:", error);
        next("/403");
        return;
      }
    }

    // 5. 其他情况放行
    next();
  });

  // 全局解析守卫
  router.beforeResolve((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // 在这里添加你的逻辑判断和处理
    next();
  });

  // 全局后置守卫
  router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    // 在这里添加你的逻辑处理
    document.title = `${to.meta.title || to.name}`;
  });
};

// // 全局前置守卫
// export function beforeEach(
//   to: RouteLocationNormalized,
//   from: RouteLocationNormalized,
//   next: NavigationGuardNext
// ): void {
//   // 如果需要阻止导航，可以调用 `next(false)`
//   //   next()放行;
//   const token = localStorage.getItem("token");
//   if (token) {
//     if (to.path === "/login") {
//       next("/");
//     } else {
//       if (to.path === "/403") {
//         next("/home");
//       } else {
//         next();
//       }
//     }
//   } else {
//     if (whiteList.includes(to.path)) {
//       next();
//     } else {
//       next("/login");
//     }
//   }
// }

// // 全局解析守卫
// export function beforeResolve(
//   to: RouteLocationNormalized,
//   from: RouteLocationNormalized,
//   next: NavigationGuardNext
// ): void {
//   // 在这里添加你的逻辑判断和处理
//   next();
// }

// // 全局后置守卫
// export function afterEach(to: RouteLocationNormalized, from: RouteLocationNormalized): void {
//   // 在这里添加你的逻辑处理
//   document.title = `${to.meta.title || to.name}`;
// }

// // 路由独享守卫
// export function onEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
//   // 在这里添加你的逻辑判断和处理
//   next();
// }

// // 注册路由守卫
// export function setupRouterGuard(router: Router): void {
//   router.beforeEach(beforeEach);
//   router.beforeResolve(beforeResolve);
//   router.afterEach(afterEach);
// }
