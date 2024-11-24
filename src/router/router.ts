import {createRouter, createWebHistory} from 'vue-router';
import Login from '../components/Login.vue';
import Register from "../views/Register.vue";
import Admin_Home from '../components/admin_layout/Home.vue';
import instance from '../utils/request.js';

// 定义路由规则
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
    // 管理员主页面
    {
        path: '/admin_home',
        component: Admin_Home,
        children: [
            {
                path: '',
                component: () => import('../components/admin_layout/manager_views/index.vue')
            },
            {
                path: 'index',
                component: () => import('../components/admin_layout/manager_views/index.vue')
            },
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

// 创建路由实例
const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 模式的路由
    routes, // 路由规则
});

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

    // console.log('进入导航守卫');
    // console.log(to); // 打印目标路由信息
    // console.log(from); // 打印来源路由信息
    //
    // // 如果访问登录页面
    // if (to.path === '/login' || to.path === '/register') {
    //     console.log(`守卫进入${to.path}`);
    //     try {
    //         // 检查管理员和商家登录状态
    //         const admin_login_response = await instance.get("/admin/login-status");
    //         const user_login_response = await instance.get("/user/login-status");
    //
    //         // 如果管理员已经登录，跳转到管理员首页
    //         if (admin_login_response.status === 200) {
    //             return next('/admin_home');
    //         }
    //         // 如果商家已经登录，跳转到商家首页
    //         else if (user_login_response.status === 200) {
    //             return next('/Home');
    //         }
    //         // 未登录，继续访问登录页面
    //         else {
    //             return next();
    //         }
    //     } catch (err) {
    //         console.error('请求失败:', err);
    //         return next();  // 请求失败时继续访问 login 页面
    //     }
    // }
    //
    // // 如果访问管理员主页面
    // else if (to.path === '/admin_home') {
    //     try {
    //         const response = await instance.get("/admin/login-status");
    //
    //         // 如果管理员没有登录，跳转到登录页面
    //         if (response.status !== 200) {
    //             return next('/login');
    //         } else {
    //             return next(); // 如果管理员已登录，继续访问 admin_home 页面
    //         }
    //     } catch (error) {
    //         console.error('请求失败:', error);
    //         return next('/login'); // 请求失败时跳转到 login 页面
    //     }
    // }
    //
    // // 如果访问商家主页面
    // else if (to.path.startsWith('/Home')) {
    //     console.log("进入判断");
    //     try {
    //         const response = await instance.get("/merchant/login-status");
    //
    //         // 如果商家没有登录，跳转到登录页面
    //         if (response.status !== 200) {
    //             return next('/login');
    //         } else {
    //             console.log("跳转成功");
    //             return next(); // 如果商家已登录，继续访问 merchant_home 页面
    //         }
    //     } catch (error) {
    //         console.error('请求失败:', error);
    //         return next('/login'); // 请求失败时跳转到 login 页面
    //     }
    // }
});

export default router;
