import http from "@/api/request";

// export const uploadApi = (payload: any) => {
//   return http.post("/api/files/upload", payload);
// };

// 检查文件上传状态
export const uploadCheckApi = (payload: any) => {
  return http.post("/api/files/check", payload);
};

// 上传分片
export const uploadChunkApi = (payload: any, axiosConfig: any) => {
  return http.post("/api/files/chunk", payload, axiosConfig);
};

// 合并分片
export const uploadMergeApi = (payload: any) => {
  return http.post("/api/files/merge", payload);
};
