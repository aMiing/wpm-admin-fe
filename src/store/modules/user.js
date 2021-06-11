/**
 * @author amingxiansen
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import {
  getUserInfo,
  login,
  logout
} from '@/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import {
  resetRouter
} from '@/router'
import {
  title,
  tokenName
} from '@/config'

const state = () => ({
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  permissions: [],
  sys_name: '',
  sys_logo: '',
  theme_name: '',
})
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
  getSysInfo: (state) => {
    return {
      sys_name: state.sys_name || '商品管理系统',
      sys_logo: state.sys_logo || 'https://gitee.com/amingxiansen/images/raw/master/logos/logo.png',
      theme_name: state.theme_name || 'default',
    }
  }
}
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setUsername(state, username) {
    state.username = username
  },

  setSysInfo(state, {
    sys_name,
    sys_logo,
    theme_name,
  }) {
    state.sys_name = sys_name
    state.sys_logo = sys_logo
    state.theme_name = theme_name
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
}
const actions = {
  setPermissions({
    commit
  }, permissions) {
    commit('setPermissions', permissions)
  },
  async login({
    commit
  }, userInfo) {
    const {
      data
    } = await login(userInfo)
    const accessToken = data[tokenName]
    if (accessToken) {
      commit('setAccessToken', accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8 ?
        '早上好' :
        hour <= 11 ?
        '上午好' :
        hour <= 13 ?
        '中午好' :
        hour < 18 ?
        '下午好' :
        '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
    }
  },
  async getUserInfo({
    commit,
    state
  }) {
    const {
      data
    } = await getUserInfo(state.accessToken)
    if (!data) {
      Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
      return false
    }
    let {
      permissions,
      name,
      avatar,
      sys_logo,
      sys_name,
      theme_name,
    } = data
    if (permissions && name && Array.isArray(permissions)) {
      commit('setPermissions', permissions)
      commit('setUsername', name)
      commit('setAvatar', avatar)
      commit('setSysInfo', {
        sys_logo,
        sys_name,
        theme_name,
      })
      return permissions
    } else {
      Vue.prototype.$baseMessage('用户信息接口异常', 'error')
      return false
    }
  },
  async logout({
    dispatch
  }) {
    await logout(state.accessToken)
    await dispatch('resetAccessToken')
    await resetRouter()
  },
  resetAccessToken({
    commit
  }) {
    commit('setPermissions', [])
    commit('setAccessToken', '')
    removeAccessToken()
  },
}
export default {
  state,
  getters,
  mutations,
  actions
}