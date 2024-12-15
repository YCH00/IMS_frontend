import {createApp} from "vue";
import App from './App.vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import Aura from '@primevue/themes/aura';
import PrimeVue from "primevue/config";
import 'primeicons/primeicons.css';
import ToastService from "primevue/toastservice";
import Dialog from 'primevue/dialog';

import router from './router/router';
import store from './store';


const app = createApp(App);

// 应用插件
app.use(PrimeVue, {theme: {preset: Aura}});
app.use(router);
app.use(store);
app.use(ToastService);
app.use(ElementPlus);
app.component('Dialog', Dialog);
// 图标注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.mount('#app');
