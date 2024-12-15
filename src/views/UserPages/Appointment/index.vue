<template>
  <div class="registration-interface">
    <div class="header">医院预约挂号系统</div>
    <div class="sidebar">
      <ul>
        <li>预约挂号</li>
        <!-- 其他与挂号相关的导航项 -->
      </ul>
    </div>
    <div class="main-content">
      <div class="form-group">
        <label for="department">科室</label>
        <select id="department" v-model="selectedDepartment">
          <option value="">请选择</option>
          <option value="pediatrics">儿科</option>
          <!-- Add more departments as needed -->
        </select>
      </div>
      <div class="form-group">
        <label for="doctor">医生</label>
        <select id="doctor" v-model="selectedDoctor">
          <option value="">请选择</option>
          <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">{{ doctor.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="date">时间</label>
        <input type="date" id="date" v-model="selectedDate"/>
      </div>
      <button class="submit-button" @click="registerAppointment">预约挂号</button>
    </div>
    <div class="info">
      <h2>挂号信息</h2>
      <!-- 挂号信息表格 -->
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.registration-interface {
  display: grid;
  grid-template-areas: "header header"
                   "sidebar main-content";
  grid-template-columns: 1fr 3fr;
  gap: 20px;
}

.header {
  grid-area: header;
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 10px 0;
}

.sidebar {
  grid-area: sidebar;
  background-color: #f5f5f5;
  padding: 10px;
}

.main-content {
  grid-area: main-content;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

select, input[type="date"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 10px 20px;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>