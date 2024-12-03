<template>
    <div class="doctor-schedule">
      <!-- 添加排班按钮 -->
      <el-button type="primary" class="add-schedule-button" @click="showAddDialog">添加排班</el-button>
  
      <!-- 排班表格 -->
      <el-table :data="schedules" style="width: 100%" border>
        <el-table-column prop="doctor" label="医生" width="180"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button size="mini" @click="editSchedule(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteSchedule(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 添加排班对话框 -->
      <el-dialog :visible.sync="addDialogVisible" title="添加排班">
        <el-form :model="newSchedule">
          <el-form-item label="医生">
            <el-select v-model="newSchedule.doctor" placeholder="请选择医生">
              <el-option v-for="doctor in doctors" :key="doctor.id" :label="doctor.name" :value="doctor.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="newSchedule.date" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="时间">
            <el-time-picker v-model="newSchedule.time" placeholder="选择时间"></el-time-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addSchedule">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const schedules = ref([
        { doctor: '张三', date: '2024-01-01', time: '09:00-17:00', id: 1 },
        { doctor: '李四', date: '2024-01-02', time: '09:00-17:00', id: 2 },
      ]);
  
      const doctors = ref([
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
      ]);
  
      const newSchedule = ref({ doctor: '', date: '', time: '', id: null });
      const addDialogVisible = ref(false);
  
      const showAddDialog = () => {
        newSchedule.value = { doctor: '', date: '', time: '', id: null };
        addDialogVisible.value = true;
      };
  
      const addSchedule = () => {
        schedules.value.push({ ...newSchedule.value, id: Date.now() });
        addDialogVisible.value = false;
      };
  
      const editSchedule = (index, row) => {
        newSchedule.value = { ...row };
        addDialogVisible.value = true;
      };
  
      const deleteSchedule = (index, row) => {
        schedules.value.splice(index, 1);
      };
  
      return {
        schedules,
        doctors,
        newSchedule,
        addDialogVisible,
        showAddDialog,
        addSchedule,
        editSchedule,
        deleteSchedule,
      };
    },
  };
  </script>
  
  <style scoped>
  .doctor-schedule {
    padding: 20px;
  }
  
  .add-schedule-button {
    margin-bottom: 20px;
  }
  
  .dialog-footer {
    text-align: right;
  }
  </style>