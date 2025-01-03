import request from "../utils/request.js";
import menu from "../store/menu.js";

// 用户注册
export const register = (data) => {
    return request.post('/patient/register', data)
}
// 用户登录
export const login = (data) => {
    return request.post('/patient/login', data)
}
// 医生登录
export const doctorLogin = (data) => {
    return request.post('/doctor/login', data)
}
// 管理员登录
export const adminLogin = (data) => {
    return request.post('/admin/login', data)
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

//-- 科室管理页面相关接口
export const getAllDept = (data) => {
    return request.get('/admin/getDept', {params: data});
}

export const alterDept = (data, dept_id) => {
    return request.put(`/admin/alterDept/${dept_id}`, data);
}

export const delDept = (dept_id) => {
    return request.delete(`/admin/delDept/${dept_id}`);
}

export const addDept = (data) => {
    return request.post(`/admin/addDept`, data);
}

export const getDoctorsByDept = (dept_id) => {
    return request.get(`/admin/getDoctorsByDept/${dept_id}`);
}

//-- 医生管理页面相关接口
export const getAllDoctor = (data) => {
    return request.get('/admin/getDoctor', {params: data});
}

export const alterDoctor = (data, doctor_id) => {
    return request.put(`/admin/alterDoctor/${doctor_id}`, data);
}

export const delDoctor = (doctor_id) => {
    return request.delete(`/admin/delDoctor/${doctor_id}`);
}

export const addDoctor = (data) => {
    return request.post(`/admin/addDoctor`, data);
}

//-- 用户管理相关接口
export const getAllUser = (data) => {
    return request.get('/admin/getUser', {params: data});
}

export const alterUser = (data, user_id) => {
    return request.put(`/admin/alterUser/${user_id}`, data);
}

export const delUser = (user_id) => {
    return request.delete(`/admin/delUser/${user_id}`);
}

export const addUser = (data) => {
    return request.post('/admin/addUser', data);
}

//-- 药品管理页面相关接口
export const getAllDrug = (data) => {
    return request.get('/admin/getDrug', {params: data});
}

export const getDrugById = (drug_id) => {
    return request.get(`/admin/drugDetail/${drug_id}`);
};

export const alterDrug = (data, drug_id) => {
    return request.put(`/admin/alterDrug/${drug_id}`, data);
}

export const delDrug = (drug_id) => {
    return request.delete(`/admin/delDrug/${drug_id}`);
}

export const addDrug = (data) => {
    return request.post('/admin/addDrug', data);
}

//-- 检查项目管理页面相关接口
export const getAllExam = (data) => {
    return request.get('/admin/getExam', {params: data});
}

export const alterExam = (data, exam_id) => {
    return request.put(`/admin/alterExam/${exam_id}`, data);
}

export const delExam = (exam_id) => {
    return request.delete(`/admin/delExam/${exam_id}`);
}

export const addExam = (data) => {
    return request.post('/admin/addExam', data);
}

//-- 预约管理页面相关接口
export const getAllAppoint = (data) => {
    return request.get('/admin/getAppoint', {params: data});
}

export const alterAppoint = (data, appoint_id) => {
    return request.put(`/admin/alterAppoint/${appoint_id}`, data);
}

export const delAppoint = (appoint_id) => {
    return request.delete(`/admin/delAppoint/${appoint_id}`);
}

export const addAppoint = (data) => {
    return request.post('/patient/addAppoint', data);
}

//-- 管理员主页数据相关
export const getAdminData = () => {
    return request.get('/admin/view-data');
}

//-- 医生页面中的相关接口
export const getCurPatient = (doctor_id, data) => {
    return request.get(`/doctor/getCurPatient/${doctor_id}`, {params: data});
}

export const getHistoryPatient = (doctor_id, data) => {
    return request.get(`/doctor/getHistoryPatient/${doctor_id}`, {params: data});
}

export const getPatientDetail = (patient_id) => {
    return request.get(`/doctor/getPatientDetail/${patient_id}`);
}

export const getAllPatient = (data) => {
    return request.get('/doctor/getAllPatient', {params: data});
}

export const getDoctorProfile = () => {
    return request.get('/doctor/getProfile');
}

export const alterDoctorProfile = (data) => {
    return request.put('doctor/alterProfile', data);
}

export const finishAppoint = (appoint_id, data) => {
    return request.put(`/doctor/finishAppoint/${appoint_id}`, data);
}


//-- 用户页面中相关接口
export const addPatientAppoint = () => {
    return request.post('/patient/addAppoint');
}

export const getPatientAppoint = (user_id, data) => {
    return request.get(`/patient/getAppoint/${user_id}`, {params: data});
}

export const getMedicalRecord = (data) => {
    return request.get('/patient/getMedicalRecord', {params: data});
}

export const getExamRecord = (data) => {
    return request.get('/patient/getExamRecord', {params: data});
}

export const getPayRecord = (user_id, data) => {
    return request.get(`/patient/getPayRecord/${user_id}`, {params: data});
}

export const finishPay = (pay_id) => {
    return request.put(`/patient/finishPay/${pay_id}`);
}