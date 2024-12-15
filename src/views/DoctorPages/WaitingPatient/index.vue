<template>
    <div class="patient-waiting-management">
        <div class="header">候诊患者管理</div>
        <div class="search-bar">
            <input type="text" placeholder="搜索患者ID" v-model="searchQuery" />
            <button @click="searchPatients">搜索</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>选择</th>
                    <th>患者ID</th>
                    <th>患者姓名</th>
                    <th>性别</th>
                    <th>年龄</th>
                    <th>就诊科室</th>
                    <th>预计就诊时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="patient in filteredPatients" :key="patient.id">
                    <td><input type="checkbox" v-model="selectedPatients" :value="patient.id" /></td>
                    <td>{{ patient.id }}</td>
                    <td>{{ patient.name }}</td>
                    <td>{{ patient.gender }}</td>
                    <td>{{ patient.age }}</td>
                    <td>{{ patient.department }}</td>
                    <td>{{ patient.appointmentTime }}</td>
                    <td>
                        <button @click="openEditDialog(patient)">编辑</button>
                        <button @click="deletePatient(patient.id)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <!-- 分页组件，根据需要实现 -->
        </div>
        <button @click="openAddDialog">新增患者</button>

        <Dialog :visible.sync="editDialogVisible" :closable="true" :style="{ width: '400px' }">
            <div class="dialog-form">
                <div class="dialog-header">
                    <h3>编辑患者信息</h3>
                </div>
                <div class="form-group">
                    <label>患者ID:</label>
                    <div class="form-value">{{ editPatientId }}</div>
                </div>
                <div class="form-group">
                    <label>患者姓名:</label>
                    <div class="form-value">{{ editPatientName }}</div>
                </div>
                <div class="form-group">
                    <label>性别:</label>
                    <div class="form-value">{{ editPatientGender }}</div>
                </div>
                <div class="form-group">
                    <label>年龄:</label>
                    <div class="form-value">{{ editPatientAge }}</div>
                </div>
                <div class="form-group">
                    <label>就诊科室:</label>
                    <InputText v-model="editPatientDepartment" />
                </div>
                <div class="form-group">
                    <label>预计就诊时间:</label>
                    <InputText v-model="editPatientAppointmentTime" />
                </div>
            </div>
            <template #footer>
                <Button @click="editDialogVisible = false" label="取消" class="p-button-secondary" />
                <Button @click="updatePatient" label="保存" class="p-button-success" />
            </template>
        </Dialog>

        <Dialog :visible.sync="addDialogVisible" :closable="true" :style="{ width: '400px' }">
            <div class="dialog-form">
                <div class="dialog-header">
                    <h3>添加患者信息</h3>
                </div>
                <div class="form-group">
                    <label>患者ID:</label>
                    <InputText v-model="newPatientId" @input="autoFillPatientInfo" />
                </div>
                <div class="form-group">
                    <label>患者姓名:</label>
                    <div class="form-value">{{ newPatientName }}</div>
                </div>
                <div class="form-group">
                    <label>性别:</label>
                    <div class="form-value">{{ newPatientGender }}</div>
                </div>
                <div class="form-group">
                    <label>年龄:</label>
                    <div class="form-value">{{ newPatientAge }}</div>
                </div>
                <div class="form-group">
                    <label>就诊科室:</label>
                    <InputText v-model="newPatientDepartment" />
                </div>
                <div class="form-group">
                    <label>预计就诊时间:</label>
                    <InputText v-model="newPatientAppointmentTime" />
                </div>
            </div>
            <template #footer>
                <Button @click="addDialogVisible = false" label="取消" class="p-button-secondary" />
                <Button @click="addPatient" label="添加" class="p-button-success" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Dialog, Button, InputText } from 'primevue';

const searchQuery = ref('');
const patients = ref([
    { id: '001', name: '张三', gender: '男', age: 35, department: '内科', appointmentTime: '2024-12-06 09:00' },
    { id: '002', name: '李四', gender: '女', age: 28, department: '外科', appointmentTime: '2024-12-06 10:00' },
    // 更多患者数据...
]);

const filteredPatients = computed(() => {
    return patients.value.filter(patient => patient.id.includes(searchQuery.value));
});

const selectedPatients = ref([]); // 存储所有选中的患者

let editDialogVisible = ref(false);
let addDialogVisible = ref(false);

const editPatientId = ref('');
const editPatientName = ref('');
const editPatientGender = ref('');
const editPatientAge = ref('');
const editPatientDepartment = ref('');
const editPatientAppointmentTime = ref('');

const newPatientId = ref('');
const newPatientName = ref('');
const newPatientGender = ref('');
const newPatientAge = ref('');
const newPatientDepartment = ref('');
const newPatientAppointmentTime = ref('');

function searchPatients() {
    // 搜索逻辑
}

function openEditDialog(patient) {
    editPatientId.value = patient.id;
    editPatientName.value = patient.name;
    editPatientGender.value = patient.gender;
    editPatientAge.value = patient.age;
    editPatientDepartment.value = patient.department;
    editPatientAppointmentTime.value = patient.appointmentTime;
    editDialogVisible.value = true;
}

function updatePatient() {
    const index = patients.value.findIndex(p => p.id === editPatientId.value);
    if (index !== -1) {
        patients.value[index] = {
            id: editPatientId.value,
            name: editPatientName.value,
            gender: editPatientGender.value,
            age: editPatientAge.value,
            department: editPatientDepartment.value,
            appointmentTime: editPatientAppointmentTime.value,
        };
    }
    editDialogVisible.value = false;
}

function openAddDialog() {
    addDialogVisible.value = true;
}

function addPatient() {
    const newPatient = {
        id: newPatientId.value,
        name: newPatientName.value,
        gender: newPatientGender.value,
        age: newPatientAge.value,
        department: newPatientDepartment.value,
        appointmentTime: newPatientAppointmentTime.value,
    };
    patients.value.push(newPatient);
    addDialogVisible.value = false;
}

function deletePatient(id) {
    const index = patients.value.findIndex(p => p.id === id);
    if (index !== -1) {
        patients.value.splice(index, 1);
    }
}

function autoFillPatientInfo() {
    // 这里应该是一个API调用，返回患者信息
    // 为了示例，我们使用静态数据
    const patientInfo = {
        '001': { name: '张三', gender: '男', age: 35 },
        '002': { name: '李四', gender: '女', age: 28 }
    };
    const info = patientInfo[newPatientId.value];
    if (info) {
        newPatientName.value = info.name;
        newPatientGender.value = info.gender;
        newPatientAge.value = info.age;
    }
}
</script>

<style scoped>
.patient-waiting-management {
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

.search-bar button {
    padding: 8px 16px;
    font-size: 14px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.search-bar button:hover {
    background-color: #66b1ff;
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

table td button {
    padding: 5px 10px;
    background-color: #f0ad4e;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

table td button:hover {
    background-color: #ec971f;
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination button {
    padding: 6px 12px;
    font-size: 14px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    margin: 0 5px;
    cursor: pointer;
}

.pagination button:hover {
    background-color: #66b1ff;
}

button {
    padding: 8px 16px;
    font-size: 14px;
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #4cae4c;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.dialog-form {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dialog-header {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}

.form-group label {
    color: #333;
    font-weight: bold;
}

.form-value {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
}

.p-button-secondary {
    background-color: #f0f0f0;
    color: #333;
    margin-right: 10px;
}

.p-button-success {
    background-color: #4CAF50;
    color: white;
}
</style>
