import request from "../utils/request.js";

// 用户注册
export const register = (data) => {
    return request.post('/register', data)
}

// 用户登录
export const login = (data) => {
    return request.post('/login', data)
}

// 获取所有的用户信息
export const getAllUserInfo = (data) => {
    return request.get("/users", data)
}
