<template>
    <div class="patient-home">
        <div class="flex-box">
            <!-- 欢迎卡片 -->
            <Card class="welcome-card">
                <template #title>
                    <div class="welcome-card-title">欢迎患者：</div>
                </template>
                <template #content>
                    <div>
                        <h3>您好，{{ userName }}</h3>
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
            <!-- 健康指标折线图 -->
            <div class="line-charts-container">
                <Card class="line-chart-card">
                    <template #title>
                        <div class="card-title">过去10天健康指标趋势</div>
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
  import { Card } from 'primevue';
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
  // 注册Chart.js所需要的模块
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);
  
  export default {
    name: 'PatientHome',
  
    components: {
        Line,
        Card,
    },
  
    data() {
        return {
            // 图表数据
            chartData: {
                labels: ['2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05', '2024-11-06', '2024-11-07', '2024-11-08', '2024-11-09', '2024-11-10'], // 日期标签
                datasets: [
                    {
                        label: '每日步数',
                        data: [5000, 7000, 6500, 8000, 7500, 9000, 8500, 9500, 10000, 11000], // 假设的步数数据
                        borderColor: '#FFA726', // 橙色边框
                        backgroundColor: 'rgba(255, 167, 38, 0.2)', // 橙色背景
                        fill: true,
                        tension: 0.4, // 曲线的平滑度
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
                            drawOnChartArea: true, // 绘制网格线
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '步数',
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
        // 当前时间变量
        const currentTime = ref('');
        const userName = ref('李自瞻');
  
        // 数据展示卡片的数据
        const dataCards = ref([
            {
                title: '今日预约次数',
                value: 2,  // 假设值
                icon: 'pi pi-calendar',
            },
            {
                title: '待查看报告数',
                value: 1,  // 假设值
                icon: 'pi pi-file',
            },
            {
                title: '活动步数',
                value: 8500,  // 假设值
                icon: 'pi pi-heart',
            },
            {
                title: '健康提醒',
                value: 3,  // 假设值
                icon: 'pi pi-bell',
            },
        ]);
  
        // 待处理事项
        const pendingTasks = ref([
            { description: '完成每日步数目标' },
            { description: '查看最新健康报告' },
            { description: '预约下次体检' },
        ]);
  
        // 更新当前时间
        const updateCurrentTime = () => {
            const now = new Date();
            const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            currentTime.value = formattedTime;
        };
  
        // 定时更新当前时间
        onMounted(() => {
            updateCurrentTime();
            setInterval(updateCurrentTime, 1000);  // 每秒更新
        });
  
        return {
            currentTime,
            userName,
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
  .patient-home {
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
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
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
    color: #FFA726; /* 更改为橙色 */
    margin-bottom: 10px;
  }
  
  .welcome-card {
    width: 100%;
    height: 200px;
    text-align: center;
    margin: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .welcome-card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
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
    justify-content: space-between;
    padding: 20px;
    width: 100%;
  }
  
  .data-card {
    margin: 20px;
    margin-top: 0px;    
    width: 200px;
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
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .data-card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
  }
  
  .data-icon {
    font-size: 30px;
    color: #FFA726; /* 更改为橙色 */
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
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .line-chart-card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
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
    justify-content: space-between;
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
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
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
    color: #FFA726; /* 更改为橙色 */
  }
  
  .pending-tasks-card .task-item span {
    font-size: 16px;
    color: #333;
    position: relative;
    display: inline-block;
    transition: color 0.3s ease;
  }
  
  /* 待处理事项新增下划线功能 */
  .pending-tasks-card .task-item span::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px; /* 下划线距离文本底部的距离 */
    width: 0;
    height: 2px;
    background-color: #FFA726; /* 更改为橙色 */
    transition: width 0.3s ease; /* 添加平滑过渡 */
  }
  
  /* 鼠标悬停时下划线动画 */
  .pending-tasks-card .task-item:hover span::after {
    width: 100%; /* 下划线在悬停时从 0 到 100% */
  }
  
  /* 鼠标悬停时，文本颜色也可变更，增加交互感 */
  .pending-tasks-card .task-item:hover span {
    color: #FFA726; /* 更改为橙色 */
  }
  
  /* 新增的按钮样式 */
  .add-task-btn {
    background-color: #FFA726; /* 更改为橙色 */
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
    background-color: #FB8C00; /* 更深的橙色 */
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
    background-color: #FFA726; /* 更改为橙色 */
  }
  
  .modal-btn:hover {
    background-color: #FB8C00; /* 更深的橙色 */
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
  