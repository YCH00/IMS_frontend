<template>
    <div class="appointment-management">
      <!-- 标题 -->
      <div class="header">用户预约管理</div>
  
      <!-- 搜索栏 -->
      <div class="search-bar">
        <input type="text" placeholder="输入挂号ID进行搜索" v-model="searchQuery" />
        <button class="hover-btn" @click="searchAppointment">搜索</button>
        <!-- 新增按钮 -->
        <button class="hover-btn" @click="showAddDialog">新增预约</button>
      </div>
  
      <!-- 预约表格 -->
      <table>
        <thead>
          <tr>
            <th>选择</th>
            <th>挂号ID</th>
            <th>患者ID</th>
            <th>患者姓名</th>
            <th>医生ID</th>
            <th>医生姓名</th>
            <th>预约时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="appointment in paginatedAppointments" 
            :key="appointment.registrationId" 
            class="appointment-row"
            @mouseover="hoveredRow = appointment.registrationId"
            @mouseleave="hoveredRow = null"
          >
            <td><input type="checkbox" v-model="selectedAppointments" :value="appointment.registrationId" /></td>
            <td>{{ appointment.registrationId }}</td>
            <td>{{ appointment.patientId }}</td>
            <td>{{ appointment.patient }}</td>
            <td>{{ appointment.doctorId }}</td>
            <td>{{ appointment.doctor }}</td>
            <td>{{ appointment.appointmentTime }}</td>
            <td>
              <el-button 
                size="mini" 
                class="action-btn edit-btn" 
                @click="editAppointment(appointment)"
              >
                编辑
              </el-button>
              <el-button 
                size="mini" 
                type="danger" 
                class="action-btn delete-btn"
                @click="deleteAppointment(appointment.registrationId)"
              >
                删除
              </el-button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- 分页组件 -->
      <el-pagination
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :current-page="paginationData.pageNumber"
        :page-size="paginationData.pageSize"
        :total="appointments.length"
        layout="prev, pager, next, sizes, total"
        :page-sizes="[10, 20, 50, 100]"
      />
  
      <!-- 弹窗：新增/编辑预约 -->
      <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑预约' : '新增预约'">
        <el-form :model="currentAppointment" label-width="80px">
          <el-form-item label="挂号ID">
            <el-input v-model="currentAppointment.registrationId" :disabled="isEdit" placeholder="请输入挂号ID" />
          </el-form-item>
          <el-form-item label="患者ID">
            <el-input v-model="currentAppointment.patientId" placeholder="请输入患者ID" />
          </el-form-item>
          <el-form-item label="患者姓名">
            <el-input v-model="currentAppointment.patient" placeholder="请输入患者姓名" />
          </el-form-item>
          <el-form-item label="医生ID">
            <el-input v-model="currentAppointment.doctorId" placeholder="请输入医生ID" />
          </el-form-item>
          <el-form-item label="医生姓名">
            <el-input v-model="currentAppointment.doctor" placeholder="请输入医生姓名" />
          </el-form-item>
          <el-form-item label="预约时间">
            <el-date-picker v-model="currentAppointment.appointmentTime" type="datetime" placeholder="选择预约时间"></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAppointment">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // 模拟预约数据
  const appointments = ref([
    { registrationId: 'A001', patientId: 'P001', patient: '张三', doctorId: 'D001', doctor: '李医生', appointmentTime: '2024-01-01 09:00' },
    { registrationId: 'A002', patientId: 'P002', patient: '李四', doctorId: 'D002', doctor: '王医生', appointmentTime: '2024-01-02 10:00' },
  ]);
  
  const searchQuery = ref('');
  const hoveredRow = ref(null);
  const selectedAppointments = ref([]);
  const dialogVisible = ref(false);
  const currentAppointment = ref({ registrationId: '', patientId: '', patient: '', doctorId: '', doctor: '', appointmentTime: '' });
  const isEdit = ref(false);
  
  // 分页数据
  const paginationData = ref({
    pageNumber: 1,
    pageSize: 10
  });
  
  // 计算过滤后的预约列表
  const filteredAppointments = computed(() => {
    return appointments.value.filter(appointment =>
      appointment.registrationId.includes(searchQuery.value.trim())
    );
  });
  
  // 计算分页后的预约列表
  const paginatedAppointments = computed(() => {
    const start = (paginationData.value.pageNumber - 1) * paginationData.value.pageSize;
    const end = start + paginationData.value.pageSize;
    return filteredAppointments.value.slice(start, end);
  });
  
  // 搜索预约
  const searchAppointment = () => {
    console.log('搜索挂号ID:', searchQuery.value);
  };
  
  // 打开新增预约对话框
  const showAddDialog = () => {
    isEdit.value = false;
    currentAppointment.value = { registrationId: '', patientId: '', patient: '', doctorId: '', doctor: '', appointmentTime: '' };
    dialogVisible.value = true;
  };
  
  // 打开编辑预约对话框
  const editAppointment = (appointment) => {
    isEdit.value = true;
    currentAppointment.value = { ...appointment };
    dialogVisible.value = true;
  };
  
  // 保存预约
  const saveAppointment = () => {
    if (isEdit.value) {
      const index = appointments.value.findIndex(a => a.registrationId === currentAppointment.value.registrationId);
      if (index !== -1) {
        appointments.value[index] = { ...currentAppointment.value };
      }
    } else {
      appointments.value.push({ ...currentAppointment.value });
    }
    dialogVisible.value = false;
  };
  
  // 删除预约
  const deleteAppointment = (registrationId) => {
    const index = appointments.value.findIndex(a => a.registrationId === registrationId);
    if (index !== -1) {
      appointments.value.splice(index, 1);
    }
  };
  
  // 分页页码变化
  const handlePageChange = (page) => {
    paginationData.value.pageNumber = page;
  };
  
  // 分页每页条数变化
  const handleSizeChange = (size) => {
    paginationData.value.pageSize = size;
  };
  </script>
  
  <style scoped>
  .appointment-management {
    padding: 20px;
    background-color: #f7f7f7;
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
  
  .search-bar input {
    width: 250px;
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
  }
  
  .search-bar button,
  .hover-btn {
    padding: 8px 16px;
    font-size: 14px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .search-bar button + .hover-btn {
    margin-left: 10px;
  }
  
  .hover-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  table th,
  table td {
    padding: 12px;
    text-align: center;
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
  }
  
  table th {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .appointment-row {
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  
  .appointment-row:hover {
    background-color: #f0f9ff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .dialog-footer {
    text-align: right;
  }
  
  .action-btn {
    transition: transform 0.2s ease, background-color 0.3s ease;
  }
  
  .action-btn:hover {
    transform: scale(1.1);
  }
  
  .delete-btn {
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
  }
  
  .delete-btn:hover {
    background-color: #d9363e;
  }
  </style>
  