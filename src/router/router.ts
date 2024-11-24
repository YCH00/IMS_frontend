import {createRouter, createWebHistory} from 'vue-router';
import Login from '../views/Login.vue';
import Register from "../views/Register.vue";
import Admin_Home from '../components/admin_layout/Home.vue';
import Admin_Main from '../views/Admin_Home/index.vue'
import instance from '../utils/request.js';

// 定义路由挥着
const routes = [
    // 登录界面
    {
        path: '/login',
        component: Login
    },
    // 注册界面
    {
        path: '/register',
        component: Register
    },
    // 管理员界面
    {
        path: '/admin/home',
        component: Admin_Main
    },
    // 管理员界面
    {
        path: '/admin_home',
        component: Admin_Home,
        children: [
            {path: '', component: () => import('../components/admin_layout/manager_views/index.vue')},
            {path: 'index', component: () => import('../components/admin_layout/manager_views/index.vue')},
            {
                path: 'change_password',
                component: () => import('../components/admin_layout/manager_views/change_password.vue')
            },
            {
                path: 'create_merchants',
                component: () => import('../components/admin_layout/manager_views/create_merchants.vue')
            },
            {
                path: 'delete_merchants',
                component: () => import('../components/admin_layout/manager_views/delete_merchants.vue')
            },
            {
                path: 'applications/:page',
                component: () => import('../components/admin_layout/manager_views/applications.vue')
            },
        ]
    },
    // 捕获所有未匹配的路径并重定向到登录页面
    {
        path: '/:catchAll(.*)',
        redirect: '/login'
    }
]

const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 模式的路由
    routes, // 路由规则
})

// 设置全局导航守卫
router.beforeEach(async (to, from, next) => {
    if (to.path === '/login' || to.path === '/register') {
        /*
        * TODO: 检查用户是否已经登录
        *  如果已经登录 则用户则不会访问登录注册界面 直接跳转到主页
        *  目前是直接放行
        * */

        return next(); // 直接放行
    }

    /*
    * TODO: 用户状态与访问页面之间的关系
    *  比如普通用户无法访问管理员的页面
    * */

    return next(); // 直接放行
})

export default router;
