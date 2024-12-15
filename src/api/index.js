import request from "../utils/request.js";
import menu from "../store/menu.js";

// 用户注册
export const register = (data) => {
    return request.post('/register', data)
}
// 用户登录
export const login = (data) => {
    return request.post('/login', data)
}
// 获取动态路由
export const getDynamicRoutes = (roleType) => {
    const routeEndpoints = {
        admin: '/api/admin/routes',
        doctor: '/api/doctor/routes',
        user: '/api/user/routes',
    };
    const url = routeEndpoints[roleType] || routeEndpoints.user;
    return request.get(url);
}


// 获取所有的用户信息
export const getAllUserInfo = (data) => {
    return request.get("/users", data)
}

// -------------------- 角色管理路由 --------------------
// 获取所有角色
export const getRoles = () => {
    return request.get('/roles');
};
// 获取所有角色(分页)
export const getRolesPaginated = (data) => {
    return request.get('/roles/paginated', data)
}
// 创建角色
export const createRole = (roleData) => {
    return request.post('/roles', roleData);
};
// 更新角色
export const updateRole = (roleId, roleData) => {
    return request.put(`/roles/${roleId}`, roleData);
};
// 删除角色
export const deleteRole = (roleId) => {
    return request.delete(`/roles/${roleId}`);
};
// -------------------- 菜单权限管理路由 --------------------
// 获取所有菜单权限
export const getMenus = () => {
    return request.get('/menus');
};
// 获取所有菜单权限(分页)
export const getMenusPaginated = (data) => {
    return request.get('/menus/paginated', data);
};
// 创建菜单权限
export const createMenu = (menuData) => {
    return request.post('/menus', menuData);
};
// 更新角色
export const updateMenu = (menuId, menuData) => {
    return request.put(`/menus/${menuId}`, menuData);
};
// 删除角色
export const deleteMenu = (menuId) => {
    return request.delete(`/menus/${menuId}`);
};

// -------------------- 科室管理路由 --------------------
export const getAllDepartmentInfo = (data) => {
    return request.get('/departments', {params: data});
}

export const getAllDoctorInfo = (data) => {
    return request.get('/doctors', {params: data});
}
