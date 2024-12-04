<template>
  <div class="user-history-records">
    <div class="header">用户历史检查记录</div>
    <div class="record-list">
      <h2>检查记录</h2>
      <ul>
        <li v-for="record in historyRecords" :key="record.id">
          <p><strong>日期:</strong> {{ record.date }}</p>
          <p><strong>检查标题:</strong> {{ record.title }}</p>
          <p><strong>医生:</strong> {{ record.doctorName }}</p>
          <button class="view-details-button" @click="viewDetails(record.id)">查看详情</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const historyRecords = ref([
  { id: 1, date: '2024-06-01', title: '血液检查', doctorName: '王医生' },
  { id: 2, date: '2024-05-15', title: '心电图检查', doctorName: '张医生' },
  { id: 3, date: '2024-05-01', title: '体检报告', doctorName: '李医生' }
]);

function viewDetails(recordId) {
  // 逻辑：跳转到记录详情页面
  console.log('查看详情', recordId);
}
</script>

<style scoped>
.user-history-records {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.header {
  width: 100%;
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 10px 0;
}

.record-list {
  margin-top: 20px;
  width: 100%;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: #fff;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

li p {
  margin: 5px 0;
}

.view-details-button {
  padding: 10px 15px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-details-button:hover {
  background-color: #1976D2;
}
</style>
