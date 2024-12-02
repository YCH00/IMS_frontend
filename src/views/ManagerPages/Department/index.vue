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
                    <th>科室编号</th>
                    <th>负责人</th>
                    <th>科室电话</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="department in filteredDepartments" :key="department.id">
                    <td><input type="checkbox" v-model="selectedDepartments" :value="department.id" /></td>
                    <td>{{ department.name }}</td>
                    <td>{{ department.code }}</td>
                    <td>{{ department.head }}</td>
                    <td>{{ department.phone }}</td>
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

// 模拟科室数据
const departments = ref([
    { id: 1, name: '内科', code: 'NK01', head: '张医生', phone: '123-456-7890' },
    { id: 2, name: '外科', code: 'WK02', head: '李医生', phone: '234-567-8901' },
    { id: 3, name: '儿科', code: 'EK03', head: '王医生', phone: '345-678-9012' },
    { id: 4, name: '妇科', code: 'FK04', head: '赵医生', phone: '456-789-0123' },
    { id: 5, name: '眼科', code: 'YK05', head: '刘医生', phone: '567-890-1234' },
    { id: 6, name: '耳鼻喉科', code: 'EBK06', head: '孙医生', phone: '678-901-2345' },
]);

// 搜索框的绑定
const searchQuery = ref('');

// 根据搜索框过滤科室数据
const filteredDepartments = computed(() => {
    return departments.value.filter(department =>
        department.name.includes(searchQuery.value) ||
        department.code.includes(searchQuery.value)
    );
});

// 存储选中的科室
const selectedDepartments = ref([]);

// 搜索科室
function searchDepartments() {
    console.log('搜索科室：', searchQuery.value);
}

// 编辑科室
function editDepartment(id) {
    console.log('编辑科室，ID：', id);
}

// 删除科室
function deleteDepartment(id) {
    console.log('删除科室，ID：', id);
    // 删除逻辑
    const index = departments.value.findIndex(department => department.id === id);
    if (index !== -1) {
        departments.value.splice(index, 1);
    }
}

// 新增科室
function addDepartment() {
    console.log('新增科室');
    // 可以弹出一个对话框来添加科室
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
