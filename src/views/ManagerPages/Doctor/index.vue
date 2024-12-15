<template>
    <div class="admin-staff-management">
        <div class="header">医务人员管理</div>
        <div class="search-bar">
            <input type="text" placeholder="输入工号进行搜索" v-model="searchQuery" />
            <button class="hover-btn" @click="searchStaff">搜索</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>选择</th>
                    <th>工号</th>
                    <th>姓名</th>
                    <th>科室</th>
                    <th>职称</th>
                    <th>电话</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="staff in filteredStaff" 
                    :key="staff.id" 
                    class="staff-row"
                    @mouseover="hoveredRow = staff.id"
                    @mouseleave="hoveredRow = null"
                >
                    <td><input type="checkbox" v-model="selectedStaff" :value="staff.id" /></td>
                    <td>{{ staff.id }}</td>
                    <td>{{ staff.name }}</td>
                    <td>{{ staff.department }}</td>
                    <td>{{ staff.title }}</td>
                    <td>{{ staff.phone }}</td>
                    <td>
                        <el-button 
                            size="mini" 
                            class="action-btn edit-btn" 
                            @click="openEditDialog(staff)"
                        >
                            编辑
                        </el-button>
                        <el-button 
                            size="mini" 
                            type="danger" 
                            class="action-btn delete-btn"
                            @click="deleteStaff(staff.id)"
                        >
                            删除
                        </el-button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <!-- 分页组件可根据需求实现 -->
        </div>
        <button class="hover-btn" @click="openAddDialog">新增医务人员</button>
  
        <!-- 弹窗：新增/编辑医务人员 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑医务人员' : '新增医务人员'">
            <el-form :model="currentStaff" label-width="80px">
                <el-form-item label="工号">
                    <el-input v-model="currentStaff.id" :disabled="isEdit" placeholder="请输入工号" />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="currentStaff.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="科室">
                    <el-input v-model="currentStaff.department" placeholder="请输入科室" />
                </el-form-item>
                <el-form-item label="职称">
                    <el-input v-model="currentStaff.title" placeholder="请输入职称" />
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="currentStaff.phone" placeholder="请输入电话" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveStaff">确认</el-button>
            </div>
        </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // 模拟医务人员数据
  const staffList = ref([
    { id: '001', name: '张三', department: '内科', title: '主治医师', phone: '123-456-7890' },
    { id: '002', name: '李四', department: '外科', title: '副主任医师', phone: '234-567-8901' },
    { id: '003', name: '王五', department: '儿科', title: '主任医师', phone: '345-678-9012' },
    { id: '004', name: '赵六', department: '妇科', title: '住院医师', phone: '456-789-0123' },
    { id: '005', name: '孙七', department: '眼科', title: '主治医师', phone: '567-890-1234' },
    { id: '006', name: '周八', department: '耳鼻喉科', title: '主任医师', phone: '678-901-2345' }
  ]);
  
  const searchQuery = ref('');
  const hoveredRow = ref(null);
  
  const filteredStaff = computed(() => {
    return staffList.value.filter(staff =>
        staff.id.includes(searchQuery.value.trim())
    );
  });
  
  const selectedStaff = ref([]);
  const dialogVisible = ref(false);
  const currentStaff = ref({ id: '', name: '', department: '', title: '', phone: '' });
  const isEdit = ref(false);
  
  const searchStaff = () => {
    console.log('搜索工号:', searchQuery.value);
  };
  
  const openAddDialog = () => {
    isEdit.value = false;
    currentStaff.value = { id: '', name: '', department: '', title: '', phone: '' };
    dialogVisible.value = true;
  };
  
  const openEditDialog = (staff) => {
    isEdit.value = true;
    currentStaff.value = { ...staff };
    dialogVisible.value = true;
  };
  
  const saveStaff = () => {
    if (isEdit.value) {
        const index = staffList.value.findIndex(s => s.id === currentStaff.value.id);
        if (index !== -1) {
            staffList.value[index] = { ...currentStaff.value };
        }
    } else {
        staffList.value.push({ ...currentStaff.value });
    }
    dialogVisible.value = false;
  };
  
  const deleteStaff = (id) => {
    console.log('删除医务人员，工号:', id);
    const index = staffList.value.findIndex(staff => staff.id === id);
    if (index !== -1) {
        staffList.value.splice(index, 1);
    }
  };
  </script>
  
  <style scoped>
  .admin-staff-management {
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
  
  .staff-row {
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  
  .staff-row:hover {
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
  