<template>
    <div class="add-schedule">
      <el-form :model="schedule" ref="scheduleForm" label-width="80px">
        <el-form-item label="医生" :rules="[{ required: true, message: '请输入医生姓名', trigger: 'blur' }]">
          <el-input v-model="schedule.doctor" placeholder="请输入医生姓名"></el-input>
        </el-form-item>
        <el-form-item label="日期" :rules="[{ required: true, message: '请选择日期', trigger: 'change' }]">
          <el-date-picker type="date" v-model="schedule.date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="时间" :rules="[{ required: true, message: '请输入时间', trigger: 'blur' }]">
          <el-time-picker v-model="schedule.time" placeholder="选择时间"></el-time-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('scheduleForm')">添加</el-button>
          <el-button @click="resetForm('scheduleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const schedule = ref({
        doctor: '',
        date: '',
        time: ''
      });
  
      const submitForm = (formName) => {
        const rules = {
          doctor: [{ required: true, message: '请输入医生姓名', trigger: 'blur' }],
          date: [{ required: true, message: '请选择日期', trigger: 'change' }],
          time: [{ required: true, message: '请输入时间', trigger: 'blur' }]
        };
        const formData = this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('提交成功!');
            // 在这里添加将排班信息发送到后端的逻辑
          } else {
            console.log('表单验证失败');
            return false;
          }
        });
      };
  
      const resetForm = (formName) => {
        this.$refs[formName].resetFields();
      };
  
      return {
        schedule,
        submitForm,
        resetForm
      };
    }
  };
  </script>
  
  <style scoped>
  .add-schedule {
    padding: 20px;
    width: 300px;
    margin: 0 auto;
  }
  </style>