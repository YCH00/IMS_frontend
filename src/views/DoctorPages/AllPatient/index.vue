<template>
    <div class="historical-patient-management">
        <div class="header">历史患者管理</div>
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
                    <th>就诊时间</th>
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
                    <td>{{ patient.visitTime }}</td>
                    <td>
                        <button @click="deletePatient(patient.id)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <!-- 分页组件，根据需要实现 -->
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const patients = ref([
    { id: '001', name: '张三', gender: '男', age: 35, department: '内科', visitTime: '2024-12-06 09:00' },
    { id: '002', name: '李四', gender: '女', age: 28, department: '外科', visitTime: '2024-12-06 10:00' },
    // 更多患者数据...
]);

const filteredPatients = computed(() => {
    return patients.value.filter(patient => patient.id.includes(searchQuery.value));
});

const selectedPatients = ref([]); // 存储所有选中的患者

function searchPatients() {
    // 搜索逻辑
}

function deletePatient(id) {
    const index = patients.value.findIndex(p => p.id === id);
    if (index !== -1) {
        patients.value.splice(index, 1);
    }
}
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