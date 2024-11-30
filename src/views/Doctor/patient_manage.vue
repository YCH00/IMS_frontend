<template>
    <div class="patient-info">
      <div class="header">
        <h2>医院信息管理系统</h2>
      </div>
      <div class="search-bar">
        <input type="text" placeholder="搜索病人信息" v-model="searchQuery" />
        <button @click="searchPatients">查询</button>
        <button @click="addPatient">新增</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>账号</th>
            <th>姓名</th>
            <th>性别</th>
            <th>手机</th>
            <th>邮箱</th>
            <th>身份证</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in filteredPatients" :key="patient.id">
            <td>{{ patient.id }}</td>
            <td>{{ patient.account }}</td>
            <td>{{ patient.name }}</td>
            <td>{{ patient.gender }}</td>
            <td>{{ patient.phone }}</td>
            <td>{{ patient.email }}</td>
            <td>{{ patient.idCard }}</td>
            <td>
              <button @click="viewPatient(patient)">查看</button>
              <button @click="editPatient(patient)">编辑</button>
              <button @click="deletePatient(patient.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <!-- 分页组件，可以根据实际需要实现 -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const patients = ref([
    { id: 1, account: '账号1', name: '姓名1', gender: '男', phone: '13823888888', email: '773860001@qq.com', idCard: '440300198101010001' },
    // 其他病人数据...
  ]);
  
  const searchQuery = ref('');
  
  const filteredPatients = computed(() => {
    return patients.value.filter(patient =>
      patient.name.includes(searchQuery.value) ||
      patient.account.includes(searchQuery.value)
    );
  });
  
  function searchPatients() {
    // 执行搜索操作，这里可以添加更复杂的搜索逻辑
  }
  
  function addPatient() {
    // 新增病人信息的逻辑
    console.log('新增病人');
    // 这里可以跳转到一个新增病人信息的表单页面
  }
  
  function viewPatient(patient) {
    // 查看病人详细信息的逻辑
    console.log('查看病人:', patient);
    // 这里可以跳转到一个显示病人详细信息的页面
  }
  
  function editPatient(patient) {
    // 编辑病人信息的逻辑
    console.log('编辑病人:', patient);
    // 这里可以跳转到一个编辑病人信息的表单页面
  }
  
  function deletePatient(id) {
    // 删除病人信息的逻辑
    patients.value = patients.value.filter(patient => patient.id !== id);
  }
  </script>
  
  <style scoped>
  .patient-info {
    padding: 20px;
  }
  
  .header h2 {
    text-align: center;
  }
  
  .search-bar {
    margin-bottom: 20px;
    text-align: center;
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
    margin-right: 5px;
  }
  </style>