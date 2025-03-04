import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import compression from "vite-plugin-compression"; // gzip压缩

export default defineConfig({
  plugins: [
    vue(),
    compression({
      // 选择压缩算法，支持 'gzip' 和 'brotliCompress'
      algorithm: "gzip",
      // 只压缩大于此大小的文件（以字节为单位）
      threshold: 10240, // 10 KB
      // 生成压缩文件的路径
      deleteOriginFile: false, // 是否删除原始文件
    }),
  ],
  server: {
    host: "0.0.0.0", // 使用 0.0.0.0 可以让服务器监听所有网络接口
    port: 8090, // 更改端口号为 8080
    open: false, // 自动打开浏览器
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 后端服务的实际地址
        changeOrigin: true,
      },
    },
  },
  // 配置根路径与@路径
  base: "./",
  resolve: {
    // ↓配置路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  //将constant.scss中的scss常量加载到全局
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/constant.scss" as *;
        `,
      },
    },
  },
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString(); // 将第三方库分割
          }
        },
      },
    },
  },
});
