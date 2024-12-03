<template>
    <div class="add-appointment">
      <el-form :model="appointment" ref="appointmentForm" label-width="120px">
        <el-form-item label="患者ID" :rules="[{ required: true, message: '请更改患者ID', trigger: 'blur' }]">
          <el-input v-model="appointment.patientId" placeholder="请更改患者ID" @input="fetchPatientInfo"></el-input>
          <div v-if="patientInfo" class="info-hint">患者姓名: {{ patientInfo.name }}</div>
        </el-form-item>
        <el-form-item label="医生ID" :rules="[{ required: true, message: '请更改医生ID', trigger: 'blur' }]">
          <el-input v-model="appointment.doctorId" placeholder="请更改医生ID" @input="fetchDoctorInfo"></el-input>
          <div v-if="doctorInfo" class="info-hint">医生姓名: {{ doctorInfo.name }}</div>
        </el-form-item>
        <el-form-item label="预约日期" :rules="[{ required: true, message: '请更改预约日期', trigger: 'change' }]">
          <el-date-picker type="date" v-model="appointment.date" placeholder="更改日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="预约时间" :rules="[{ required: true, message: '请更改预约时间', trigger: 'change' }]">
          <el-time-picker v-model="appointment.time" placeholder="更改时间"></el-time-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">修改预约</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const appointment = ref({
        patientId: '',
        doctorId: '',
        date: '',
        time: ''
      });
  
      const patients = ref([
        { id: 1, name: '张三' },
        { id: 2, name: '李四' }
      ]);
  
      const doctors = ref([
        { id: 1, name: '王五' },
        { id: 2, name: '赵六' }
      ]);
  
      const patientInfo = ref(null);
      const doctorInfo = ref(null);
  
      const fetchPatientInfo = () => {
        patientInfo.value = patients.value.find(patient => patient.id.toString() === appointment.value.patientId) || null;
      };
  
      const fetchDoctorInfo = () => {
        doctorInfo.value = doctors.value.find(doctor => doctor.id.toString() === appointment.value.doctorId) || null;
      };
  
      const submitForm = () => {
        this.$refs.appointmentForm.validate((valid) => {
          if (valid) {
            alert('添加成功!');
            // 在这里添加将预约信息发送到后端的逻辑
          } else {
            console.log('表单验证失败');
            return false;
          }
        });
      };
  
      return {
        appointment,
        patients,
        doctors,
        patientInfo,
        doctorInfo,
        fetchPatientInfo,
        fetchDoctorInfo,
        submitForm
      };
    }
  };
  </script>
  
  <style scoped>
  .add-appointment {
    padding: 20px;
    width: 500px;
    margin: 0 auto;
  }
  .info-hint {
    color: #409EFF;
    font-size: 12px;
    margin-top: 5px;
  }
  </style>