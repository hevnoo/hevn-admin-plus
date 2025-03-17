<template>
  <div id="container" class="map-container"></div>
</template>

<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, onUnmounted } from "vue";

let map: any = null;

onMounted(() => {
  initMap();
});

const initMap = () => {
  AMapLoader.load({
    key: "29345f0383941474f27a57e576ddfd5e",
    version: "2.0",
    // plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.Marker", "AMap.MarkerClusterer"],
    plugins: [
      "AMap.Scale",
      "AMap.ToolBar",
      "AMap.Marker",
      "AMap.ControlBar",
      "AMap.MapType",
      "AMap.ContextMenu",
      "AMap.MarkerClusterer",
    ],
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        // mapStyle: "amap://styles/whitesmoke", //设置地图的显示样式
        viewMode: "2D", //默认使用 2D 模式
        zoom: 11, // 地图缩放级别
        center: [116.397428, 39.90923], // 地图中心点
      });

      // 添加地图控件
      map.addControl(new AMap.Scale()); // 比例尺
      map.addControl(new AMap.ToolBar()); // 工具条
      map.addControl(new AMap.ControlBar()); // 地图控制条
      map.addControl(new AMap.MapType()); // 地图类型切换

      // 添加右键菜单
      addContextMenu(AMap, map);

      // 1. 添加点标记（Marker）
      const marker = new AMap.Marker({
        position: [116.39, 39.9],
        title: "标记点",
        label: {
          content: "我是标记点",
          direction: "top",
        },
      });

      // 2. 添加圆形（Circle）
      const circle = new AMap.Circle({
        center: [116.397428, 39.90923],
        radius: 1000, // 半径，单位：米
        fillColor: "#1791fc",
        fillOpacity: 0.3,
        strokeColor: "#1791fc",
        strokeWeight: 1,
      });

      // 3. 添加折线（Polyline）
      const polyline = new AMap.Polyline({
        path: [
          [116.39, 39.91],
          [116.38, 39.9],
          [116.4, 39.89],
        ],
        strokeColor: "#3366FF",
        strokeWeight: 5,
      });

      // 将覆盖物添加到地图
      map.add([marker, circle, polyline]);
      //地图图块加载完成后触发on，监听点击事件
      map.on("click", clickHandler);
    })
    .catch((e) => {
      console.error("地图加载失败", e);
    });
};

// 添加右键菜单
function addContextMenu(AMap, map) {
  const contextMenu = new AMap.ContextMenu();
  contextMenu.addItem(
    "添加标记",
    function (e) {
      const marker = new AMap.Marker({
        position: contextMenuPositon,
      });
      map.add(marker);
    },
    0
  );
  contextMenu.addItem(
    "删除标记",
    function (e) {
      // 删除标记的逻辑
    },
    1
  );
  // 监听鼠标右键事件
  let contextMenuPositon;
  map.on("rightclick", function (e) {
    contextMenuPositon = e.lnglat;
    contextMenu.open(map, e.lnglat);
  });
}

//在运行阶段监听地图的点击事件
const clickHandler = function (e) {
  console.log("您在[ " + e.lnglat.getLng() + "," + e.lnglat.getLat() + " ]的位置点击了地图！");
};

onUnmounted(() => {
  // 解绑地图的点击事件
  map.off("click", clickHandler);
  //销毁地图，并清空地图容器
  map.destroy();
  //地图对象赋值为null
  map = null;
  //清除地图容器的 DOM 元素
  document.getElementById("container")?.remove(); //"container" 为指定 DOM 元素的id
});
</script>

<style scoped lang="scss">
.map-container {
  width: 100%;
  height: 100%;
}
</style>
