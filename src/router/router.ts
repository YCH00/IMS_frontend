import {createRouter, createWebHistory} from 'vue-router';
import instance from "../utils/request";
import {getDynamicRoutes} from "../api";
import store from "../store"
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

// 静态路由
const staticRoutes = [
    {
        path: '/register',
        component: Register
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/login'
    }
]

// 工具函数：动态加载组件
function loadView(viewPath) {
    return () => import(`../views/${viewPath}.vue`);
}

// 工具函数：格式化路由
function formatRoutes(routes) {
    const formattedRoutes = [];
    routes.forEach(route => {
        const {path, component, meta, children} = route;
        const formattedRoute = {
            path,
            component: component ? loadView(component) : null,
            meta: meta || {},
            children: children ? formatRoutes(children) : null
        };
        formattedRoutes.push(formattedRoute);
    });
    return formattedRoutes;
}

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes: staticRoutes // 初始加载静态路由
});

// 添加标志避免重复加载动态路由
router.hasDynamicRoutes = false;

// 路由守卫
router.beforeEach(async (to, from, next) => {
    console.log('进入导航守卫');
    console.log(to, "从哪里来"); // 打印目标路由信息
    console.log(from, "到哪里去"); // 打印来源路由信息
    const token = localStorage.getItem('token'); // 从localStorage中获取token

    // 允许未登录用户访问的白名单
    const whiteList = ['/login', '/register'];

    // 如果未登录且目标路由不在白名单中，则跳转到登录页
    if (!token && !whiteList.includes(to.path)) {
        console.log("没有token, 跳转到登录界面")
        return next('/login');
    }

    // 如果未加载动态路由，向后端请求并添加
    if (token && !router.hasDynamicRoutes) {
        try {
            console.log("没有加载动态路由")
            // 请求后端动态路由并等待完成
            const {data} = await getDynamicRoutes();
            const routesData = data.data.routes;

            console.log(routesData, "从后端获取的路由数据");
            // 格式化路由并添加到路由实例中
            const dynamicRoutes = formatRoutes(routesData);
            console.log(dynamicRoutes, "格式化之后的路由数据");
            dynamicRoutes.forEach(route => {
                router.addRoute(route);
            });
            console.log(router, "加入动态路由之后的路由实例");
            router.hasDynamicRoutes = true;

            // 根据后端返回的路由数据生成菜单
            store.commit('setMenuData', routesData);

            // 重新导航到目标路由，确保新路由生效
            return next({...to, replace: true});
        } catch (error) {
            console.error('获取动态路由失败', error);
            return next('/login'); // 失败时跳转到登录页
        }
    }

    // 如果是静态路由或动态路由已加载，直接放行
    next();
})

// // 定义路由规则
// const routes = [
//     // 主界面路由
//     {
//         path: '/',
//         component: Layout,
//         name: 'main',
//         children: [
//             {
//                 path: 'home',
//                 component: HomePage,
//                 meta: {
//                     id: '1',
//                     name: '主页',
//                     icon: 'HomeFilled',
//                     path: '/home',
//                     component: () => import('../views/Admin/home.vue')
//                 },
//             },
//             {
//                 // 管理界面导航
//                 path: '/admin',
//                 meta: {
//                     id: '2',
//                     name: "后台管理",
//                     icon: "Management",
//                 },
//                 children: [
//                     {
//                         path: 'roles',
//                         component: AdminRole,
//                         meta: {
//                             id: '0',
//                             name: '角色管理', // 页面标题
//                             icon: 'UserFilled', // 可选：侧边栏图标
//                             path: '/admin/roles'
//                         },
//                     },
//                     {
//                         path: 'menus',
//                         component: AdminMenu,
//                         meta: {
//                             id: '1',
//                             name: '菜单管理', // 页面标题
//                             icon: 'CirclePlus', // 可选：侧边栏图标
//                             path: '/admin/menus'
//                         },
//                     },
//                     {
//                         path: 'users',
//                         component: AdminUser,
//                         meta: {
//                             id: '2',
//                             name: '用户管理', // 页面标题
//                             icon: 'Pear', // 可选：侧边栏图标
//                             path: '/admin/users'
//                         },
//                     },
//                     {
//                         path: 'doctors',
//                         component: AdminDoctor,
//                         meta: {
//                             id: '3',
//                             name: '医生管理',
//                             icon: 'Grape',
//                             path: '/admin/doctors'
//                         },
//                     },
//                     {
//                         path: 'departments',
//                         component: AdminDept,
//                         meta: {
//                             id: '4',
//                             name: '科室管理',
//                             icon: 'Orange',
//                             path: '/admin/departments'
//                         },
//                     },
//                     {
//                         path: 'medicines',
//                         name: 'AdminMedicine',
//                         component: AdminMedicine,
//                         meta: {
//                             id: '5',
//                             name: '药品管理',
//                             icon: 'Sugar',
//                             path: '/admin/medicines'
//                         },
//                     }
//                 ]
//             }
//         ]
//     },
//     // 注册界面路由
//     {
//         path: '/register',
//         component: Register
//     },
//     // 登录界面路由
//     {
//         path: '/login',
//         component: Login
//     },
//     // 非法路由
//     {
//         path: '/:catchAll(.*)',
//         redirect: '/login'
//     }
// ]

// // 创建路由实例
// const router = createRouter({
//     history: createWebHistory(), // 使用 HTML5 模式的路由
//     routes, // 路由规则
// });

// // 设置全局导航守卫
// router.beforeEach(async (to, from, next) => {
//     console.log('进入导航守卫');
//     console.log(to); // 打印目标路由信息
//     console.log(from); // 打印来源路由信息
//
//     return next();
// });

export default router;
