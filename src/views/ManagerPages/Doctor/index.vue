<template>
  <div class="admin-doctors-management">
    <div class="header">医生管理</div>
    <div class="search-bar">
      <input type="text" placeholder="搜索医生" v-model="searchQuery"/>
      <button @click="searchDoctors">搜索</button>
    </div>

    <table>
      <thead>
      <tr>
        <th>选择</th>
        <th>医生姓名</th>
        <th>联系方式</th>
        <th>邮箱</th>
        <th>所属科室</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="data in tableData.list" :key="data.id">
        <td><input type="checkbox" v-model="currentDoctor" :value="data.id"/></td>
        <td>{{ data.name }}</td>
        <td>{{ data.phone_number }}</td>
        <td>{{ data.email }}</td>
        <td>{{ data.specialty_name }}</td>
        <td>
          <button @click="editDoctor(data.id)">编辑</button>
          <button @click="deleteDoctor(data.id)">删除</button>
        </td>
      </tr>
      </tbody>
    </table>
    <button @click="addDoctor">新增医生</button>

    <!-- 分页部分 -->
    <el-pagination
        @current-change="(page) => {
      paginationData.pageNumber = page;
      loadTableData();
    }"
        @size-change="(size) => {
      paginationData.pageSize = size;
      loadTableData();
    }"
        :current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize"
        :total="tableData.total"
        layout="prev, pager, next, sizes, total"
        :page-sizes="[10, 20, 50, 100]"
    />

  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import {ref, computed, reactive, onMounted} from 'vue';
import {getAllDoctorInfo} from "../../../api/index.js";

// 分页数据
const paginationData = reactive({
  pageNumber: 1,
  pageSize: 10
})
// 搜索数据
const searchQuery = ref('');

// 列表数据
const tableData = reactive({
  list: [],
  total: 0
})

const currentDoctor = reactive({
  id: null,
  name: '',
  phone_number: '',
  email: "",
  specialty_name: ""
});

// 加载科室列表
const loadTableData = () => {
  const queryParams = {
    ...paginationData,
    searchQuery: searchQuery.value
  };
  getAllDoctorInfo(queryParams).then(({data}) => {
    const {total, list} = data.data
    console.log(list, "科室数据")
    list.forEach(item => {
      item.created_at = item.created_at
          ? dayjs(item.created_at).format("YYYY-MM-DD")
          : "N/A"; // 默认显示"N/A"或其他占位符
    })
    tableData.list = list;
    tableData.total = total;
  });
};


function searchDoctors() {
  loadTableData();
}

function editDoctor(id) {
  // 编辑医生逻辑
  console.log('编辑医生', id);
}

function deleteDoctor(id) {
  // 删除医生逻辑
  console.log('删除医生', id);
}

function addDoctor() {
  // 新增医生逻辑
  console.log('新增医生');
}

onMounted(() => {
  loadTableData();
})
</script>

<style scoped>
.admin-doctors-management {
  padding: 20px;
  background-color: #f5f5f5;
}

.header {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.search-bar {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

th {
  background-color: #4CAF50;
  color: white;
}

button {
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>