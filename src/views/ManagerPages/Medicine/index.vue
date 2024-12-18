<template>
    <div class="admin-drug-management">
        <div class="header">药品管理</div>
        <!-- 搜索栏 -->
        <div class="search-bar">
            <input type="text" placeholder="输入药品名称进行搜索" v-model="searchQuery" />
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
                <tr v-for="drug in tableData.list" :key="drug.id" class="drug-row" @mouseover="hoveredRow = drug.id"
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
            layout="prev, pager, next, sizes, total" :page-sizes="[10, 20, 50, 100]" class="el-pagination" />

        <!-- 弹窗：新增/编辑药品 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑药品' : '新增药品'" class="drug-dialog" width="50%">
            <el-form :model="currentDrug" label-width="80px" ref="drugForm" :rules="rules" @submit.native.prevent>

                <el-form-item label="药品名称" prop="name">
                    <el-input v-model="currentDrug.name" placeholder="请输入药品名称" />
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model.number="currentDrug.price" type="number" placeholder="请输入价格" />
                </el-form-item>
                <el-form-item label="处方药" prop="isRx">
                    <el-switch v-model="currentDrug.isRx" active-text="是" inactive-text="否" />
                </el-form-item>
                <el-form-item label="库存数量" prop="num">
                    <el-input v-model.number="currentDrug.number" type="number" placeholder="请输入库存数量" />
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
import { getAllDrug, alterDrug, delDrug, addDrug, getDrugById } from "../../../api/index.js"; // 这里需要你的接口
import { ElMessage, ElMessageBox } from 'element-plus';
import { ElNotification } from 'element-plus';

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入药品名称', trigger: 'blur' }
    ],
    price: [
        { required: true, message: '请输入价格', trigger: 'blur' },
        { type: 'number', message: '价格必须为数字', trigger: 'blur' },
    ],
    isRx: [
        { required: true, message: '请选择是否为处方药', trigger: 'change' }
    ],
    number: [
        { required: true, message: '请输入库存数量', trigger: 'blur' },
        { type: 'number', message: '库存数量必须为数字', trigger: 'blur' },
    ]
};

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
const searchQuery = ref('');
const hoveredRow = ref(null);
const selectedDrugs = ref([]);
const dialogVisible = ref(false);
const currentDrug = ref({ id: '', name: '', price: '', isRx: false, number: ''});
const isEdit = ref(false);
const drugForm = ref(null);

const loadData = () => {
    const params = {
        ...paginationData.value, // 分页数据
        name: searchQuery.value
    };
    getAllDrug(params).then(({ data }) => {
        const { total, list } = data.data
        tableData.list = list;
        tableData.total = total;
    });
};

onMounted(() => {
    loadData();
})


// 搜索药品
const searchDrugs = () => {
    loadData()
};

// 打开新增药品弹窗
const openAddDialog = () => {
    isEdit.value = false;
    currentDrug.value = { id: '', name: '', price: '', isRx: false, number: '', description: '' };
    dialogVisible.value = true;

};

// 打开编辑药品弹窗
const openEditDialog = (drug) => {
    getDrugById(drug.id).then(({ data }) => {
        currentDrug.value = data.data;
    })
    isEdit.value = true;
    dialogVisible.value = true;
};

