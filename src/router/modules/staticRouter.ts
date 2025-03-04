import Layout from "@/layouts/basic/Layout.vue";
import HomeView from "@/views/home/HomeView.vue";
import Login from "@/components/login/Login.vue";

export const staticRouter = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "登录",
    },
  },
  // ...routes,
  {
    path: "/", // path: 使用 kebab-case（小写横杠），以 / 开头
    name: "layouts", // name: 使用 camelCase（小驼峰）
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: HomeView,
        meta: {
          title: "首页",
        },
      },
      // {
      //   path: "/system-settings",
      //   name: "system-settings",
      //   component: "",
      //   meta: {
      //     title: "系统设置",
      //   },
      //   children: [
      //     {
      //       path: "/system-settings/user-management",
      //       name: "user-management",
      //       component: UserManagementView,
      //       meta: {
      //         title: "用户管理",
      //       },
      //     },
      //     {
      //       path: "/system-settings/role-management",
      //       name: "role-management",
      //       component: RoleManagementView,
      //       meta: {
      //         title: "角色管理",
      //       },
      //     },
      //   ],
      // },
      {
        path: "/403",
        name: "403",
        component: () => import("@/components/common/error/403.vue"),
        meta: {
          title: "403",
        },
      },
    ],
  },
];

/**
 * errorRouter(错误页面路由)
 */
export const errorRouter = [
  {
    path: "/404",
    name: "404",
    component: () => import("@/components/common/error/404.vue"),
    meta: {
      title: "404",
    },
  },
];

/**
 * notFoundRouter(找不到路由)
 */
export const notFoundRouter = {
  path: "/:catchAll(.*)",
  name: "404",
  component: () => import("@/components/common/error/404.vue"),
};
// export const notFoundRouter = {
//   path: "/:pathMatch(.*)*",
//   name: "notFound",
//   redirect: { name: "404" },
// };
