<template>
    <div class="registration-page">
      <div class="form-card" @mouseenter="cardHover = true" @mouseleave="cardHover = false" :class="{ hover: cardHover }">
        <h2 class="title">预约挂号</h2>
  
        <!-- 科室选择 -->
        <div class="form-group" @mouseenter="hoverDepartment = true" @mouseleave="hoverDepartment = false" :class="{ hover: hoverDepartment }">
          <label for="department">
            <i class="icon-department"></i> 科室
          </label>
          <select id="department" v-model="selectedDepartment" class="input-field">
            <option value="">请选择科室</option>
            <option v-for="department in departments" :key="department.id" :value="department.id">{{ department.name }}</option>
          </select>
        </div>
  
        <!-- 医生选择 -->
        <div class="form-group" @mouseenter="hoverDoctor = true" @mouseleave="hoverDoctor = false" :class="{ hover: hoverDoctor }">
          <label for="doctor">
            <i class="icon-doctor"></i> 医生
          </label>
          <select id="doctor" v-model="selectedDoctor" class="input-field" :disabled="!selectedDepartment">
            <option value="" disabled>请选择医生</option>
            <option v-if="!selectedDepartment" disabled>请先选择科室</option>
            <option v-for="doctor in filteredDoctors" :key="doctor.id" :value="doctor.id">{{ doctor.name }}</option>
          </select>
        </div>
  
        <!-- 预约日期 -->
        <div class="form-group" @mouseenter="hoverDate = true" @mouseleave="hoverDate = false" :class="{ hover: hoverDate }">
          <label for="date">
            <i class="icon-calendar"></i> 预约日期
          </label>
          <input type="date" id="date" v-model="selectedDate" class="input-field" />
        </div>
  
        <!-- 预约时间 -->
        <div class="form-group" @mouseenter="hoverTime = true" @mouseleave="hoverTime = false" :class="{ hover: hoverTime }">
          <label for="time">
            <i class="icon-clock"></i> 预约时间
          </label>
          <input type="time" id="time" v-model="selectedTime" class="input-field" />
        </div>
  
        <!-- 提交按钮 -->
        <button class="submit-button" @click="handleSubmit">预约挂号</button>
      </div>
  
      <!-- 成功提示弹窗 -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <h3>预约成功</h3>
          <p>您的挂号信息已成功提交！</p>
          <button class="close-button" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // 预约信息
  const selectedDepartment = ref('');
  const selectedDoctor = ref('');
  const selectedDate = ref('');
  const selectedTime = ref('');
  const showModal = ref(false);
  const cardHover = ref(false);
  
  // 每个表单项的 hover 状态
  const hoverDepartment = ref(false);
  const hoverDoctor = ref(false);
  const hoverDate = ref(false);
  const hoverTime = ref(false);
  
  // 科室和医生数据
  const departments = ref([
    { id: 'pediatrics', name: '儿科' },
    { id: 'cardiology', name: '心脏科' },
    { id: 'neurology', name: '神经科' }
  ]);
  
  const doctors = ref([
    { id: 1, departmentId: 'pediatrics', name: '张医生' },
    { id: 2, departmentId: 'pediatrics', name: '李医生' },
    { id: 3, departmentId: 'cardiology', name: '王医生' },
    { id: 4, departmentId: 'cardiology', name: '赵医生' },
    { id: 5, departmentId: 'neurology', name: '周医生' }
  ]);
  
  // 计算：根据选中的科室过滤医生
  const filteredDoctors = computed(() => {
    return doctors.value.filter(doctor => doctor.departmentId === selectedDepartment.value);
  });
  
  // 提交按钮
  const handleSubmit = () => {
    if (selectedDepartment.value && selectedDoctor.value && selectedDate.value && selectedTime.value) {
      showModal.value = true; // Show modal on successful registration
    } else {
      alert('请填写完整的预约信息');
    }
  };
  
  const closeModal = () => {
    showModal.value = false;
  };
  </script>
  
  <style scoped>
  /* 页面背景：渐变色 + 精美的花纹背景 */
  .registration-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #ff7a18, #d9ea5f 50%, #22b9e3);
    position: relative;
  }
  
  /* 使用伪元素::after实现背景花纹 */
  .registration-page::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%) -5px -5px,
      linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%) -5px -5px;
    background-size: 20px 20px;
    z-index: -1;
    opacity: 0.15; /* 背景透明度，确保不干扰内容可读性 */
  }
  
  /* 表单卡片 */
  .form-card {
    background: white;
    padding: 40px 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    transition: transform 0.3s ease;
    margin-top: -20px; /* 向上移动模块 */
  }
  
  .form-card.hover {
    transform: translateY(-10px);
  }
  
  .title {
    text-align: center;
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  
  /* 表单项 */
  .form-group {
    margin-bottom: 20px;
    transition: transform 0.3s, box-shadow 0.3s ease;
  }
  
  .form-group.hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* 标签样式 */
  label {
    font-size: 16px;
    color: #555;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  /* 输入框 */
  .input-field {
    width: 100%;
    padding: 12px;
    margin-top: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s ease;
  }
  
  .input-field:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
  }
  
  /* 提交按钮 */
  .submit-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 15px 30px;
    width: 100%;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.3s, background-color 0.3s;
  }
  
  .submit-button:hover {
    transform: scale(1.05);
    background-color: #45a049;
  }
  
  .submit-button:active {
    transform: scale(0.98);
  }
  
  /* 弹窗 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
  }
  
  .modal-content {
    background: white;
    padding: 30px;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    width: 300px;
    animation: scaleUp 0.3s ease;
  }
  
  .close-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s;
  }
  
  .close-button:hover {
    background-color: #e53935;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes scaleUp {
    from {
      transform: scale(0.8);
    }
    to {
      transform: scale(1);
    }
  }
  
  /* 图标样式 */
  .icon-department::before {
    content: url('https://img.icons8.com/ios/50/000000/hospital-room.png');
  }
  
  .icon-doctor::before {
    content: url('https://img.icons8.com/ios/50/000000/user-male.png'); /* 更换为小人图标 */
  }
  
  .icon-calendar::before {
    content: url('https://img.icons8.com/ios/50/000000/calendar.png');
  }
  
  .icon-clock::before {
    content: url('https://img.icons8.com/ios/50/000000/clock.png');
  }
  </style>
  