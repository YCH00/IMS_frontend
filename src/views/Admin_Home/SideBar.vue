<template>
  <el-scrollbar>
    <el-menu :default-openeds="['1']" router>
      <!-- 首页 -->
      <el-menu-item index="/home">
        <el-icon>
          <house/>
        </el-icon>
        首页
      </el-menu-item>

      <!-- 用户管理 -->
      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <user/>
          </el-icon>
          用户管理
        </template>
        <el-menu-item-group title="用户操作">
          <el-menu-item index="/user/list">用户列表</el-menu-item>
          <el-menu-item index="/user/add">新增用户</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <!-- 科室管理 -->
      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <office-building/>
          </el-icon>
          科室管理
        </template>
        <el-menu-item-group title="科室操作">
          <el-menu-item index="/department/list">科室列表</el-menu-item>
          <el-menu-item index="/department/add">新增科室</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <!-- 医生管理 -->
      <el-sub-menu index="4">
        <template #title>
          <el-icon>
            <medal/>
          </el-icon>
          医生管理
        </template>
        <el-menu-item-group title="医生操作">
          <el-menu-item index="/doctor/list">医生列表</el-menu-item>
          <el-menu-item index="/doctor/add">新增医生</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import {
  House, User, OfficeBuilding, Medal
} from '@element-plus/icons-vue'

</script>

<style scoped>

</style>