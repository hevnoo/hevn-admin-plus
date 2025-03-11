import { AxiosError } from "axios";

/**
 * 引用的方式转成tree
 * @param list
 * @returns 树形结构
 */
export const arrayToTree = (items: any[], parentKey = "parent_id", idKey = "id"): any[] => {
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
};

// 用例：return Promise.reject(createApiError("密码不能为空！", "ERR_EMPTY", 400));
export function createAxiosError(message: string, code: string, status: number): AxiosError {
  const error = new AxiosError(message, code, undefined, undefined, {
    status,
    statusText: message,
    headers: {},
    config: {},
    data: {},
  } as any);
  error.status = status;
  return error;
}
