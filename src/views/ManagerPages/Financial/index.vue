<template>
    <div class="financial-management-home">
        <div class="module" v-for="module in modules" :key="module.name">
            <h2>{{ module.name }}</h2>
            <p>{{ module.description }}</p>
            <button @click="navigateToModule(module.path)">{{ module.buttonText }}</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const modules = ref([
    { name: '酬金发放', description: '管理医务人员的酬金发放', buttonText: '进入', path: '/admin/financial/salary-payment' },
    { name: '财政拨款', description: '管理医院的财政拨款', buttonText: '进入', path: '/admin/financial/financial-allocation' },
    { name: '报销平台', description: '处理医院的报销事宜', buttonText: '进入', path: '/admin/financial/reimbursement' },
    { name: '缴费平台', description: '管理患者的缴费情况', buttonText: '进入', path: '/admin/financial/payment-platform' }
]);

function navigateToModule(path) {
    console.log('path: ', path);
    router.push(path);
}
</script>

<style scoped>
.financial-management-home {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 20px;
    background-color: #f7f7f7;
}

.module {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 10px;
    width: 300px;
    text-align: center;
}

.module h2 {
    color: #333;
}

.module p {
    color: #666;
}

.module button {
    background-color: #409eff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.module button:hover {
    background-color: #66b1ff;
}
</style>