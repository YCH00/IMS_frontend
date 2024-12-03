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
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts';
  
  export default {
    setup() {
      const doctorChart = ref(null);
      const satisfactionChart = ref(null);
  
      // 模拟数据
      const doctorAppointments = [
        { name: '王五', value: 120 },
        { name: '赵六', value: 150 },
        { name: '孙七', value: 90 },
        { name: '周八', value: 60 }
      ];
  
      const patientSatisfaction = [
        { value: 40, name: '满意' },
        { value: 30, name: '一般' },
        { value: 30, name: '不满意' }
      ];
  
      onMounted(() => {
        initDoctorChart();
        initSatisfactionChart();
      });
  
      const initDoctorChart = () => {
        const chart = echarts.init(doctorChart.value);
        const option = {
          title: { text: '医生预约次数统计' },
          tooltip: {},
          xAxis: { data: doctorAppointments.map(doc => doc.name) },
          yAxis: {},
          series: [{
            name: '预约次数',
            type: 'bar',
            data: doctorAppointments.map(doc => doc.value)
          }]
        };
        chart.setOption(option);
      };
  
      const initSatisfactionChart = () => {
        const chart = echarts.init(satisfactionChart.value);
        const option = {
          title: { text: '患者满意度评分' },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '满意度',
              type: 'pie',
              radius: '50%',
              data: patientSatisfaction,
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
  
      return {
        doctorChart,
        satisfactionChart
      };
    }
  };
  </script>
  
  <style scoped>
  .statistics {
    padding: 20px;
  }
  </style>