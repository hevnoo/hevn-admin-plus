import request from "@/api/request";
import type {
  BaseResponse,
  QueryParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  HardDeleteParams,
} from "@/api/types/api";

export const api = {
  // 获取列表
  // 参数：model: 模型名称，params: 查询参数（prisma语法）
  // 注意：如果需要获取外表关联数据，则需要使用include参数，如：{ include: ["menu"] }
  getList: <T = any>(model: string, params: QueryParams = {}): Promise<BaseResponse<T[] | T>> => {
    return request({
      url: `/api/${model}/getList`,
      method: "get",
      params,
    });
  },

  // 新增
  // data参数支持对象或数组对象：
  // 对象：{ id: 1, name: "test", menu: [1, 2], include: ["menu"] }
  // 数组：[{ id: 1, name: "test", menu: [1, 2], include: ["menu"] }, { id: 2, name: "test2", menu: [1, 2], include: ["menu"] }]
  create: <T = any>(model: string, data: CreateParams): Promise<BaseResponse<T | T[]>> => {
    return request({
      url: `/api/${model}/create`,
      method: "post",
      data,
    });
  },

  // 更新
  // data参数支持对象或数组对象：
  // 对象：{ id: 1, name: "test", menu: [1, 2], include: ["menu"] }
  // 数组：[{ id: 1, name: "test", menu: [1, 2], include: ["menu"] }, { id: 2, name: "test2", menu: [1, 2], include: ["menu"] }]
  update: <T = any>(model: string, data: UpdateParams): Promise<BaseResponse<T | T[]>> => {
    return request({
      url: `/api/${model}/update`,
      method: "put",
      data,
    });
  },

  // 软删除
  // data参数支持对象或数组对象：
  // 对象：{ id: 1 }
  // 对象: {ids: [1, 2]}
  // 字符串: "1"
  // 数组：[1, 2]
  // 数组对象：[{ id: 1 }, { id: 2 }]
  delete: <T = any>(model: string, data: DeleteParams): Promise<BaseResponse<T>> => {
    return request({
      url: `/api/${model}/delete`,
      method: "delete",
      data,
    });
  },

  // 删除
  // data参数支持对象或数组对象：
  // 对象：{ id: 1 }
  // 对象: {ids: [1, 2]}
  // 字符串: "1"
  // 数组：[1, 2]
  // 数组对象：[{ id: 1 }, { id: 2 }]
  // 注意：如果id是字符串，可能需要使用prisma的where语法，如：{ id: { equals: "1" } }
  hardDelete: <T = any>(model: string, data: HardDeleteParams): Promise<BaseResponse<T>> => {
    const url =
      typeof data === "object" && "id" in data ? `/api/${model}/hardDelete/${data.id}` : `/api/${model}/hardDelete`;

    return request({
      url,
      method: "delete",
      data,
    });
  },
};

/*
用法：
import { api } from "@/api";
const res = await api.getDataApi("roles", { page: 1, include: ["menu"] });
*/
