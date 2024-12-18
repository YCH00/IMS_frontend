<template>
    <div class="admin-tests-management">
        <!-- 页面标题 -->
        <div class="header">检查项目管理</div>

        <!-- 搜索框 -->
        <div class="search-bar">
            <input type="text" placeholder="搜索项目名称" v-model="searchQuery" />
            <button class="hover-btn" @click="searchTests">搜索</button>
            <button class="hover-btn" @click="openAddTestDialog">新增检查项目</button>
        </div>

        <!-- 检查项目列表 -->
        <table>
            <thead>
                <tr>
                    <th>选择</th>
                    <th>项目ID</th>
                    <th>检查项目名称</th>
                    <th>价格</th>
                    <th>是否有特殊检查</th>
                    <th>库存数量</th>
                    <th>地址</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="test in tableData.list" :key="test.id" class="test-row" @mouseover="hoveredRow = test.id"
                    @mouseleave="hoveredRow = null">
                    <td><input type="checkbox" v-model="selectedTests" :value="test.id" /></td>
                    <td>{{ test.id }}</td>
                    <td>{{ test.name }}</td>
                    <td>{{ test.price }}</td>
                    <td>{{ test.isSpecial ? '是' : '否' }}</td>
                    <td>{{ test.number }}</td>
                    <td>{{ test.address }}</td>
                    <td>
                        <el-button size="mini" class="action-btn edit-btn" @click="openEditDialog(test)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" class="action-btn delete-btn" @click="deleteTest(test.id)">
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

        <!-- 弹窗：新增/编辑检查项目 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑检查项目' : '新增检查项目'">
            <el-form :model="currentTest" label-width="120px" ref="testForm" :rules="rules" @submit.native.prevent>
                <el-form-item label="项目名称">
                    <el-input v-model="currentTest.name" placeholder="请输入检查项目名称" />
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="currentTest.price" placeholder="请输入价格" />
                </el-form-item>
                <el-form-item label="特殊检查">
                    <el-switch v-model="currentTest.isSpecial" active-text="是" inactive-text="否" />
                </el-form-item>
                <el-form-item label="库存数量">
                    <el-input v-model="currentTest.number" placeholder="请输入库存数量" />
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="currentTest.address" placeholder="请输入检查所在地址" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveTest">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { reactive, onMounted } from 'vue'
import { getAllExam, alterExam, delExam, addExam } from "../../../api/index.js"; // 这里需要你的接口
import { ElNotification } from 'element-plus';

// 表单验证规则
const rules = {
    id: [
        { required: false, message: '请输入项目ID', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入检查项目名称', trigger: 'blur' }
    ],
    price: [
        { required: true, message: '请输入价格', trigger: 'blur' },
        { type: 'number', message: '价格必须为数字', trigger: 'blur' },
    ],
    isSpecial: [
        { required: true, message: '请选择是否有特殊检查', trigger: 'change' }
    ],
    num: [
        { required: true, message: '请输入库存数量', trigger: 'blur' },
        { type: 'number', message: '库存数量必须为数字', trigger: 'blur' },
    ],
    address: [
        { required: true, message: '请输入检查的地址', trigger: 'blur' }
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

// 加载科室列表
const loadData = () => {
    const params = {
        ...paginationData.value, // 分页数据
        name: searchQuery.value
    };
    getAllExam(params).then(({ data }) => {
        const { total, list } = data.data
        tableData.list = list;
        tableData.total = total;
    });
};

onMounted(() => {
    loadData();
})


// 搜索框输入数据
const searchQuery = ref('');
const hoveredRow = ref(null);
const selectedTests = ref([]);
// 表单引用
const testForm = ref(null);

// 当前操作的检查项目
const currentTest = ref({ id: '', name: '', price: '', isSpecial: false, number: '', address: '' });
const dialogVisible = ref(false);
const isEdit = ref(false);

// 搜索功能
const searchTests = () => {
    ElMessage({
        message: `搜索检查项目: ${searchQuery.value}`,
        type: 'info',
    });
    loadData();
};

// 打开新增检查项目弹窗
const openAddTestDialog = () => {
    isEdit.value = false;
    currentTest.value = { id: '', name: '', price: '', isSpecial: false, number: '', address: '' };
    dialogVisible.value = true;
};

// 打开编辑检查项目弹窗
const openEditDialog = (test) => {
    isEdit.value = true;
    currentTest.value = { ...test }; // 保证项目ID不能修改
    dialogVisible.value = true;
};

// 保存药品信息
const saveTest = () => {
    drugForm.value.validate((valid) => {
        if (valid) {
            const { id, ...data } = currentTest.value;
            if (isEdit.value) { // 修改
                alterExam(data, id).then((res) => {
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
                addExam(data).then((res) => {
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
            ElMessage({
                message: '请填写所有必填项',
                type: 'warning',
            });

        }
    });
};

// 删除检查项目
const deleteTest = (id) => {
    ElMessageBox.confirm(
        '确定删除该药品吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        delExam(id).then((res) => {
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
};

// 分页每页条数变化
const handleSizeChange = (size) => {
    paginationData.value.pageSize = size;
};

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
.search-bar button + .hover-btn {
  margin-left: 10px; /* 增加间距 */
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

.test-row {
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.test-row:hover {
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
.test-dialog .el-dialog__header {
  background-color: #409eff;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.test-dialog .el-dialog__body {
  padding: 20px;
}

.test-dialog .el-form-item {
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
