<template>
    <div class="admin-department-management">
      <div class="header">科室管理</div>
      <div class="search-bar">
        <input type="text" placeholder="输入科室ID进行搜索" v-model="searchQuery" />
        <button class="hover-btn" @click="searchDepts">搜索</button>
        <button class="hover-btn" @click="openAddDeptDialog">新增科室</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>选择</th>
            <th>科室ID</th>
            <th>科室名称</th>
            <th>科室主任</th>
            <th>科室电话</th>
            <th>科室地址</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="dept in paginatedDepts"
            :key="dept.id"
            class="dept-row"
            @mouseover="hoveredRow = dept.id"
            @mouseleave="hoveredRow = null"
          >
            <td><input type="checkbox" v-model="selectedDepts" :value="dept.id" /></td>
            <td>{{ dept.id }}</td>
            <td>{{ dept.name }}</td>
            <td>{{ dept.head }}</td>
            <td>{{ dept.phone_number }}</td>
            <td>{{ dept.address }}</td>
            <td>
              <el-button
                size="mini"
                class="action-btn edit-btn"
                @click="openEditDialog(dept)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                class="action-btn delete-btn"
                @click="deleteDept(dept.id)"
              >
                删除
              </el-button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- 分页组件 -->
      <el-pagination
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :current-page="paginationData.pageNumber"
        :page-size="paginationData.pageSize"
        :total="filteredDepts.length"
        layout="prev, pager, next, sizes, total"
        :page-sizes="[10, 20, 50, 100]"
      />
  
      <!-- 弹窗：新增/编辑科室 -->
      <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑科室' : '新增科室'">
        <el-form :model="currentDept" label-width="80px">
          <!-- 新增时显示科室ID -->
          <el-form-item label="科室ID" v-if="!isEdit">
            <el-input v-model="currentDept.id" placeholder="请输入科室ID" />
          </el-form-item>
          
          <el-form-item label="科室名称">
            <el-input v-model="currentDept.name" placeholder="请输入科室名称" />
          </el-form-item>
          <el-form-item label="科室主任">
            <el-input v-model="currentDept.head" placeholder="请输入科室主任" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="currentDept.phone_number" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="科室地址">
            <el-input v-model="currentDept.address" placeholder="请输入科室地址" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDept">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // 模拟科室数据
  const deptList = ref([
    { id: '001', name: '内科', head: '李主任', phone_number: '123-456-7890', address: '1号楼 101室' },
    { id: '002', name: '外科', head: '张主任', phone_number: '234-567-8901', address: '1号楼 102室' },
    { id: '003', name: '眼科', head: '王主任', phone_number: '345-678-9012', address: '2号楼 201室' },
    { id: '004', name: '牙科', head: '赵主任', phone_number: '456-789-0123', address: '3号楼 301室' },
  ]);
  
  const searchQuery = ref('');
  const hoveredRow = ref(null);
  const selectedDepts = ref([]);
  const dialogVisible = ref(false);
  const currentDept = ref({ id: '', name: '', head: '', phone_number: '', address: '' });
  const isEdit = ref(false);
  const paginationData = ref({ pageNumber: 1, pageSize: 10 });
  
  // 计算过滤后的科室列表
  const filteredDepts = computed(() => {
    return deptList.value.filter(dept =>
      dept.id.includes(searchQuery.value.trim())
    );
  });
  
  // 计算分页后的科室列表
  const paginatedDepts = computed(() => {
    const start = (paginationData.value.pageNumber - 1) * paginationData.value.pageSize;
    const end = start + paginationData.value.pageSize;
    return filteredDepts.value.slice(start, end);
  });
  
  // 搜索科室
  const searchDepts = () => {
    console.log('搜索科室ID:', searchQuery.value);
  };
  
  // 打开新增科室弹窗
  const openAddDeptDialog = () => {
    isEdit.value = false;
    currentDept.value = { id: '', name: '', head: '', phone_number: '', address: '' };
    dialogVisible.value = true;
  };
  
  // 打开编辑科室弹窗
  const openEditDialog = (dept) => {
    isEdit.value = true;
    currentDept.value = { ...dept };
    dialogVisible.value = true;
  };
  
  // 保存科室
  const saveDept = () => {
    if (isEdit.value) {
      const index = deptList.value.findIndex(d => d.id === currentDept.value.id);
      if (index !== -1) {
        deptList.value[index] = { ...currentDept.value };
      }
    } else {
      deptList.value.push({ ...currentDept.value });
    }
    dialogVisible.value = false;
  };
  
  // 删除科室
  const deleteDept = (id) => {
    const index = deptList.value.findIndex(dept => dept.id === id);
    if (index !== -1) {
      deptList.value.splice(index, 1);
    }
  };
  
  // 分页页码变化
  const handlePageChange = (page) => {
    paginationData.value.pageNumber = page;
  };
  
  // 分页每页条数变化
  const handleSizeChange = (size) => {
    paginationData.value.pageSize = size;
  };
  </script>
  
  <style scoped>
  .admin-department-management {
    width: 100%;
    padding: 20px;
    background-color: #f7f7f7;
  }
  
  .header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .search-bar input {
    width: 250px;
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
  }
  
  .search-bar button,
  .hover-btn {
    padding: 8px 16px;
    font-size: 14px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  /* 按钮之间的间隔 */
  .search-bar button + .hover-btn {
    margin-left: 10px; /* 增加间距 */
  }
  
  .hover-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  table th,
  table td {
    padding: 12px;
    text-align: center;
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
  }
  
  table th {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .dept-row {
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  
  .dept-row:hover {
    background-color: #f0f9ff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .dialog-footer {
    text-align: right;
  }
  
  .action-btn {
    transition: transform 0.2s ease, background-color 0.3s ease;
  }
  
  .action-btn:hover {
    transform: scale(1.1);
  }
  
  .delete-btn {
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
  }
  
  .delete-btn:hover {
    background-color: #d9363e;
  }
  </style>
  