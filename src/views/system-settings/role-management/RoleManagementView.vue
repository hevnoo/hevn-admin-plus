<template>
  <div class="container">
    <!-- 遍历盒子 -->
    <div
      v-for="(box, index) in boxes"
      :key="index"
      class="box"
      :class="{ active: box.isActive }"
      @click="toggleBox(index)"
    >
      <!-- 盒子内容 -->
      <div class="box-content">
        Box {{ index + 1 }}
      </div>
      <!-- 变大的盒子上方显示的 card -->
      <div v-if="box.isActive" class="card">
        Card {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    // 定义盒子的初始状态
    const boxes = ref([
      { isActive: false },
      { isActive: false },
      { isActive: false },
      { isActive: false },
    ]);

    // 切换盒子的状态
    const toggleBox = (index) => {
      // 先将所有盒子重置为未激活状态
      boxes.value.forEach((box, i) => {
        if (i !== index) {
          box.isActive = false;
        }
      });
      // 切换当前盒子的状态
      boxes.value[index].isActive = !boxes.value[index].isActive;
    };

    return {
      boxes,
      toggleBox,
    };
  },
};
</script>

<style>
/* 容器样式 */
.container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
}

/* 盒子基础样式 */
.box {
  width: 100px;
  height: 100px;
  background-color: #3498db;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.5s ease;
  position: relative;
}

/* 盒子激活状态样式 */
.box.active {
  width: 150px;
  height: 150px;
  background-color: #e74c3c;
}

/* Card 样式 */
.card {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 40px;
  background-color: #2ecc71;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
  animation: fadeIn 0.5s ease;
}

/* Card 出现动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>