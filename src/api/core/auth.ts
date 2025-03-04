import http from "@/api/request";
import { createAxiosError } from "@/utils";
import CryptoJS from "crypto-js";

// * 用户登录接口
export const loginApi = (payload: any) => {
  if (!payload?.password) {
    // return Promise.reject(new Error("密码不能为空！"));
    // return Promise.reject({
    //   code: 404,
    //   msg: "密码不能为空！",
    // });
    // return Promise.resolve({
    //   data: {
    //     code: 404,
    //     msg: "密码不能为空！",
    //     data: null,
    //   },
    // });
    return Promise.reject(createAxiosError("密码不能为空！", "ERR_EMPTY", 400));
  }
  // return http.post("/api/auth/login", { ...payload, password: CryptoJS.MD5(payload.password).toString() }); // 正常 post json 请求  ==>  application/json
  return http.post("/api/auth/login", payload); // 正常 post json 请求  ==>  application/json
};

// * 注册接口
export const registerApi = (payload: any) => {
  if (!payload?.password) {
    return Promise.reject(createAxiosError("密码不能为空！", "ERR_EMPTY", 400));
  }
  // return http.post("/api/auth/register", { ...payload, password: CryptoJS.MD5(payload.password).toString() });
  return http.post("/api/auth/register", payload);
};

// * 刷新token
export const refreshTokenApi = (payload: any) => {
  return http.post("/api/auth/refreshToken", payload);
};
