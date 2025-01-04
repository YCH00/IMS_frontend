<template>
    <div class="doctor-personal-info-management">
        <!-- <div class="header">个人信息管理</div> -->
        <div class="info-card">
            <h3>个人信息</h3>
            <p>姓名：{{ doctorInfo.name }}</p>
            <p>性别：{{ doctorInfo.gender }}</p>
            <p>年龄：{{ doctorInfo.age }}</p>
            <p>专业领域：{{ doctorInfo.dept }}</p>
            <p>联系方式：{{ doctorInfo.contact }}</p>
            <button @click="openEditDialog">编辑信息</button>
            <button @click="openKeyDialog">修改密码</button>
        </div>

        <Dialog :visible.sync="editDialogVisible" :closable="false" :style="{ width: '400px' }">
            <div class="dialog-form">
                <div class="dialog-header">
                    <h3>编辑个人信息</h3>
                </div>
                <div class="form-group">
                    <label>姓名:</label>
                    <InputText v-model="editDoctorInfo.name" />
                </div>
                <div class="form-group">
                    <label>性别:</label>
                    <InputText v-model="editDoctorInfo.gender" />
                </div>
                <div class="form-group">
                    <label>年龄:</label>
                    <InputText v-model="editDoctorInfo.age" type="number" />
                </div>
                <div class="form-group">
                    <label>科室:</label>
                    <InputText v-model="editDoctorInfo.dept" />
                </div>
                <div class="form-group">
                    <label>联系方式:</label>
                    <InputText v-model="editDoctorInfo.contact" />
                </div>
            </div>
            <template #footer>
                <Button @click="editDialogVisible = false" label="取消" class="p-button-secondary" />
                <Button @click="updateDoctorInfo" label="保存" class="p-button-success" />
            </template>
        </Dialog>
        <Dialog :visible.sync="keyDialogVisible" :closable="false" :style="{ width: '400px' }">
            <div class="dialog-form">
                <div class="dialog-header">
                    <h3>修改密码</h3>
                </div>
                <div class="form-group">
                    <label>请输入旧密码：</label>
                    <InputText v-model="editKey.oldKey" />
                </div>
                <div class="form-group">
                    <label>请输入新密码：</label>
                    <InputText v-model="editKey.newKey1" />
                </div>
                <div class="form-group">
                    <label>请确认新密码：</label>
                    <InputText v-model="editKey.newKey2" />
                </div>
            </div>
            <template #footer>
                <Button @click="keyDialogVisible = false" label="取消" class="p-button-secondary" />
                <Button @click="updateKeyInfo" label="确定" class="p-button-success" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Dialog, Button, InputText } from 'primevue';
import { showMessage } from "../../../utils/message.js";
import {getDoctorProfile, alterDoctorProfile} from "../../../api/index.js"; // 这里需要你的接口\
import {ElNotification} from 'element-plus';
const doctorInfo = ref({
    name: '张医生',
    gender: '男',
    age: 45,
    dept: '内科',
    contact: '1234567890'
});

const editKey = ref({
    oldKey: '',
    newKey1: '',
    newKey2: ''
})

const editDialogVisible = ref(false);
const editDoctorInfo = ref({ ...doctorInfo.value });
const keyDialogVisible = ref(false);

const loadData = () => {
    getDoctorProfile().then(({data}) => {
    doctorInfo.value = data.data
  });
};

onMounted(() => {
    loadData();
})

function openEditDialog() {
    editDoctorInfo.value = { ...doctorInfo.value };
    editDialogVisible.value = true;
}

function updateDoctorInfo() {
    alterDoctorProfile(editDoctorInfo.value).then((res) => {
        if (res.data.data.success) {
            // 编辑成功弹窗
            ElNotification({
                title: '编辑成功',
                message: '编辑成功',
                type: 'success',  // 'success', 'warning', 'info', 'error'
                duration: 1500,  // 3秒后自动关闭
                });
            loadData();
        } else {
            // 编辑失败弹窗
                ElNotification({
                title: '编辑失败',
                message: '编辑失败',
                type: 'error',  // 'success', 'warning', 'info', 'error'
                duration: 1500,  // 3秒后自动关闭
            });
        }
    });
    // doctorInfo.value = { ...editDoctorInfo.value };    
    editDialogVisible.value = false;
}

function openKeyDialog() {
    keyDialogVisible.value = true;
}

function updateKeyInfo() {
   
    if (editKey.value.newKey1 != editKey.value.newKey2) {
        showMessage("两次新密码不一致", "warning");
    }
    else if (editKey.value.newKey1 == '') {
        showMessage("新密码不能为空", "warning");
    }
    else {
         //todo: 给后端发请求，（旧密码&新密码），根据返回值进行判断
        editKey.value = {
            oldKey: '',
            newKey1: '',
            newKey2: ''
        }
        showMessage("修改成功", "success");
        keyDialogVisible.value = false;
    }

}
</script>

<style scoped>
.doctor-personal-info-management {
    width: 100%;
    padding: 20px;
    background-color: #f7f7f7f7;
}

.header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
}

.info-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
    font-size: 20px;
    margin-bottom: 10px;
}

.info-card p {
    margin: 5px 0;
    font-size: 16px;
    color: #666;
}

.info-card button {
    margin-top: 10px;
    margin-right: 10px;
    padding: 10px 20px;
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.dialog-form {
    padding: 20px;
}

.dialog-header {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #000000;
}

.form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}

.form-group label {
    color: #333;
    font-weight: bold;
}

.p-button-secondary {
    background-color: #f0f0f0;
    color: #333;
    margin-right: 10px;
}

.p-button-success {
    background-color: #4CAF50;
    color: white;
}
</style>