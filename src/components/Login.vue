<script setup lang="ts">
import Button from "primevue/button"; // 按钮组件需要引入
import IftaLabel from "primevue/iftalabel";
import InputText from "primevue/inputtext";
import RadioButton from "primevue/radiobutton";

import {ref} from "vue";
import instance from "../utils/request.js"; // Axios 实例，用于发送 HTTP 请求
import router from "../router/router";
import {showMessage} from "../utils/message.js";

// 定义响应式变量，用于绑定表单数据
const phone_number = ref(""); // 用户账号
const password = ref(""); // 用户密码
const identity = ref("admin"); // 身份，默认为管理员(admin)
const title = {
  'admin': '管理员登录',
  'doctor': '医生登录',
  'user': '用户登录',
  'default': '登录'
}

// 校验函数：根据身份验证账号和密码长度
const validateForm = () => {
  if (!phone_number.value || !password.value) {
    showMessage("账号和密码不能为空", "warning");
    return false;
  }
  // TODO: 其他校验条件

  return true;
};

// 登录函数
async function try_login(event: Event) {
  event.preventDefault(); // 防止表单默认提交行为

  if (!validateForm()) {
    return;
  }

  // 组织请求数据
  const data = {
    phone_number: phone_number.value, // 替换为实际的账号字段
    password: password.value,         // 替换为实际的密码字段
  };

  try {
    // 发送 POST 请求
    const response = await instance.post("/login", data, {
      headers: {
        "Content-Type": "application/json", // 确保指定 JSON 格式
      },
    })

    // 获取后端返回的 JSON 数据
    const {code, message, data} = response.data;

    if (code === "000") {
      // 显示成功信息
      showMessage(message, "success");
      // TODO:在这里处理成功逻辑，比如跳转页面
      // if (identity.value === "admin") {
      //   router.push("/admin_Home");
      // } else if (identity.value === "doctor") {
      //   router.push("/merchant_Home");
      // } else if (identity.value === "patient") {
      //   router.push("/patient_Home");
      // }
    } else {
      // 显示错误消息
      showMessage(message || "登录失败", "error");
    }
  } catch (error) {
    // 显示网络错误消息
    showMessage("网络错误，请稍后再试", "error");
  }
}
</script>

<template>
  <div class="container">
    <!-- 登录表单容器 -->
    <div class="screen">
      <div class="screen__content">
        <form class="login">

          <!-- 登录标题 -->
          <h3 class="login_header">
            {{ title[identity] }}
          </h3>

          <!-- 账号输入框 -->
          <div class="login__field">
            <IftaLabel>
              <i class="pi pi-user icon"></i>
              <InputText id="Account" class="login__input" v-model="phone_number"/>
              <label for="Account">手机号码</label>
            </IftaLabel>
          </div>

          <!-- 密码输入框 -->
          <div class="login__field">
            <IftaLabel>
              <i class="pi pi-lock icon"></i>
              <InputText
                  id="Password"
                  type="password"
                  class="login__input"
                  v-model="password"
                  toggleMask
              />
              <label for="Password">密码</label>
            </IftaLabel>
          </div>

          <!-- 身份选择单选框 -->
          <div class="radio-group">
            <div class="radio-item">
              <RadioButton
                  id="admin"
                  v-model="identity"
                  value="admin"
                  class="custom-radio"
                  variant="filled"
              />
              <label for="admin" class="radio-label">管理员</label>
            </div>
            <div class="radio-item">
              <RadioButton
                  id="doctor"
                  v-model="identity"
                  value="doctor"
                  class="custom-radio"
                  variant="filled"
              />
              <label for="merchant" class="radio-label">医生</label>
            </div>
            <div class="radio-item">
              <RadioButton
                  id="user"
                  v-model="identity"
                  value="user"
                  class="custom-radio"
                  variant="filled"
              />
              <label for="admin" class="radio-label">普通用户</label>
            </div>
          </div>

          <!-- 登录按钮 -->
          <Button
              class="button login__submit"
              @click="try_login"
              :disabled="!validateForm"
          >
            <span class="button__text">登录</span>
          </Button>
        </form>
      </div>

      <!-- 在此处加入跳转到注册界面的部分 -->
      <p class="register-link">
        还没有账号？
        <a href="/register" @click.prevent="router.push('/register')">点击注册</a>
      </p>

      <!-- 背景装饰 -->
      <div class="screen__background">
        <span
            class="screen__background__shape screen__background__shape4"
        ></span>
        <span
            class="screen__background__shape screen__background__shape3"
        ></span>
        <span
            class="screen__background__shape screen__background__shape2"
        ></span>
        <span
            class="screen__background__shape screen__background__shape1"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/login.css";
</style>
