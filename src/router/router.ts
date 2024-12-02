import {createRouter, createWebHistory} from 'vue-router';
// 引入组件
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Layout from "../views/Main.vue"
import AdminUser from "../views/ManagerPages/User/index.vue"
import AdminDoctor from "../views/ManagerPages/Doctor/index.vue"
import AdminDept from "../views/ManagerPages/Department/index.vue"
import AdminMedicine from "../views/ManagerPages/Medicine/index.vue"
import AdminMenu from "../views/ManagerPages/Menu/index.vue"
import AdminRole from "../views/ManagerPages/Role/index.vue"
import HomePage from "../views/HomePage/index.vue"
// import instance from '../utils/request.js';
// 定义路由规则
const routes = [
    // 主界面路由
    {
        path: '/',
        component: Layout,
        name: 'main',
        children: [
            {
                path: 'home',
                component: HomePage,
                meta: {
                    id: '1',
                    name: '主页',
                    icon: 'HomeFilled',
                    path: '/home',
                    component: () => import('../views/Admin/home.vue')
                },
            },
            {
                // 管理界面导航
                path: '/admin',
                meta: {
                    id: '2',
                    name: "后台管理",
                    icon: "Management",
                },
                children: [
                    {
                        path: 'roles',
                        component: AdminRole,
                        meta: {
                            id: '0',
                            name: '角色管理', // 页面标题
                            icon: 'UserFilled', // 可选：侧边栏图标
                            path: '/admin/roles'
                        },
                    },
                    {
                        path: 'menus',
                        component: AdminMenu,
                        meta: {
                            id: '1',
                            name: '菜单管理', // 页面标题
                            icon: 'CirclePlus', // 可选：侧边栏图标
                            path: '/admin/menus'
                        },
                    },
                    {
                        path: 'users',
                        component: AdminUser,
                        meta: {
                            id: '2',
                            name: '用户管理', // 页面标题
                            icon: 'Pear', // 可选：侧边栏图标
                            path: '/admin/users'
                        },
                    },
                    {
                        path: 'doctors',
                        component: AdminDoctor,
                        meta: {
                            id: '3',
                            name: '医生管理',
                            icon: 'Grape',
                            path: '/admin/doctors'
                        },
                    },
                    {
                        path: 'departments',
                        component: AdminDept,
                        meta: {
                            id: '4',
                            name: '科室管理',
                            icon: 'Orange',
                            path: '/admin/departments'
                        },
                    },
                    {
                        path: 'medicines',
                        name: 'AdminMedicine',
                        component: AdminMedicine,
                        meta: {
                            id: '5',
                            name: '药品管理',
                            icon: 'Sugar',
                            path: '/admin/medicines'
                        },
                    }
                ]
            }
        ]
    },
    // 注册界面路由
    {
        path: '/register',
        component: Register
    },
    // 登录界面路由
    {
        path: '/login',
        component: Login
    },
    // 非法路由
    {
        path: '/:catchAll(.*)',
        redirect: '/login'
    }
]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 模式的路由
    routes, // 路由规则
});

// 设置全局导航守卫
router.beforeEach(async (to, from, next) => {
    console.log('进入导航守卫');
    console.log(to); // 打印目标路由信息
    console.log(from); // 打印来源路由信息

    return next();
});

export default router;