// 保存药品信息
const saveDrug = () => {
    drugForm.value.validate((valid) => {
        if (valid) {
            const { id, ...data } = currentDrug.value;
            if (isEdit.value) { // 修改
                alterDrug(data, id).then((res) => {
                    if (res.data.data.success) {
                        // 编辑成功弹窗
                        ElNotification({
                            title: '编辑成功',
                            message: '编辑成功',
                            type: 'success',  // 'success', 'warning', 'info', 'error'
                            duration: 1500,  // 1.5秒后自动关闭
                        });
                        loadData();
                    } else {
                        // 编辑失败弹窗
                        ElNotification({
                            title: '编辑失败',
                            message: '编辑失败',
                            type: 'error',  // 'success', 'warning', 'info', 'error'
                            duration: 1500,  // 1.5秒后自动关闭
                        });
                    }
                })
            } else {  // 添加
                console.log('添加药品--验证通过');
                addDrug(data).then((res) => {
                    if (res.data.data.success) {
                        // 添加成功弹窗
                        ElNotification({
                            title: '添加成功',
                            message: '添加成功',
                            type: 'success',  // 'success', 'warning', 'info', 'error'
                            duration: 1500,  // 1.5秒后自动关闭
                        });
                        loadData();
                    } else {
                        // 添加失败弹窗
                        ElNotification({
                            title: '添加失败',
                            message: '添加失败',
                            type: 'error',  // 'success', 'warning', 'info', 'error'
                            duration: 1500,  // 1.5秒后自动关闭
                        });
                    }
                });
            }
            dialogVisible.value = false;
        } else {
            console.log('验证失败');
            ElMessage({
                message: '请填写所有必填项',
                type: 'warning',
            });
            
        }
    });
};


// 删除药品
const deleteDrug = (id) => {
    ElMessageBox.confirm(
        '确定删除该药品吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        delDrug(id).then((res) => {
            if (res.data.data.success) {
                // 删除失败弹窗
                ElNotification({
                    title: '删除成功',
                    message: '删除成功',
                    type: 'success',  // 'success', 'warning', 'info', 'error'
                    duration: 1500,  // 1.5秒后自动关闭
                });
                loadData();
            } else {
                // 删除失败弹窗
                ElNotification({
                    title: '删除失败',
                    message: '删除失败',
                    type: 'error',  // 'success', 'warning', 'info', 'error'
                    duration: 1500,  // 1.5秒后自动关闭
                });
            }
        });
    }).catch(() => {
        // 用户取消删除
    });
};


// 分页页码变化
const handlePageChange = (page) => {
    paginationData.value.pageNumber = page;
    loadData();
};

// 分页每页条数变化
const handleSizeChange = (size) => {
    paginationData.value.pageSize = size;
    loadData();
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

/* 按钮之间的间隔 */
.search-bar button+.hover-btn {
    margin-left: 10px;
    /* 增加间距 */
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

table td {
    color: #666;
}

.drug-row {
    transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.drug-row:hover {
    background-color: #f0f9ff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transform: scale(1.02);
}

.dialog-footer {
    text-align: right;
}

.action-btn {
    transition: transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}

/* 编辑按钮样式 - 镂空蓝色 */
.edit-btn {
    background-color: transparent;
    color: #409eff;
    border: 1px solid #409eff;
    margin-right: 10px;
}

.edit-btn:hover {
    background-color: #e6f7ff;
    border-color: #73d13d;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 删除按钮样式 - 红色背景 */
.delete-btn {
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
}

.delete-btn:hover {
    background-color: #d9363e;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 分页样式 */
.el-pagination {
    margin-top: 20px;
}

/* 弹窗样式，与用户模板一致 */
.drug-dialog .el-dialog__header {
    background-color: #409eff;
    color: white;
    font-size: 18px;
    font-weight: bold;
}

.drug-dialog .el-dialog__body {
    padding: 20px;
}

.drug-dialog .el-form-item {
    margin-bottom: 15px;
}

/* 弹窗底部按钮样式 */
.dialog-footer .el-button {
    margin-left: 10px;
}

/* 与用户界面保持一致的交互动效 */
.el-button {
    border-radius: 4px;
    font-size: 14px;
    padding: 6px 12px;
}

.el-button.primary {
    background-color: #409eff;
    color: white;
    border: none;
}

.el-button.primary:hover {
    background-color: #66b1ff;
}

.el-button.danger {
    background-color: #ff4d4f;
    color: white;
    border: none;
}

.el-button.danger:hover {
    background-color: #d9363e;
}
</style>
