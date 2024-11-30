<script setup>
import {ref, reactive} from 'vue'

// form的数据
const form = reactive({
  name: '',
  permissions: ''
})

// 弹窗的显示隐藏
const dialogFormvisable = ref(false)

// 关闭弹窗的回调
const beforeclose = () => {
  dialogFormvisable.value = false
}
</script>

<template>
  <button @click="dialogFormvisable = true">打开</button>
  <el-dialog v-model="dialogFormvisable"
             :before-close="beforeclose"
             title="添加权限"
             width="500px">
    <el-form
        ref="formRef"
        label-width="100px"
        label-position="left"
        :model="form">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称"/>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
      </el-form-item>
    </el-form>
  </el-dialog>
  <p>这里是菜单管理界面</p>
</template>

<style scoped>

</style>