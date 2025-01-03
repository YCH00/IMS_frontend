<script setup lang="ts">
import Button from "primevue/button"; // 按钮组件需要引入
import IftaLabel from "primevue/iftalabel";
import InputText from "primevue/inputtext";
import RadioButton from "primevue/radiobutton";

import {reactive, ref} from "vue";
import router from "../router/router";
import {showMessage} from "../utils/message.js";
// 后端API接口函数
import {login, doctorLogin, adminLogin} from "../api"

// 定义响应式变量，用于绑定表单数据
const login_form = reactive({
  username: "",
  password: ""
})
const identity = ref("admin")
const title = {
  'admin': '管理员登录',
  'doctor': '医生登录',
  'user': '用户登录',
  'default': '登录'
}

// 注册跳转函数
const gotoRegister = () => {
  router.push('/register');
}

// 校验函数：根据身份验证账号和密码长度
const validateForm = () => {
  if (!login_form.username || !login_form.password) {
    showMessage("账号和密码不能为空", "warning");
    return false;
  }
  return true;
};

// 登录函数
async function try_login(event: Event) {
  event.preventDefault(); // 防止表单默认提交行为

  if (!validateForm()) {
    return;
  }

  let loginResponse;
  switch (identity.value) {
    case "admin":
      loginResponse = adminLogin(login_form); // 管理员登录
      break;
    case "doctor":
      loginResponse = doctorLogin(login_form); // 医生登录
      break;
    case "user":
      loginResponse = login(login_form); // 用户登录
      break;
    default:
      loginResponse = login(login_form); // 默认登录
      break;
  }

  try {
    const {data} = await loginResponse;

    if (data.code === "000") {
      showMessage(data.message, "success");
      const token = data.data.token;
      const userInfo = JSON.stringify(data.data.user_info);
      localStorage.setItem("pz_token", token);
      localStorage.setItem("userInfo", userInfo);
      localStorage.setItem("role", identity.value);
      router.hasDynamicRoutes = false;
      router.push("/home");
    } else {
      showMessage(data.error || "登录失败", "error");
    }
  } catch (error) {
    showMessage("登录请求失败，请稍后重试", "error");
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
              <InputText id="Account" class="login__input" v-model="login_form.username"/>
              <label for="Account">{{
                  identity === 'admin' ?
                      "管理员账号" : identity === "doctor" ? "工号" : "电话号码"
                }}</label>
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
                  v-model="login_form.password"
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

        <!-- 在此处加入跳转到注册界面的部分 -->
        <p class="register-link">
          还没有账号？
          <button class="register-button" @click.prevent="gotoRegister">点击注册</button>
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

.register-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #a89797;

  .register-button {
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
