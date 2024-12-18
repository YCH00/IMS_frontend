<template>
    <div class="doctor-schedule">
      <!-- 标题 -->
      <div class="header">医生排班管理</div>
  
      <!-- 搜索栏 -->
      <div class="search-bar">
        <input
          type="text"
          placeholder="输入医生姓名进行搜索"
          v-model="searchQuery"
        />
        <button class="hover-btn" @click="searchSchedule">搜索</button>
        <!-- 添加排班按钮 -->
        <button class="hover-btn" @click="showAddDialog">添加排班</button>
      </div>
  
      <!-- 排班表格 -->
      <table>
        <thead>
          <tr>
            <th>选择</th>
            <th>排班ID</th>
            <th>医生</th>
            <th>日期</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="schedule in paginatedSchedules"
            :key="schedule.id"
            class="schedule-row"
            @mouseover="hoveredRow = schedule.id"
            @mouseleave="hoveredRow = null"
          >
            <td>
              <input type="checkbox" v-model="selectedSchedules" :value="schedule.id" />
            </td>
            <td>{{ schedule.registrationId }}</td>
            <td>{{ schedule.doctor }}</td>
            <td>{{ formatDate(schedule.date) }}</td>
            <td>{{ schedule.time }}</td>
            <td>
              <el-button
                size="mini"
                class="action-btn edit-btn"
                @click="editSchedule(schedule)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                class="action-btn delete-btn"
                @click="deleteSchedule(schedule.id)"
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
        :total="filteredSchedules.length"
        layout="prev, pager, next, sizes, total"
        :page-sizes="[10, 20, 50, 100]"
        class="el-pagination"
      />
  
      <!-- 弹窗：新增/编辑排班 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑排班' : '添加排班'"
        class="schedule-dialog"
        width="50%"
      >
        <el-form
          :model="currentSchedule"
          label-width="120px"
          ref="scheduleForm"
          :rules="rules"
          @submit.native.prevent
        >
          <!-- 新增时显示排班ID -->
          <el-form-item label="排班ID" v-if="!isEdit" prop="registrationId">
            <el-input v-model="currentSchedule.registrationId" placeholder="自动生成排班ID" disabled />
          </el-form-item>
  
          <el-form-item label="医生" prop="doctor">
            <el-select v-model="currentSchedule.doctor" placeholder="请选择医生">
              <el-option
                v-for="doctor in doctors"
                :key="doctor.id"
                :label="doctor.name"
                :value="doctor.name"
              ></el-option>
            </el-select>
          </el-form-item>
  
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="currentSchedule.date"
              type="date"
              placeholder="选择日期"
              :disabled-date="disabledPastDate"
            ></el-date-picker>
          </el-form-item>
  
          <el-form-item label="时间" prop="time">
            <el-select v-model="currentSchedule.time" placeholder="请选择时间">
              <el-option
                v-for="time in times"
                :key="time.id"
                :label="time.time"
                :value="time.time"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="saveSchedule">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import dayjs from 'dayjs';
  
  // 表单验证规则
  const rules = {
    registrationId: [
      { required: true, message: '请输入排班ID', trigger: 'blur' }
    ],
    doctor: [
      { required: true, message: '请选择医生', trigger: 'change' }
    ],
    date: [
      { required: true, message: '请选择日期', trigger: 'change' }
    ],
    time: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ]
  };
  
  // 模拟医生排班数据
  const schedules = ref([
    { id: 1, registrationId: 'S001', doctor: '张三', date: new Date('2024-01-01'), time: '白班' },
    { id: 2, registrationId: 'S002', doctor: '李四', date: new Date('2024-01-02'), time: '夜班' },
    { id: 3, registrationId: 'S003', doctor: '王五', date: new Date('2024-01-02'), time: '上午班' },
  ]);
  
  // 模拟医生数据
  const doctors = ref([
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 3, name: '王五' },
    // 你可以添加更多医生
  ]);
  
  // 模拟时间段数据
  const times = ref([
    { time: '上午班', id: 1 },
    { time: '下午班', id: 2 },
    { time: '白班', id: 3 },
    { time: '夜班', id: 4 },
  ]);
  
  // 搜索框输入数据
  const searchQuery = ref('');
  const hoveredRow = ref(null);
  const selectedSchedules = ref([]);
  
  // 分页数据
  const paginationData = reactive({
    pageNumber: 1,
    pageSize: 10,
  });
  
  // 当前操作的排班
  const currentSchedule = ref({ registrationId: '', doctor: '', date: null, time: '', id: null });
  const dialogVisible = ref(false);
  const isEdit = ref(false);
  
  // 表单引用
  const scheduleForm = ref(null);
  
  // 计算过滤后的排班列表
  const filteredSchedules = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return schedules.value;
    return schedules.value.filter(schedule =>
      schedule.doctor.toLowerCase().includes(query) ||
      schedule.registrationId.toLowerCase().includes(query)
    );
  });
  
  // 计算分页后的排班列表
  const paginatedSchedules = computed(() => {
    const start = (paginationData.pageNumber - 1) * paginationData.pageSize;
    const end = start + paginationData.pageSize;
    return filteredSchedules.value.slice(start, end);
  });
  
  // 搜索排班
  const searchSchedule = () => {
    paginationData.pageNumber = 1; // 重置到第一页
    ElMessage({
      message: `搜索医生或排班ID: ${searchQuery.value}`,
      type: 'info',
    });
  };
  
  // 打开新增排班对话框
  const showAddDialog = () => {
    isEdit.value = false;
    currentSchedule.value = { registrationId: '', doctor: '', date: null, time: '', id: null };
    dialogVisible.value = true;
  };
  
  // 打开编辑排班对话框
  const editSchedule = (schedule) => {
    isEdit.value = true;
    // 深拷贝排班信息，确保编辑时不直接修改原数据
    currentSchedule.value = { 
      ...schedule, 
      date: new Date(schedule.date) 
    };
    dialogVisible.value = true;
  };
  
  // 保存排班
  const saveSchedule = () => {
    scheduleForm.value.validate((valid) => {
      if (valid) {
        if (isEdit.value) {
          const index = schedules.value.findIndex(s => s.id === currentSchedule.value.id);
          if (index !== -1) {
            schedules.value[index] = { 
              ...currentSchedule.value, 
              date: new Date(currentSchedule.value.date) 
            };
            ElMessage({
              message: '排班信息已更新',
              type: 'success',
            });
          }
        } else {
          // 自动生成排班ID
          const newIdNumber = parseInt(schedules.value[schedules.value.length - 1]?.registrationId.slice(1) || '0') + 1;
          currentSchedule.value.registrationId = `S${newIdNumber.toString().padStart(3, '0')}`;
          currentSchedule.value.id = Date.now(); // 使用时间戳作为唯一ID
          schedules.value.push({ 
            ...currentSchedule.value, 
            date: new Date(currentSchedule.value.date) 
          });
          ElMessage({
            message: '新增排班成功',
            type: 'success',
          });
        }
        dialogVisible.value = false;
      } else {
        ElMessage({
          message: '请填写所有必填项',
          type: 'warning',
        });
        return false;
      }
    });
  };
  
  // 取消排班对话框
  const cancel = () => {
    dialogVisible.value = false;
  };
  
  // 删除排班
  const deleteSchedule = (id) => {
    ElMessageBox.confirm(
      '确定删除该排班吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      const index = schedules.value.findIndex(schedule => schedule.id === id);
      if (index !== -1) {
        schedules.value.splice(index, 1);
        ElMessage({
          message: '排班已删除',
          type: 'success',
        });
      }
    }).catch(() => {
      // 用户取消删除
    });
  };
  
  // 分页页码变化
  const handlePageChange = (page) => {
    paginationData.pageNumber = page;
  };
  
  // 分页每页条数变化
  const handleSizeChange = (size) => {
    paginationData.pageSize = size;
  };
  
  // 格式化日期显示
  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  
  // 禁止选择过去的日期
  const disabledPastDate = (time) => {
    return time && time < dayjs().startOf('day').toDate();
  };
  
  // 在组件挂载时加载排班数据（如果从API获取数据，可以在这里调用API）
  onMounted(() => {
    // 这里使用本地数据模拟
    // 如果有API，替换此部分
  });
  </script>
  
  <style scoped>
  .doctor-schedule {
    width: 100%;
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
  
  /* 按钮之间的间隔 */
  .search-bar button + .hover-btn {
    margin-left: 10px; /* 增加间距 */
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
  
  table td {
    color: #666;
  }
  
  .schedule-row {
    transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
  }
  
  .schedule-row:hover {
    background-color: #f0f9ff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transform: scale(1.02);
  }
  
  .dialog-footer {
    text-align: right;
  }
  
  .action-btn {
    transition: transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  /* 编辑按钮样式 - 镂空蓝色 */
  .edit-btn {
    background-color: transparent;
    color: #409eff;
    border: 1px solid #409eff;
    margin-right: 10px;
  }
  
  .edit-btn:hover {
    background-color: #e6f7ff;
    border-color: #73d13d;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  /* 删除按钮样式 - 红色背景 */
  .delete-btn {
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
  }
  
  .delete-btn:hover {
    background-color: #d9363e;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  /* 分页样式 */
  .el-pagination {
    margin-top: 20px;
  }
  
  /* 弹窗样式，与其他管理页面一致 */
  .schedule-dialog .el-dialog__header {
    background-color: #409eff;
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
  
  .schedule-dialog .el-dialog__body {
    padding: 20px;
  }
  
  .schedule-dialog .el-form-item {
    margin-bottom: 15px;
  }
  
  /* 弹窗底部按钮样式 */
  .dialog-footer .el-button {
    margin-left: 10px;
  }
  
  /* 与用户界面保持一致的交互动效 */
  .el-button {
    border-radius: 4px;
    font-size: 14px;
    padding: 6px 12px;
  }
  
  .el-button.primary {
    background-color: #409eff;
    color: white;
    border: none;
  }
  
  .el-button.primary:hover {
    background-color: #66b1ff;
  }
  
  .el-button.danger {
    background-color: #ff4d4f;
    color: white;
    border: none;
  }
  
  .el-button.danger:hover {
    background-color: #d9363e;
  }
  </style>
  