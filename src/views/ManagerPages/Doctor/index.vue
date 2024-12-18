<template>
    <div class="admin-staff-management">
        <div class="header">医务人员管理</div>
        <div class="search-bar">
            <input type="text" placeholder="输入工号进行搜索" v-model="searchQuery" />
            <button class="hover-btn" @click="searchStaff">搜索</button>
            <!-- 将新增按钮放置在这里 -->
            <button class="hover-btn" @click="openAddDialog">新增医务人员</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>选择</th>
                    <th>工号</th>
                    <th>姓名</th>
                    <th>科室</th>
                    <th>职称</th>
                    <th>电话</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="staff in tableData.list" :key="staff.id" class="staff-row" @mouseover="hoveredRow = staff.id"
                    @mouseleave="hoveredRow = null">
                    <td><input type="checkbox" v-model="selectedStaff" :value="staff.id" /></td>
                    <td>{{ staff.jobNum }}</td>
                    <td>{{ staff.name }}</td>
                    <td :class="{ 'highlight-dept': getDeptName(staff.department_id) === '待定科室' }">
                        {{ getDeptName(staff.department_id) }}
                    </td>
                    <td>{{ staff.title }}</td>
                    <td>{{ staff.phone }}</td>
                    <td>
                        <el-button size="mini" class="action-btn edit-btn" @click="openEditDialog(staff)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" class="action-btn delete-btn"
                            @click="confirmDeleteStaff(staff.id)">
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

        <!-- 弹窗：新增/编辑医务人员 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑医务人员' : '新增医务人员'" class="staff-dialog">
            <el-form :model="currentStaff" label-width="120px" ref="staffForm" :rules="rules" @submit.native.prevent>
                <el-form-item label="工号">
                    <el-input v-model="currentStaff.jobNum" :disabled="isEdit" placeholder="请输入工号" />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="currentStaff.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="科室">
                    <!-- 使用 el-select 下拉框 -->
                    <el-select v-model="currentStaff.department_id" placeholder="请选择科室" style="width: 100%">
                        <el-option v-for="dept in deptData.list" :key="dept.id" :label="dept.name" :value="dept.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="职称">
                    <!-- 使用 el-select 下拉框 -->
                    <el-select v-model="currentStaff.title" placeholder="请选择职称" style="width: 100%">
                        <el-option v-for="title in titleList" :key="title.value" :label="title.label"
                            :value="title.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="currentStaff.phone" placeholder="请输入电话" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveStaff">确认</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { reactive, onMounted } from 'vue'
import { getAllDoctor, alterDoctor, delDoctor, addDoctor, getAllDept } from "../../../api/index.js"; // 这里需要你的接口
import { ElNotification } from 'element-plus';

const searchQuery = ref('');
const hoveredRow = ref(null);
const selectedStaff = ref([]);
const dialogVisible = ref(false);
const currentStaff = ref({ id: '', jobNum: '', name: '', department_id: '', title: '', phone: '' });
const isEdit = ref(false);
// 表单引用
const staffForm = ref(null);

// 表单验证规则
const rules = {
  jobNum: [
    { required: true, message: '请输入工号', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9]+$/, message: '工号只能包含字母和数字', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { pattern: /^(?!\s*$).+$/, message: '姓名不能为空', trigger: 'blur' }
  ],
  department_id: [
    { required: true, message: '请选择科室', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入职称', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
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
const deptData = reactive({
    list: [],
    total: 0
})
const titleList = [
    { label: "主任医师", value: "主任医师" },
    { label: "副主任医师", value: "副主任医师" },
    { label: "主治医师", value: "主治医师" },
    { label: "住院医师", value: "住院医师" },
    { label: "护士", value: "护士" },
    { label: "实习医师", value: "实习医师" }
]


const getDeptName = (deptId) => {
    const dept = deptData.list.find(d => d.id === deptId);
    return dept ? dept.name : '待定科室';
};
const loadDoctors = () => {
    const params = {
        ...paginationData.value, // 分页数据
        jobNum: searchQuery.value
    };
    getAllDoctor(params).then(({ data }) => {
        const { total, list } = data.data
        tableData.list = list;
        tableData.total = total;
    });
};
// 加载科室列表
const loadDepts = () => {
    const params = { pageNumber: -1, pageSize: -1 };
    getAllDept(params).then(({ data }) => {
        const { total, list } = data.data
        deptData.list = list;
        deptData.total = total;
    });
};

onMounted(() => {
    loadDoctors();
    loadDepts();
})

// 搜索医务人员
const searchStaff = () => {
    loadDoctors()
};

// 打开新增医务人员弹窗
const openAddDialog = () => {
    isEdit.value = false;
    currentStaff.value = { id: '', jobNum: '', name: '', department_id: '', title: '', phone: '' };
    dialogVisible.value = true;
};

// 打开编辑医务人员弹窗
const openEditDialog = (staff) => {
    isEdit.value = true;
    currentStaff.value = { ...staff };
    dialogVisible.value = true;
};

// 保存医务人员信息
const saveStaff = () => {
    staffForm.value.validate((valid) => {
        if (valid) {
            console.log("form is valid");
            console.log('currentStaff: ', currentStaff);
            const { id, ...data } = currentStaff.value;
            if (isEdit.value) {
                console.log(data, "updateData")
                alterDoctor(data, id).then((res) => {
                    if (res.data.data) {
                        ElNotification({
                            title: '编辑成功',
                            message: '编辑成功',
                            type: 'success',  // 'success', 'warning', 'info', 'error'
                            duration: 1500,  // 1.5秒后自动关闭
                        });
                        loadDoctors();
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
            } else {
                addDoctor(data).then((res) => {
                    if (res.data.data) {
                        ElNotification({
                            title: '添加成功',
                            message: '添加成功',
                            type: 'success',  // 'success', 'warning', 'info', 'error'
                            duration: 1500,  // 1.5秒后自动关闭
                        });
                        loadDoctors();
                    } else {
                        // 编辑失败弹窗
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

// 确认删除医务人员
const confirmDeleteStaff = (id) => {
  ElMessageBox.confirm(
    '确定删除该医务人员吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    deleteStaff(id);
  }).catch(() => {
    // 用户取消删除
  });
};

// 删除医务人员
const deleteStaff = (id) => {
    delDoctor(id).then((res) => {
        if (res.data.data.success) {
            // 删除失败弹窗
            ElNotification({
                title: '删除成功',
                message: '删除成功',
                type: 'success',  // 'success', 'warning', 'info', 'error'
                duration: 1500,  // 3秒后自动关闭
            });
            loadDoctors();
        } else {
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
    loadDoctors();
};

// 分页每页条数变化
const handleSizeChange = (size) => {
    paginationData.value.pageSize = size;
    loadDoctors();
};
</script>

<style scoped>
.highlight-dept {
    color: red;
    font-weight: bold;
}

.admin-staff-management {
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

.staff-row {
    transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.staff-row:hover {
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
.staff-dialog .el-dialog__header {
    background-color: #409eff;
    color: white;
    font-size: 18px;
    font-weight: bold;
}

.staff-dialog .el-dialog__body {
    padding: 20px;
}

.staff-dialog .el-form-item {
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