<template>
  <tempalte v-for="(item, index) in props.menuData">
    <!--  有子菜单  -->
    <el-menu-item
        v-if="!item.children || item.children === 0"
        :index="`${props.index}-${item.meta.id}`"
        :key="`${props.index}-${item.meta.id}`"
        @click="handleClick(item, `${props.index}-${item.meta.id}`)">
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>

    <!--  有子菜单  -->
    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <tree-menu :index="`${props.index}-${item.meta.id}`" :menuData="item.children"/>
    </el-sub-menu>
  </tempalte>
</template>

<script setup>
// 动态树形菜单
import {useRouter} from 'vue-router'
import {useStore} from 'vuex';

const props = defineProps(['menuData', "index"])

const router = useRouter()
const store = useStore()

// 点击菜单处理函数
const handleClick = (item, active) => {
  store.commit('addMenu', item.meta)
  router.push(item.meta.path)
  console.log(item.meta.path, "path")
}


</script>

<style scoped></style>