<template>
    <div class="admin-drug-management">
        <div class="header">药品管理</div>
        <!-- 搜索栏 -->
        <div class="search-bar">
            <input type="text" placeholder="输入药品ID进行搜索" v-model="searchQuery" />
            <button class="hover-btn" @click="searchDrugs">搜索</button>
            <button class="hover-btn" @click="openAddDialog">新增药品</button>
        </div>

        <!-- 药品表格 -->
        <table>
            <thead>
                <tr>
                    <th>选择</th>
                    <th>药品ID</th>
                    <th>药品名称</th>
                    <th>价格</th>
                    <th>处方药</th>
                    <th>库存数量</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="drug in paginatedDrugs" :key="drug.id" class="drug-row" @mouseover="hoveredRow = drug.id"
                    @mouseleave="hoveredRow = null">
                    <td><input type="checkbox" v-model="selectedDrugs" :value="drug.id" /></td>
                    <td>{{ drug.id }}</td>
                    <td>{{ drug.name }}</td>
                    <td>{{ drug.price }}</td>
                    <td>{{ drug.isRx ? '是' : '否' }}</td>
                    <td>{{ drug.number }}</td>
                    <td>
                        <el-button size="mini" class="action-btn edit-btn" @click="openEditDialog(drug)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" class="action-btn delete-btn" @click="deleteDrug(drug.id)">
                            删除
                        </el-button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- 分页组件 -->
        <el-pagination @current-change="handlePageChange" @size-change="handleSizeChange"
            :current-page="paginationData.pageNumber" :page-size="paginationData.pageSize" :total="tableData.total"
            layout="prev, pager, next, sizes, total" :page-sizes="[10, 20, 50, 100]" />

        <!-- 弹窗：新增/编辑药品 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑药品' : '新增药品'">
            <el-form :model="currentDrug" label-width="80px">
                <el-form-item label="药品ID">
                    <el-input v-model="currentDrug.id" :disabled=true placeholder="请输入药品ID" />
                </el-form-item>
                <el-form-item label="药品名称">
                    <el-input v-model="currentDrug.name" placeholder="请输入药品名称" />
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="currentDrug.price" placeholder="请输入价格" />
                </el-form-item>
                <el-form-item label="处方药">
                    <el-switch v-model="currentDrug.isRx" active-text="是" inactive-text="否" />
                </el-form-item>
                <el-form-item label="库存数量">
                    <el-input v-model="currentDrug.number" placeholder="请输入库存数量" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveDrug">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { reactive, onMounted } from 'vue'
import { getAllDrug, alterDrug, delDrug, addDrug } from "../../../api/index.js"; // 这里需要你的接口
import { ElNotification } from 'element-plus';

// 分页数据
const paginationData = ref({
    pageNumber: 1,
    pageSize: 10
})

// 列表数据
const tableData = reactive({
    list: [],
    total: 0
})

// 加载科室列表
const loadDrugs = () => {
    getAllDrug(paginationData.value).then(({ data }) => {
        const { total, list } = data.data
        tableData.list = list;
        tableData.total = total;
    });
};

onMounted(() => {
    loadDrugs();
})

// // 模拟药品数据
// const drugList = ref([
//     { id: 'A001', name: '阿莫西林', price: '25.0', isRx: false, num: 100 },
//     { id: 'A002', name: '布洛芬', price: '18.5', isRx: false, num: 150 },
//     { id: 'A003', name: '头孢克肟', price: '38.0', isRx: true, num: 80 },
//     { id: 'A004', name: '氯氮平', price: '120.0', isRx: true, num: 50 },
//     { id: 'A005', name: '奥美拉唑', price: '22.5', isRx: false, num: 200 },
//     { id: 'A006', name: '依托度酸', price: '35.0', isRx: true, num: 40 }
// ]);

const searchQuery = ref('');
const hoveredRow = ref(null);

