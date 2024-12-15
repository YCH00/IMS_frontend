<script setup>
import {ref, reactive, onMounted} from 'vue'
import {
  getMenus,
  getMenusPaginated,
  createMenu,
  updateMenu,
  deleteMenu
} from '../../../api/index.js';
import {showMessage} from "../../../utils/message.js";
import dayjs from "dayjs";
import {ElMessage, ElMessageBox} from "element-plus";

// 分页数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})

// 列表数据
const tableData = reactive({
  list: [],
  total: 0,
})
const menuList = reactive({
  list: []
})

// 当前选中的菜单项(编辑时可用)
const currentMenu = reactive({
  id: null,
  name: "",
  parent_id: null,
  path: "",
  isParent: false // 标记是否为父节点
})

// 控制弹窗显示
const dialogVisible = ref(false);

// 搜索关键字
const searchQuery = ref('');


const handlePageChange = (page) => {
  paginationData.pageNum = page;
  loadMenuList();
};
const handleSizeChange = (size) => {
  paginationData.pageSize = size;
  loadMenuList();
};
// 加载菜单列表
const loadMenuList = () => {
  getMenusPaginated(paginationData).then(({data}) => {
    const {total, list} = data.data;
    console.log(list, "菜单list")
    tableData.list = list;
    tableData.total = total;
  });
};
const loadMenuListAll = () => {
  getMenus().then(({data}) => {
    const {list} = data.data;
    menuList.list = list;
  })
}

// 搜索菜单
const handleSearch = () => {
  loadMenuList();
};


// 打开新增/编辑菜单对话框
const openDialog = (menu = null) => {
  if (menu) {
    Object.assign(currentMenu, menu);
  } else {
    Object.assign(currentMenu, {
      id: null,
      name: '',
      parent_id: null,
      path: '',
      isParent: false
    });
  }
  dialogVisible.value = true;
};

// 提交菜单数据（新增或编辑）
const submitMenu = () => {
  const {id, ...menuData} = currentMenu;
  const action = id ? updateMenu(id, menuData) : createMenu(menuData);

  action.then(({data}) => {
    showMessage(data.message, "success");
    dialogVisible.value = false;
    loadMenuList();
  });
};

// 删除菜单
const handleDelete = (id) => {
  ElMessageBox.confirm('确认删除该菜单吗？', '提示', {type: 'warning'})
      .then(() => deleteMenu(id))
      .then(({data}) => {
        showMessage(data.message, "success");
        loadMenuList();
      });
};

// 初次加载
onMounted(() => {
  loadMenuList();
  loadMenuListAll();
});
</script>

<template>
  <el-row
      style="display: flex; justify-content: flex-end; margin-bottom: 20px; margin-top: 20px;">
    <!-- 左侧按钮 -->
    <el-col :span="12">
      <el-button
          type="primary"
          @click="openDialog()"
          style="margin-left: 20px">
        新增菜单
      </el-button>
    </el-col>

    <!-- 右侧搜索框 -->
    <el-col :span="12">
      <el-input
          v-model="searchQuery"
          placeholder="请输入菜单名称搜索"
          clearable
          suffix-icon="el-icon-search"
          @clear="loadMenuList"
          @keyup.enter.native="handleSearch"
          style="width: 300px;"
      />
    </el-col>
  </el-row>

  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="name" label="菜单名称"></el-table-column>
    <el-table-column prop="path" label="路径"></el-table-column>
    <el-table-column prop="created_at" label="创建时间"></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" size="small" @click="openDialog(scope.row)">
          编辑
        </el-button>
        <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row.id)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :total="tableData.total"
      layout="prev, pager, next, sizes, total"
      :page-sizes="[10, 20, 50, 100]"
  />

  <el-dialog
      v-model="dialogVisible"
      title="菜单管理"
      width="30%"
      :before-close="() => (dialogVisible = false)"
  >
    <el-form :model="currentMenu" label-width="100px">
      <el-form-item label="菜单名称">
        <el-input v-model="currentMenu.name"/>
      </el-form-item>
      <el-form-item label="是否为父节点">
        <el-checkbox v-model="currentMenu.isParent">是父节点</el-checkbox>
      </el-form-item>
      <el-form-item v-if="!currentMenu.isParent" label="父菜单ID">
        <el-select v-model="currentMenu.parent_id" placeholder="请选择父菜单">
          <el-option
              v-for="menu in menuList.list"
              :key="menu.id"
              :label="menu.name"
              :value="menu.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="路径">
        <el-input v-model="currentMenu.path"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitMenu">提交</el-button>
    </template>
  </el-dialog>
</template>



<style scoped>
.menu-manager {
  padding: 20px;
}
</style>