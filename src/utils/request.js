import axios from 'axios';

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
            console.log('服务器被吃了( ╯□╰ )504');
        } else if (error.status === 403) {
            console.log('服务器被吃了( ╯□╰ )403');
        } else if (error.status === 401) {
            console.log('401!!!!!!!');
        } else {
            console.log(error);
        }
        console.log('返回reject');
        // 返回一个被拒绝的 Promise，以便调用者可以处理错误
        return Promise.reject(error);
    }
);

export default instance;