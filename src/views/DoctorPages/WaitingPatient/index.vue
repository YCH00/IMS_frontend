<template>
  <div class="patient-waiting-management">
    <div class="header">候诊患者管理</div>
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
        <th>就诊日期</th>
        <th>就诊时间</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="appointment in tableData.list"
          :key="appointment.id"
          class="patient-row"
          @mouseover="hoveredRow = appointment.id"
          @mouseleave="hoveredRow = null"
      >
        <td><input type="checkbox" v-model="selectedPatients" :value="appointment.id"/></td>
        <td>{{ appointment.id }}</td>
        <td>{{ appointment.user.name }}</td>
        <td>{{ appointment.user.gender || '暂无' }}</td>
        <td>{{ appointment.user.age || '暂无' }}</td>
        <td>{{ `${appointment.appointment_date}` }}</td>
        <td>{{ `${appointment.appointment_time}` }}</td>
        <td>
          <button
              class="action-btn call-btn hover-btn"
              @click="openCallDialog(appointment)"
          >
            叫号
          </button>
          <button
              class="action-btn complete-btn hover-btn"
              @click="completePatient(appointment.id)"
          >
            完成
          </button>
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
        :total="tableData.total"
        layout="prev, pager, next, sizes, total"
        :page-sizes="[10, 20, 50, 100]"
    />

    <!-- 叫号弹窗 -->
    <el-dialog v-model="dialogVisible" width="70%" title="处方" class="prescription-dialog" :top="'10px'">
      <div class="visit-interface">
        <!-- 患者信息模块 -->
        <div class="module" @mouseover="hover = true" @mouseleave="hover = false">
          <h2>患者信息</h2>
          <p>姓名：<span>{{ currentAppointment.user.name }}</span></p>
          <p>性别：<span>{{ currentAppointment.user.gender || '暂无' }}</span></p>
          <p>年龄：<span>{{ currentAppointment.user.age || '暂无' }}</span></p>
          <p>手机号：<span>{{ currentAppointment.user.phone_number || '暂无' }}</span></p>
        </div>

        <!-- 病例标题模块 -->
        <div class="module" @mouseover="hover = true" @mouseleave="hover = false">
          <h2>病例标题</h2>
          <el-input
              v-model="caseTitle"
              placeholder="请输入病例标题"
              class="input-field"
          />
        </div>

        <!-- 病历模块 -->
        <div class="module" @mouseover="hover = true" @mouseleave="hover = false">
          <h3>病历</h3>
          <el-input
              type="textarea"
              v-model="medicalRecord"
              placeholder="填写病历..."
              rows="5"
              class="input-field"
          />
        </div>

        <!-- 药方模块 -->
        <div class="module" @mouseover="hover = true" @mouseleave="hover = false">
          <h3>药方</h3>
          <table v-if="prescriptions.length > 0" class="prescription-table">
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
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(prescription, index) in prescriptions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <el-select
                    v-model="prescription.name"
                    placeholder="选择药品"
                    :remote="true"
                    :remote-method="fetchDrugList"
                    :loading="loadingDrugs"
                    filterable
                    clearable
                    @change="handleDrugSelect(prescription, prescription.name)"
                >
                  <el-option
                      v-for="item in drugList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                  />
                </el-select>
              </td>
              <td>
                <el-input v-model="prescription.quantity" type="number" placeholder="数量"/>
              </td>
              <td>{{ prescription.price }}</td>
              <td>
                <el-input v-model="prescription.usage" placeholder="用法"/>
              </td>
              <td>
                <el-input v-model="prescription.frequency" placeholder="频次"/>
              </td>
              <td>
                <el-input v-model="prescription.days" type="number" placeholder="天数"/>
              </td>
              <td>
                <el-input v-model="prescription.notes" placeholder="备注"/>
              </td>
              <td>
                <el-button @click="removePrescription(index)" size="small" type="danger">删除</el-button>
              </td>
            </tr>
            </tbody>
          </table>

          <!-- 始终显示“添加药品”按钮 -->
          <el-button v-show="true" @click="addPrescription" class="add-prescription-btn" size="small">添加药品
          </el-button>
        </div>

        <!-- 医生建议模块 -->
        <div class="module" @mouseover="hover = true" @mouseleave="hover = false">
          <h3>医生建议</h3>
          <el-input
              type="textarea"
              v-model="doctorAdvice"
              placeholder="填写医生建议..."
              rows="5"
              class="input-field"
          />
        </div>

        <!-- 保存按钮 -->
        <div class="actions">
          <el-button
              type="primary"
              @click="savePrescription"
              class="save-btn"
              round
              icon="el-icon-check"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, reactive} from 'vue';
import {getCurPatient, getAllDrug, finishAppoint} from "../../../api/index.js";
import {showMessage} from "../../../utils/message.js";

