<template>
  <div>
    <img src="../../assets/img.png" alt="" height="30">
    <span>电商后台管理系统</span>
  </div>
  <el-button type="info" @click="logout">退出</el-button>
</template>

<script setup lang="ts">
import {ElNotification as notify} from 'element-plus'

const onBack = () => {
  notify('Back')
}
</script>

<style>
.el-header {
  background-color: #363D40;
  display: flex;
  justify-content: space-between;
}


.el-header {
  background-color: #363D40;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

</style>
