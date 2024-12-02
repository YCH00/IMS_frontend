<template>
    <div class="admin-department-management">
        <div class="header">科室管理</div>
        <div class="search-bar">
            <input type="text" placeholder="搜索科室" v-model="searchQuery" />
            <button @click="searchDepartments">搜索</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>选择</th>
                    <th>科室名称</th>
                    <th>科室电话</th>
                    <th>科室负责人</th>
                    <th>科室地址</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="department in filteredDepartments" :key="department.id">
                    <td><input type="checkbox" v-model="selectedDepartments" :value="department.id" /></td>
                    <td>{{ department.name }}</td>
                    <td>{{ department.phone }}</td>
                    <td>{{ department.head }}</td>
                    <td>{{ department.address }}</td>
                    <td>
                        <button @click="editDepartment(department.id)">编辑</button>
                        <button @click="deleteDepartment(department.id)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <!-- 分页组件，根据需要实现 -->
        </div>
        <button @click="addDepartment">新增科室</button>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const departments = ref([
    // 假设科室数据
    { id: 1, name: '内科', phone: '010-12345678', head: '张主任', address: '北京市东城区医院大楼' },
    { id: 2, name: '外科', phone: '010-87654321', head: '李主任', address: '北京市朝阳区医院大楼' },
    { id: 3, name: '妇产科', phone: '010-23456789', head: '王主任', address: '北京市海淀区医院大楼' },
    { id: 4, name: '儿科', phone: '010-34567890', head: '赵主任', address: '北京市西城区医院大楼' },
    { id: 5, name: '眼科', phone: '010-45678901', head: '孙主任', address: '北京市丰台区医院大楼' },
    { id: 6, name: '牙科', phone: '010-56789012', head: '周主任', address: '北京市昌平区医院大楼' }
]);

const filteredDepartments = computed(() => {
    return departments.value.filter(department => department.name.includes(searchQuery.value));
});

const selectedDepartments = []; // 存储选中的科室ID

function searchDepartments() {
    // 目前只根据科室名称进行搜索
    console.log('搜索科室:', searchQuery.value);
}

function editDepartment(id) {
    console.log('编辑科室', id);
    // 根据科室ID进行编辑操作（例如打开编辑弹窗等）
}

function deleteDepartment(id) {
    console.log('删除科室', id);
    // 删除指定ID的科室
    const index = departments.value.findIndex(department => department.id === id);
    if (index !== -1) {
        departments.value.splice(index, 1);
    }
}

function addDepartment() {
    console.log('新增科室');
    // 打开新增科室的弹窗或者直接将新科室添加到列表
    const newId = departments.value.length + 1;
    departments.value.push({
        id: newId,
        name: '新科室',
        phone: '010-00000000',
        head: '新主任',
        address: '新地址'
    });
}
</script>


<style scoped>
.admin-department-management {
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
</style>