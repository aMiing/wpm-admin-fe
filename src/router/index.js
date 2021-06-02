/**
 * @author amingxiansen 1006934861@qq.com
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import { publicPath, routerMode } from '@/config'

Vue.use(VueRouter)
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
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/index'),
        meta: {
          title: '首页',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/management',
    component: Layout,
    redirect: 'noRedirect',
    name: 'management',
    meta: { title: '系统设置', icon: 'users-cog', permissions: ['admin'] },
    children: [
      // {
      //   path: 'userManagement',
      //   name: 'UserManagement',
      //   component: () =>
      //     import('@/views/personnelManagement/userManagement/index'),
      //   meta: { title: '用户管理' },
      // },
      // {
      //   path: 'roleManagement',
      //   name: 'RoleManagement',
      //   component: () =>
      //     import('@/views/personnelManagement/roleManagement/index'),
      //   meta: { title: '角色管理' },
      // },
      // {
      //   path: 'menuManagement',
      //   name: 'MenuManagement',
      //   component: () =>
      //     import('@/views/personnelManagement/menuManagement/index'),
      //   meta: { title: '菜单管理', badge: 'New' },
      // },
      {
        path: 'goods',
        name: 'goods',
        component: () =>
          import('@/views/management/goods/index'),
        meta: { title: '商品管理', icon: 'users-cog', permissions: ['admin'] },
      },
    ],
  },
  
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})
//注释的地方是允许路由重复点击，如果你觉得框架路由跳转规范太过严格可选择放开
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}

export function resetRouter() {
  router.matcher = new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  }).matcher
}

export default router
