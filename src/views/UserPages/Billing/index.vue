<template>
    <div class="medical-record-details">
      <div class="header">诊断详情</div>
      <div class="patient-info">
        <h2>患者信息</h2>
        <p>姓名：{{ medicalRecord.patientName }}</p>
        <p>性别：{{ medicalRecord.gender }}</p>
        <p>年龄：{{ medicalRecord.age }}</p>
        <p>手机号：{{ medicalRecord.phone }}</p>
      </div>
      <div class="record-info">
        <h2>病例标题</h2>
        <p><strong>日期:</strong> {{ medicalRecord.date }}</p>
        <p><strong>医生:</strong> {{ medicalRecord.doctorName }}</p>
        <p><strong>诊断:</strong> {{ medicalRecord.diagnosis }}</p>
        <p><strong>治疗建议:</strong> {{ medicalRecord.treatment }}</p>
      </div>
      <div class="prescription">
        <h2>处方</h2>
        <ul>
          <li v-for="item in prescription" :key="item.name">
            <strong>{{ item.name }}</strong> - 数量：{{ item.quantity }}, 单价：{{ item.price }}, 用法：{{ item.usage }}, 频次/天：{{ item.frequency }}</li>
          </ul>
      </div>
      <div class="actions">
        <button class="edit-button" @click="editRecord">编辑病例</button>
        <button class="delete-button" @click="deleteRecord">删除病例</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const medicalRecord = ref({
    patientName: '李自瞻',
    gender: '男',
    age: 32,
    phone: '13823888888',
    date: '2024-06-01',
    diagnosis: '感冒',
    treatment: '休息和药物治疗',
    doctorName: '李医生',
    prescription: [
      { name: '华维素胶囊', quantity: 1, price: '22.00', usage: '口服', frequency: '每天三次' },
      { name: '银诺露', quantity: 1, price: '13.00', usage: '外用', frequency: '每天二次' }
    ]
  });
  
  function editRecord() {
    // 逻辑：跳转到编辑病例界面或弹出编辑对话框
    console.log('编辑病例', medicalRecord.value);
  }
  
  function deleteRecord() {
    // 逻辑：删除病例
    console.log('删除病例', medicalRecord.value);
  }
  </script>
  
  <style scoped>
  .medical-record-details {
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
  }
  
  .patient-info, .record-info, .prescription {
    margin: 10px 0;
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%; /* 确保块块占据整个宽度 */
  }
  
  .actions {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;
  }
  
  .edit-button, .delete-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .edit-button {
    background-color: #4CAF50;
    color: white;
  }
  
  .edit-button:hover {
    background-color: #45a049;
  }
  
  .delete-button {
    background-color: #f44433;
    color: white;
  }
  
  .delete-button:hover {
    background-color: #e53935;
  }
  </style>