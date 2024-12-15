<template>
  <div class="common-layout">
    <el-container>
      <Aside></Aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
        <RouterView/>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from '../components/aside.vue'
import Header from '../components/navHeader.vue'
</script>

<style lang="less" scoped>
.el-header {
  padding: 0;
}

.common-layout {
  height: 100%;

  .el-container {
    height: 100%;
  }
}

</style>