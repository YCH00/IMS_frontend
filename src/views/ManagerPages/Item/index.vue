<template>
    <div class="admin-tests-management">
        <!-- 页面标题 -->
        <div class="header">检查项目管理</div>

        <!-- 搜索框 -->
        <div class="search-bar">
            <input type="text" placeholder="搜索检查项目" v-model="searchQuery" />
            <button @click="searchTests">搜索</button>
        </div>

        <!-- 检查项目列表 -->
        <table>
            <thead>
                <tr>
                    <th>选择</th>
                    <th>检查项目名称</th>
                    <th>价格</th>
                    <th>是否有特殊检查</th>
                    <th>库存数量</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="test in filteredTests" :key="test.id">
                    <td><input type="checkbox" v-model="selectedTests" :value="test.id" /></td>
                    <td>{{ test.name }}</td>
                    <td>{{ test.price }}</td>
                    <td>{{ test.isSpecial ? '是' : '否' }}</td>
                    <td>{{ test.num }}</td>
                    <td>
                        <button @click="editTest(test.id)">编辑</button>
                        <button @click="deleteTest(test.id)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- 分页组件 -->
        <div class="pagination">
            <!-- 根据需要实现分页组件 -->
        </div>

        <!-- 新增检查项目按钮 -->
        <button @click="addTest">新增检查项目</button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 搜索框的输入数据
const searchQuery = ref('');

// 假设的检查项目数据
const tests = ref([
    { id: 1, name: 'CT扫描', price: '500.0', isSpecial: true, num: 50 },
    { id: 2, name: 'X光检查', price: '150.0', isSpecial: false, num: 200 },
    { id: 3, name: 'MRI检查', price: '1200.0', isSpecial: true, num: 30 },
    { id: 4, name: '血液检查', price: '100.0', isSpecial: false, num: 500 },
    { id: 5, name: '超声波检查', price: '300.0', isSpecial: false, num: 150 },
    { id: 6, name: '心电图', price: '200.0', isSpecial: false, num: 100 },
    { id: 7, name: '胃镜检查', price: '800.0', isSpecial: true, num: 20 },
    { id: 8, name: '肺功能测试', price: '350.0', isSpecial: false, num: 80 },
]);

// 过滤后的检查项目
const filteredTests = computed(() => {
    return tests.value.filter(test => test.name.includes(searchQuery.value));
});

// 存储选中的检查项目ID
const selectedTests = ref([]);

// 搜索方法
function searchTests() {
    console.log('搜索查询:', searchQuery.value);
}

// 编辑检查项目
function editTest(id) {
    console.log('编辑检查项目', id);
}

// 删除检查项目
function deleteTest(id) {
    console.log('删除检查项目', id);
    const index = tests.value.findIndex(test => test.id === id);
    if (index !== -1) {
        tests.value.splice(index, 1); // 删除对应的检查项目
    }
}

// 新增检查项目
function addTest() {
    console.log('新增检查项目');
    // 这里可以打开一个对话框或跳转到新增页面
}
</script>


<style scoped>
.admin-tests-management {
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