<template>
    <div class="common-layout">
      <el-container>
        <el-aside width="200px">
            <common-aside/>
        </el-aside>
        <el-container>
          <el-header>Header</el-header>
          <el-main>Main</el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script>
import CommonAside from "../../components/commonSider.vue"
export default{
    data(){
        return {}
    },
    components:{
        CommonAside
    }
}

</script>