const filteredDrugs = computed(() => {
    return tableData.list.filter(drug =>
        drug.id.includes(searchQuery.value.trim()) || drug.name.includes(searchQuery.value.trim())
    );
});

const selectedDrugs = ref([]);
const dialogVisible = ref(false);
const currentDrug = ref({ id: '', name: '', price: '', isRx: false, number: '' });
const isEdit = ref(false);

// 计算分页后的药品列表
const paginatedDrugs = computed(() => {
    const start = (paginationData.value.pageNumber - 1) * paginationData.value.pageSize;
    const end = start + paginationData.value.pageSize;
    return filteredDrugs.value.slice(start, end);
});

// 搜索药品
const searchDrugs = () => {
    console.log('搜索药品ID:', searchQuery.value);
};

// 打开新增药品弹窗
const openAddDialog = () => {
    isEdit.value = false;
    currentDrug.value = { id: '', name: '', price: '', isRx: false, number: '' };
    dialogVisible.value = true;
};

// 打开编辑药品弹窗
const openEditDialog = (drug) => {
    isEdit.value = true;
    currentDrug.value = { ...drug };
    dialogVisible.value = true;
};

// 保存药品信息
const saveDrug = () => {
    const { id, ...data } = currentDrug.value;
    if (isEdit.value) { // 修改
        alterDept(data, id).then((res) => {
            if (res.data.data.success) {
                // 编辑成功弹窗
                ElNotification({
                    title: '编辑成功',
                    message: '编辑成功',
                    type: 'success',  // 'success', 'warning', 'info', 'error'
                    duration: 1500,  // 3秒后自动关闭
                });
                loadDrugs();
            }else {
                // 编辑失败弹窗
                ElNotification({
                    title: '编辑失败',
                    message: '编辑失败',
                    type: 'error',  // 'success', 'warning', 'info', 'error'
                    duration: 1500,  // 3秒后自动关闭
                });
            }
        })
    } else {  // 添加
        addDept(data).then((res) => {
            if (res.data.data.success) {
                // 添加成功弹窗
                ElNotification({
                    title: '添加成功',
                    message: '添加成功',
                    type: 'success',  // 'success', 'warning', 'info', 'error'
                    duration: 1500,  // 3秒后自动关闭
                });
                loadDrugs();
            }else {
                // 添加失败弹窗
                ElNotification({
                    title: '添加失败',
                    message: '添加失败',
                    type: 'error',  // 'success', 'warning', 'info', 'error'
                    duration: 1500,  // 3秒后自动关闭
                });
            }
        })
    }
    dialogVisible.value = false;
};

// 删除药品
const deleteDrug = (id) => {
    delDrug(id).then((res) => {
        if (res.data.data.success) {
            // 删除失败弹窗
            ElNotification({
                title: '删除成功',
                message: '删除成功',
                type: 'success',  // 'success', 'warning', 'info', 'error'
                duration: 1500,  // 3秒后自动关闭
            });
            loadDrugs();
        }
        else {
            // 删除失败弹窗
            ElNotification({
                title: '删除失败',
                message: '删除失败',
                type: 'error',  // 'success', 'warning', 'info', 'error'
                duration: 1500,  // 3秒后自动关闭
            });
        }
    });
};

// 分页页码变化
const handlePageChange = (page) => {
    paginationData.value.pageNumber = page;
};

// 分页每页条数变化
const handleSizeChange = (size) => {
    paginationData.value.pageSize = size;
};
</script>

<style scoped>
.admin-drug-management {
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

.search-bar button+.hover-btn {
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

.drug-row {
    transition: background-color 0.3s, box-shadow 0.3s;
}

.drug-row:hover {
    background-color: #f0f9ff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dialog-footer {
    text-align: right;
}

.action-btn {
    transition: transform 0.2s ease, background-color 0.3s ease;
}

.action-btn:hover {
    transform: scale(1.1);
}

.delete-btn {
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
}

.delete-btn:hover {
    background-color: #d9363e;
}
</style>