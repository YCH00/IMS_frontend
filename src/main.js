import {createApp} from "vue";
import App from './App.vue';

import ElementPlus from 'element-plus';  // 引入 Element Plus
import 'element-plus/dist/index.css';  // 引入 Element Plus 的样式
import 'element-ui/lib/theme-chalk/index.css';
import Aura from '@primevue/themes/aura';  // 引入 PrimeVue 的 Aura 主题
import PrimeVue from "primevue/config";  // 引入 PrimeVue 配置
import 'primeicons/primeicons.css';  // 引入 PrimeIcons 图标
import ToastService from "primevue/toastservice";  // 引入 PrimeVue 的 ToastService
import 'primeicons/primeicons.css';

import router from './router/router';  // 引入 Vue Router


createApp(App)
    .use(PrimeVue, {theme: {preset: Aura}})  // 使用 PrimeVue 配置，设置 Aura 主题
    .use(router)  // 使用 Vue Router
    .use(ToastService)  // 使用 PrimeVue 的 ToastService
    .use(ElementPlus)  // 使用 Element Plus
    .mount('#app');  // 挂载应用

