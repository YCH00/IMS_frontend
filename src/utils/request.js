import axios from 'axios';
import {showMessage} from "./message.js";

const localHost = "http://127.0.0.1:5000"; // 本地URL

// 创建一个 axios 实例，并设置基础 URL
const instance = axios.create({
    baseURL: localHost,
});

// 添加响应拦截器，用于在响应到达调用者之前处理它
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.status === 504 || error.status === 404) {
            showMessage('服务器被吃了( ╯□╰ )504', 'error')
        } else if (error.status === 403) {
            showMessage('服务器被吃了( ╯□╰ )403', 'error')
        } else if (error.status === 401) {
            showMessage('401!!!!!!!', 'error')
        } else {
            console.log(error);
        }
        console.log('返回reject');
        // 返回一个被拒绝的 Promise，以便调用者可以处理错误
        return Promise.reject(error);
    }
);

export default instance;