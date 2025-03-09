<template>
  <el-image
    class="base-image"
    :src="url"
    :preview-src-list="srcList"
    :fit="fit"
    :hide-on-click-modal="true"
    :lazy="true"
    v-bind="$attrs"
  >
    <template #error>
      <div class="image-error">
        <el-icon><icon-picture /></el-icon>
      </div>
    </template>
    <template #toolbar="{ actions, prev, next, reset, activeIndex }">
      <el-icon @click="prev"><DArrowLeft /></el-icon>
      <el-icon @click="next"><DArrowRight /></el-icon>
      <el-icon @click="actions('zoomOut')"><ZoomOut /></el-icon>
      <el-icon @click="actions('zoomIn', { enableTransition: false, zoomRate: 2 })">
        <ZoomIn />
      </el-icon>
      <el-icon @click="actions('clockwise', { rotateDeg: 180, enableTransition: false })">
        <RefreshRight />
      </el-icon>
      <el-icon @click="actions('anticlockwise')"><RefreshLeft /></el-icon>
      <el-icon @click="reset"><Refresh /></el-icon>
      <el-icon @click="download(activeIndex)"><Download /></el-icon>
    </template>
  </el-image>
</template>

<script lang="ts" setup>
import { computed } from "vue";
// import { ElIcon } from "element-plus";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import {
  DArrowLeft,
  DArrowRight,
  Download,
  Refresh,
  RefreshLeft,
  RefreshRight,
  ZoomIn,
  ZoomOut,
} from "@element-plus/icons-vue";

// 设置组件不自动继承属性到根元素
// v-bind="$attrs"透传属性到根元素，可以在父元素直接使用el-image的属性和方法
defineOptions({
  inheritAttrs: false,
});

interface BaseImageProps {
  url: string;
  srcList?: string[];
  width?: number;
  height?: number;
  fit?: "cover" | "fill" | "contain" | "none" | "scale-down";
  align?: "left" | "center" | "right";
}

const props = withDefaults(defineProps<BaseImageProps>(), {
  url: "",
  srcList: [],
  width: 40,
  height: 40,
  fit: "cover",
  align: "left",
});

// const emit = defineEmits(["load"]);

const width = computed(() => props.width + "px");
const height = computed(() => props.height + "px");
const fontSize = computed(() => (props.width + props.height) / 2 + "px");

const download = (index: number) => {
  const url = props.srcList ? props.srcList[index] : props.url;
  const suffix = url.slice(url.lastIndexOf("."));
  const filename = Date.now() + suffix;

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(blobUrl);
      link.remove();
    });
};
</script>

<style scoped lang="scss">
.base-image {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: v-bind(align);
  align-items: center;
  :deep(.el-image__error),
  :deep(.el-image__inner),
  :deep(.el-image__placeholder),
  :deep(.el-image__wrapper) {
    width: v-bind(width);
    height: v-bind(height);
    border-radius: 8px;
  }
  .image-error {
    display: flex;
    justify-content: v-bind(align);
    align-items: center;
    width: 100%;
    height: 100%;
    // background: var(--el-fill-color-light);
    background: transparent;
    // color: var(--el-text-color-secondary);
    color: #d1cfcf;
    .el-icon {
      font-size: v-bind(fontSize);
    }
  }
}
</style>
