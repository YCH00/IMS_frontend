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
                        <Clock />
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
    <el-pagination @current-change="(page) => {
        paginationData.pageNumber = page;
        loadDepts();
    }" @size-change="(size) => {
        paginationData.pageSize = size;
        loadDepts();
    }" :current-page="paginationData.pageNum" :page-size="paginationData.pageSize" :total="tableData.total"
        layout="prev, pager, next, sizes, total" :page-sizes="[10, 20, 50, 100]" />
</template>


<script setup>
import { reactive, onMounted } from 'vue'
import { getAllDepartmentInfo } from "../../../api/index.js"; // 这里需要你的接口
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
    getAllDepartmentInfo(paginationData).then(({ data }) => {
        const { total, list } = data.data
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

.search-bar button {
    padding: 8px 16px;
    font-size: 14px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.search-bar button:hover {
    background-color: #66b1ff;
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

table td button {
    padding: 5px 10px;
    background-color: #f0ad4e;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

table td button:hover {
    background-color: #ec971f;
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination button {
    padding: 6px 12px;
    font-size: 14px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    margin: 0 5px;
    cursor: pointer;
}

.pagination button:hover {
    background-color: #66b1ff;
}

button {
    padding: 8px 16px;
    font-size: 14px;
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #4cae4c;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
