<template>
  <el-button class="g-icon-button refresh-button" :icon="RefreshRight" @click="refresh" />
  <div class="breadcrumb">
    <slot name="breadcrumb"></slot>
  </div>
  <div style="display: flex; flex: 1 1 0%"></div>
  <template v-for="slot in rightSlots" :key="slot.name">
    <slot :name="slot.name">
      <template v-if="slot.name === 'global-search'">
        <!-- <GlobalSearch
            :enable-shortcut-key="globalSearchShortcutKey"
            :menus="accessStore.accessMenus"
            class="mr-1 sm:mr-4"
          /> -->
      </template>

      <template v-else-if="slot.name === 'preferences'">
        <!-- <PreferencesButton
            class="mr-1"
            @clear-preferences-and-logout="clearPreferencesAndLogout"
          /> -->
      </template>
      <template v-else-if="slot.name === 'theme-toggle'">
        <!-- <ThemeToggle class="mr-1 mt-[2px]" /> -->
      </template>
      <template v-else-if="slot.name === 'language-toggle'">
        <LanguageToggle />
      </template>
      <template v-else-if="slot.name === 'fullscreen'">
        <Fullscreen />
      </template>
      <template v-else-if="slot.name === 'user-dropdown'">
        <UserDropdown />
      </template>
    </slot>
  </template>
</template>

<script setup lang="ts">
import { RefreshRight } from "@element-plus/icons-vue";
import { LanguageToggle, Fullscreen, UserDropdown } from "@/layouts/widgets";

const refresh = () => {};
const rightSlots = [
  { name: "global-search" },
  { name: "preferences" },
  { name: "theme-toggle" },
  { name: "language-toggle" },
  { name: "fullscreen" },
  { name: "notification" },
  { name: "user-dropdown" },
];
</script>

<style scoped lang="scss">
.refresh-button {
  margin-left: 2px !important;
  // margin-right: 2px;
}
.breadcrumb {
  padding-left: 8px;
}
</style>
