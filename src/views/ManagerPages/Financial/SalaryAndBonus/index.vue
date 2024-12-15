<template>
    <div class="admin-financial-management">
      <div class="header">财务管理</div>
      <div class="search-bar">
        <input type="text" placeholder="搜索医务人员ID" v-model="searchQuery" class="search-input" />
        <button @click="searchStaff" class="search-button">搜索</button>
      </div>
      <table class="staff-table">
        <thead>
          <tr>
            <th>选择</th>
            <th>ID</th>
            <th>姓名</th>
            <th>科室</th>
            <th>KPI指数</th>
            <th>工资</th>
            <th>奖金</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="staff in filteredStaff" :key="staff.id">
            <td><input type="checkbox" v-model="selectedStaff" :value="staff.id" /></td>
            <td>{{ staff.id }}</td>
            <td>{{ staff.name }}</td>
            <td>{{ staff.department }}</td>
            <td>{{ staff.kpi }}</td>
            <td><input type="number" v-model="staff.salary" class="input-salary" /></td>
            <td><input type="number" v-model="staff.bonus" class="input-bonus" /></td>
            <td>
              <button @click="paySalary(staff.id)" class="action-button">发工资</button>
              <button @click="payBonus(staff.id)" class="action-button">发奖金</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const staff = ref([
    { id: 1, name: '张三', department: '内科', kpi: 85, salary: 4996, bonus: 0 },
    { id: 2, name: '李四', department: '外科', kpi: 90, salary: 5500, bonus: 0 },
  ]);
  
  const searchQuery = ref('');
  const selectedStaff = ref([]);
  
  const filteredStaff = computed(() => {
    return staff.value.filter(staffMember =>
      staffMember.id.toString().includes(searchQuery.value)
    );
  });
  
  function searchStaff() {
    console.log('搜索医务人员ID：', searchQuery.value);
  }
  
  function paySalary(staffId) {
    const staffMember = staff.value.find(s => s.id === staffId);
    if (staffMember) {
      console.log(`工资已发放给ID为${staffId}的员工，金额：${staffMember.salary}`);
    }
  }
  
  function payBonus(staffId) {
    const staffMember = staff.value.find(s => s.id === staffId);
    if (staffMember) {
      console.log(`奖金已发放给ID为${staffId}的员工，金额：${staffMember.bonus}`);
    }
  }
  </script>
  
  <style scoped>
  .admin-financial-management {
    padding: 20px;
    background-color: #f7f7f7;
    font-family: 'Arial', sans-serif;
  }
  
  .header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 300px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
  }
  
  .search-button {
    padding: 8px 16px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .staff-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .staff-table th,
  .staff-table td {
    padding: 12px;
    text-align: center;
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
  }
  
  .staff-table th {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .staff-table td {
    color: #666;
  }
  
  .input-salary,
  .input-bonus {
    width: 100px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .action-button {
    padding: 5px 10px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
  }
  
  .action-button:hover {
    background-color: #66b1ff;
  }
  </style>