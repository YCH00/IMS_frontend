<template>
    <div class="visit-interface">
      <div class="patient-info">
        <h2>患者信息</h2>
        <p>姓名：<span>{{ patient.name }}</span></p>
        <p>性别：<span>{{ patient.gender }}</span></p>
        <p>年龄：<span>{{ patient.age }}</span></p>
        <p>手机号：<span>{{ patient.phone }}</span></p>
      </div>
      <div class="medical-record">
        <h3>病历</h3>
        <textarea v-model="medicalRecord" placeholder="填写病历..."></textarea>
      </div>
      <div class="prescription">
        <h3>处方</h3>
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>名称</th>
              <th>数量</th>
              <th>单价</th>
              <th>单次用量</th>
              <th>用法</th>
              <th>频次</th>
              <th>天数</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(prescription, index) in prescriptions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ prescription.name }}</td>
              <td>{{ prescription.quantity }}</td>
              <td>{{ prescription.price }}</td>
              <td>{{ prescription.singleDose }}</td>
              <td>{{ prescription.usage }}</td>
              <td>{{ prescription.frequency }}</td>
              <td>{{ prescription.days }}</td>
              <td>{{ prescription.notes }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="addPrescription">添加药品</button>
      </div>
      <div class="doctor-advice">
        <h3>医生建议</h3>
        <textarea v-model="doctorAdvice" placeholder="填写医生建议..."></textarea>
      </div>
      <div class="actions">
        <button @click="print">打印</button>
        <button @click="viewHistory">历史</button>
        <button @click="save">保存</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const patient = ref({
    name: '李自瞻',
    gender: '男',
    age: '32岁',
    phone: '13823888888'
  });
  
  const medicalRecord = ref('');
  
  const prescriptions = ref([
    { name: '华维素胶囊', quantity: 1, price: '22.00', singleDose: 1, usage: '口服', frequency: '每天三次', days: 7, notes: '' },
    { name: '银诺露', quantity: 1, price: '13.00', singleDose: 1, usage: '外用', frequency: '每天二次', days: 7, notes: '' }
  ]);
  
  const doctorAdvice = ref('');
  
  function addPrescription() {
    // 添加药品的逻辑
  }
  
  function print() {
    // 打印的逻辑
  }
  
  function viewHistory() {
    // 查看历史的逻辑
  }
  
  function save() {
    // 保存的逻辑
  }
  </script>
  
  <style scoped>
  .visit-interface {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background-color: #f9f9f9;
  }
  
  .patient-info, .medical-record, .prescription, .doctor-advice, .actions {
    background-color: #fff;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  textarea {
    width: 100%;
    height: 100px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>