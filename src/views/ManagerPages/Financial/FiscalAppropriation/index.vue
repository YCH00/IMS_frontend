<template>
    <div class="financial-allocation">
      <div class="header">财政拨款</div>
      <div class="allocation-form">
        <h3>新增拨款</h3>
        <input type="text" placeholder="项目名称" v-model="newAllocation.projectName" />
        <input type="number" placeholder="拨款金额" v-model="newAllocation.amount" />
        <button @click="addAllocation">添加拨款</button>
      </div>
      <table class="allocation-table">
        <thead>
          <tr>
            <th>项目名称</th>
            <th>拨款金额</th>
            <th>日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="allocation in allocations" :key="allocation.id">
            <td>{{ allocation.projectName }}</td>
            <td>{{ allocation.amount }}</td>
            <td>{{ allocation.date }}</td>
            <td>
              <button @click="enableEdit(allocation)">编辑</button>
              <button @click="deleteAllocation(allocation.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="isEditing" class="edit-modal">
        <h3>编辑拨款</h3>
        <input type="text" placeholder="项目名称" v-model="editAllocation.projectName" />
        <input type="number" placeholder="拨款金额" v-model="editAllocation.amount" />
        <button @click="updateAllocation">更新拨款</button>
        <button @click="cancelEdit">取消</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const newAllocation = ref({ projectName: '', amount: 0 });
  const allocations = ref([
    { id: 1, projectName: '医疗设备采购', amount: 50000, date: '2024-06-10' },
    // ...其他拨款记录
  ]);
  const isEditing = ref(false);
  const editAllocation = ref({});
  
  function addAllocation() {
    if (newAllocation.value.projectName && newAllocation.value.amount > 0) {
      const newId = allocations.value.length ? Math.max(...allocations.value.map(a => a.id)) + 1 : 1;
      allocations.value.push({ id: newId, ...newAllocation.value, date: new Date().toISOString().split('T')[0] });
      newAllocation.value.projectName = '';
      newAllocation.value.amount = 0;
    }
  }
  
  function enableEdit(allocation) {
    isEditing.value = true;
    editAllocation.value = { ...allocation };
  }
  
  function updateAllocation() {
    const index = allocations.value.findIndex(a => a.id === editAllocation.value.id);
    if (index !== -1) {
      allocations.value.splice(index, 1, { ...editAllocation.value, date: new Date().toISOString().split('T')[0] });
    }
    isEditing.value = false;
  }
  
  function deleteAllocation(id) {
    const index = allocations.value.findIndex(a => a.id === id);
    if (index !== -1) {
      allocations.value.splice(index, 1);
    }
  }
  
  function cancelEdit() {
    isEditing.value = false;
    editAllocation.value = {}; // 重置编辑对象
  }
  </script>
  
  <style scoped>
  .financial-allocation {
    padding: 20px;
    background-color: #f7f7f7;
  }
  
  .header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }
  
  .allocation-form {
    margin-bottom: 20px;
  }
  
  .allocation-form h3 {
    margin-bottom: 10px;
  }
  
  .allocation-form input {
    margin-right: 10px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .allocation-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .allocation-table th,
  .allocation-table td {
    padding: 12px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
  }
  
  .allocation-table th {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .allocation-table td {
    color: #666;
  }
  
  .allocation-table td button {
    padding: 5px 10px;
    background-color: #f0ad4e;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .allocation-table td button:hover {
    background-color: #ec971f;
  }
  
  .edit-modal {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 20px auto;
    width: 300px;
    text-align: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
  
  .edit-modal input {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .edit-modal button {
    margin: 5px;
    padding: 8px 16px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .edit-modal button:hover {
    background-color: #66b1ff;
  }
  </style>