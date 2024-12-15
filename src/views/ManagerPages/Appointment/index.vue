<template>
    <div class="appointment-management">
      <!-- 添加预约按钮 -->
      <el-button type="primary" class="add-appointment-button" @click="showAddDialog">添加预约</el-button>
  
      <!-- 预约表格 -->
      <el-table :data="appointments" style="width: 100%" border>
        <el-table-column prop="patientId" label="患者ID" width="100"></el-table-column>
        <el-table-column prop="patient" label="患者姓名" width="180"></el-table-column>
        <el-table-column prop="doctorId" label="医生ID" width="100"></el-table-column>
        <el-table-column prop="doctor" label="医生姓名"></el-table-column>
        <el-table-column prop="date" label="预约日期"></el-table-column>
        <el-table-column prop="time" label="预约时间"></el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button size="mini" @click="editAppointment(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteAppointment(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 添加预约对话框 -->
      <el-dialog :visible.sync="addDialogVisible" title="添加预约">
        <el-form :model="newAppointment">
          <el-form-item label="患者ID">
            <el-select v-model="newAppointment.patientId" placeholder="请选择患者">
              <el-option v-for="patient in patients" :key="patient.id" :label="patient.name" :value="patient.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="患者姓名">
            <el-input v-model="newAppointment.patient" placeholder="患者姓名" readonly></el-input>
          </el-form-item>
          <el-form-item label="医生ID">
            <el-select v-model="newAppointment.doctorId" placeholder="请选择医生">
              <el-option v-for="doctor in doctors" :key="doctor.id" :label="doctor.name" :value="doctor.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="医生姓名">
            <el-input v-model="newAppointment.doctor" placeholder="医生姓名" readonly></el-input>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="newAppointment.date" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="时间">
            <el-time-picker v-model="newAppointment.time" placeholder="选择时间"></el-time-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addAppointment">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const appointments = ref([
        { patientId: 1, patient: '张三', doctorId: 2, doctor: '李医生', date: '2024-01-01', time: '09:00-10:00' },
        { patientId: 2, patient: '李四', doctorId: 3, doctor: '王医生', date: '2024-01-02', time: '10:00-11:00' },
      ]);
  
      const patients = ref([
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
      ]);
  
      const doctors = ref([
        { id: 2, name: '李医生' },
        { id: 3, name: '王医生' },
      ]);
  
      const newAppointment = ref({ patientId: '', patient: '', doctorId: '', doctor: '', date: '', time: '' });
      const addDialogVisible = ref(false);
  
      const showAddDialog = () => {
        newAppointment.value = { patientId: '', patient: '', doctorId: '', doctor: '', date: '', time: '' };
        addDialogVisible.value = true;
      };
  
      const addAppointment = () => {
        appointments.value.push({ ...newAppointment.value });
        addDialogVisible.value = false;
      };
  
      const editAppointment = (index, row) => {
        newAppointment.value = { ...row };
        addDialogVisible.value = true;
      };
  
      const deleteAppointment = (index, row) => {
        appointments.value.splice(index, 1);
      };
  
      return {
        appointments,
        patients,
        doctors,
        newAppointment,
        addDialogVisible,
        showAddDialog,
        addAppointment,
        editAppointment,
        deleteAppointment,
      };
    },
  };
  </script>
  
  <style scoped>
  .appointment-management {
    padding: 20px;
  }
  
  .add-appointment-button {
    margin-bottom: 20px; /* 添加空行 */
  }
  
  .dialog-footer {
    text-align: right;
  }
  </style>