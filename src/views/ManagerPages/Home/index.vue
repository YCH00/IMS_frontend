<template>
    <div class="home-page">
        <div class="flex-box">
            <!-- 欢迎卡片 -->
            <Card class="welcome-card">
                <template #title>
                    <div class="welcome-card-title">欢迎管理员：</div>
                </template>
                <template #content>
                    <div>
                        <h3>您好，管理员</h3>
                        <p>当前时间：{{ currentTime }}</p>
                    </div>
                </template>
            </Card>

            <div class="data-cards">
                <div class="data-card" v-for="(data, index) in dataCards" :key="index">
                    <div class="data-icon">
                        <i :class="data.icon"></i>
                    </div>
                    <div class="data-content">
                        <div>
                            <span>{{ data.title }}</span>
                            <p>{{ data.value }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex-box">
            <!-- 折线图 -->
            <div class="line-charts-container">
                <Card class="line-chart-card">
                    <template #title>
                        <div class="card-title">过去10天总就诊人数</div>
                    </template>
                    <template #content>
                        <Line class="line-chart" :data="chartData" :options="chartOptions" />
                    </template>
                </Card>
            </div>
            <!-- 待处理事项 -->
            <div class="pending-tasks-container">
                <Card class="pending-tasks-card">
                    <template #title>
                        <!-- 在右上角新增一个加号按钮 -->
                        <div class="card-title"
                            style="display:flex; justify-content: space-between; align-items:center;">
                            <span>待处理事项</span>
                            <button class="add-task-btn" @click="showAddModal = true">
                                <i class="pi pi-plus"></i>
                            </button>
                        </div>
                    </template>
                    <template #content>
                        <ul>
                            <!-- 点击任务时弹出编辑弹窗 -->
                            <li v-for="(task, index) in pendingTasks" :key="index" class="task-item"
                                @click="openEditModal(task, index)">
                                <i class="pi pi-bell"></i>
                                <span>{{ task.description }}</span>
                            </li>
                        </ul>
                    </template>
                </Card>
            </div>
        </div>

        <!-- 新增待办事项的弹窗 -->
        <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
            <div class="modal-content">
                <h3>新增待办事项</h3>
                <input v-model="newTaskDescription" type="text" placeholder="输入新的待办事项..." class="modal-input" />
                <div class="modal-actions">
                    <button class="modal-btn" @click="addTask">确认</button>
                    <button class="modal-btn cancel" @click="closeAddModal">取消</button>
                </div>
            </div>
        </div>

        <!-- 编辑待办事项的弹窗 -->
        <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
            <div class="modal-content">
                <h3>编辑待办事项</h3>
                <input v-model="currentEditingTaskDescription" type="text" class="modal-input" />
                <div class="modal-actions">
                    <button class="modal-btn" @click="updateTask">保存修改</button>
                    <button class="modal-btn delete" @click="deleteTask">删除</button>
                    <button class="modal-btn cancel" @click="closeEditModal">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
// import { Card } from 'primevue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { getAdminData } from "../../../api/index.js"; // 这里需要你的接口

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default {
    name: 'AdminHome',
    components: {
        Line,
    },
    data() {
        return {
            // 图表数据
            chartData: {
                labels: ['2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05', '2024-11-06', '2024-11-07', '2024-11-08', '2024-11-09', '2024-11-10'],
                datasets: [
                    {
                        label: '总就诊人数',
                        data: [120, 150, 180, 170, 200, 210, 190, 220, 250, 230],
                        borderColor: '#42A5F5',
                        backgroundColor: 'rgba(66, 165, 245, 0.2)',
                        fill: true,
                        tension: 0.4,
                    },
                ],
            },
            // 图表配置
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index', // 使竖线生效
                    intersect: false, // 鼠标不需要完全悬停在点上
                },
                plugins: {
                    tooltip: {
                        enabled: true, // 启用工具提示
                        mode: 'index', // 工具提示显示当前x轴的所有数据
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                // 格式化工具提示的显示文本
                                return `${context.dataset.label}: ${context.raw}`;
                            },
                        },
                    },
                    legend: {
                        display: true,
                        position: 'top', // 图例位置
                    },
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '日期',
                        },
                        grid: {
                            drawOnChartArea: true, // 禁止绘制网格线
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '就诊人数',
                        },
                    },
                },
            },

            // 新增的数据属性
            showAddModal: false,
            showEditModal: false,
            newTaskDescription: '',
            currentEditingTaskIndex: null,
            currentEditingTaskDescription: '',
        };
    },
    setup() {
        const currentTime = ref('');

        const dataCards = ref([
            {
                title: '当前挂号人数',
                value: 120,
                icon: 'pi pi-users',
            },
            {
                title: '当前门诊医生数',
                value: 15,
                icon: 'pi pi-user',
            },
            {
                title: '当日累计就诊人数',
                value: 250,
                icon: 'pi pi-heart',
            },
            {
                title: '当日医院总入账',
                value: '¥10,000',
                icon: 'pi pi-dollar',
            },
        ]);

        const pendingTasks = ref([
            { description: '检查病人挂号资料' },
            { description: '安排医生会议' },
            { description: '检查病房清洁情况' },
        ]);

        const updateCurrentTime = () => {
            const now = new Date();
            currentTime.value = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        };

        onMounted(() => {
            updateCurrentTime();
            setInterval(updateCurrentTime, 1000);
        });

        return {
            currentTime,
            dataCards,
            pendingTasks,
        };
    },
    methods: {
        closeAddModal() {
            this.showAddModal = false;
            this.newTaskDescription = '';
        },
        addTask() {
            if (this.newTaskDescription.trim() !== '') {
                this.pendingTasks.push({ description: this.newTaskDescription });
                this.newTaskDescription = '';
                this.showAddModal = false;
            }
        },
        openEditModal(task, index) {
            this.currentEditingTaskIndex = index;
            this.currentEditingTaskDescription = task.description;
            this.showEditModal = true;
        },
        closeEditModal() {
            this.showEditModal = false;
            this.currentEditingTaskIndex = null;
            this.currentEditingTaskDescription = '';
        },
        updateTask() {
            if (this.currentEditingTaskIndex !== null && this.currentEditingTaskDescription.trim() !== '') {
                this.pendingTasks[this.currentEditingTaskIndex].description = this.currentEditingTaskDescription;
                this.closeEditModal();
            }
        },
        deleteTask() {
            if (this.currentEditingTaskIndex !== null) {
                this.pendingTasks.splice(this.currentEditingTaskIndex, 1);
                this.closeEditModal();
            }
        },
    },
};
</script>

