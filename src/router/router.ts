// import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';
import {createRouter, createWebHistory} from 'vue-router';
import {getDynamicRoutes, login} from "../api";
import store from "../store"
// 引入组件

/*
// 改为动态加载
// import Main from "../views/Main.vue"
// import AdminUser from "../views/ManagerPages/User/index.vue"
// import AdminDoctor from "../views/ManagerPages/Doctor/index.vue"
// import AdminDept from "../views/ManagerPages/Department/index.vue"
// import AdminMedicine from "../views/ManagerPages/Medicine/index.vue"
// import AdminMenu from "../views/ManagerPages/Menu/index.vue"
// import AdminRole from "../views/ManagerPages/Role/index.vue"
// import HomePage from "../views/HomePage/index.vue"
*/


// 静态路由
const staticRoutes = [
    {
        path: '/register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/login'
    }
]

// 工具函数：动态加载组件
function loadView(viewPath) {
    return () => import(`../views/${viewPath}`);
}

// 工具函数：格式化路由
function formatRoutes(routes) {
    const formattedRoutes = []; // 格式化之后的路由数据
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
    console.log(formattedRoutes, "Dynamic Route Data After Formated");
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
    console.log(from, "Come From Where?"); // 打印来源路由信息
    console.log(to, "Go To Wherer");   // 打印目标路由信息

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
            console.log("No dynamic routing loaded!!!")
            getDynamicRoutes().then(({data}) => {
                    const routesData = data.data.routes;
                    // 格式化路由并添加到路由实例中
                    const dynamicRoutes = formatRoutes(routesData);
                    dynamicRoutes.forEach(route => {
                        console.log(route, "Route")
                        router.addRoute(route);
                    });
                    console.log(dynamicRoutes, "Dynamic Route Data");
                    store.commit('setMenuData', dynamicRoutes);
                    router.hasDynamicRoutes = true;
                    return next({...to, replace: true});
                }
            )
        } catch (error) {
            console.error('获取动态路由失败', error);
            return next('/login'); // 失败时跳转到登录页
        }
    } else {
        const menuData = store.state.menu.menuData;
        console.log(menuData, "Dynamic Route Data")
    }


    // 如果是静态路由或动态路由已加载，直接放行
    next();
})


// // 定义路由规则
// const routes = [
//     // 主界面路由
//     {
//         path: '/',
//         component: () => import('../views/Main.vue'),
//         name: 'main',
//         children: [
//             {
//                 // 管理界面导航
//                 path: 'admin',
//                 meta: {
//                     id: '1',
//                     name: "管理员页面",
//                     icon: "Management",
//                 },
//                 children: [ 
//                     {
//                         path: 'home',
//                         component: () => import('../views/ManagerPages/Home/index.vue'),
//                         meta: {
//                             id: '0',
//                             name: '主页',
//                             icon: 'HomeFilled',
//                             path: '/admin/home',
//                         },
//                     },
//                     {
//                         path: 'menus',
//                         component: () => import('../views/ManagerPages/Menu/index.vue'),
//                         meta: {
//                             id: '1',
//                             name: '菜单管理', // 页面标题
//                             icon: 'CirclePlus', // 可选：侧边栏图标
//                             path: '/admin/menus'
//                         },
//                     },
//                     {
//                         path: 'users',
//                         component: () => import('../views/ManagerPages/User/index.vue'),
//                         meta: {
//                             id: '2',
//                             name: '用户管理', // 页面标题
//                             icon: 'Pear', // 可选：侧边栏图标
//                             path: '/admin/users'
//                         },
//                     },
//                     {
//                         path: 'doctors',
//                         component: () => import('../views/ManagerPages/Doctor/index.vue'),
//                         meta: {
//                             id: '3',
//                             name: '医生管理',
//                             icon: 'Grape',
//                             path: '/admin/doctors'
//                         },
//                     },
//                     {
//                         path: 'departments',
//                         component: () => import('../views/ManagerPages/Department/index.vue'),
//                         meta: {
//                             id: '4',
//                             name: '科室管理',
//                             icon: 'Orange',
//                             path: '/admin/departments'
//                         },
//                     },
//                     {
//                         path: 'medicines',
//                         component: () => import('../views/ManagerPages/Medicine/index.vue'),
//                         meta: {
//                             id: '5',
//                             name: '药品管理',
//                             icon: 'Sugar',
//                             path: '/admin/medicines'
//                         },
//                     },
//                     {
//                         path: 'item',
//                         component: () => import('../views/ManagerPages/Item/index.vue'),
//                         meta: {
//                             id: '6',
//                             name: '检查项目管理',
//                             icon: 'Stamp',
//                             path: '/admin/item'
//                         }
//                     },
//                     {
//                         path: 'appointment',
//                         component: () => import('../views/ManagerPages/Appointment/index.vue'),
//                         meta: {
//                             id: '7',
//                             name: '用户预约管理',
//                             icon: 'Stamp',
//                             path: '/admin/appointment'
//                         }
//                     },
//                     {
//                         path: 'schedule',
//                         component: () => import('../views/ManagerPages/Schedule/index.vue'),
//                         meta: {
//                             id: '8',
//                             name: '医生排班管理',
//                             icon: 'Stamp',
//                             path: '/admin/schedule'
//                         }
//                     },
//                     {
//                         path: 'financial',
//                         //component: () => import('../views/ManagerPages/Financial/index.vue'),
//                         meta: {
//                             id: '9',
//                             name: '财务管理',
//                             icon: 'Stamp',
//                             path: '/admin/financial'
//                         },
//                         children: [
//                             {
//                                 path: 'salary-payment',
//                                 component: () => import('../views/ManagerPages/Financial/SalaryAndBonus/index.vue'),
//                                 meta: {
//                                     id: '1',
//                                     name: '酬金发放',
//                                     icon: 'Stamp',
//                                     path: '/admin/financial/salary-payment'
//                                 }
//                             },
//                             {
//                                 path: 'financial-allocation',
//                                 component: () => import('../views/ManagerPages/Financial/FiscalAppropriation/index.vue'),
//                                 meta: {
//                                     id: '2',
//                                     name: '财政拨款',
//                                     icon: 'Stamp',
//                                     path: '/admin/financial/financial-allocation'
//                                 }
//                             },
//                             {
//                                 path: 'reimbursement',
//                                 component: () => import('../views/ManagerPages/Financial/Reimbursement/index.vue'),
//                                 meta: {
//                                     id: '3',
//                                     name: '报销平台',
//                                     icon: 'Stamp',
//                                     path: '/admin/financial/reimbursement'
//                                 }
//                             },
//                             {
//                                 path: 'payment-platform',
//                                 component: () => import('../views/ManagerPages/Financial/Payment/index.vue'),
//                                 meta: {
//                                     id: '4',
//                                     name: '缴费平台',
//                                     icon: 'Stamp',
//                                     path: '/admin/financial/payment-platform'
//                                 }
//                             },
//                         ]
//                     },
//                     {
//                         path: 'data',
//                         component: () => import('../views/ManagerPages/Data/index.vue'),
//                         meta: {
//                             id: '10',
//                             name: '数据统计',
//                             icon: 'Stamp',
//                             path: '/admin/data'
//                         }
//                     }

