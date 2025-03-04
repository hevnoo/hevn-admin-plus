// import request from "@/api/request";

// //获取列表
// export const getRolesApi = (payload: any = {}) => {
//   return request({
//     url: "/api/roles/getList",
//     method: "get",
//     params: payload,
//   });
// };
// //新增
// export const addRolesApi = (payload: any) => {
//   return request({
//     url: "/api/roles/create",
//     method: "post",
//     data: payload,
//   });
// };
// //更新 /:id
// // payload: { id: number; [key: string]: any }
// export const updateRolesApi = <T extends { id: number }>(payload: T) => {
//   return request({
//     url: `/api/roles/update/${payload.id}`,
//     method: "put",
//     data: payload,
//   });
// };
// //软删除
// export const deleteRolesApi = <T extends { id: number | number[] }>(payload: T) => {
//   return request({
//     url: "/api/roles/delete",
//     method: "delete",
//     data: payload,
//   });
// };
// //删除
// export const realDeleteRolesApi = <T extends { id: number }>(payload: T) => {
//   return request({
//     url: `/api/roles/realDelete/${payload.id}`,
//     method: "delete",
//   });
// };
