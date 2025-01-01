<template>
  <div class="medical-records-list">
    <div class="header">我的就诊记录</div>
    <ul class="records-list">
      <li v-for="record in tableData.list" :key="record.id" class="record-item">
        <div class="record-info">
          <h3>{{ record.medical_title }}</h3>
          <p>日期: {{ formatDate(record.visitTime) }}</p>
          <p>医生: {{ record.doctor.name }}</p>
        </div>
        <div class="record-actions">
          <button @click="viewRecord(record.id)" class="view-btn">查看</button>
          <button @click="deleteRecord(record.id)" class="delete-btn">删除</button>
        </div>
      </li>
    </ul>

    <!-- 详细病例弹窗 -->
    <el-dialog v-model="dialogVisible" width="70%" title="病例详情" class="record-dialog">
      <div class="visit-interface">
        <!-- 病例信息模块 -->
        <div class="module">
          <h2>病例信息</h2>
          <p>病例标题：<span>{{ currentRecord.medical_title }}</span></p>
          <p>就诊日期：<span>{{ formatDate(currentRecord.visitTime) }}</span></p>
          <p>医生：<span>{{ currentRecord.doctor.name }}</span></p>
          <p>病情描述：<span>{{ currentRecord.medical_record }}</span></p>
        </div>

        <!-- 医生建议模块 -->
        <div class="module">
          <h3>医生建议</h3>
          <p>{{ currentRecord.doctor_advice }}</p>
        </div>

        <!-- 药方模块 -->
        <div class="module">
          <h3>药方</h3>
          <ul>
            <li v-for="prescription in currentRecord.prescriptions" :key="prescription.index">
              <p>{{ prescription.medicine.name }} - 数量: {{ prescription.quantity }} - 用法: {{
                  prescription.usage
                }} - 频率: {{ prescription.frequency }}</p>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>

    <!-- 分页组件 -->
    <el-pagination
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :current-page="paginationData.pageNumber"
        :page-size="paginationData.pageSize"
        :total="tableData.total"
        layout="prev, pager, next, sizes, total"
        :page-sizes="[5, 10, 20]"
        class="el-pagination"
    />
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {getPatientAppoint, getPatientDetail} from "../../../api/index.js";

// 医疗记录数据
const medicalRecords = ref([
  {
    id: 1,
    title: '感冒病例',
    date: '2024/5/12',
    doctorName: '李医生',
    description: '患者有持续咳嗽和喉咙痛，伴随轻微发热。',
    advice: '多喝水，保持休息，必要时服用退烧药。',
    prescriptions: [
      {name: '感冒灵', quantity: 10, usage: '每日三次，每次两片'},
      {name: '华维素胶囊', quantity: 5, usage: '每日两次，每次一粒'}
    ]
  },
  {
    id: 2,
    title: '过敏病例',
    date: '2024/5/3',
    doctorName: '王医生',
    description: '患者出现皮肤红肿和瘙痒症状，疑似过敏反应。',
    advice: '避免接触过敏源，使用抗过敏药物。',
    prescriptions: [
      {name: '银诺露', quantity: 20, usage: '每日两次，每次外涂适量'}
    ]
  },
  // 添加更多病例数据...
]);

const dialogVisible = ref(false);
const currentRecord = ref(null);

// 分页相关数据
const paginationData = ref({
  pageNumber: 1,
  pageSize: 10
});
const tableData = reactive({
  list: [],
  total: 0
})

onMounted(() => {
  loadTableData();
});

// 加载列表数据
const loadTableData = () => {
  const params = {
    ...paginationData.value, // 分页数据
  };
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  getPatientAppoint(userInfo.id, params).then(({data}) => {
    const {total, list} = data.data
    tableData.list = list;
    tableData.total = total;
    console.log(list, total);
  });
};

// 查看病例
function viewRecord(id) {
  getPatientDetail(id).then(({data}) => {
    currentRecord.value = data.data;
    dialogVisible.value = true;
  });
}

// 删除病例
function deleteRecord(id) {
  const index = medicalRecords.value.findIndex(record => record.id === id);
  if (index !== -1) {
    medicalRecords.value.splice(index, 1);
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

const formatDate = (date) => {
  // 检查传入的date是否为字符串，如果是字符串则转换为Date对象
  if (typeof date === 'string') {
    date = new Date(date); // 将字符串转换为 Date 对象
  }

  // 如果是有效的 Date 对象，格式化显示
  if (date instanceof Date && !isNaN(date)) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
  }

  return ''; // 如果不是有效的日期，返回空字符串
};
</script>

<style scoped>
.medical-records-list {
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
  