<template>
    <div class="doctor-personal-info-management">
        <div class="header">个人信息管理</div>
        <div class="info-card">
            <h3>个人信息</h3>
            <p>姓名：{{ doctorInfo.name }}</p>
            <p>性别：{{ doctorInfo.gender }}</p>
            <p>年龄：{{ doctorInfo.age }}</p>
            <p>专业领域：{{ doctorInfo.specialty }}</p>
            <p>联系方式：{{ doctorInfo.contact }}</p>
            <button @click="openEditDialog">编辑信息</button>
        </div>

        <Dialog :visible.sync="editDialogVisible" :closable="true" :style="{ width: '400px' }">
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
                    <InputText v-model="editDoctorInfo.specialty" />
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
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Dialog, Button, InputText } from 'primevue';

const doctorInfo = ref({
    name: '张医生',
    gender: '男',
    age: 45,
    specialty: '内科',
    contact: '1234567890'
});

const editDialogVisible = ref(false);
const editDoctorInfo = ref({ ...doctorInfo.value });

function openEditDialog() {
    editDoctorInfo.value = { ...doctorInfo.value };
    editDialogVisible.value = true;
}

function updateDoctorInfo() {
    doctorInfo.value = { ...editDoctorInfo.value };
    editDialogVisible.value = false;
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
    color: #f0eaea;
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