import axios from "axios";
import { URL } from "@/config";
import Cookies from "js-cookie";
import router from "@/router";
// import { ElMessage } from "element-plus";

// 创建一个 axios 实例
const service = axios.create({
  baseURL: URL,
  timeout: 60000, // 请求超时时间毫秒
  //withCredentials: true, // 异步请求携带cookie
  // headers: {
  //   // 设置后端需要的传参类型
  //   "Content-Type": "application/json",
  //   token: "your token",
  //   "X-Requested-With": "XMLHttpRequest",
  // },
});

//请求拦截
service.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // ElMessage.error("错误");
    return Promise.reject(new Error(error));
  }
);

//响应拦截
service.interceptors.response.use(
  (response) => {
    if (response.data.code == 401) {
      Cookies.remove("token");
      router.push("/login");
    }
    return response;
  },
  (error) => {
    // 发生错误时的处理
    if (error.response && error.response.data && error.response.data.msg) {
      // ElMessage.error(error.response.data.msg);
      // return Promise.reject(new Error(error.data.msg));
    } else {
      // console.log("发生错误，请稍后再试");
    }
    return Promise.reject(error);
  }
);

export default service;
