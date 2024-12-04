<template>
  <el-menu
      class="aside-container"
      :style="{width: !isCollapse ? '230px' : '65px'}"
      :default-active="'2'"
      :collapse="isCollapse"
      :active-text-color="'#ffd04b'"
      :background-color="'#545c64'"
      :text-color="'#fff'"
      @open="handleOpen"
      @close="handleClose"
  >
    <p class="logo-lg">{{ !isCollapse ? 'IMS同济医疗管理系统' : 'IMS' }}</p>
    <treeMenu :menuData="menuData" :index="1"></treeMenu>
  </el-menu>
</template>

<script lang="ts" setup>
import treeMenu from './treeMenu.vue';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {ref, computed} from 'vue';

const store = useStore()
const isCollapse = computed(() => store.state.menu.isCollapse)

const router = useRouter()

const menuData = ref(router.options.routes[0].children)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>


<style lang="less" scoped>

.aside-container {
  display: flex;
  flex-direction: column;
  height: 1200px;

  .logo-lg {
    font-size: 15px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}

.el-menu-vertical-demo {
  border: 1px solid #1f1f1f;
  flex-grow: 1;
}


</style>
