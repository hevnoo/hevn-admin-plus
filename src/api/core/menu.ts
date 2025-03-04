import request from "@/api/request";

// 获取菜单
export const getMenuApi = (params: any) => {
  return request({
    url: `/api/menu/getList`,
    method: "get",
    params,
  });
};
