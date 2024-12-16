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
                <tr v-for="staff in paginatedStaff" :key="staff.id" class="staff-row" @mouseover="hoveredRow = staff.id"
                    @mouseleave="hoveredRow = null">
                    <td><input type="checkbox" v-model="selectedStaff" :value="staff.id" /></td>
                    <td>{{ staff.jobNum }}</td>
                    <td>{{ staff.name }}</td>
                    <td>{{ staff.dept }}</td>
                    <td>{{ staff.title }}</td>
                    <td>{{ staff.phone }}</td>
                    <td>
                        <el-button size="mini" class="action-btn edit-btn" @click="openEditDialog(staff)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" class="action-btn delete-btn"
                            @click="deleteStaff(staff.id)">
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
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑医务人员' : '新增医务人员'">
            <el-form :model="currentStaff" label-width="80px">
                <el-form-item label="工号">
                    <el-input v-model="currentStaff.jobNum" :disabled="isEdit" placeholder="请输入工号" />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="currentStaff.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="科室">
                    <el-input v-model="currentStaff.dept" placeholder="请输入科室" />
                </el-form-item>
                <el-form-item label="职称">
                    <el-input v-model="currentStaff.title" placeholder="请输入职称" />
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
import { getAllDoctor, alterDoctor, delDoctor, addDoctor } from "../../../api/index.js"; // 这里需要你的接口
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
const loadDoctors = () => {
    getAllDoctor(paginationData.value).then(({ data }) => {
        const { total, list } = data.data
        tableData.list = list;
        tableData.total = total;
    });
};

onMounted(() => {
    loadDoctors();
})

const searchQuery = ref('');
const hoveredRow = ref(null);

const filteredStaff = computed(() => {
    return tableData.list.filter(staff =>
        staff.id.includes(searchQuery.value.trim())
    );
});

const selectedStaff = ref([]);
const dialogVisible = ref(false);
const currentStaff = ref({ id: '', jobNum: '', name: '', dept: '', title: '', phone: '' });
const isEdit = ref(false);

// 计算分页后的医务人员列表
const paginatedStaff = computed(() => {
    const start = (paginationData.value.pageNumber - 1) * paginationData.value.pageSize;
    const end = start + paginationData.value.pageSize;
    return filteredStaff.value.slice(start, end);
});

// 搜索医务人员
const searchStaff = () => {
    console.log('搜索工号:', searchQuery.value);
};

// 打开新增医务人员弹窗
const openAddDialog = () => {
    isEdit.value = false;
    currentStaff.value = { id: '', jonNum:'', name: '', dept: '', title: '', phone: '' };
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
    const { id, ...data } = currentStaff.value;
    if (isEdit.value) {
        alterDoctor(data, id).then((res) => {
            if (res.data.data) {
                ElNotification({
                    title: '编辑成功',
                    message: '编辑成功',
                    type: 'success',  // 'success', 'warning', 'info', 'error'
                    duration: 1500,  // 1.5秒后自动关闭
                });
                loadDoctors();
            }
            else {
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
            }
            else {
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

.staff-row {
    transition: background-color 0.3s, box-shadow 0.3s;
}

.staff-row:hover {
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