//                 ]
//             },
//             {
//                 // 医生界面导航
//                 path: 'doctor',
//                 meta: {
//                     id: '2',
//                     name: "医生页面",
//                     icon: "Management",
//                 },
//                 children: [
//                     {
//                         path: 'home',
//                         component: () => import('../views/DoctorPages/Home/index.vue'),
//                         meta: {
//                             id: '1',
//                             name: '主页',
//                             icon: 'HomeFilled',
//                             path: '/doctor/home',
//                         },
//                     },
//                     {
//                         path: 'waiting-patient',
//                         component: () => import('../views/DoctorPages/WaitingPatient/index.vue'),
//                         meta: {
//                             id: '2',
//                             name: '候诊患者',
//                             icon: 'HomeFilled',
//                             path: '/doctor/waiting-patient',
//                         },
//                     },
//                     {
//                         path: 'all-patient',
//                         component: () => import('../views/DoctorPages/AllPatient/index.vue'),
//                         meta: {
//                             id: '3',
//                             name: '历史患者',
//                             icon: 'HomeFilled',
//                             path: '/doctor/all-patient',
//                         },
//                     },
//                     {
//                         path: 'profile',
//                         component: () => import('../views/DoctorPages/Profile/index.vue'),
//                         meta: {
//                             id: '4',
//                             name: '个人信息',
//                             icon: 'HomeFilled',
//                             path: '/doctor/profile',
//                         },
//                     }
//                 ]
//             },
//             {
//                 // 患者界面导航
//                 path: 'user',
//                 meta: {
//                     id: '3',
//                     name: "用户页面",
//                     icon: "Management",
//                 },
//                 children: [
//                     {
//                         path: 'home',
//                         component: () => import('../views/UserPages/Home/index.vue'),
//                         meta: {
//                             id: '1',
//                             name: '主页',
//                             icon: 'HomeFilled',
//                             path: '/user/home',
//                         },
//                     },
//                     {
//                         path: 'appointment',
//                         component: () => import('../views/UserPages/Appointment/index.vue'),
//                         meta: {
//                             id: '2',
//                             name: '预约挂号',
//                             icon: 'HomeFilled',
//                             path: '/user/appointment',
//                         },
//                     },
//                     {
//                         path: 'medical-record',
//                         component: () => import('../views/UserPages/MedicalRecord/index.vue'),
//                         meta: {
//                             id: '3',
//                             name: '就诊记录',
//                             icon: 'HomeFilled',
//                             path: '/user/medical-record',
//                         },
//                     },
//                     {
//                         path: 'exam-record',
//                         component: () => import('../views/UserPages/ExamRecord/index.vue'),
//                         meta: {
//                             id: '4',
//                             name: '检查记录',
//                             icon: 'HomeFilled',
//                             path: '/user/exam-record',
//                         },
//                     },
//                     {
//                         path: 'bill',
//                         component: () => import('../views/UserPages/Bill/index.vue'),
//                         meta: {
//                             id: '5',
//                             name: '账单',
//                             icon: 'HomeFilled',
//                             path: '/user/bill',
//                         },
//                     },
//                     {
//                         path: 'profile',
//                         component: () => import('../views/UserPages/Profile/index.vue'),
//                         meta: {
//                             id: '6',
//                             name: '个人信息',
//                             icon: 'HomeFilled',
//                             path: '/user/profile',
//                         },
//                     }
//                 ]
//             }

//         ]
//     },
//     // 注册界面路由
//     {
//         path: '/register',
//         component: () => import('../views/Register.vue')
//     },
//     // 登录界面路由
//     {
//         path: '/login',
//         component: () => import('../views/Login.vue')
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
