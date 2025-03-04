import { defineStore } from "pinia";
// import { getMenuApi } from "@/api";

export const menu = defineStore("/menu", {
  state: () => ({
    menu: localStorage.getItem("menu"),
  }),
  getters: {},
  actions: {
    //获取菜单
    // async getMenu(val?: any) {
    //   const res = await getMenuApi(val);
    //   this.menu = res.data.data;
    //   localStorage.setItem("menu", this.menu);
    // },
  },
});
