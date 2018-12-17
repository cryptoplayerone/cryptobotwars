import Vue from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import App from './App.vue';

import '@fortawesome/fontawesome-free/css/all.css';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(Vuetify, {iconfont: 'fa'});

new Vue({
  render: h => h(App),
}).$mount('#app');
