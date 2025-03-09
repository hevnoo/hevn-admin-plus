<template>
  <el-dropdown trigger="hover" popper-class="g-dropdown">
    <div class="el-dropdown-link">
      <img class="avatar" :src="userInfo.avatar" alt="" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <div class="user-dropdown-item">
          <img class="user-dropdown-item-avatar" :src="userInfo.avatar" alt="" />
          <div class="user-dropdown-item-userInfo">
            <div class="user-dropdown-item-userInfo--wrapper">
              <h3 class="user-dropdown-item-userInfo--wrapper--name">{{ userInfo.name }}</h3>
              <span class="user-dropdown-item-userInfo--wrapper--tag">Pro</span>
            </div>
            <p class="user-dropdown-item-userInfo--email">{{ userInfo.email }}</p>
          </div>
        </div>
        <el-divider style="margin: 0 0 4px 0" />
        <template v-for="option in options" :key="option.value">
          <el-divider v-if="option.value === 'logout'" style="margin: 4px 0" />
          <el-dropdown-item :command="option.value" @click="handleCommand(option.value)">
            <Icon class="icon-item" :icon="option.icon" size="14px" />
            {{ option.label }}
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { Icon } from "@/components/basic";
import { auth } from "@/store/core/auth";
import { SERVER_URL } from "@/config";

const router = useRouter();
const useAuth = auth();

const options = ref<any[]>([
  { value: "personal", label: "个人中心", icon: "icon-gerenzhongxin1" },
  { value: "about", label: "关于", icon: "icon-guanyu2" },
  { value: "logout", label: "退出登录", icon: "icon-exit" },
]);

const localUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
const userInfo = ref<any>({
  name: localUserInfo?.nickname || localUserInfo?.username || "用户",
  email: localUserInfo?.email || localUserInfo?.phone || "email",
  avatar: localUserInfo?.avatar ? SERVER_URL + localUserInfo?.avatar : "src/assets/img/avatar.jpg",
});

const handleCommand = (command) => {
  switch (command) {
    case "personal":
      router.push("/system/personal");
      break;
    case "about":
      router.push("/about");
      break;
    case "logout":
      ElMessageBox.confirm("确认要退出登录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          useAuth.logout();
        })
        .catch(() => {});
      break;
  }
};
</script>

<style scoped lang="scss">
.el-dropdown {
  margin: 0 0 0 8px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 50%;
  &:hover {
    background-color: #f4f4f5;
  }
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  object-fit: cover;
}

.user-dropdown-item {
  padding: 8px 16px;
  // border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  &-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 8px;
    object-fit: cover;
  }
  &-userInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    &--wrapper {
      display: flex;
      align-items: center;
      &--name {
        font-size: 14px;
        font-weight: 600;
        margin-right: 6px;
      }
      &--tag {
        position: relative;
        font-size: 12px;
        color: #66d28a;
        // border: 1px solid #999;
        border-radius: 6px;
        padding: 2px 8px;
        &::before {
          content: "";
          position: absolute; // 绝对定位
          top: 0; // 垂直居中
          left: 0; // 水平居中
          right: 0; // 水平居中
          bottom: 0; // 垂直居中
          background-color: #f4f4f5; // 设置背景色
          border-radius: 6px; // 与标签相同的圆角
          z-index: -1; // 确保背景在标签后面
        }
      }
    }
    &--email {
      font-size: 12px;
      color: #999;
    }
  }
}

.icon-item {
  margin-right: 5px;
}
</style>
