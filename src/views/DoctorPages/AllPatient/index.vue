<template>
  <div class="historical-patient-management">
    <div class="header">历史患者管理</div>
    <div class="search-bar">
      <input type="text" placeholder="搜索患者ID" v-model="searchQuery"/>
      <button class="hover-btn" @click="searchPatients">搜索</button>
    </div>

    <table>
      <thead>
      <tr>
        <th>选择</th>
        <th>患者ID</th>
        <th>患者姓名</th>
        <th>性别</th>
        <th>年龄</th>
        <th>就诊时间</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="patient in tableData.list"
          :key="patient.id"
          class="patient-row"
          @mouseover="hoveredRow = patient.id"
          @mouseleave="hoveredRow = null"
      >
        <td><input type="checkbox" v-model="selectedPatients" :value="patient.id"/></td>
        <td>{{ patient.id }}</td>
        <td>{{ patient.user.name }}</td>
        <td>{{ patient.user.gender || '暂无' }}</td>
        <td>{{ patient.user.age || '暂无' }}</td>
        <td>{{ formatDate(patient.visitTime) }}</td>
        <td>
          <button
              class="action-btn view-btn hover-btn"
              @click="openViewDialog(patient)"
          >
            查看
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <el-pagination
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :current-page="paginationData.pageNumber"
        :page-size="paginationData.pageSize"
        :total="tableData.total"
        layout="prev, pager, next, sizes, total"
        :page-sizes="[10, 20, 50, 100]"
        class="el-pagination"
    />

    <!-- 查看病例弹窗 -->
    <el-dialog v-model="viewDialogVisible" width="70%" title="病例信息" class="view-dialog" :top="'10px'">
      <div class="visit-interface">
        <!-- 患者信息模块 -->
        <div class="module" @mouseover="hover = true" @mouseleave="hover = false">
          <h2>患者信息</h2>
          <p>姓名：<span>{{ currentPatient.user.name }}</span></p>
          <p>性别：<span>{{ currentPatient.user.gender || '暂无' }}</span></p>
          <p>年龄：<span>{{ currentPatient.user.age || '暂无' }}</span></p>
          <p>手机号：<span>{{ currentPatient.user.phone_number }}</span></p>
          <p>就诊时间：<span>{{ formatDate(currentPatient.visitTime) }}</span></p>
        </div>

        <!-- 病历标题模块 -->
        <div class="module" @mouseover="hover = true" @mouseleave="hover = false">
          <h3>病例标题</h3>
          <div class="input-field read-only-field">
            {{ currentPatient.medical_title || '暂无病例标题' }}
          </div>
        </div>

        <!-- 病历模块 -->
        <div class="module" @mouseover="hover = true" @mouseleave="hover = false">
          <h3>病历</h3>
          <div class="input-field read-only-field">
            {{ currentPatient.medical_record }}
          </div>
        </div>

        <!-- 药方模块 -->
        <div class="module" @mouseover="hover = true" @mouseleave="hover = false">
          <h3>药方</h3>
          <table v-if="currentPatient.prescriptions.length > 0" class="prescription-table">
            <thead>
            <tr>
              <th>序号</th>
              <th>药品名称</th>
              <th>数量</th>
              <th>单价</th>
              <th>用法</th>
              <th>频次</th>
              <th>天数</th>
              <th>备注</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="prescription in currentPatient.prescriptions" :key="index">
              <td>{{ prescription.index }}</td>
              <td>{{ prescription.medicine.name }}</td>
              <td>{{ prescription.quantity }}</td>
              <td>{{ prescription.medicine.price }}</td>
              <td>{{ prescription.usage }}</td>
              <td>{{ prescription.frequency }}</td>
              <td>{{ prescription.days }}</td>
              <td>{{ prescription.notes }}</td>
            </tr>
            </tbody>
          </table>
          <div v-else class="no-prescriptions">暂无药方信息。</div>
        </div>

        <!-- 医生建议模块（只读） -->
        <div class="module" @mouseover="hover = true" @mouseleave="hover = false">
          <h3>医生建议</h3>
          <div class="input-field read-only-field">
            {{ currentPatient.doctor_advice }}
          </div>
        </div>

        <!-- 关闭按钮 -->
        <div class="actions">
          <button @click="closeViewDialog" class="p-button-secondary hover-btn">关闭</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, reactive} from 'vue';
import {getHistoryPatient, getPatientDetail} from "../../../api/index.js";

