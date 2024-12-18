<template>
    <div class="user-history-records">
      <div class="header">用户历史检查记录</div>
      <ul class="records-list">
        <li v-for="record in paginatedRecords" :key="record.id" class="record-item">
          <div class="record-info">
            <h3>{{ record.title }}</h3>
            <p>日期: {{ record.date }}</p>
            <p>医生: {{ record.doctorName }}</p>
          </div>
          <div class="record-actions">
            <button @click="viewDetails(record.id)" class="view-btn">查看详情</button>
            <button @click="deleteRecord(record.id)" class="delete-btn">删除</button>
          </div>
        </li>
      </ul>
  
      <!-- 详细记录弹窗 -->
      <el-dialog v-model="dialogVisible" width="70%" title="检查记录详情" class="record-dialog">
        <div class="visit-interface">
          <div class="module">
            <h2>检查记录信息</h2>
            <p>检查标题：<span>{{ currentRecord.title }}</span></p>
            <p>就诊日期：<span>{{ currentRecord.date }}</span></p>
            <p>医生：<span>{{ currentRecord.doctorName }}</span></p>
            <p>检查结果：<span>{{ currentRecord.result }}</span></p>
          </div>
        </div>
      </el-dialog>
  
      <!-- 分页组件 -->
      <el-pagination
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :current-page="paginationData.pageNumber"
        :page-size="paginationData.pageSize"
        :total="filteredRecords.length"
        layout="prev, pager, next, sizes, total"
        :page-sizes="[5, 10, 20]"
        class="el-pagination"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // 测试数据：历史检查记录
  const historyRecords = ref([
    { id: 1, date: '2024-06-01', title: '血液检查', doctorName: '王医生', result: '正常' },
    { id: 2, date: '2024-05-15', title: '心电图检查', doctorName: '张医生', result: '异常' },
    { id: 3, date: '2024-05-01', title: '体检报告', doctorName: '李医生', result: '健康' },
    { id: 4, date: '2024-04-25', title: '超声波检查', doctorName: '赵医生', result: '正常' },
    { id: 5, date: '2024-04-10', title: '血压检查', doctorName: '刘医生', result: '偏高' },
    { id: 6, date: '2024-03-20', title: '胃镜检查', doctorName: '陈医生', result: '正常' }
  ]);
  
  const dialogVisible = ref(false);
  const currentRecord = ref(null);
  
  // 分页相关数据
  const paginationData = ref({
    pageNumber: 1,
    pageSize: 5
  });
  
  // 计算过滤后的检查记录
  const filteredRecords = computed(() => {
    return historyRecords.value;
  });
  
  // 计算分页后的记录
  const paginatedRecords = computed(() => {
    const start = (paginationData.value.pageNumber - 1) * paginationData.value.pageSize;
    const end = start + paginationData.value.pageSize;
    return filteredRecords.value.slice(start, end);
  });
  
  // 查看详情
  function viewDetails(id) {
    const record = historyRecords.value.find(record => record.id === id);
    currentRecord.value = record;
    dialogVisible.value = true;
  }
  
  // 删除记录
  function deleteRecord(id) {
    const index = historyRecords.value.findIndex(record => record.id === id);
    if (index !== -1) {
      historyRecords.value.splice(index, 1);
    }
  }
  
  // 分页处理：页码变化
  const handlePageChange = (page) => {
    paginationData.value.pageNumber = page;
  };
  
  // 分页处理：每页记录数变化
  const handleSizeChange = (size) => {
    paginationData.value.pageSize = size;
  };
  </script>
  
  <style scoped>
  .user-history-records {
    width: 80%;
    margin: 20px auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .header {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
    font-weight: bold;
    background-color: transparent; /* 无色背景 */
  }
  
  .records-list {
    list-style: none;
    padding: 0;
  }
  
  .record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-bottom: 15px;
    background-color: #f9f9f9;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  
  .record-item:hover {
    transform: scale(1.02);
    background-color: #f7faff;
  }
  
  .record-info h3 {
    margin: 0;
    color: #555;
  }
  
  .record-info p {
    margin: 5px 0;
    color: #777;
  }
  
  .record-actions {
    display: flex;
    gap: 10px;
  }
  
  .record-actions button {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .view-btn {
    background-color: #409eff;
    color: white;
  }
  
  .view-btn:hover {
    background-color: #66b1ff;
  }
  
  .delete-btn {
    background-color: #f56c6c;
    color: white;
  }
  
  .delete-btn:hover {
    background-color: #f79c42;
  }
  
  .record-dialog .el-dialog__header {
    background-color: #409eff;
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
  
  .record-dialog .el-dialog__body {
    padding: 20px;
  }
  
  .visit-interface {
    display: flex;
    flex-direction: column;
  }
  
  .module {
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 6px;
    background-color: #f9f9f9;
    transition: transform 0.3s ease;
  }
  
  .module:hover {
    transform: scale(1.02);
    background-color: #f0faff;
  }
  
  h3 {
    color: #409eff;
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .el-dialog {
    font-size: 14px;
  }
  
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
  </style>
  