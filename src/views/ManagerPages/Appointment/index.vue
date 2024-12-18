<template>
    <div class="appointment-management">
        <!-- 标题 -->
        <div class="header">用户预约管理</div>

        <!-- 搜索栏 -->
        <div class="search-bar">
            <input type="text" placeholder="输入挂号ID进行搜索" v-model="searchQuery" />
            <button class="hover-btn" @click="searchAppointment">搜索</button>
            <!-- 新增按钮 -->
            <button class="hover-btn" @click="showAddDialog">新增预约</button>
        </div>

        <!-- 预约表格 -->
        <table>
            <thead>
                <tr>
                    <th>选择</th>
                    <th>挂号ID</th>
                    <th>患者ID</th>
                    <th>患者姓名</th>
                    <th>科室</th>
                    <th>医生ID</th>
                    <th>医生姓名</th>
                    <th>预约时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="appointment in tableData.list" :key="appointment.id" class="appointment-row"
                    @mouseover="hoveredRow = appointment.id" @mouseleave="hoveredRow = null">
                    <td><input type="checkbox" v-model="selectedAppointments" :value="appointment.id" />
                    </td>
                    <td>{{ appointment.id }}</td>
                    <td>{{ appointment.userId }}</td>
                    <td>{{ appointment.userName }}</td>
                    <td>{{ appointment.dept }}</td>
                    <td>{{ appointment.doctorId }}</td>
                    <td>{{ appointment.doctorName }}</td>
                    <td>{{ appointment.time }}</td>
                    <td>
                        <el-button size="mini" class="action-btn edit-btn" @click="editAppointment(appointment)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" class="action-btn delete-btn"
                            @click="deleteAppointment(appointment.id)">
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

        <!-- 弹窗：新增/编辑预约 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑预约' : '新增预约'" class="appointment-dialog" width="50%">
            <el-form :model="currentAppointment" label-width="120px" ref="appointmentForm" :rules="rules"
                @submit.native.prevent>
                <el-form-item label="挂号ID">
                    <el-input v-model="currentAppointment.id" :disabled=true placeholder="请输入挂号ID" />
                </el-form-item>
                <el-form-item label="患者ID">
                    <el-input v-model="currentAppointment.userId" placeholder="请输入患者ID" />
                </el-form-item>
                <el-form-item label="患者姓名">
                    <el-input v-model="currentAppointment.userName" placeholder="请输入患者姓名" />
                </el-form-item>
                <el-form-item label="科室">
                    <el-input v-model="currentAppointment.dept" placeholder="请输入科室" />
                </el-form-item>
                <el-form-item label="医生ID">
                    <el-input v-model="currentAppointment.doctorId" placeholder="请输入医生ID" />
                </el-form-item>
                <el-form-item label="医生姓名">
                    <el-input v-model="currentAppointment.doctorName" placeholder="请输入医生姓名" />
                </el-form-item>
                <el-form-item label="预约时间">
                    <el-date-picker v-model="currentAppointment.time" type="datetime"
                        placeholder="选择预约时间"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveAppointment">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { reactive, onMounted } from 'vue'
import { getAllAppoint, alterAppoint, delAppoint, addAppoint } from "../../../api/index.js"; // 这里需要你的接口
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';

// 表单验证规则
const rules = {
    registrationId: [
        { required: true, message: '请输入挂号ID', trigger: 'blur' }
    ],
    patientId: [
        { required: true, message: '请输入患者ID', trigger: 'blur' }
    ],
    patient: [
        { required: true, message: '请输入患者姓名', trigger: 'blur' }
    ],
    doctorId: [
        { required: true, message: '请输入医生ID', trigger: 'blur' }
    ],
    doctor: [
        { required: true, message: '请输入医生姓名', trigger: 'blur' }
    ],
    appointmentTime: [
        { required: true, message: '请选择预约时间', trigger: 'change' }
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
        dept_name: searchQuery.value  // 查询参数（科室名称）
    };
    getAllAppoint(params).then(({ data }) => {
        const { total, list } = data.data
        console.log(total, "total")
        tableData.list = list;
        tableData.total = total;
    });
};


onMounted(() => {
    loadData();
})


const searchQuery = ref('');
const hoveredRow = ref(null);
const selectedAppointments = ref([]);
const dialogVisible = ref(false);
const currentAppointment = ref({ id: '', userId: '', userName: '', dept: '', doctorId: '', doctorName: '', time: '' });
const isEdit = ref(false);
// 表单引用
const appointmentForm = ref(null);


// 搜索预约
const searchAppointment = () => {
    console.log('搜索挂号ID:', searchQuery.value);
};

// 打开新增预约对话框
const showAddDialog = () => {
    isEdit.value = false;
    currentAppointment.value = { id: '', userId: '', userName: '', dept: '', doctorId: '', doctorName: '', time: '' };
    dialogVisible.value = true;
};

// 打开编辑预约对话框
const editAppointment = (appointment) => {
    isEdit.value = true;
    currentAppointment.value = { ...appointment };
    dialogVisible.value = true;
};

// 保存预约
const saveAppointment = () => {
    appointmentForm.value.validate((valid) => {
        if (valid) {
            const { id, ...data } = currentAppointment.value;
            if (isEdit.value) { // 修改
                alterAppoint(data, id).then((res) => {
                    if (res.data.data.success) {
                        // 编辑成功弹窗
                        ElNotification({
                            title: '编辑成功',
                            message: '编辑成功',
                            type: 'success',  // 'success', 'warning', 'info', 'error'
                            duration: 1500,  // 3秒后自动关闭
                        });
                        loadData();
                    }
                    else {
                        // 编辑失败弹窗
                        ElNotification({
                            title: '编辑失败',
                            message: '编辑失败',
                            type: 'error',  // 'success', 'warning', 'info', 'error'
                            duration: 1500,  // 3秒后自动关闭
                        });
                    }
                });
            } else {  // 添加
                addAppoint(data).then((res) => {
                    if (res.data.data.success) {
                        // 添加成功弹窗
                        ElNotification({
                            title: '添加成功',
                            message: '添加成功',
                            type: 'success',  // 'success', 'warning', 'info', 'error'
                            duration: 1500,  // 3秒后自动关闭
                        });
                        loadData();
                    }
                    else {
                        // 添加失败弹窗
                        ElNotification({
                            title: '添加失败',
                            message: '添加失败',
                            type: 'error',  // 'success', 'warning', 'info', 'error'
                            duration: 1500,  // 3秒后自动关闭
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
            return false;
        }
    });
};

// 删除预约
const deleteAppointment = (registrationId) => {
    ElMessageBox.confirm(
        '确定删除该预约吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        delAppoint(id).then((res) => {
            if (res.data.data.success) {
                // 删除失败弹窗
                ElNotification({
                    title: '删除成功',
                    message: '删除成功',
                    type: 'success',  // 'success', 'warning', 'info', 'error'
                    duration: 1500,  // 1.5秒后自动关闭
                });
                loadData();
            }
            else {
                // 删除失败弹窗
                ElNotification({
                    title: '删除失败',
                    message: '删除失败',
                    type: 'error',  // 'success', 'warning', 'info', 'error'
                    duration: 1500,  // 1.5秒后自动关闭
                });
            }
        });
        ElMessage({
            message: '预约已删除',
            type: 'success',
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
.appointment-management {
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

.appointment-row {
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.appointment-row:hover {
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
.appointment-dialog .el-dialog__header {
  background-color: #409eff;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.appointment-dialog .el-dialog__body {
  padding: 20px;
}

.appointment-dialog .el-form-item {
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
