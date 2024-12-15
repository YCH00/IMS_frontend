<template>
  <div class="user-info-page">
    <div class="header">个人信息</div>
    <div class="info-section">
      <h2>用户基本信息</h2>
      <ul>
        <li><strong>姓名：</strong>{{ userInfo.name }}</li>
        <li><strong>邮箱：</strong>{{ userInfo.email }}</li>
        <li><strong>手机号：</strong>{{ userInfo.phone }}</li>
        <li><strong>地址：</strong>{{ userInfo.address }}</li>
      </ul>
    </div>
    <div class="edit-section">
      <button class="edit-button" @click="editInfo">编辑个人信息</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userInfo = ref({
  name: '李自瞻',
  email: 'lizizhan@example.com',
  phone: '123-456-7890',
  address: '北京市朝阳区'
});

function editInfo() {
  // 跳转到编辑信息页面或触发编辑逻辑
  console.log('编辑个人信息');
}
</script>

<style scoped>
.user-info-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 20px;
}

.header {
  width: 100%;
  background-color: #3f51b5;
  color: #fff;
  text-align: center;
  padding: 10px 0;
  font-size: 1.5rem;
}

.info-section {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.info-section ul {
  list-style: none;
  padding: 0;
}

.info-section li {
  margin: 10px 0;
  font-size: 1rem;
}

.edit-section {
  margin-top: 20px;
}

.edit-button {
  padding: 10px 20px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button:hover {
  background-color: #e68900;
}
</style>
