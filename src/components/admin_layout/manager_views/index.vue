<template>
    
  <Card>
      <template #title>欢迎管理员：</template>
      <template #content><div ref="clock"></div></template>
  </Card>

</template>

<script>
import Clock from '../../../js/Clock'
import { Card } from 'primevue';

export default {
  name: 'App',
  mounted() {
    const clock = new Clock();
    clock.display(this.$refs.clock); // 使用 Vue 的 ref
  }
};

</script>

<style scoped>
/* 全局卡片容器样式 */
.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 单个卡片样式 */
.p-card {
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: #ffffff;
}

/* 卡片 hover 效果 */
.p-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* 卡片标题样式 */
.p-card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

/* 卡片内容样式 */
.p-card-content {
  padding: 20px;
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
}

/* 时钟样式 */
#clock {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  text-align: center;
  margin: 20px 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .p-card {
    max-width: 100%;
    margin: 0 10px;
  }

  .p-card-title {
    font-size: 1.25rem;
  }

  .p-card-content {
    font-size: 0.9rem;
  }

  #clock {
    font-size: 1.5rem;
  }
}

</style>




