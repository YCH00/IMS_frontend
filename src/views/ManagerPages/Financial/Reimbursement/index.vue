<template>
    <div class="reimbursement-platform">
      <div class="header">报销平台</div>
      <div class="reimbursement-form">
        <h3>提交报销申请</h3>
        <input type="text" placeholder="申请人" v-model="newReimbursement.applicant" />
        <input type="text" placeholder="项目名称" v-model="newReimbursement.projectName" />
        <input type="number" placeholder="报销金额" v-model="newReimbursement.amount" />
        <button @click="submitReimbursement">提交申请</button>
      </div>
      <table class="reimbursement-table">
        <thead>
          <tr>
            <th>申请人</th>
            <th>项目名称</th>
            <th>报销金额</th>
            <th>申请日期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reimbursement in reimbursements" :key="reimbursement.id">
            <td>{{ reimbursement.applicant }}</td>
            <td>{{ reimbursement.projectName }}</td>
            <td>{{ reimbursement.amount }}</td>
            <td>{{ reimbursement.date }}</td>
            <td>{{ reimbursement.status }}</td>
            <td>
              <button @click="approveReimbursement(reimbursement.id)" class="approve-button">批准</button>
              <button @click="rejectReimbursement(reimbursement.id)" class="reject-button">拒绝</button>
              <button @click="deleteReimbursement(reimbursement.id)" class="delete-button">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const newReimbursement = ref({ applicant: '', projectName: '', amount: 0 });
  const reimbursements = ref([
    { id: 1, applicant: '张三', projectName: '医疗设备', amount: 1500, date: '2024-06-10', status: '待审批' },
    // ...其他报销记录
  ]);
  
  function submitReimbursement() {
    if (newReimbursement.value.applicant && newReimbursement.value.projectName && newReimbursement.value.amount > 0) {
      const newId = reimbursements.value.length ? Math.max(...reimbursements.value.map(r => r.id)) + 1 : 1;
      reimbursements.value.push({
        id: newId,
        ...newReimbursement.value,
        date: new Date().toISOString().split('T')[0],
        status: '待审批'
      });
      newReimbursement.value.applicant = '';
      newReimbursement.value.projectName = '';
      newReimbursement.value.amount = 0;
    }
  }
  
  function approveReimbursement(id) {
    const reimbursement = reimbursements.value.find(r => r.id === id);
    if (reimbursement) {
      reimbursement.status = '已批准';
    }
  }
  
  function rejectReimbursement(id) {
    const reimbursement = reimbursements.value.find(r => r.id === id);
    if (reimbursement) {
      reimbursement.status = '已拒绝';
    }
  }
  
  function deleteReimbursement(id) {
    const index = reimbursements.value.findIndex(r => r.id === id);
    if (index !== -1) {
      reimbursements.value.splice(index, 1);
    }
  }
  </script>
  
  <style scoped>
  .reimbursement-platform {
    padding: 20px;
    background-color: #f7f7f7;
  }
  
  .header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }
  
  .reimbursement-form {
    margin-bottom: 20px;
  }
  
  .reimbursement-form h3 {
    margin-bottom: 10px;
  }
  
  .reimbursement-form input {
    margin-right: 10px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .reimbursement-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .reimbursement-table th,
  .reimbursement-table td {
    padding: 12px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
  }
  
  .reimbursement-table th {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .reimbursement-table td {
    color: #666;
  }
  
  .approve-button {
    background-color: #5cb85c; /* 绿色 */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .approve-button:hover {
    background-color: #4cae4c; /* 深绿色 */
  }
  
  .reject-button {
    background-color: #d9534f; /* 红色 */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .reject-button:hover {
    background-color: #c9302c; /* 深红色 */
  }
  
  .delete-button {
    background-color: #f0ad4e; /* 橙色 */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .delete-button:hover {
    background-color: #ec971f; /* 深橙色 */
  }
  </style>