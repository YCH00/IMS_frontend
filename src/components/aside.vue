<template>
    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="aside-container" default-active="2"
        text-color="#fff" @open="handleOpen" @close="handleClose" :collapse="isCollapse" 
        :style="{width: !isCollapse ? '230px' : '64px'}">
        <p class="logo-lg">{{ !isCollapse ? 'IMS同济医疗管理系统' : 'IMS'}}</p>
        <treeMenu :menuData="menuData" :index="1"></treeMenu>
    </el-menu>
</template>

<script lang="ts" setup>
import treeMenu from './treeMenu.vue';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const isCollapse = computed(() => store.state.menu.isCollapse)

const router = useRouter()

const menuData = reactive(router.options.routes[0].children)

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
    /* 垂直排列 */
    height: 100%;
}

.el-menu-vertical-demo {
    border: 1px solid #1f1f1f;
    /* 设置边框颜色 */
    flex-grow: 1;
    /* 占据剩余空间 */
}

.logo-lg {
    font-size: 18px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
}
</style>
