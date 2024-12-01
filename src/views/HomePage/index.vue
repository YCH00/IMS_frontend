<template>
    <div class="admin-dashboard">
      <div class="header">IMS同济医疗管理系统</div>
      <div class="main-content">
        <div class="card">
          <h2>医生管理</h2>
          <p>管理医院医生信息</p>
          <button class="action-button" @click="manageDoctors">管理医生</button>
        </div>
        <div class="card">
          <h2>病人管理</h2>
          <p>管理病人信息</p>
          <button class="action-button" @click="managePatients">管理病人</button>
        </div>
        <div class="card">
          <h2>数据统计</h2>
          <p>查看医院数据统计</p>
          <button class="action-button" @click="viewStatistics">数据统计</button>
        </div>
        <div class="calendar-card">
          <CalendarComponent></CalendarComponent>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import CalendarComponent from './CalendarComponent.vue'; // 确保路径正确
  
  function manageDoctors() {
    console.log('管理医生信息功能待实现');
  }
  
  function managePatients() {
    console.log('管理病人信息功能待实现');
  }
  
  function viewStatistics() {
    console.log('查看数据统计功能待实现');
  }
  </script>
  
  <style scoped>
  .admin-dashboard {
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
    font-size: 24px; /* 增加标题字体大小 */
  }
  
  .main-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
  }
  
  .card {
    flex: 1 1 300px;
    margin: 10px;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0, 0.1);
    text-align: center;
  }
  
  .action-button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
  }
  
  .action-button:hover {
    background-color: #45a049;
  }
  
  .calendar-card {
    flex: 1 1 300px;
    margin: 10px;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0, 0.1);
    text-align: center;
  }
  </style>