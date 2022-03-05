import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import './plugins';
import '@/layouts/export';
import '@/assets/style/common.scss';
/**
 * @author
 * @description
 */

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
