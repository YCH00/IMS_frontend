import axios from 'axios';
import {showMessage} from "./message.js";

const localHost = "http://127.0.0.1:5000"; // 本地URL

const instance = axios.create({
    baseURL: "http://127.0.0.1:5000", // 后端地址
    timeout: 5000,                   // 超时时间，单位：毫秒
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('pz_token')
    // 不需要添加token的api
    const whiteUrl = ['/login', '/register']
    if (token && !whiteUrl.includes(config.url)) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, function (error) {
    // 对请求错误做些什么
    showMessage(error, 'error')
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对接口异常的数据,给用户提示
    if (response.data.code === "111") {
        showMessage(response.data.message, 'error')
    }

    return response;
}, function (error) {
    if (error.response && error.response.status === 401) {
        // Token 过期或者无效时，清除 token，并跳转到登录页面
        localStorage.removeItem('pz_token');
        window.location.href = '/login';  // 跳转到登录页面
    } else {
        showMessage(error, 'error');
    }
    return Promise.reject(error);
});

export default instance;