<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20" color="#fff" @click="store.commit('collapseMenu')">
                <Fold />
            </el-icon>
            <ul class="flex-box">
                <li v-for="(item, index) in selectMenu" :key="item.path" :class="{ selected: route.path === item.path }"
                    class="tab flex-box">
                    <el-icon size="12">
                        <component :is="item.icon" />
                    </el-icon>
                    <router-link class="custom-link text flex-box" :to="{ path: item.path }"> {{
                        item.name
                        }}
                    </router-link>
                    <el-icon class="close" size="12" @click="closeTab(item, index)">
                        <Close />
                    </el-icon>
                </li>
            </ul>
        </div>

        <div class="header-right">
            <el-dropdown>
                <div class="el-dropdown-link flex-box">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <p class="user-name">{{ username }}</p>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人信息</el-dropdown-item>
                        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>


<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router';

const store = useStore()  //获取全局存储store实例
const route = useRoute()  //当前路由对象（拿到当前url路径）
const router = useRouter()
// 获取全局选中过的页面
const selectMenu = computed(() => store.state.menu.selectMenu)

// 点击关闭tab
const closeTab = (item, index) => {
    store.commit('closeMenu', item)
    // 若删除非当前页tag
    if (route.path !== item.path) {
        return
    }
    const selectMenuData = selectMenu.value
    //若删除的是最后一项
    if (index === selectMenuData.length) {
        // 若删除前仅有一项，跳主页
        if (!selectMenuData.length) {
            router.push('/')
        } else {
            router.push({
                path: selectMenuData[index - 1].path
            })
        }
    } else {
        router.push({
            path: selectMenuData[index].path
        })
    }
}

// localStorage.clear();  清除本地缓存

// 获取用户名
const userInfoString = localStorage.getItem('userInfo');
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
const username = ref(userInfo && userInfo.name ? userInfo.name : userInfo?.phone_number);

// 退出登录
const logout = () => {
    // 清除 localStorage 中的用户信息
    localStorage.removeItem('pz_token')
    localStorage.removeItem('userInfo');
    localStorage.removeItem('role')
    // 跳转到登录页面
    router.push('/login');
};
</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;

    .header-left {
        height: 100%;

        .icon {
            width: 45px;
            height: 100%;
            color: black;
        }

        .icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }

        .tab {
            padding: 0 10px;
            height: 100%;

            .custom-link {
                text-decoration: none;
                /* 去掉下划线 */
                color: inherit;
                /* 可选，继承父级颜色，避免默认蓝色 */
            }

            .text {
                margin: 0 5px;
            }

            .close {
                visibility: hidden;
            }

            &.selected {
                a {
                    color: #409eff;
                }

                i {
                    color: #409eff;
                }

                background-color: #f5f5f5;
            }
        }

        .tab:hover {
            background-color: #f5f5f5;

            .close {
                visibility: inherit;
                cursor: pointer;
                color: #000;
            }
        }
    }

    .header-right {
        .user-name {
            margin-left: 10px;
        }
    }

    a {
        height: 100%;
        color: #333;
        font-size: 15px;
    }
}
</style>