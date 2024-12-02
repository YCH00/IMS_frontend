<script setup>
import {ref, reactive, onMounted} from 'vue'
import {
  getRoles,
  getRolesPaginated,
  createRole,
  updateRole,
  deleteRole,
  getMenus
} from '../../../api/index.js';
import {showMessage} from "../../../utils/message.js";
import {ElMessage, ElMessageBox} from "element-plus";

// 分页数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})

// 角色列表数据
const tableData = reactive({
  list: [],
  total: 0
})

// 当前选中的角色及其权限
const currentRole = reactive({
  id: null,
  name: '',
  description: '',
  permissions: [], // 当前角色的菜单权限
});

// 所有菜单权限数据
const menus = ref([]);

// 控制弹窗显示
const dialogVisible = ref(false);
const permissionsDialogVisible = ref(false);

// 搜索关键字
const searchQuery = ref('');

// 加载角色列表
const loadRoles = () => {
  getRolesPaginated(paginationData).then(({data}) => {
    const {total, list} = data.data;
    tableData.list = list;
    tableData.total = total;
    console.log(tableData, "表格数据")
  });
};

// 加载所有菜单权限
const loadMenuPermissions = () => {
  getMenus().then(({data}) => {
    menus.value = data.data;
  });
};

// 搜索角色
const handleSearch = () => {
  loadRoles();
};

// 打开新增/编辑角色对话框
const openDialog = (role = null) => {
  if (role) {
    // 编辑模式
    Object.assign(currentRole, role);
  } else {
    // 新增模式
    Object.assign(currentRole, {
      id: null,
      name: "",
      description: "",
      permissions: [],
    });
  }
  dialogVisible.value = true;
};

// 打开分配权限对话框
const openPermissionsDialog = (role) => {
  Object.assign(currentRole, role);
  // 加载角色当前的权限
  // getRolePermissions(role.id).then(({data}) => {
  //   currentRole.permissions = data.data.map((perm) => perm.id);
  //   permissionsDialogVisible.value = true;
  // });
};

// 提交角色数据（新增或编辑）
const submitRole = () => {
  const {id, ...roleData} = currentRole;

  if (id) {
    // 更新
    updateRole(id, roleData).then(() => {
      showMessage("角色更新成功", "success");
      loadRoles();
      dialogVisible.value = false;
    });
  } else {
    // 新增
    createRole(roleData).then(() => {
      showMessage("角色新增成功", "success");
      loadRoles();
      dialogVisible.value = false;
    });
  }
};

// 删除角色
const handleDelete = (id, name) => {
  if (name === 'admin' || name === '超级管理员') {
    showMessage("超级管理员角色不可删除", "warning")
    return;
  }
  ElMessageBox.confirm("确定要删除该角色吗？", "提示", {type: "warning"}).then(() => {
    deleteRole(id).then(() => {
      showMessage("角色删除成功", "success");
      loadRoles();
    });
  }).catch(() => {
  });
};

// 提交权限分配
const submitPermissions = () => {
  // assignPermissionsToRole(currentRole.id, currentRole.permissions).then(() => {
  //   showMessage('角色权限分配成功', 'success');
  //   permissionsDialogVisible.value = false;
  // });
};

// 初次加载
onMounted(() => {
  loadRoles();
  loadMenuPermissions();
});
</script>

<template>

  <el-row style="margin-bottom: 20px; margin-top: 20px;">
    <el-col :span="12">
      <el-button type="primary" @click="openDialog()" style="margin-left: 20px">新增角色</el-button>
    </el-col>

    <el-col :span="12">
      <el-input
          v-model="searchQuery"
          placeholder="请输入角色名称搜索"
          clearable
          suffix-icon="el-icon-search"
          @clear="loadRoles"
          @keyup.enter.native="handleSearch"
          style="width: 300px;"
      ></el-input>
    </el-col>
  </el-row>

  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="name" label="角色名称"></el-table-column>
    <el-table-column prop="description" label="描述"></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" size="small" @click="openDialog(scope.row)">编辑</el-button>
        <el-button
            type="success"
            size="small"
            @click="openPermissionsDialog(scope.row)"
        >
          分配权限
        </el-button>
        <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row.id, scope.row.name)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
      @current-change="(page) => {
      paginationData.pageNum = page;
      loadRoles();
    }"
      @size-change="(size) => {
      paginationData.pageSize = size;
      loadRoles();
    }"
      :current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :total="tableData.total"
      layout="prev, pager, next, sizes, total"
      :page-sizes="[10, 20, 50, 100]"
  />

  <!-- 新增/编辑角色对话框 -->
  <el-dialog v-model="dialogVisible" title="角色管理" width="30%">
    <el-form :model="currentRole" label-width="100px">
      <el-form-item label="角色名称">
        <el-input v-model="currentRole.name"/>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="currentRole.description"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitRole">提交</el-button>
    </template>
  </el-dialog>

  <!-- 分配权限对话框 -->
  <el-dialog v-model="permissionsDialogVisible" title="分配权限" width="30%">
    <el-checkbox-group v-model="currentRole.permissions">
      <el-checkbox
          v-for="permission in menuPermissions"
          :key="permission.id"
          :label="permission.id"
      >
        {{ permission.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button @click="permissionsDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitPermissions">提交</el-button>
    </template>
  </el-dialog>

</template>

<style scoped>

</style>