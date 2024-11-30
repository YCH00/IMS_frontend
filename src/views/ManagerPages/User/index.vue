<script setup>
import {reactive, onMounted} from 'vue'
import {getAllUserInfo} from "../../../api/index.js";
import dayjs from 'dayjs'

// 分页数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})
// 列表数据
const tableData = reactive({
  list: [],
  total: 0
})

const open = () => {
}


onMounted(() => {
  getAllUserInfo(paginationData).then(({data}) => {
    const {total, list} = data.data
    console.log(list, "解析后的数据")
    list.forEach(item => {
      item.created_at = item.created_at
          ? dayjs(item.created_at).format("YYYY-MM-DD")
          : "N/A"; // 默认显示"N/A"或其他占位符
    })
    tableData.list = list;
    tableData.total = total;
  })
})
</script>

<template>
  <el-table :data="tableData.list" style="width: 180%">
    <el-table-column prop="id" label="id"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="gender" label="性别"></el-table-column>
    <el-table-column prop="age" label="年龄"></el-table-column>
    <el-table-column prop="id_card" label="身份证号"></el-table-column>
    <el-table-column prop="phone_number" label="手机号码"></el-table-column>
    <el-table-column prop="address" label="住址"></el-table-column>
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
</template>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
</style>