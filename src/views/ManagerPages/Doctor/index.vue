<template>
    <div class="admin-doctors-management">
      <div class="header">医生管理</div>
      <div class="search-bar">
        <input type="text" placeholder="搜索医生" v-model="searchQuery" />
        <button @click="searchDoctors">搜索</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>选择</th>
            <th>医生姓名</th>
            <th>科室</th>
            <th>工号</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doctor in filteredDoctors" :key="doctor.id">
            <td><input type="checkbox" v-model="selectedDoctors" :value="doctor.id" /></td>
            <td>{{ doctor.name }}</td>
            <td>{{ doctor.department }}</td>
            <td>{{ doctor.employeeId }}</td>
            <td>{{ doctor.status }}</td>
            <td><button @click="editDoctor(doctor.id)">编辑</button><button @click="deleteDoctor(doctor.id)">删除</button></td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <!-- 分页组件，根据需要实现 -->
      </div>
      <button @click="addDoctor">新增医生</button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const searchQuery = ref('');
  const doctors = ref([
    // 假设医生数据
    { id: 1, name: '张三', department: '骨科', employeeId: 'G001', status: '在职' },
    // 更多医生数据...
  ]);
  
  const filteredDoctors = computed(() => {
    return doctors.value.filter(doctor => doctor.name.includes(searchQuery.value));
  });
  
  function searchDoctors() {
    // 搜索逻辑
  }
  
  function editDoctor(id) {
    // 编辑医生逻辑
    console.log('编辑医生', id);
  }
  
  function deleteDoctor(id) {
    // 删除医生逻辑
    console.log('删除医生', id);
  }
  
  function addDoctor() {
    // 新增医生逻辑
    console.log('新增医生');
  }
  </script>
  
  <style scoped>
  .admin-doctors-management {
    padding: 20px;
    background-color: #f5f5f5;
  }
  
  .header {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .search-bar {
    margin-bottom: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
  }
  
  th {
    background-color: #4CAF50;
    color: white;
  }
  
  button {
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
  
  .pagination {
    margin-top: 20px;
    text-align: center;
  }
  </style>