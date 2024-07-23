import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from './axiosConfig';

const app = createApp(App);

app.config.globalProperties.$axios = axios;

app.use(router);

app.mount('#app');

app.config.globalProperties.$root.$on('user-logged-in', () => {
  app.config.globalProperties.$root.getUserInfo();
});
