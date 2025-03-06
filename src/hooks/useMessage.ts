import { ElMessage, ElMessageBox } from "element-plus";
import type { ElMessageBoxOptions } from "element-plus";

export const useMessage = () => {
  // 消息提示
  const message = {
    success(message: string) {
      ElMessage.success(message);
    },
    warning(message: string) {
      ElMessage.warning(message);
    },
    error(message: string) {
      ElMessage.error(message);
    },
    info(message: string) {
      ElMessage.info(message);
    },
  };

  // 确认框
  const confirm = (message: string, options?: ElMessageBoxOptions) => {
    return ElMessageBox.confirm(message, options?.title || "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      ...options,
    });
  };

  // 警告确认框
  const alert = (message: string, options?: ElMessageBoxOptions) => {
    return ElMessageBox.alert(message, options?.title || "提示", {
      confirmButtonText: "确定",
      type: "warning",
      ...options,
    });
  };

  return {
    message,
    confirm,
    alert,
  };
};

// 使用示例：
/*
import { useMessage } from '@/hooks/useMessage'

const { message, confirm } = useMessage()

// 消息提示
message.success('操作成功')
message.error('操作失败')

// 确认框
try {
  await confirm('确定要删除吗？')
  // 用户点击确定
  // 执行删除操作
} catch {
  // 用户点击取消
}
*/
