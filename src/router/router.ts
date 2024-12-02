import {createRouter, createWebHistory} from 'vue-router';
// 定义路由规则
const routes = [
    // 主界面路由
    {
        path: '/',
        component: () => import('../views/Main.vue'),
        name: 'main',
        children: [
            {
                path: 'home',
                component: () => import('../views/HomePage/index.vue'),
                meta: {
                    id: '1',
                    name: '主页',
                    icon: 'HomeFilled',
                    path: '/home',
                    component: () => import('../views/Admin/home.vue')  // 这个是干嘛的？ 似乎没有用
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
                        path: 'menus',
                        component: () => import('../views/ManagerPages/Menu/index.vue'),
                        meta: {
                            id: '0',
                            name: '菜单管理', // 页面标题
                            icon: 'CirclePlus', // 可选：侧边栏图标
                            path: '/admin/menus'
                        },
                    },
                    {
                        path: 'users',
                        component: () => import('../views/ManagerPages/User/index.vue'),
                        meta: {
                            id: '1',
                            name: '用户管理', // 页面标题
                            icon: 'Pear', // 可选：侧边栏图标
                            path: '/admin/users'
                        },
                    },
                    {
                        path: 'doctors',
                        component: () => import('../views/ManagerPages/Doctor/index.vue'),
                        meta: {
                            id: '2',
                            name: '医生管理',
                            icon: 'Grape',
                            path: '/admin/doctors'
                        },
                    },
                    {
                        path: 'departments',
                        component: () => import('../views/ManagerPages/Department/index.vue'),
                        meta: {
                            id: '3',
                            name: '科室管理',
                            icon: 'Orange',
                            path: '/admin/departments'
                        },
                    },
                    {
                        path: 'medicines',
                        name: 'AdminMedicine',
                        component: () => import('../views/ManagerPages/Medicine/index.vue'),
                        meta: {
                            id: '4',
                            name: '药品管理',
                            icon: 'Sugar',
                            path: '/admin/medicines'
                        },
                    },
                    {
                        path: 'item',
                        name: 'AdminItem',
                        component: () => import('../views/ManagerPages/Item/index.vue'),
                        meta: {
                            id: '5',
                            name: '检查项目管理',
                            icon: 'Stamp',
                            path: '/admin/item'
                        }
                    }
                ]
            }
        ]
    },
    // 注册界面路由
    {
        path: '/register',
        component: () => import('../views/Register.vue')
    },
    // 登录界面路由
    {
        path: '/login',
        component: () => import('../views/Login.vue')
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
    console.log('to: ', to); // 打印目标路由信息
    console.log('from: ', from); // 打印来源路由信息

    return next();
});

export default router;
