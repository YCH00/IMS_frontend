<template>
    <div class="admin-user-management">
        <!-- 页面标题 -->
        <div class="header">用户管理</div>

        <!-- 搜索栏 -->
        <div class="search-bar">
            <input type="text" placeholder="输入卡号或姓名进行搜索" v-model="searchQuery" />
            <button class="hover-btn" @click="searchUsers">搜索</button>
            <button class="hover-btn" @click="openAddDialog">新增用户</button>
        </div>

        <!-- 用户表格 -->
        <table>
            <thead>
                <tr>
                    <th>选择</th>
                    <th>id</th>
                    <th>姓名</th>
                    <th>性别</th>
                    <th>年龄</th>
                    <th>身份证号</th>
                    <th>电话</th>
                    <th>地址</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in tableData.list" :key="user.id" class="user-row" @mouseover="hoveredRow = user.id"
                    @mouseleave="hoveredRow = null">
                    <td><input type="checkbox" v-model="selectedUsers" :value="user.id" /></td>
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.gender }}</td>
                    <td>{{ user.age }}</td>
                    <td>{{ user.idCard }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ user.address }}</td>
                    <td>{{ formatDate(user.time) }}</td>
                    <td>
                        <el-button size="mini" class="action-btn edit-btn" @click="openEditDialog(user)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" class="action-btn delete-btn"
                            @click="confirmDeleteUser(user.id)">
                            删除
                        </el-button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- 分页组件 -->
        <el-pagination @current-change="handlePageChange" @size-change="handleSizeChange"
            :current-page="paginationData.pageNumber" :page-size="paginationData.pageSize"
            :total="tableData.total" layout="prev, pager, next, sizes, total" :page-sizes="[10, 20, 50, 100]"
            class="el-pagination" />

        <!-- 弹窗：新增/编辑用户 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" class="user-dialog" width="50%">
            <el-form :model="currentUser" label-width="120px" ref="userForm" :rules="rules" @submit.native.prevent>
                <!-- 新增时显示卡号 -->
                <el-form-item label="卡号" v-if="!isEdit" prop="id">
                    <el-input v-model="currentUser.cardNumber" placeholder="自动生成id" disabled />
                </el-form-item>

                <!-- 编辑时显示卡号输入 -->
                <el-form-item label="卡号" v-else prop="id">
                    <el-input v-model="currentUser.id" :disabled="isEdit" disabled />
                </el-form-item>

                <el-form-item label="姓名" prop="name">
                    <el-input v-model="currentUser.name" placeholder="请输入姓名" />
                </el-form-item>

                <el-form-item label="性别" prop="gender">
                    <el-select v-model="currentUser.gender" placeholder="请选择性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="currentUser.age" type="number" placeholder="请输入年龄" min="0" />
                </el-form-item>

                <el-form-item label="身份证号" prop="idCard">
                    <el-input v-model="currentUser.idCard" placeholder="请输入身份证号" />
                </el-form-item>

                <el-form-item label="电话" prop="phone">
                    <el-input v-model="currentUser.phone" placeholder="请输入电话" />
                </el-form-item>

                <el-form-item label="地址" prop="address">
                    <el-input v-model="currentUser.address" placeholder="请输入地址" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="saveUser">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { getAllUser, alterUser, delUser, addUser } from "../../../api/index.js";
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus';

const loadData = () => {
    const params = {
        ...paginationData.value, // 分页数据
        name: searchQuery.value
    };
    getAllUser(params).then(({ data }) => {
        const { total, list } = data.data
        tableData.list = list;
        tableData.total = total;
    });
};

// 在组件挂载时加载用户数据
onMounted(() => {
    loadData();
});

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

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
    ],
    age: [
        { required: true, message: '请输入年龄', trigger: 'blur' },
        { type: 'number', message: '年龄必须为数字', trigger: 'blur' },
        { min: 0, message: '年龄不能为负数', trigger: 'blur' }
    ],
    idCard: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
        { pattern: /^(?:\d{15}|\d{17}[\dXx])$/, message: '请输入有效的身份证号码', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
    ],
    address: [
        { required: false, message: '请输入地址', trigger: 'blur' }
    ]
};


// 搜索框输入数据
const searchQuery = ref('');
const selectedUsers = ref([]);
const hoveredRow = ref(null);


// 当前操作的用户
const currentUser = ref({
    id: '',
    name: '',
    gender: '',
    age: null,
    idCard: '',
    phone: '',
    address: '',
    time: null
});

const dialogVisible = ref(false);
const isEdit = ref(false);

// 表单引用
const userForm = ref(null);

// // 计算过滤后的用户列表
// const filteredUsers = computed(() => {
//     const query = searchQuery.value.trim().toLowerCase();
//     if (!query) return tableData.list;
//     return tableData.list.filter(user =>
//         user.cardNumber.toLowerCase().includes(query) ||
//         user.name.toLowerCase().includes(query)
//     );
// });

// // 计算分页后的用户列表
// const paginatedUsers = computed(() => {
//     const start = (paginationData.pageNumber - 1) * paginationData.pageSize;
//     const end = start + paginationData.pageSize;
//     return filteredUsers.value.slice(start, end);
// });

// 搜索用户
const searchUsers = () => {
    paginationData.value.pageNumber = 1; // 重置到第一页
    ElMessage({
        message: `搜索姓名: ${searchQuery.value}`,
        type: 'info',
    });
    loadData();
};

// 打开新增用户弹窗
const openAddDialog = () => {
    isEdit.value = false;
    currentUser.value = { id: '', name: '', gender: '', age: null, idCard: '', phone: '', address: '', time: null };
    dialogVisible.value = true;
};

// 打开编辑用户弹窗
const openEditDialog = (user) => {
    isEdit.value = true;
    // 深拷贝用户信息，确保编辑时不直接修改原数据
    currentUser.value = { ...user, created_at: new Date(user.created_at) };
    dialogVisible.value = true;
};

// 保存用户信息
const saveUser = () => {
    userForm.value.validate((valid) => {
        if (valid) {
            const { id, ...data } = currentUser.value;
            if (isEdit.value) { // 修改
                alterUser(data, id).then((res) => {
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
                addUser(data).then((res) => {
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
                })
            }
            dialogVisible.value = false;
        } else {
            ElMessage({
                message: '请填写所有必填项并确保格式正确',
                type: 'warning',
            });
            return false;
        }
    });
};

// 确认删除用户
const confirmDeleteUser = (id) => {
    ElMessageBox.confirm(
        '确定删除该用户吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        deleteUser(id);
    }).catch(() => {
        // 用户取消删除
    });
};

// 删除用户
const deleteUser = (id) => {
    delUser(id).then((res) => {
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
};

// 分页页码变化
const handlePageChange = (page) => {
    paginationData.value.pageNumber = page;
};

// 分页每页条数变化
const handleSizeChange = (size) => {
    paginationData.value.pageSize = size;
};

// 格式化日期显示
const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
};

</script>


<style scoped>
.admin-user-management {
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

.user-row {
    transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.user-row:hover {
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

/* 弹窗样式，与其他管理页面一致 */
.user-dialog .el-dialog__header {
    background-color: #409eff;
    color: white;
    font-size: 18px;
    font-weight: bold;
}

.user-dialog .el-dialog__body {
    padding: 20px;
}

.user-dialog .el-form-item {
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