// 候诊患者列表数据
const patients = ref([
  {id: '001', name: '张三', gender: '男', age: 35, phone: '13800138000', appointmentTime: new Date('2024-12-06 09:00')},
  {id: '002', name: '李四', gender: '女', age: 28, phone: '13800138001', appointmentTime: new Date('2024-12-06 10:00')},
  {id: '003', name: '王五', gender: '男', age: 50, phone: '13800138002', appointmentTime: new Date('2024-12-07 08:30')},
  {id: '004', name: '赵六', gender: '女', age: 40, phone: '13800138003', appointmentTime: new Date('2024-12-07 11:00')}
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
const dialogVisible = ref(false);
const currentAppointment = ref(null);
const caseTitle = ref('');
const medicalRecord = ref('');
const doctorAdvice = ref('');
const prescriptions = ref([]);

const drugParams = {
  pageNum: 1,
  pageSize: 10,
  name: ''
}
const drugList = ref([]);
const loadingDrugs = ref(false);
// 动态获取药品列表
const fetchDrugList = (query) => {
  if (query) {
    drugParams.name = query;
    loadingDrugs.value = true;  // 开启加载状态

    // 假设这是你的 API 请求
    getAllDrug(drugParams).then(({data}) => {
      loadingDrugs.value = false;  // 关闭加载状态
      // 将返回的药品数据赋值给药品列表
      drugList.value = data.data.list;
    }).catch((error) => {
      loadingDrugs.value = false;  // 发生错误时关闭加载状态
      console.error("加载药品失败:", error);
    });
  }
};
const handleDrugSelect = (prescription, selectedDrugName) => {
  // 查找选择的药品对象
  const selectedDrug = drugList.value.find(drug => drug.name === selectedDrugName);
  console.log(selectedDrug, "selectedDrug")
  // 如果找到了药品，就更新 prescription 中的 price 字段
  if (selectedDrug) {
    prescription.price = selectedDrug.price;
  }
};

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
  getCurPatient(userInfo.id, params).then(({data}) => {
    const {total, list} = data.data
    tableData.list = list;
    tableData.total = total;
  });
};

// 搜索患者
const searchPatients = () => {
  console.log('搜索患者ID:', searchQuery.value);
};

// 完成（删除）患者
const completePatient = (id) => {
  const index = patients.value.findIndex(patient => patient.id === id);
  if (index !== -1) {
    patients.value.splice(index, 1);
  }
};

// 打开叫号（开处方）弹窗
const openCallDialog = (appointment) => {
  currentAppointment.value = appointment;
  dialogVisible.value = true;
};

// 保存处方信息
const savePrescription = () => {
  dialogVisible.value = false;
  console.log('保存处方信息');
  finishAppoint(currentAppointment.value.id, {
    caseTitle: caseTitle.value,
    medicalRecord: medicalRecord.value,
    doctorAdvice: doctorAdvice.value,
    prescriptions: prescriptions.value
  }).then(() => {
    showMessage('保存成功', 'success');
    loadPatients();
  });
};

// 添加药品
const addPrescription = () => {
  prescriptions.value.push({
    name: '',
    quantity: '',
    price: '',
    usage: '',
    frequency: '',
    days: '',
    notes: ''
  });
};

// 删除药品
const removePrescription = (index) => {
  prescriptions.value.splice(index, 1);
};

// 分页页码变化
const handlePageChange = (page) => {
  paginationData.value.pageNumber = page;
  loadPatients();
};

// 分页每页条数变化
const handleSizeChange = (size) => {
  paginationData.value.pageSize = size;
  loadPatients();
};
</script>

<style scoped>
.patient-waiting-management {
  padding: 20px;
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
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.call-btn {
  background-color: transparent;
  color: #409eff;
  border: 1px solid #409eff;
  margin-right: 10px;
}

.complete-btn {
  background-color: #52c41a;
  color: white;
  border: none;
}

.action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.complete-btn:hover {
  background-color: #73d13d;
}

.call-btn:hover {
  background-color: #e6f7ff;
  border-color: #73d13d;
}

.el-pagination {
  margin-top: 20px;
}

/* 弹窗样式 */
.prescription-dialog .el-dialog__header {
  background-color: #409eff;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.prescription-dialog .el-dialog__body {
  padding: 20px;
}

.prescription-dialog .visit-interface {
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

.actions {
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  background-color: #409eff;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.save-btn:hover {
  background-color: #66b1ff;
  transform: scale(1.05);
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

h3, h2 {
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

/* 调整药品表格的列宽 */
.prescription-table th:nth-child(2), .prescription-table td:nth-child(2) {
  width: 200px; /* 药品名称列宽 */
}

.prescription-table th:nth-child(3), .prescription-table td:nth-child(3) {
  width: 80px; /* 数量列宽 */
}

.prescription-table th:nth-child(7), .prescription-table td:nth-child(7) {
  width: 80px; /* 天数列宽 */
}
</style>
  