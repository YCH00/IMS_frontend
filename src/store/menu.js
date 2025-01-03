import {showMessage} from "../utils/message.js";
import router from "../router/router.ts";

const state = {
    menuData: [], // 动态加载的菜单数据
    isCollapse: false, // 展开与收起
    selectMenu: [] // Tabs
}

const mutations = {
    setMenuData(state, routes) {
        state.menuData = routes
        console.log(state.menuData, "菜单数据")
    },

    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    },

    addMenu(state, payload) {
        // 对数据进行去重
        if (state.selectMenu.length >= 10) {
            showMessage("最多只能打开 10 个选项卡", "warning");
        } else {
            if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
                state.selectMenu.push(payload)
            }
            router.push(payload.path)
        }
    },

    closeMenu(state, payload) {
        console.log("删除Menu")
        //找到点击数据的索引
        const index = state.selectMenu.findIndex(val => val.name === payload.name)
        //通过索引删除数组指定元素
        state.selectMenu.splice(index, 1)
    }
}


export default {
    state,
    mutations
}