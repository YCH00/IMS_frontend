<template>
    <div class="admin-doctors-management">
        <div class="header">药品管理</div>
        <div class="search-bar">
            <input type="text" placeholder="搜索药品" v-model="searchQuery" />
            <button @click="searchDrugs">搜索</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>选择</th>
                    <th>药品名称</th>
                    <th>价格</th>
                    <th>处方药</th>
                    <th>库存数量</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="drug in filteredDrugs" :key="drug.id">
                    <td><input type="checkbox" v-model="selectedDrugs" :value="drug.id" /></td>
                    <td>{{ drug.name }}</td>
                    <td>{{ drug.price }}</td>
                    <td>{{ drug.isRx }}</td>
                    <td>{{ drug.num }}</td>
                    <td><button @click="editDrug(drug.id)">编辑</button><button
                            @click="deleteDrug(drug.id)">删除</button></td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <!-- 分页组件，根据需要实现 -->
        </div>
        <button @click="addDrug">新增药品</button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const drugs = ref([
    { id: 1, name: '阿莫西林', price: '25.0', isRx: false, num: 100 },
    { id: 2, name: '布洛芬', price: '18.5', isRx: false, num: 150 },
    { id: 3, name: '头孢克肟', price: '38.0', isRx: true, num: 80 },
    { id: 4, name: '氯氮平', price: '120.0', isRx: true, num: 50 },
    { id: 5, name: '奥美拉唑', price: '22.5', isRx: false, num: 200 },
    { id: 6, name: '依托度酸', price: '35.0', isRx: true, num: 40 },
    { id: 7, name: '头孢拉定', price: '40.0', isRx: true, num: 90 },
    { id: 8, name: '降压药', price: '50.0', isRx: true, num: 60 },
]);

const filteredDrugs = computed(() => {
    return drugs.value.filter(drug => drug.name.includes(searchQuery.value));
});

const selectedDrugs = []; //存储所有选中的药品

function searchDrugs() {
    // 搜索逻辑
}

function editDrug(id) {
    console.log('编辑药品', id);
}

function deleteDrug(id) {
    console.log('删除药品', id);
}

function addDrug() {
    console.log('新增药品');
}
</script>

<style scoped>
.admin-doctors-management {
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