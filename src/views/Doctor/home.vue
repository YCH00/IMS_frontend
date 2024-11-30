<template>
    <div class="dashboard">
      <div class="header">IMS同济医疗管理系统</div>
      <div class="nav">
        <ul>
          <li>Navigator One</li>
          <li>Navigator Two</li>
          <li>Navigator Three</li>
        </ul>
      </div>
      <div class="profile-card">
        <h2>JIANG</h2>
        <p>shanghai.china</p>
        <div class="specialties">
          <span>骨科</span>
          <span>儿科</span>
          <span>神经科</span>
          <span>外科</span>
        </div>
        <div class="actions">
          <button>预约</button>
          <button>病人</button>
          <button>报告</button>
        </div>
      </div>
      <div class="count-card">
        <h3>COUNT</h3>
        <div class="count-stats">
          <div class="stat">
            <p>75%</p>
            <span>准时</span>
          </div>
          <div class="stat">
            <p>25%</p>
            <span>迟到</span>
          </div>
          <div class="stat">
            <p>100%</p>
            <span>完成</span>
          </div>
        </div>
      </div>
      <div class="doctors-card">
        <h3>Doctors</h3>
        <ul>
          <li>张医生 DR.Zhang</li>
          <li>李医生 DR.Li</li>
          <li>姜医生 DR.Jiang</li>
          <li>赵医生 DR.Zhao</li>
          <li>郭医生 DR.Guo</li>
        </ul>
      </div>
      <div class="age-card">
        <h3>Age</h3>
        <!-- 这里可以放置一个图表，但需要使用图表库如Chart.js -->
      </div>
      <div class="return-card">
        <h3>Return</h3>
        <!-- 这里可以放置一个图表，但需要使用图表库如Chart.js -->
      </div>
    </div>
  </template>
  
  <script setup>
  // 这里可以添加你的逻辑代码
  </script>
  
  <style lang="less" scoped>
  .dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
  }
  
  .header {
    width: 100%;
    background-color: #000;
    color: #fff;
    text-align: center;
    padding: 10px 0;
  }
  
  .nav {
    width: 200px;
    background-color: #4a4a4f;
    color: #fff;
    padding: 10px;
  }
  
  .nav ul {
    list-style: none;
    padding: 0;
  }
  
  .nav li {
    margin: 10px 0;
  }
  
  .profile-card, .count-card, .doctors-card, .age-card, .return-card {
    width: 80%;
    margin: 10px 0;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .specialties span, .count-stats div {
    display: inline-block;
    margin-right: 10px;
  }
  
  .actions button, .stat p {
    margin-right: 5px;
  }
  </style>