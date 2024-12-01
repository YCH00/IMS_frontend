<template>
    <div class="medical-records-list">
      <div class="header">我的病例记录</div>
      <ul class="records-list">
        <li v-for="record in medicalRecords" :key="record.id" class="record-item">
          <div class="record-info">
            <h3>{{ record.title }}</h3>
            <p>日期: {{ record.date }}</p>
            <p>医生: {{ record.doctorName }}</p>
          </div>
          <div class="record-actions">
            <button @click="viewRecord(record.id)">查看</button>
            <button @click="deleteRecord(record.id)">删除</button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const medicalRecords = ref([
    // 假设病例数据
    { id: 1, title: '感冒病例', date: '2024/5/2024', doctorName: '李医生' },
    { id: 2, title: '过敏病例', date: '3/5/2024', doctorName: '王医生' },
    // 更多病例...
  ]);
  
  function viewRecord(id) {
    // 逻辑：跳转到病例详情界面
    console.log('查看病例', id);
  }
  
  function deleteRecord(id) {
    // 逻辑：删除病例
    console.log('删除病例', id);
  }
  </script>
  
  <style scoped>
  .medical-records-list {
    width: 80%;
    margin: 20px auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .header {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  
  .records-list {
    list-style: none;
    padding: 0;
  }
  
  .record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .record-info h3 {
    margin: 0;
    color: #555;
  }
  
  .record-info p {
    margin: 5px 0;
    color: #777;
  }
  
  .record-actions button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .record-actions button:hover {
    background-color: #ddd;
  }
  </style>