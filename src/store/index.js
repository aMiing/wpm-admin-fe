/**
 * @author amingxiansen 1006934861@qq.com
 * @description 导入所有 vuex 模块，自动加入namespaced:true，用于解决vuex命名冲突，请勿修改。
 */

import Vue from 'vue';
import Vuex from 'vuex';
const global = require('./global.js').default;

Vue.use(Vuex);
const files = require.context('./modules', false, /\.js$/);
const modules = {};

files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default;
});
Object.keys(modules).forEach(key => {
  modules[key]['namespaced'] = true;
});

const store = new Vuex.Store({
  ...global,
  modules,
});
export default store;
