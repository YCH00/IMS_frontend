<template>
    <div class="doctor-schedule">
      <div class="header">医生排班管理</div>
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
            <td><input type="checkbox" v-model="selectedSchedules" :value="schedule.id" /></td>
            <td>{{ schedule.doctor }}</td>
            <td>{{ schedule.date }}</td>
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
      />
  
      <!-- 弹窗：新增/编辑排班 -->
      <el-dialog v-model="dialogVisible" :title="isAdd ? '添加排班' : '编辑排班'">
        <el-form :model="newSchedule" label-width="80px">
          <el-form-item label="医生">
            <el-select v-model="newSchedule.doctor" placeholder="请选择医生">
              <el-option
                v-for="doctor in doctors"
                :key="doctor.id"
                :label="doctor.name"
                :value="doctor.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="newSchedule.date"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="时间">
            <el-select v-model="newSchedule.time" placeholder="请选择时间">
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
          <el-button type="primary" @click="ensure">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // 模拟数据
  const schedules = ref([
    { doctor: '张三', date: '2024-01-01', time: '白班', id: 1 },
    { doctor: '李四', date: '2024-01-02', time: '夜班', id: 2 },
    { doctor: '王五', date: '2024-01-02', time: '上午班', id: 3 },
  ]);
  
  const doctors = ref([
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 3, name: '王五' },
  ]);
  
  const times = ref([
    { time: '上午班', id: 1 },
    { time: '下午班', id: 2 },
    { time: '白班', id: 3 },
    { time: '夜班', id: 4 },
  ]);
  
  const searchQuery = ref('');
  const hoveredRow = ref(null);
  
  // 分页数据
  const paginationData = ref({
    pageNumber: 1,
    pageSize: 10,
  });
  
  const selectedSchedules = ref([]);
  const dialogVisible = ref(false);
  const newSchedule = ref({ doctor: '', date: '', time: '', id: null });
  const isAdd = ref(true);
  
  // 计算过滤后的排班数据
  const filteredSchedules = computed(() => {
    return schedules.value.filter((schedule) =>
      schedule.doctor.includes(searchQuery.value.trim())
    );
  });
  
  // 计算分页后的排班数据
  const paginatedSchedules = computed(() => {
    const start = (paginationData.value.pageNumber - 1) * paginationData.value.pageSize;
    const end = start + paginationData.value.pageSize;
    return filteredSchedules.value.slice(start, end);
  });
  
  // 添加排班对话框
  const showAddDialog = () => {
    newSchedule.value = { doctor: '', date: '', time: '', id: null };
    isAdd.value = true;
    dialogVisible.value = true;
  };
  
  // 保存排班
  const ensure = () => {
    if (!formValid(newSchedule.value)) {
      console.log('表单填写不完整！');
      return;
    }
    newSchedule.value.date = formatDate(newSchedule.value.date); // 格式化日期
    if (isAdd.value) {
      schedules.value.push({ ...newSchedule.value, id: Date.now() });
    } else {
      const index = schedules.value.findIndex((schedule) => schedule.id === newSchedule.value.id);
      if (index !== -1) {
        schedules.value[index] = { ...newSchedule.value }; // 更新排班信息
      }
    }
    dialogVisible.value = false;
  };
  
  // 取消排班对话框
  const cancel = () => {
    dialogVisible.value = false;
  };
  
  // 编辑排班
  const editSchedule = (schedule) => {
    newSchedule.value = { ...schedule };
    isAdd.value = false;
    dialogVisible.value = true;
  };
  
  // 删除排班
  const deleteSchedule = (id) => {
    const index = schedules.value.findIndex((schedule) => schedule.id === id);
    if (index !== -1) {
      schedules.value.splice(index, 1);
    }
  };
  
  // 格式化日期为 "yyyy-MM-dd"
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 验证表单是否完整
  const formValid = (form) => {
    return form.doctor && form.date && form.time;
  };
  
  // 搜索排班
  const searchSchedule = () => {
    console.log('搜索医生:', searchQuery.value);
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
  .doctor-schedule {
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
  
  .schedule-row {
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  
  .schedule-row:hover {
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
  