// 历史患者数据
const patients = ref([
  {
    id: '001',
    name: '张三',
    gender: '男',
    age: 35,
    phone: '13800138000',
    visitTime: new Date('2024-12-06 09:00'),
    medicalTitle: '急性胃肠炎',
    medicalRecord: '张三的病历信息...',
    doctorAdvice: '建议多休息，按时服药。',
    prescriptions: [
      {name: '华维素胶囊', quantity: 2, price: '22.00', usage: '口服', frequency: '每日一次', days: 5, notes: '无'},
      {name: '感冒灵', quantity: 1, price: '8.00', usage: '口服', frequency: '每日两次', days: 3, notes: '注意休息'}
    ]
  },
  {
    id: '002',
    name: '李四',
    gender: '女',
    age: 28,
    phone: '13800138001',
    visitTime: new Date('2024-12-06 10:00'),
    medicalTitle: '慢性支气管炎',
    medicalRecord: '李四的病历信息...',
    doctorAdvice: '建议进行进一步检查。',
    prescriptions: [
      {name: '阿莫西林', quantity: 3, price: '10.00', usage: '口服', frequency: '每日三次', days: 7, notes: '饭后服用'}
    ]
  },
  {
    id: '003',
    name: '王五',
    gender: '男',
    age: 50,
    phone: '13800138002',
    visitTime: new Date('2024-12-07 08:30'),
    medicalTitle: '肠胃炎',
    medicalRecord: '王五的病历信息...',
    doctorAdvice: '建议调整饮食习惯。',
    prescriptions: []
  },
  {
    id: '004',
    name: '赵六',
    gender: '女',
    age: 40,
    phone: '13800138003',
    visitTime: new Date('2024-12-07 11:00'),
    medicalTitle: '癌症',
    medicalRecord: '赵六的病历信息...',
    doctorAdvice: '建议定期体检。',
    prescriptions: [
      {name: '银诺露', quantity: 1, price: '13.00', usage: '口服', frequency: '每日一次', days: 10, notes: '空腹服用'}
    ]
  },
  {
    id: '005',
    name: '孙七',
    gender: '男',
    age: 60,
    phone: '13800138004',
    visitTime: new Date('2024-12-08 09:30'),
    medicalTitle: '高血压',
    medicalRecord: '孙七的病历信息...',
    doctorAdvice: '建议服用降压药。',
    prescriptions: [
      {name: '阿莫西林', quantity: 2, price: '10.00', usage: '口服', frequency: '每日两次', days: 5, notes: '饭前服用'}
    ]
  },
  {
    id: '006',
    name: '周八',
    gender: '女',
    age: 32,
    phone: '13800138005',
    visitTime: new Date('2024-12-08 10:45'),
    medicalTitle: '骨质疏松',
    medicalRecord: '周八的病历信息...',
    doctorAdvice: '建议增加锻炼。',
    prescriptions: []
  },
  {
    id: '007',
    name: '吴九',
    gender: '男',
    age: 45,
    phone: '13800138006',
    visitTime: new Date('2024-12-09 08:15'),
    medicalTitle: '吃饱了撑的',
    medicalRecord: '吴九的病历信息...',
    doctorAdvice: '建议减少工作压力。',
    prescriptions: [
      {name: '感冒灵', quantity: 1, price: '8.00', usage: '口服', frequency: '每日三次', days: 4, notes: '多喝水'}
    ]
  },
  {
    id: '008',
    name: '郑十',
    gender: '女',
    age: 29,
    phone: '13800138007',
    visitTime: new Date('2024-12-09 11:30'),
    medicalTitle: '抑郁症',
    medicalRecord: '郑十的病历信息...',
    doctorAdvice: '建议保持良好心态。',
    prescriptions: []
  }
]);
const paginationData = ref({
  pageNumber: 1,
  pageSize: 10
});
const tableData = reactive({
  list: [],
  total: 0
})

const searchQuery = ref('');
const hoveredRow = ref(null);
const selectedPatients = ref([]);
const viewDialogVisible = ref(false);
const currentPatient = ref(null);

onMounted(() => {
  loadPatients();
});

// 加载患者列表
const loadPatients = () => {
  const params = {
    ...paginationData.value, // 分页数据
  };
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  console.log(userInfo.id, "userInfo.id")
  getHistoryPatient(userInfo.id, params).then(({data}) => {
    const {total, list} = data.data
    tableData.list = list;
    tableData.total = total;
  });
};

// 格式化日期显示
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

// 搜索患者
const searchPatients = () => {
  console.log('搜索患者ID:', searchQuery.value);
};

// 打开查看病例弹窗
const openViewDialog = (patient) => {
  // 根据传入的患者信息，设置当前患者信息
  getPatientDetail(patient.id).then(({data}) => {
    currentPatient.value = data.data;
    console.log(currentPatient.value, "currentPatient.value")
    viewDialogVisible.value = true;
  });
};

// 关闭查看病例弹窗
const closeViewDialog = () => {
  viewDialogVisible.value = false;
};

// 分页处理函数（示例）
const handlePageChange = (page) => {
  paginationData.value.pageNumber = page;
};

const handleSizeChange = (size) => {
  paginationData.value.pageSize = size;
};

</script>

<style scoped>
.historical-patient-management {
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

.patient-row {
  transition: background-color 0.3s, box-shadow 0.3s;
}

.patient-row:hover {
  background-color: #f0f9ff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.action-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}

.view-btn {
  background-color: transparent;
  color: #409eff;
  border: 1px solid #409eff;
  margin-right: 10px;
}

.view-btn:hover {
  background-color: #e6f7ff;
  border-color: #73d13d;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.el-pagination {
  margin-top: 20px;
}

/* 查看病例弹窗样式 */
.view-dialog .el-dialog__header {
  background-color: #409eff;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.view-dialog .el-dialog__body {
  padding: 20px;
}

.view-dialog .visit-interface {
  display: flex;
  flex-direction: column;
}

/* 模块样式 */
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

h2 {
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
}

h3 {
  color: #409eff;
  font-size: 16px;
  margin-bottom: 10px;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #409eff;
}

/* 只读字段样式 */
.read-only-field {
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  color: #666;
}

/* 动作按钮样式 */
.actions {
  display: flex;
  justify-content: flex-end;
}

.p-button-secondary,
.p-button-success {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.p-button-secondary {
  background-color: #f0f0f0;
  color: #333;
  margin-right: 10px;
  border: none;
}

.p-button-secondary:hover {
  background-color: #e0e0e0;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.p-button-success {
  background-color: #4CAF50;
  color: white;
}

.p-button-success:hover {
  background-color: #45a049;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 只读字段在弹窗中保持一致 */
.view-dialog .read-only-field {
  background-color: #f5f5f5;
  color: #666;
}

/* 样式保持一致 */
.prescription-table th,
.prescription-table td {
  padding: 12px;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid #f2f2f2;
}

.prescription-table th {
  background-color: #f5f5f5;
  color: #333;
}

.no-prescriptions {
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
    