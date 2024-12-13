<script setup>
import {reactive, onMounted} from 'vue'
import {getAllDepartmentInfo} from "../../../api/index.js"; // 这里需要你的接口
import dayjs from 'dayjs'

// 分页数据
const paginationData = reactive({
  pageNumber: 1,
  pageSize: 10
})

// 列表数据
const tableData = reactive({
  list: [],
  total: 0
})

// 编辑操作
const open = (row) => {
  console.log('编辑科室:', row)
}

// 加载科室列表
const loadDepts = () => {
  getAllDepartmentInfo(paginationData).then(({data}) => {
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

onMounted(() => {
  loadDepts();
})

</script>

<template>
  <p>这里是科室管理界面</p>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="name" label="科室名称"></el-table-column>
    <el-table-column prop="head" label="科室主任"></el-table-column>
    <el-table-column prop="phone_number" label="联系电话"></el-table-column>
    <el-table-column prop="address" label="科室地址"></el-table-column>
    <el-table-column prop="created_at" label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon>
            <Clock/>
          </el-icon>
          <span style="margin-left: 10px">{{ scope.row.created_at }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页部分 -->
  <el-pagination
      @current-change="(page) => {
      paginationData.pageNumber = page;
      loadDepts();
    }"
      @size-change="(size) => {
      paginationData.pageSize = size;
      loadDepts();
    }"
      :current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :total="tableData.total"
      layout="prev, pager, next, sizes, total"
      :page-sizes="[10, 20, 50, 100]"
  />
</template>

<style scoped>

</style>