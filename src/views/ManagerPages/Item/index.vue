<template>
    <div class="admin-tests-management">
      <!-- 页面标题 -->
      <div class="header">检查项目管理</div>
  
      <!-- 搜索框 -->
      <div class="search-bar">
        <input type="text" placeholder="搜索项目ID或名称" v-model="searchQuery" />
        <button class="hover-btn" @click="searchTests">搜索</button>
        <button class="hover-btn" @click="openAddTestDialog">新增检查项目</button>
      </div>
  
      <!-- 检查项目列表 -->
      <table>
        <thead>
          <tr>
            <th>选择</th>
            <th>项目ID</th>
            <th>检查项目名称</th>
            <th>价格</th>
            <th>是否有特殊检查</th>
            <th>库存数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="test in paginatedTests"
            :key="test.id"
            class="test-row"
            @mouseover="hoveredRow = test.id"
            @mouseleave="hoveredRow = null"
          >
            <td><input type="checkbox" v-model="selectedTests" :value="test.id" /></td>
            <td>{{ test.id }}</td>
            <td>{{ test.name }}</td>
            <td>{{ test.price }}</td>
            <td>{{ test.isSpecial ? '是' : '否' }}</td>
            <td>{{ test.num }}</td>
            <td>
              <el-button
                size="mini"
                class="action-btn edit-btn"
                @click="openEditDialog(test)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                class="action-btn delete-btn"
                @click="deleteTest(test.id)"
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
        :total="filteredTests.length"
        layout="prev, pager, next, sizes, total"
        :page-sizes="[10, 20, 50, 100]"
      />
  
      <!-- 弹窗：新增/编辑检查项目 -->
      <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑检查项目' : '新增检查项目'">
        <el-form :model="currentTest" label-width="80px">
          <el-form-item label="项目ID">
            <el-input
              v-model="currentTest.id"
              :disabled="isEdit"
              placeholder="自动生成项目ID"
            />
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input v-model="currentTest.name" placeholder="请输入检查项目名称" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="currentTest.price" placeholder="请输入价格" />
          </el-form-item>
          <el-form-item label="特殊检查">
            <el-switch v-model="currentTest.isSpecial" active-text="是" inactive-text="否" />
          </el-form-item>
          <el-form-item label="库存数量">
            <el-input v-model="currentTest.num" placeholder="请输入库存数量" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTest">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // 模拟检查项目数据
  const tests = ref([
    { id: 'T001', name: 'CT扫描', price: '500.0', isSpecial: true, num: 50 },
    { id: 'T002', name: 'X光检查', price: '150.0', isSpecial: false, num: 200 },
    { id: 'T003', name: 'MRI检查', price: '1200.0', isSpecial: true, num: 30 },
    { id: 'T004', name: '血液检查', price: '100.0', isSpecial: false, num: 500 },
    { id: 'T005', name: '超声波检查', price: '300.0', isSpecial: false, num: 150 },
    { id: 'T006', name: '心电图', price: '200.0', isSpecial: false, num: 100 },
    { id: 'T007', name: '胃镜检查', price: '800.0', isSpecial: true, num: 20 },
    { id: 'T008', name: '肺功能测试', price: '350.0', isSpecial: false, num: 80 },
  ]);
  
  // 搜索框输入数据
  const searchQuery = ref('');
  const hoveredRow = ref(null);
  const selectedTests = ref([]);
  
  // 过滤后的检查项目列表
  const filteredTests = computed(() => {
    return tests.value.filter(test =>
      test.id.includes(searchQuery.value.trim()) || test.name.includes(searchQuery.value.trim())
    );
  });
  
  // 分页数据
  const paginationData = ref({ pageNumber: 1, pageSize: 10 });
  
  // 当前操作的检查项目
  const currentTest = ref({ id: '', name: '', price: '', isSpecial: false, num: '' });
  const dialogVisible = ref(false);
  const isEdit = ref(false);
  
  // 计算分页后的检查项目列表
  const paginatedTests = computed(() => {
    const start = (paginationData.value.pageNumber - 1) * paginationData.value.pageSize;
    const end = start + paginationData.value.pageSize;
    return filteredTests.value.slice(start, end);
  });
  
  // 搜索功能
  const searchTests = () => {
    console.log('搜索查询:', searchQuery.value);
  };
  
  // 打开新增检查项目弹窗
  const openAddTestDialog = () => {
    isEdit.value = false;
    currentTest.value = { id: '', name: '', price: '', isSpecial: false, num: '' };
    dialogVisible.value = true;
  };
  
  // 打开编辑检查项目弹窗
  const openEditDialog = (test) => {
    isEdit.value = true;
    currentTest.value = { ...test }; // 保证项目ID不能修改
    dialogVisible.value = true;
  };
  
  // 保存检查项目
  const saveTest = () => {
    if (isEdit.value) {
      const index = tests.value.findIndex(t => t.id === currentTest.value.id);
      if (index !== -1) {
        tests.value[index] = { ...currentTest.value };
      }
    } else {
      // 自动生成项目ID
      currentTest.value.id = `T${(tests.value.length + 1).toString().padStart(3, '0')}`;
      tests.value.push({ ...currentTest.value });
    }
    dialogVisible.value = false;
  };
  
  // 删除检查项目
  const deleteTest = (id) => {
    const index = tests.value.findIndex(test => test.id === id);
    if (index !== -1) {
      tests.value.splice(index, 1);
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
  .admin-tests-management {
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
  
  .search-bar button + .hover-btn {
    margin-left: 10px;
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
  
  .test-row {
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  
  .test-row:hover {
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
  