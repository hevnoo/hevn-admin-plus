<template>
  <el-dropdown trigger="click" popper-class="g-dropdown" @command="changeLanguage">
    <span class="el-dropdown-link">
      <el-button class="g-icon-button">
        <Icon icon="icon-a-Language" size="18px" color="#000" />
      </el-button>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="option in options"
          :key="option.value"
          :command="option.value"
          :disabled="selected === option.value"
          @click="handleCommand(option.value)"
        >
          {{ option.label }}
        </el-dropdown-item>
        <!-- :class="{ 'is-active': selected === option.value }" -->
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Icon } from "@/components/basic";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const options = [
  { value: "zh", label: "简体中文" },
  { value: "en", label: "English" },
];
const selected = ref(locale.value); // 默认选中的值

const handleCommand = (command) => {
  selected.value = command; // 更新选中的值
};

const changeLanguage = (lang) => {
  locale.value = lang; // 切换语言
  localStorage.setItem("language", lang);
};
</script>

<style scoped lang="scss">
// .is-active {
//   background-color: #edf5ff;
//   color: #409eff;
// }
</style>
