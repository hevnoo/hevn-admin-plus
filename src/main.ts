//* main.ts
import { createApp } from "vue";
// import "./style.css";
import App from "./App.vue";
//pinia
import { createPinia } from "pinia";
//router
import router from "./router";
//路由守卫
import "@/router/guard";
// 动态路由
import { auth } from "@/store";
import { addDynamicRoutes } from "@/router";
//element
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//国际化element
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
//注册element-icon
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
//styles
import "@/styles/index.scss";
//vxeTable
import VxeUI from "vxe-pc-ui";
import "vxe-pc-ui/lib/style.css";
import VxeTable from "vxe-table";
import "vxe-table/lib/style.css";
// 国际化
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

const pinia = createPinia();

const localeLanguage = localStorage.getItem("language") || "zh";
const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: localeLanguage,
  fallbackLocale: "en",
  messages: {
    en,
    zh,
  },
});

const app = createApp(App);

app.use(pinia);
app.use(i18n);

// 初始化路由
const initRouter = async () => {
  const useAuth = auth();
  // 如果有菜单数据，重新添加路由
  if (useAuth.menu?.length) {
    await addDynamicRoutes(useAuth.menu);
  }
};
// 等待路由初始化完成后再挂载应用
await initRouter();

app.use(router);

app.use(ElementPlus, {
  locale: zhCn,
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(VxeUI);
app.use(VxeTable);

app.mount("#app");
