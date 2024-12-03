<template>
  <div class="menu-manager">
    <el-button type="primary" @click="showAddDialog">添加菜单项</el-button>
    <el-table :data="menuItems" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="url" label="链接"></el-table-column>
      <el-table-column prop="icon" label="图标"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="editMenuItem(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteMenuItem(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加菜单项对话框 -->
    <el-dialog :visible.sync="addDialogVisible" title="添加菜单项">
      <el-form :model="newMenuItem">
        <el-form-item label="标题">
          <el-input v-model="newMenuItem.title"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="newMenuItem.url"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="newMenuItem.icon"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenuItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const menuItems = ref([
      { id: 1, title: '首页', url: '/', icon: 'home' },
      { id: 2, title: '关于我们', url: '/about', icon: 'info' },
    ]);

    const newMenuItem = ref({ id: null, title: '', url: '', icon: '' });
    const addDialogVisible = ref(false);

    const showAddDialog = () => {
      newMenuItem.value = { id: null, title: '', url: '', icon: '' };
      addDialogVisible.value = true;
    };

    const addMenuItem = () => {
      menuItems.value.push({ ...newMenuItem.value, id: Date.now() });
      addDialogVisible.value = false;
    };

    const editMenuItem = (index, row) => {
      newMenuItem.value = { ...row };
      addDialogVisible.value = true;
    };

    const deleteMenuItem = (index, row) => {
      menuItems.value.splice(index, 1);
    };

    return {
      menuItems,
      newMenuItem,
      addDialogVisible,
      showAddDialog,
      addMenuItem,
      editMenuItem,
      deleteMenuItem,
    };
  },
};
</script>

<style scoped>
.menu-manager {
  padding: 20px;
}
</style>