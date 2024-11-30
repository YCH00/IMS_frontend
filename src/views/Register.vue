<script setup lang="ts">
import Button from "primevue/button"; // 按钮组件
import IftaLabel from "primevue/iftalabel"; // 标签组件
import InputText from "primevue/inputtext"; // 输入框组件
import RadioButton from "primevue/radiobutton"; // 单选按钮组件

import {reactive, ref} from "vue"; // Vue 的响应式变量
import instance from "../utils/request.js"; // Axios 实例，用于发送 HTTP 请求
import router from "../router/router"; // 路由实例，用于页面跳转
import {showMessage} from "../utils/message.js";

// 定义响应式变量，用于绑定表单数据
const register_form = reactive({
  name: "",
  id_card: "",
  phone_number: "",
  password: ""
})
const gotoLogin = () => {
  router.push("/login")
}

// 校验函数：检查账号和密码长度是否符合不同身份的要求
const validateForm = () => {
  // 验证姓名
  if (!register_form.name.trim()) {
    showMessage("姓名不能为空", "error");
    return false;
  }
  if (register_form.name.length < 2 || register_form.name.length > 50) {
    showMessage("姓名长度应在2到50个字符之间", "error");
    return false;
  }

  // 验证手机号
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!register_form.phone_number.trim()) {
    showMessage("手机号码不能为空", "error");
    return false;
  }
  if (!phoneRegex.test(register_form.phone_number)) {
    showMessage("手机号码格式不正确", "error");
    return false;
  }

  // 验证身份证号
  const idCardRegex = /^(?:\d{15}|\d{18}|\d{17}[Xx])$/;
  if (!register_form.id_card.trim()) {
    showMessage("身份证号不能为空", "error");
    return false;
  }
  if (!idCardRegex.test(register_form.id_card)) {
    showMessage("身份证号格式不正确", "error");
    return false;
  }

  // 验证密码
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
  if (!register_form.password.trim()) {
    showMessage("密码不能为空", "error");
    return false;
  }
  if (!passwordRegex.test(register_form.password)) {
    showMessage("密码长度应为8到20位，且包含字母和数字", "error");
    return false;
  }

  // 所有验证通过
  return true;
};

// 注册函数：向服务器发送注册请求并跳转到对应的页面
async function try_register(event: Event) {
  event.preventDefault(); // 防止表单默认提交行为

  if (!validateForm()) {
    return
  }
  try {
    const response = await instance.post("/register", register_form)

    // 获取后端返回的 JSON 数据
    const {code, message, data} = response.data;

    if (code === "000") {
      // 显示成功信息
      showMessage(message, "success");
      // TODO:在这里处理成功逻辑，比如跳转页面
      router.push('/admin/home');
    } else {
      // 显示错误消息
      showMessage(response.data.error || "注册失败", "error");
    }

  } catch (error) {
    // 显示网络错误消息
    showMessage("网络错误，请稍后再试", "error");
  }


}
</script>

<template>
  <div class="container">
    <!-- 注册表单容器 -->
    <div class="screen">
      <div class="screen__content">

        <!-- 注册表单 -->
        <form class="login">
          <!-- 注册标题 -->
          <h3 class="login_header">
            用户注册
          </h3>

          <!-- 姓名输入框 -->
          <div class="login__field">
            <IftaLabel>
              <i class="pi pi-user icon"></i> <!-- 用户图标 -->
              <InputText
                  id="name"
                  class="login__input"
                  v-model="register_form.name"
              />
              <label for="name">姓名</label>
            </IftaLabel>
          </div>

          <!-- 手机号输入框 -->
          <div class="login__field">
            <IftaLabel>
              <i class="pi pi-phone icon"></i> <!-- 电话图标 -->
              <InputText
                  id="phone_number"
                  class="login__input"
                  v-model="register_form.phone_number"
              />
              <label for="phone_number">手机号码</label>
            </IftaLabel>
          </div>

          <!-- 身份证号输入框 -->
          <div class="login__field">
            <IftaLabel>
              <i class="pi pi-id-card icon"></i> <!-- 用户图标 -->
              <InputText
                  id="id_card"
                  class="login__input"
                  v-model="register_form.id_card"
              />
              <label for="id_card">身份证号</label>
            </IftaLabel>
          </div>

          <!-- 密码输入框 -->
          <div class="login__field">
            <IftaLabel>
              <i class="pi pi-lock icon"></i> <!-- 密码图标 -->
              <InputText
                  id="Password"
                  type="password"
                  class="login__input"
                  v-model="register_form.password"
                  toggleMask
              />
              <label for="Password">密码</label>
            </IftaLabel>
          </div>

          <!-- 注册按钮 -->
          <Button
              class="button login__submit"
              @click="try_register"
              :disabled="!validateForm"
          >
            <span class="button__text">注册</span>
          </Button>
        </form>

        <p class="login-link">
          已有账号？
          <button class="login-button" @click.prevent="gotoLogin">前往登录</button>
        </p>
      </div>

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

.login-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #a89797;

  .login-button {
    background-color: #e42b5f;
    border: none;
    color: white;
    padding: 8px 16px;
    margin-left: 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #d51038;
    }

    &:active {
      background-color: #df0c3d;
    }

    &:focus {
      outline: none;
    }
  }
}
</style>