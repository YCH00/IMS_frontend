const state = {
    isCollapse: false, // 展开与收起
    selectMenu: [] // Tabs
}

const mutations = {
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    },

    addMenu(state, payload) {
        // 对数据进行去重
        if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
            state.selectMenu.push(payload)
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