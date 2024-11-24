<script setup>
import Button from "primevue/button"; // 按钮组件
import IftaLabel from "primevue/iftalabel"; // 标签组件
import InputText from "primevue/inputtext"; // 输入框组件
import RadioButton from "primevue/radiobutton"; // 单选按钮组件

import {ref} from "vue"; // Vue 的响应式变量
import instance from "../utils/request.js"; // Axios 实例，用于发送 HTTP 请求
import router from "../router/router"; // 路由实例，用于页面跳转

// 定义响应式变量，用于绑定表单数据
const Account = ref(""); // 用户账号
const password = ref(""); // 用户密码
const confirmPassword = ref(""); // 确认密码
const identity = ref("admin"); // 身份，默认为管理员(admin)
const errorMessage = ref(""); // 动态显示错误信息

// 校验函数：检查账号和密码长度是否符合不同身份的要求
const validateForm = () => {
  if (identity.value === "admin") {
    // 管理员身份的账号和密码要求
    return (
        Account.value.length >= 10 &&
        Account.value.length <= 30 &&
        password.value.length >= 15 &&
        password.value.length <= 30 &&
        password.value === confirmPassword.value // 确认密码必须匹配
    );
  } else {
    // 商家身份的账号和密码要求
    return (
        Account.value.length >= 6 &&
        Account.value.length <= 30 &&
        password.value.length >= 8 &&
        password.value.length <= 30 &&
        password.value === confirmPassword.value // 确认密码必须匹配
    );
  }
};

// 获取账号和密码长度要求的动态提示
const getValidationHint = () => {
  if (identity.value === "admin") {
    return "管理员账号需为 10-30 字符，密码需为 15-30 字符";
  } else {
    return "商家账号需为 6-30 字符，密码需为 8-30 字符";
  }
};

// 处理错误消息
const handleError = (message) => {
  errorMessage.value = message;
  setTimeout(() => (errorMessage.value = ""), 3000); // 3 秒后清除错误消息
};

// 注册函数：向服务器发送注册请求并跳转到对应的页面
async function try_register(event) {
  event.preventDefault(); // 防止表单默认提交行为

  // 如果表单校验未通过，提示用户并退出函数
  if (!validateForm()) {
    handleError("账号或密码长度不符合要求，或者密码和确认密码不匹配");
    return;
  }

  // 构造表单数据
  let data = new FormData();
  data.append("account", Account.value); // 添加账号
  data.append("password", password.value); // 添加密码
  data.append("identity", identity.value); // 添加身份参数

  try {
    // 根据身份选择对应的 API 接口
    const apiPath = (identity.value === "admin") ? "/admin/register" : "/merchant/register";

    // 发送 POST 请求
    const response = await instance.post(apiPath, data);

    // 根据返回结果处理注册逻辑
    if (response.status === 200 && response.data.msg === "ok") {
      console.log("注册成功");
      // 跳转到对应身份的首页
      if (identity.value === "admin") {
        await router.push("/admin_Home");
      } else {
        await router.push("/merchant_Home");
      }
    } else {
      console.log("注册失败");
      handleError(response.data.msg);
    }
  } catch (error) {
    console.error("注册请求失败:", error);
    handleError("注册失败，请检查网络或联系管理员");
  }
}
</script>

<template>
  <div class="container">
    <!-- 注册表单容器 -->
    <div class="screen">
      <div class="screen__content">
        <form class="login">
          <!-- 注册标题 -->
          <h3 class="login_header">
            {{ identity === "admin" ? "管理员注册" : "商家注册" }}
          </h3>

          <!-- 错误消息 -->
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <!-- 账号输入框 -->
          <div class="login__field">
            <IftaLabel>
              <i class="pi pi-user icon"></i> <!-- 用户图标 -->
              <InputText
                  id="Account"
                  class="login__input"
                  v-model="Account"
              />
              <label for="Account">账号</label>
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
                  v-model="password"
                  toggleMask
              />
              <label for="Password">密码</label>
            </IftaLabel>
          </div>

          <!-- 确认密码输入框 -->
          <div class="login__field">
            <IftaLabel>
              <i class="pi pi-lock icon"></i> <!-- 密码图标 -->
              <InputText
                  id="ConfirmPassword"
                  type="password"
                  class="login__input"
                  v-model="confirmPassword"
                  toggleMask
              />
              <label for="ConfirmPassword">确认密码</label>
            </IftaLabel>
          </div>

          <!-- 提示信息 -->
          <p class="validation-hint">{{ getValidationHint() }}</p>

          <!-- 注册按钮 -->
          <Button
              class="button login__submit"
              @click="try_register"
              :disabled="!validateForm"
          >
            <span class="button__text">注册</span>
          </Button>
        </form>
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

/* 错误消息样式 */
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

/* 验证提示样式 */
.validation-hint {
  color: #6c757d;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

</style>