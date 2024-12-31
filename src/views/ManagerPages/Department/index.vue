<template>
  <div class="admin-department-management">
    <div class="header">科室管理</div>
    <div class="search-bar">
      <input type="text" placeholder="输入科室名称进行搜索" v-model="searchQuery"/>
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
      <tr v-for="dept in tableData.list" :key="dept.id" class="dept-row" @mouseover="hoveredRow = dept.id"
          @mouseleave="hoveredRow = null">
        <td><input type="checkbox" v-model="selectedDepts" :value="dept.id"/></td>
        <td>{{ dept.id }}</td>
        <td>{{ dept.name }}</td>
        <td :class="{ 'highlight-dept': !dept.head_name }">{{ dept.head_name || '待定' }}</td>
        <td>{{ dept.phone_number }}</td>
        <td>{{ dept.address }}</td>
        <td>
          <el-button size="default" class="action-btn edit-btn" @click="openEditDialog(dept)">
            编辑
          </el-button>
          <el-button size="default" type="danger" class="action-btn delete-btn" @click="deleteDept(dept.id)">
            删除
          </el-button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 分页组件 -->
    <el-pagination @current-change="handlePageChange" @size-change="handleSizeChange"
                   :current-page="paginationData.pageNumber" :page-size="paginationData.pageSize"
                   :total="tableData.total"
                   layout="prev, pager, next, sizes, total" :page-sizes="[10, 20, 50, 100]" class="el-pagination"/>

    <!-- 弹窗：新增/编辑科室 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑科室' : '新增科室'" class="dept-dialog" width="50%">
      <el-form :model="currentDept" label-width="120px" ref="deptForm" :rules="rules" @submit.native.prevent>
        <!-- 新增时显示科室ID -->
        <!-- <el-form-item label="科室ID" v-if="!isEdit">
            <el-input v-model="currentDept.id" placeholder="请输入科室ID" />
        </el-form-item> -->
        <el-form-item label="科室名称">
          <el-input v-model="currentDept.name" placeholder="请输入科室名称"/>
        </el-form-item>
        <!-- 仅在编辑模式下显示科室主任输入框 -->
        <el-form-item label="科室主任" v-if="isEdit">
          <el-select v-model="currentDept.head_id" placeholder="请选择科室主任">
            <el-option v-for="doctor in doctorData.list" :key="doctor.id" :label="doctor.name"
                       :value="doctor.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="currentDept.phone_number" placeholder="请输入联系电话"/>
        </el-form-item>
        <el-form-item label="科室地址">
          <el-input v-model="currentDept.address" placeholder="请输入科室地址"/>
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
import {ref, computed} from 'vue';
import {reactive, onMounted} from 'vue'
import {getAllDept, alterDept, delDept, addDept, getDoctorsByDept} from "../../../api/index.js"; // 这里需要你的接口
import {ElNotification} from 'element-plus';

// 表单引用
const deptForm = ref(null);

// 表单验证规则
const rules = {
  id: [
    {required: true, message: '请输入科室ID', trigger: 'blur'},
    {pattern: /^[A-Za-z0-9]+$/, message: '科室ID只能包含字母和数字', trigger: 'blur'}
  ],
  name: [
    {required: true, message: '请输入科室名称', trigger: 'blur'}
  ],
  head: [
    {required: true, message: '请输入科室主任', trigger: 'blur'}
  ],
  phone_number: [
    {required: true, message: '请输入联系电话', trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: '请输入有效的电话号码', trigger: 'blur'}
  ],
  address: [
    {required: true, message: '请输入科室地址', trigger: 'blur'}
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
const doctorData = reactive({
  list: [],
})

// 加载科室列表
const loadDepts = () => {
  const params = {
    ...paginationData.value, // 分页数据
    dept_name: searchQuery.value  // 查询参数（科室名称）
  };
  getAllDept(params).then(({data}) => {
    const {total, list} = data.data
    console.log(total, "total")
    tableData.list = list;
    tableData.total = total;
  });
};

const loadDoctorsByDept = (ID) => {
  getDoctorsByDept(ID).then(({data}) => {
    const {list} = data.data
    doctorData.list = list;
  })
}

onMounted(() => {
  loadDepts();
})

const searchQuery = ref('');
const hoveredRow = ref(null);
const selectedDepts = ref([]);
const dialogVisible = ref(false);
const currentDept = ref({id: '', name: '', head_id: '', head_name: '', phone_number: '', address: ''});
const isEdit = ref(false);

// 搜索科室
const searchDepts = () => {
  loadDepts()
};

// 打开新增科室弹窗
const openAddDeptDialog = () => {
  isEdit.value = false;
  currentDept.value = {id: '', name: '', head_id: '', head_name: '', phone_number: '', address: ''};
  dialogVisible.value = true;
};

// 打开编辑科室弹窗
const openEditDialog = (dept) => {
  isEdit.value = true;
  currentDept.value = {...dept};
  dialogVisible.value = true;
  console.log(currentDept.value, "CurrentValue")
  loadDoctorsByDept(currentDept.value.id);
};

// 保存科室
const saveDept = () => {
  const {id, ...data} = currentDept.value;
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
      } else {
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
      } else {
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
.search-bar button + .hover-btn {
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

.dept-row {
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.dept-row:hover {
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
.dept-dialog .el-dialog__header {
  background-color: #409eff;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.dept-dialog .el-dialog__body {
  padding: 20px;
}

.dept-dialog .el-form-item {
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

.highlight-dept {
  color: red;
  /* 红色字体 */
  font-weight: bold;
  /* 加粗 */
}
</style>