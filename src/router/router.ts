import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Admin_Home from '../components/admin_layout/Admin_Home.vue';
import Doctor_Home from '../components/doctor_layout/Doctor_Home.vue';
import Patient_Home from '../components/patient_layout/Patient_Home.vue';
import instance from '../http.js';

const routes = [
    {
        path: '/login',
        component: Login
    },
    {
        path: '/admin_home',
        component: Admin_Home,
        children: [
            {
                path: '',
                component: () => import('../components/admin_layout/manager_view/index.vue')
            },
            {
                path: 'index',
                component: () => import('../components/admin_layout/manager_view/index.vue')
            },
            {
                path: 'change_password',
                component: () => import('../components/admin_layout/manager_view/change_password.vue')
            },
            {
                path: 'create_merchants',
                component: () => import('../components/admin_layout/manager_view/create_merchants.vue')
            },
            {
                path: 'delete_merchants',
                component: () => import('../components/admin_layout/manager_view/delete_merchants.vue')
            },
            {
                path: 'applications/:page',
                component: () => import('../components/admin_layout/manager_view/applications.vue')
            },
        ]
    },
    {
        path: '/doctor_home',
        component: Doctor_Home,
        props: true,
        children: [
            {
                path: '',
                component: () => import('../components/doctor_layout/doctor_view/Merchant_dashboard.vue')
            },
            {
                path: 'change_merchant_password',
                component: () => import('../components/doctor_layout/doctor_view/change_doctor_password.vue')
            },
            {
                path: 'Merchant_restaurant',
                component: () => import('../components/doctor_layout/doctor_view/Merchant_restaurant.vue'),
            },
            {
                path: '/restaurant/:restaurantID',
                component: () => import('../components/doctor_layout/doctor_view/Merchant_category.vue'),
                props: true
            }
        ]
    },
    {
        path: '/patient_home',
        component: Patient_Home,
        props: true,
        children: [
            {
                path: '',
                component: () => import('../components/patient_layout/patient_view/Merchant_dashboard.vue')
            },
            {
                path: 'change_patient_password',
                component: () => import('../components/patient_layout/patient_view/change_patient_password.vue')
            },
            {
                path: 'Merchant_restaurant',
                component: () => import('../components/patient_layout/patient_view/Merchant_restaurant.vue'),
            },
            {
                path: '/restaurant/:restaurantID',
                component: () => import('../components/patient_layout/patient_view/Merchant_category.vue'),
                props: true
            }
        ]
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/login'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    console.log('进入导航守卫');
    console.log(to);
    console.log(from);
    
    // 如果目标路径是 '/login' 页面
    if (to.path === '/login') {
        console.log('守卫进入login');
        try {
            const admin_login_response = await instance.get("/admin/login-status");
            const doctor_login_response = await instance.get("/merchant/login-status");
            const patient_login_response = await instance.get("/patient/login-status");

            // 如果管理员已经登录，跳转到管理员首页
            if (admin_login_response.status === 200) {
                return next('/admin_home');
            }
            // 如果商家已经登录，跳转到商家首页
            else if (doctor_login_response.status === 200) {
                return next('/doctor_home');
            }
            else if (patient_login_response.status === 200) {
                return next('/patient_home');
            }
            // 如果都没有登录，继续访问 login 页面
            else {
                return next(); // 继续访问 login 页面
            }
        } catch (err) {
            console.error('请求失败:', err);
            return next();  // 请求失败时继续访问 login 页面
        }
    }

    // 如果目标路径是 '/admin_home' 页面
    else if (to.path === '/admin_home') {
        try {
            const response = await instance.get("/admin/login-status");

            // 如果管理员没有登录，跳转到登录页面
            if (response.status !== 200) {
                return next('/login');
            } else {
                return next(); // 如果管理员已登录，继续访问 admin_home 页面
            }
        } catch (error) {
            console.error('请求失败:', error);
            return next('/login'); // 请求失败时跳转到 login 页面
        }
    }

    // 如果目标路径是 '/doctor_home' 页面
    else if (to.path.startsWith('/doctor_home')) {
        console.log("进入判断");
        try {
            const response = await instance.get("/doctor/login-status");

            // 如果商家没有登录，跳转到登录页面
            if (response.status !== 200) {
                return next('/login');
            } else {
                console.log("跳转成功");
                return next(); // 如果商家已登录，继续访问 merchant_home 页面
            }
        } catch (error) {
            console.error('请求失败:', error);
            return next('/login'); // 请求失败时跳转到 login 页面
        }
    }

    else if (to.path.startsWith('/patient_home')){
        console.log("进入判断");
        try{
            const response = await instance.get("/patient/login-status");

            if(response.status !== 200){
                return next('/login');
            }
            else{
                console.log("跳转成功");
                return next();
            }
        } catch(error) {
            console.error('请求失败:', error);
            return next('/login');
        }
    }

    // 对于其他路径，直接调用 next() 继续
    return next();
});

export default router;
