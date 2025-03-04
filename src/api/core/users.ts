import request from "@/api/request";

//获取用户列表
export const getUserListApi = (payload: any) => {
  return request({
    url: `/api/users/getUserList`,
    method: "get",
    params: payload,
  });
};
//更新用户
export const updateUserApi = <T extends { id: string }>(payload: T) => {
  return request({
    url: `/api/users/updateUser/${payload.id}`,
    method: "put",
    data: payload,
  });
};
//软删除用户
export const deleteUserApi = <T extends { id: string }>(payload: T) => {
  return request({
    url: `/api/users/delete/${payload.id}`,
    method: "delete",
    data: payload,
  });
};
//删除用户
export const realDeleteUserApi = <T extends { id: string }>(payload: T) => {
  return request({
    url: `/api/users/hardDelete/${payload.id}`,
    method: "delete",
  });
};
