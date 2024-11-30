<template>
  <el-container class="app-container">

    <!--头部-->
    <el-header class="app-header">
      <HeaderBar></HeaderBar>
    </el-header>

    <el-container>
      <!--侧边栏-->
      <el-aside class="app-sidebar">
        <SideBar></SideBar>
      </el-aside>

      <!--主体-->
      <el-main class="app-content">
        <el-scrollbar>
          <el-table :data="tableData">
            <el-table-column prop="date" label="Date" width="140"/>
            <el-table-column prop="name" label="Name" width="120"/>
            <el-table-column prop="address" label="Address"/>
          </el-table>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import SideBar from "./SideBar.vue";
import HeaderBar from "./HeaderBar.vue";
import {ref} from "vue";
import {Setting} from "@element-plus/icons-vue";

const item = {
  date: "2016-05-02",
  name: "Tom",
  address: "No. 189, Grove St, Los Angeles",
};
const tableData = ref(Array.from({length: 20}).fill(item));
</script>

<style scoped>
/* 设置容器铺满整个屏幕 */
.app-container {
  height: 100vh;
  width: 100vw;
  //display: flex;
}

/* 左侧侧边栏铺满高度 */
.app-sidebar {
  width: 200px;
  height: 100%;
  background-color: var(--el-color-primary-light-8);
  color: var(--el-text-color-primary);
}

.app-content {
  padding: 0;
  height: calc(100vh - 64px); /* 减去头部高度 */
  overflow: hidden;
}

/* 工具栏样式 */
.header-toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-right: 20px;
}

.app-sidebar {
  width: 200px;
  height: 100%;
  background-color: var(--el-color-primary-light-8);
  color: var(--el-text-color-primary);
  font-weight: bold; /* 加粗字体 */
}

.app-header {
  background-color: rgba(37, 86, 165, 0.64); /* 替换为你的头部背景颜色 */
  color: #000; /* 替换为文字颜色 */
}
</style>
