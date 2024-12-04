<template>
  <div class="home-page">
    <div class="header">用户主页</div>
    <div class="welcome-section">
      <h2>欢迎, {{ userName }}</h2>
      <p>这是您的健康管理主页。</p>
    </div>
    <div class="actions-section">
      <h3>快捷操作</h3>
      <div class="actions">
        <button class="action-button" @click="goToHistory">查看历史检查记录</button>
        <button class="action-button" @click="goToMedicalRecords">查看病例详情</button>
        <button class="action-button" @click="goToProfile">管理个人信息</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userName = ref('李自瞻');

function goToHistory() {
  // 跳转到历史检查记录页面
  console.log('跳转到历史检查记录页面');
}

function goToMedicalRecords() {
  // 跳转到病例详情页面
  console.log('跳转到病例详情页面');
}

function goToProfile() {
  // 跳转到个人信息管理页面
  console.log('跳转到个人信息管理页面');
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.header {
  width: 100%;
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 10px 0;
  font-size: 1.5rem;
}

.welcome-section {
  margin-top: 20px;
  text-align: center;
}

.actions-section {
  margin-top: 30px;
  width: 100%;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.action-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #45a049;
}
</style>