<style scoped>
/* 样式总体布局 */
.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background-color: #f4f7fc;
}

.flex-box {
    display: flex;
}

.card-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
}

.card {
    flex: 1 1 220px;
    min-width: 220px;
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.card {
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
}

.welcome-card-title {
    text-align: left;
}

/* 为欢迎卡片添加悬停效果，与其他模块保持一致 */
.welcome-card:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

/* 图标和数值样式 */
.card .card-value {
    font-size: 24px;
    font-weight: bold;
    color: #555;
}

.card .card-icon {
    font-size: 36px;
    color: #42A5F5;
    margin-bottom: 10px;
}

.welcome-card {
    width: 100%;
    height: 200px;
    text-align: center;
    margin: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.welcome-card h3 {
    font-size: 22px;
    margin-bottom: 10px;
}

.welcome-card p {
    font-size: 14px;
    color: #777;
}

.data-cards {
    display: flex;
    justify-content: right;
    padding: 20px;
    width: 100%;
    margin-left: 50px;
}

.data-card {
    margin: 20px;
    margin-top: 0px;
    width: 200px;
    height: 200px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.data-card:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.data-icon {
    font-size: 30px;
    color: #42A5F5;
}

.data-content {
    margin-top: 10px;
}

.data-content span {
    font-weight: bold;
    font-size: 18px;
    color: #333;
}

.data-content p {
    font-size: 14px;
    color: #666;
}

.line-charts-container {
    width: 800px;
}

.line-chart-card {
    margin: 20px auto;
    margin-left: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.line-chart-card:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.line-chart-card .card-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
}

.line-chart {
    width: 100%;
    height: 400px;
}

.pending-tasks-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.pending-tasks-card {
    flex-grow: 1;
    width: 80%;
    max-width: 900px;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pending-tasks-card:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.pending-tasks-card .card-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
}

.pending-tasks-card ul {
    list-style-type: none;
    padding: 0;
}

.pending-tasks-card .task-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 16px;
}

.pending-tasks-card .task-item i {
    margin-right: 10px;
    font-size: 18px;
    color: #42A5F5;
}

.pending-tasks-card .task-item span {
    font-size: 16px;
    color: #333;
}

/* 待处理事项新增下划线功能 */
.pending-tasks-card .task-item span {
    position: relative;
    display: inline-block;
}

.pending-tasks-card .task-item span::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 2px;
    background-color: #42A5F5;
    transition: width 0.3s ease;
}

.pending-tasks-card .task-item:hover span::after {
    width: 100%;
}

/* 新增的按钮样式 */
.add-task-btn {
    background-color: #42A5F5;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.add-task-btn:hover {
    background-color: #1e88e5;
}

/* 弹窗样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    background: #fff;
    padding: 20px 30px;
    border-radius: 10px;
    width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.2s ease;
}

.modal-content h3 {
    margin-top: 0;
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
}

.modal-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.modal-btn {
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
    color: #fff;
    background-color: #42A5F5;
}

.modal-btn:hover {
    background-color: #1e88e5;
}

.modal-btn.cancel {
    background-color: #999;
}

.modal-btn.delete {
    background-color: #d9534f;
}

/* 弹窗动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>