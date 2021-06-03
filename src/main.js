import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import './plugins';
import '@/layouts/export';
import '@/assets/style/common.scss'
/**
 * @author
 * @description 生产环境默认都使用mock，如果正式用于生产环境时，记得去掉
 */

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});
