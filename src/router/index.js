/**
 * @author amingxiansen 1006934861@qq.com
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layouts';
import { publicPath, routerMode } from '@/config';

Vue.use(VueRouter);
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index'),
    hidden: true,
  },
  {
    path: '/',
    name: 'Reception',
    component: () => import('@/views/reception'),
    hidden: true,
    meta: {
      title: '前台',
    },
  },
  {
    path: '/personalCenter',
    name: 'PersonalCenter',
    component: () => import('@/views/personalCenter'),
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
];

export const asyncRoutes = [
  {
    path: '/goods',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '商品管理',
      icon: 'volleyball-ball',
    },
    children: [
      {
        path: 'classification',
        name: 'classification',
        component: () => import('@/views/classification/classification'),
        meta: {
          title: '分类列表',
          icon: 'gift',
        },
      },
      {
        path: 'stock',
        name: 'stock',
        component: () => import('@/views/stock/index'),
        meta: {
          title: '库存管理',
          icon: 'box',
        },
      },
      {
        path: 'create',
        name: 'create',
        component: () => import('@/views/create/index'),
        meta: {
          title: '新增商品',
          icon: 'folder-plus',
        },
      },
    ],
  },
  {
    path: '/vip',
    name: 'vip',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '会员管理',
      icon: 'crown',
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/vip/list/index'),
        meta: {
          title: '会员列表',
          icon: 'users',
        },
      },
      {
        path: 'privilege',
        name: 'privilege',
        component: () => import('@/views/vip/privilege/index'),
        meta: {
          title: '会员活动',
          icon: 'user-secret',
        },
      },
    ],
  },

  {
    path: '/data',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '销售数据',
      icon: 'chart-line',
      permissions: ['admin'],
    },
    children: [
      {
        path: 'analyse',
        name: 'analyse',
        component: () => import('@/views/analyse/index'),
        meta: {
          title: '数据统计',
          icon: 'chart-pie',
        },
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/order/index'),
        meta: {
          title: '订单列表',
          icon: 'book',
        },
      },
    ],
  },
  {
    path: '/management',
    name: 'management',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '系统设置',
      icon: 'cogs',
      permissions: ['admin'],
    },
    children: [
      {
        path: 'systemInfo',
        name: 'systemInfo',
        component: () => import('@/views/management/systemConfig/index'),
        meta: {
          title: '系统设置',
          icon: 'cog',
          badge: 'New',
        },
      },
    ],
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
});
//注释的地方是允许路由重复点击，如果你觉得框架路由跳转规范太过严格可选择放开
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

export function resetRouter() {
  router.matcher = new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  }).matcher;
}

export default router;
