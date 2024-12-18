<template>
    <div class="bill-records-list">
      <div class="header">我的账单记录</div>
      <ul class="records-list">
        <li v-for="record in paginatedRecords" :key="record.id" class="record-item">
          <div class="record-info">
            <h3>{{ record.title }}</h3>
            <p>日期: {{ record.date }}</p>
            <p>金额: ￥{{ record.amount.toFixed(2) }}</p>
          </div>
          <div class="record-actions">
            <button 
              v-if="!record.paid" 
              @click="payBill(record.id)" 
              class="pay-btn"
              :disabled="record.paid"
            >
              支付
            </button>
            <button 
              v-if="record.paid" 
              class="paid-btn" 
              disabled
            >
              已支付
            </button>
            <button @click="deleteRecord(record.id)" class="delete-btn">删除</button>
          </div>
        </li>
      </ul>
  
      <!-- 支付成功弹窗 -->
      <el-dialog v-model="dialogVisible" width="50%" title="支付成功" class="payment-dialog">
        <p>支付成功！</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
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
  
  // 账单记录数据
  const billRecords = ref([
    { 
      id: 1, 
      title: '医疗费用', 
      date: '2024/6/10', 
      amount: 300.5, 
      paid: false 
    },
    { 
      id: 2, 
      title: '药品费用', 
      date: '2024/6/12', 
      amount: 150.0, 
      paid: false 
    },
    { 
      id: 3, 
      title: '住院费用', 
      date: '2024/6/15', 
      amount: 1200.0, 
      paid: true 
    },
    // 更多账单数据...
  ]);
  
  const dialogVisible = ref(false);
  const paginationData = ref({
    pageNumber: 1,
    pageSize: 10
  });
  
  // 计算过滤后的账单记录
  const filteredRecords = computed(() => {
    return billRecords.value;
  });
  
  // 计算分页后的记录
  const paginatedRecords = computed(() => {
    const start = (paginationData.value.pageNumber - 1) * paginationData.value.pageSize;
    const end = start + paginationData.value.pageSize;
    return filteredRecords.value.slice(start, end);
  });
  
  // 支付账单
  function payBill(id) {
    const record = billRecords.value.find(record => record.id === id);
    if (record) {
      record.paid = true;
      dialogVisible.value = true;  // 显示支付成功弹窗
    }
  }
  
  // 删除账单
  function deleteRecord(id) {
    const index = billRecords.value.findIndex(record => record.id === id);
    if (index !== -1) {
      billRecords.value.splice(index, 1);
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
  .bill-records-list {
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
  
  .pay-btn {
    background-color: #409eff;
    color: white;
  }
  
  .pay-btn:hover {
    background-color: #66b1ff;
  }
  
  .paid-btn {
    background-color: #8bc34a;
    color: white;
  }
  
  .paid-btn:hover {
    background-color: #a5d6a7;
  }
  
  .delete-btn {
    background-color: #f56c6c;
    color: white;
  }
  
  .delete-btn:hover {
    background-color: #f79c42;
  }
  
  .payment-dialog .el-dialog__header {
    background-color: #409eff;
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
  
  .payment-dialog .el-dialog__body {
    padding: 20px;
    font-size: 16px;
  }
  
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
  </style>
  