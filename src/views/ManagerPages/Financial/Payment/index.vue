<template>
    <div class="payment-platform">
        <div class="header">缴费平台</div>
        <div class="payment-form">
            <h3>录入缴费信息</h3>
            <input type="text" placeholder="患者姓名" v-model="newPayment.patientName" />
            <input type="text" placeholder="缴费项目" v-model="newPayment.paymentItem" />
            <input type="number" placeholder="缴费金额" v-model="newPayment.amount" />
            <button @click="addPayment">录入缴费</button>
        </div>
        <table class="payment-table">
            <thead>
                <tr>
                    <th>患者姓名</th>
                    <th>缴费项目</th>
                    <th>缴费金额</th>
                    <th>缴费日期</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="payment in payments" :key="payment.id">
                    <td>{{ payment.patientName }}</td>
                    <td>{{ payment.paymentItem }}</td>
                    <td>{{ payment.amount }}</td>
                    <td>{{ payment.date }}</td>
                    <td>
                        <button @click="deletePayment(payment.id)" class="delete-button">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const newPayment = ref({ patientName: '', paymentItem: '', amount: 0 });
const payments = ref([
    { id: 1, patientName: '张三', paymentItem: '挂号费', amount: 50, date: '2024-06-10' },
    // ...其他缴费记录
]);

function addPayment() {
    if (newPayment.value.patientName && newPayment.value.paymentItem && newPayment.value.amount > 0) {
        const newId = payments.value.length ? Math.max(...payments.value.map(p => p.id)) + 1 : 1;
        payments.value.push({
            id: newId,
            ...newPayment.value,
            date: new Date().toISOString().split('T')[0]
        });
        newPayment.value.patientName = '';
        newPayment.value.paymentItem = '';
        newPayment.value.amount = 0;
    }
}

function deletePayment(id) {
    const index = payments.value.findIndex(p => p.id === id);
    if (index !== -1) {
        payments.value.splice(index, 1);
    }
}
</script>

<style scoped>
.payment-platform {
    padding: 20px;
    background-color: #f7f7f7;
}

.header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
}

.payment-form {
    margin-bottom: 20px;
}

.payment-form h3 {
    margin-bottom: 10px;
}

.payment-form input {
    margin-right: 10px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.payment-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.payment-table th,
.payment-table td {
    padding: 12px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
}

.payment-table th {
    background-color: #f5f5f5;
    color: #333;
}

.payment-table td {
    color: #666;
}

.delete-button {
    background-color: #d9534f;
    /* 红色 */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.delete-button:hover {
    background-color: #c9302c;
    /* 深红色 */
}
</style>