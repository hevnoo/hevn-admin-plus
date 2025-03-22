import { defineStore } from "pinia";
import Cookies from "js-cookie";
import router from "@/router";
import { ElMessage } from "element-plus";
import { api, loginApi, registerApi, refreshTokenApi } from "@/api";
import { addDynamicRoutes } from "@/router"; // 引入动态路由

export const auth = defineStore("/auth", {
  state: () => ({
    token: "",
    userInfo: {},
    menu: [],
  }),
  // 启用所有store持久化
  // persist: true,
  // 启用自定义持久化
  persist: {
    key: "auth",
    storage: localStorage,
    paths: ["token", "userInfo", "menu"],
  },
  getters: {},
  actions: {
    //登录
    async login(payload: unknown) {
      try {
        const res = await loginApi(payload);
        if (res.data.code >= 400) {
          return ElMessage.error(res.data.msg);
        }
        ElMessage.success(res.data.msg);
        this.token = res.data.token;
        Cookies.set("token", res.data.token);
        localStorage.setItem("token", res.data.token);
        this.userInfo = res.data.userInfo;
        localStorage.setItem(
          "userInfo",
          JSON.stringify(res.data.userInfo || "{}")
        );

        // 获取菜单数据
        const menuRes = await api.getList("menu", {
          where: {
            roles: {
              some: {
                // value: { in: this.userInfo?.roles?.map((role) => role.value) },
                id: { in: this.userInfo?.roles?.map((role) => role.id) },
              },
            },
          },
          orderBy: [{ order: "asc" }, { createtime: "desc" }],
          include: ["roles"],
        });
        if (menuRes.data.data) {
          this.menu = menuRes.data.data;
          // this.menu = this.arrayToTree(menuRes.data.data); // 生成树形结构
          localStorage.setItem("menu", JSON.stringify(menuRes.data.data));
          // 添加动态路由
          await addDynamicRoutes(menuRes.data.data);
        }

        router.push("/");
      } catch (error: unknown) {
        this.handleError(error);
      }
    },
    //注册
    async register(payload: unknown) {
      try {
        const res = await registerApi(payload);
        if (res.data.code >= 400) {
          return ElMessage.error(res.data.msg);
        }
        ElMessage.success(res.data.msg);
      } catch (error: unknown) {
        this.handleError(error);
      }
    },
    // 退出登录
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("lang", "zh");
      Cookies.remove("token");
      localStorage.removeItem("token");
      router.replace("/login");
    },
    //刷新token
    async refreshToken(payload: unknown) {
      const res = await refreshTokenApi(payload);
      this.token = res.data.token;
      Cookies.set("token", res.data.token);
      localStorage.setItem("token", res.data.token);
      Cookies.remove("Authorization_token");
    },
    handleError(error: any) {
      if (
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null
      ) {
        const responseData = error.response as { data?: { msg?: string } };
        ElMessage.error(responseData.data?.msg || error.message);
      } else {
        ElMessage.error("发生未知错误");
      }
    },
    arrayToTree(items: any[], parentKey = "parent_id", idKey = "id") {
      const result: any[] = [];
      const itemMap: { [key: string]: any } = {};

      // 首先将所有项目映射到一个对象中
      items.forEach((item) => {
        itemMap[item[idKey]] = { ...item, children: [] };
      });

      // 构建树形结构
      items.forEach((item) => {
        const parentId = item[parentKey];
        if (parentId && itemMap[parentId]) {
          // 如果有父节点，将当前项添加到父节点的children中
          itemMap[parentId].children.push(itemMap[item[idKey]]);
        } else {
          // 如果没有父节点，则为顶层节点
          result.push(itemMap[item[idKey]]);
        }
      });

      return result;
    },
  },
});
