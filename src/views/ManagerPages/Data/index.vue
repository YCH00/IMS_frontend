<template>
    <div class="statistics">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>医生预约次数统计</span>
                    </div>
                    <div ref="doctorChart" style="width: 100%; height: 400px;"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>患者满意度评分</span>
                    </div>
                    <div ref="satisfactionChart" style="width: 100%; height: 400px;"></div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>财报数据</span>
                    </div>
                    <div ref="financialChart" style="width: 100%; height: 400px;"></div>
                    <el-table :data="financialData" style="width: 100%" border>
                        <el-table-column prop="category" label="类别" width="180"></el-table-column>
                        <el-table-column prop="amount" label="金额"></el-table-column>
                        <el-table-column prop="date" label="日期"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

export default {
    setup() {
        const doctorChart = ref(null);
        const satisfactionChart = ref(null);
        const financialChart = ref(null);
        const financialData = ref([
            { category: '挂号费', amount: 5000, date: '2024-01-01' },
            { category: '检查费', amount: 3000, date: '2024-01-01' },
            // 更多财务数据...
        ]);

        const doctorAppointments = ref([
            { name: '王五', value: 120 },
            { name: '赵六', value: 150 },
            { name: '孙七', value: 90 },
            { name: '周八', value: 60 }
        ]);

        const patientSatisfaction = ref(30); // 假设的患者满意度评分

        onMounted(() => {
            initDoctorChart();
            initSatisfactionChart();
            initFinancialChart();
        });

        const initDoctorChart = () => {
            const chart = echarts.init(doctorChart.value);
            const option = {
                //title: { text: '医生预约次数统计' },
                tooltip: {},
                xAxis: { data: doctorAppointments.value.map(doc => doc.name) },
                yAxis: {},
                series: [{
                    name: '预约次数',
                    type: 'bar',
                    data: doctorAppointments.value.map(doc => doc.value)
                }]
            };
            chart.setOption(option);
        };

        const initSatisfactionChart = () => {
            const chart = echarts.init(satisfactionChart.value);
            const option = {
                //title: { text: '患者满意度评分' },
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        name: '满意度',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: patientSatisfaction.value, name: '满意' },
                            { value: 100 - patientSatisfaction.value, name: '不满意' }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            chart.setOption(option);
        };

        const initFinancialChart = () => {
            const chart = echarts.init(financialChart.value);
            const option = {
                //title: { text: '年度财务概览' },
                tooltip: { trigger: 'axis' },
                legend: { data: ['收入', '支出'] },
                xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
                yAxis: { type: 'value' },
                series: [
                    { name: '收入', type: 'line', data: [5000, 6000, 7000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000, 500] },
                    { name: '支出', type: 'line', data: [3000, 3500, 4000, 4500, 4000, 3500, 3000, 2500, 2000, 1500, 1000, 500] }
                ]
            };
            chart.setOption(option);
        };

        return {
            doctorChart,
            satisfactionChart,
            financialChart,
            financialData,
            doctorAppointments,
            patientSatisfaction
        };
    }
};
</script>

<style scoped>
.statistics {
    padding: 20px;
}

/* 给所有的el-card组件添加悬浮效果 */
.el-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    /* 过渡效果 */
    margin: 20px;
}

.el-card:hover {
    transform: scale(1.05);
    /* 放大效果 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    /* 添加阴影效果 */
}

/* 可以为卡片的header部分添加一些样式 */
.el-card .clearfix {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}
</style>