import {createApp} from "vue";
import App from './App.vue';

import ElementPlus from 'element-plus';  // 引入 Element Plus
// import 'element-plus/dist/index.css';  // 引入 Element Plus 的样式
import Aura from '@primevue/themes/aura';  // 引入 PrimeVue 的 Aura 主题
import PrimeVue from "primevue/config";  // 引入 PrimeVue 配置
// import 'primeicons/primeicons.css';  // 引入 PrimeIcons 图标
import ToastService from "primevue/toastservice";  // 引入 PrimeVue 的 ToastService
// import 'primeicons/primeicons.css';

import router from './router/router';  // 引入 Vue Router
// import './assets/init.css'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(PrimeVue, {theme: {preset: Aura}})  // 使用 PrimeVue 配置，设置 Aura 主题
app.use(router)  // 使用 Vue Router
app.use(store) //store进行挂载
app.use(ToastService)  // 使用 PrimeVue 的 ToastService
app.use(ElementPlus)  // 使用 Element Plus

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.mount('#app');  // 挂载应用



