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
                    <template #title>过去10天总就诊人数</template>
                    <template #content>
                        <Line class="line-chart" :data="chartData" :options="chartOptions" />
                    </template>
                </Card>
            </div>
            <!-- 待处理事项 -->
            <div class="pending-tasks-container">
                <Card class="pending-tasks-card">
                    <template #title>待处理事项</template>
                    <template #content>
                        <ul>
                            <li v-for="(task, index) in pendingTasks" :key="index" class="task-item">
                                <i class="pi pi-bell"></i>
                                <span>{{ task.description }}</span>
                            </li>
                        </ul>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import { Card } from 'primevue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
// 注册Chart.js所需要的模块
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
                labels: ['2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05', '2024-11-06', '2024-11-07', '2024-11-08', '2024-11-09', '2024-11-10'], // 日期标签
                datasets: [
                    {
                        label: '总就诊人数',
                        data: [120, 150, 180, 170, 200, 210, 190, 220, 250, 230], // 假设的就诊人数数据
                        borderColor: '#42A5F5',
                        backgroundColor: 'rgba(66, 165, 245, 0.2)',
                        fill: true,
                        tension: 0.4, // 曲线的平滑度
                    },
                ],
            },
            // 图表配置
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2, // 根据需要设置合适的宽高比
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '日期',
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
                plugins: {
                    title: {
                        display: false,
                        text: '过去10天总就诊人数',
                        font: {
                            size: 18,
                            weight: 'bold',
                        },
                    },
                },
            },
        };
    },

    setup() {
        // 当前时间变量
        const currentTime = ref('');

        // 数据展示卡片的数据
        const dataCards = ref([
            {
                title: '当前挂号人数',
                value: 120,  // 假设值
                icon: 'pi pi-users',
            },
            {
                title: '当前门诊医生数',
                value: 15,  // 假设值
                icon: 'pi pi-user-md',
            },
            {
                title: '当日累计就诊人数',
                value: 250,  // 假设值
                icon: 'pi pi-stethoscope',
            },
            {
                title: '当日医院总入账',
                value: '¥10,000',  // 假设值
                icon: 'pi pi-dollar',
            },
        ]);

        // 待处理事项
        const pendingTasks = ref([
            { description: '检查病人挂号资料' },
            { description: '安排医生会议' },
            { description: '检查病房清洁情况' },
        ]);

        // 过去10天的就诊人数数据（模拟数据）
        const lineChartData = ref({
            labels: ['10天前', '9天前', '8天前', '7天前', '6天前', '5天前', '4天前', '3天前', '2天前', '昨天'],  // 日期标签
            datasets: [
                {
                    label: '总就诊人数',
                    data: [200, 220, 210, 230, 250, 240, 220, 230, 260, 270],  // 假设的就诊人数数据
                    borderColor: '#42A5F5',
                    backgroundColor: 'rgba(66, 165, 245, 0.2)',
                    fill: true,
                },
            ],
        });

        // 更新当前时间
        const updateCurrentTime = () => {
            const now = new Date();
            currentTime.value = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        };

        // 定时更新当前时间
        onMounted(() => {
            updateCurrentTime();
            setInterval(updateCurrentTime, 1000);  // 每秒更新
        });

        return {
            currentTime,
            dataCards,
            pendingTasks,
            lineChartData,
        };
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
    transition: transform 0.3s ease;
}

.card:hover {
    transform: scale(1.05);
}

.card {
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
}

.welcome-card-title {
    text-align: left;
    /* 确保标题文本靠左对齐 */
}

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
    justify-content:right;
    padding: 20px;
    width: 100%;
    margin-left: 50px;
}

.data-card {
    margin: 20px;
    margin-top: 0px;    
    width: 200px;
    height: 200px;
    /* 每个卡片的宽度 */
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
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

.line-charts-container{
    width: 800px;
}

.line-chart-card {
    
    margin: 20px auto;
    margin-left: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.line-chart-card .p-card-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
}

.line-chart {
    width: 100%;
    /* 使折线图适应父容器宽度 */
    height: 400px;
    /* 设置折线图的固定高度 */
}

/* 待处理事项列表 */
.pending-tasks-container {
    display: flex;
    flex-direction: column;
    /* 让子元素垂直排列 */
    justify-content: space-between;
    /* 子元素垂直排列时，自动填充剩余空间 */
    align-items: center;
    /* 水平居中所有子元素 */
    width: 100%;
}

.pending-tasks-card {
    flex-grow: 1;
    /* 让卡片占据剩余空间 */
    width: 80%;
    /* 卡片的宽度占父容器的 80% */
    max-width: 900px;
    /* 卡片的最大宽度 */
    margin-top: 20px;
    /* 卡片上方的间距 */
    margin-bottom: 20px;
    /* 卡片下方的间距 */
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pending-tasks-card .p-card-title {
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
    /* 图标和文本之间的间距 */
    font-size: 18px;
    color: #ff9900;
    /* 设置图标颜色 */
}

.pending-tasks-card .task-item span {
    font-size: 16px;
    color: #333;
}
</style>
