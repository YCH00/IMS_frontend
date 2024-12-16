<template>
    <div class="admin-department-management">
        <div class="header">科室管理</div>
        <div class="search-bar">
            <input type="text" placeholder="输入科室ID进行搜索" v-model="searchQuery" />
            <button class="hover-btn" @click="searchDepts">搜索</button>
            <button class="hover-btn" @click="openAddDeptDialog">新增科室</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>选择</th>
                    <th>科室ID</th>
                    <th>科室名称</th>
                    <th>科室主任</th>
                    <th>科室电话</th>
                    <th>科室地址</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="dept in paginatedDepts" :key="dept.id" class="dept-row" @mouseover="hoveredRow = dept.id"
                    @mouseleave="hoveredRow = null">
                    <td><input type="checkbox" v-model="selectedDepts" :value="dept.id" /></td>
                    <td>{{ dept.id }}</td>
                    <td>{{ dept.name }}</td>
                    <td>{{ dept.head }}</td>
                    <td>{{ dept.phone_number }}</td>
                    <td>{{ dept.address }}</td>
                    <td>
                        <el-button size="mini" class="action-btn edit-btn" @click="openEditDialog(dept)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" class="action-btn delete-btn" @click="deleteDept(dept.id)">
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

        <!-- 弹窗：新增/编辑科室 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑科室' : '新增科室'">
            <el-form :model="currentDept" label-width="80px">
                <!-- 新增时显示科室ID -->
                <!-- <el-form-item label="科室ID" v-if="!isEdit">
                    <el-input v-model="currentDept.id" placeholder="请输入科室ID" />
                </el-form-item> -->

                <el-form-item label="科室名称">
                    <el-input v-model="currentDept.name" placeholder="请输入科室名称" />
                </el-form-item>
                <el-form-item label="科室主任">
                    <el-input v-model="currentDept.head" placeholder="请输入科室主任" />
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="currentDept.phone_number" placeholder="请输入联系电话" />
                </el-form-item>
                <el-form-item label="科室地址">
                    <el-input v-model="currentDept.address" placeholder="请输入科室地址" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveDept">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { reactive, onMounted } from 'vue'
import { getAllDept, alterDept, delDept, addDept } from "../../../api/index.js"; // 这里需要你的接口
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
const loadDepts = () => {
    getAllDept(paginationData.value).then(({ data }) => {
        const { total, list } = data.data
        // console.log(list, "科室数据")
        // list.forEach(item => {
        //     item.created_at = item.created_at
        //         ? dayjs(item.created_at).format("YYYY-MM-DD")
        //         : "N/A"; // 默认显示"N/A"或其他占位符
        // })
        tableData.list = list;
        tableData.total = total;
    });
};

onMounted(() => {
    loadDepts();
})

const searchQuery = ref('');
const hoveredRow = ref(null);
const selectedDepts = ref([]);
const dialogVisible = ref(false);
const currentDept = ref({ id: '', name: '', head: '', phone_number: '', address: '' });
const isEdit = ref(false);

// 计算过滤后的科室列表
const filteredDepts = computed(() => {
    return tableData.list.filter(dept =>
        dept.id.includes(searchQuery.value.trim())
    );
});

// 计算分页后的科室列表
const paginatedDepts = computed(() => {
    const start = (paginationData.value.pageNumber - 1) * paginationData.value.pageSize;
    const end = start + paginationData.value.pageSize;
    return filteredDepts.value.slice(start, end);
});

// 搜索科室
const searchDepts = () => {
    console.log('搜索科室ID:', searchQuery.value);
};

// 打开新增科室弹窗
const openAddDeptDialog = () => {
    isEdit.value = false;
    currentDept.value = { id: '', name: '', head: '', phone_number: '', address: '' };
    dialogVisible.value = true;
};

// 打开编辑科室弹窗
const openEditDialog = (dept) => {
    isEdit.value = true;
    currentDept.value = { ...dept };
    dialogVisible.value = true;
};

// 保存科室
const saveDept = () => {
    const { id, ...data } = currentDept.value;
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
                loadDepts();
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
                loadDepts();
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
};

// 删除科室
const deleteDept = (id) => {
    delDept(id).then((res) => {
        if (res.data.data.success) {
            // 删除失败弹窗
            ElNotification({
                title: '删除成功',
                message: '删除成功',
                type: 'success',  // 'success', 'warning', 'info', 'error'
                duration: 1500,  // 3秒后自动关闭
            });
            loadDepts();
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
    loadDepts();

};

// 分页每页条数变化
const handleSizeChange = (size) => {
    paginationData.value.pageSize = size;
    loadDepts();
};
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

.dept-row {
    transition: background-color 0.3s, box-shadow 0.3s;
}

.dept-row:hover {
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