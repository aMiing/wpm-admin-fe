import request from '@/utils/request'
import {
  encryptedData
} from '@/utils/encrypt'
import {
  loginRSA,
  tokenName
} from '@/config'

export async function login(data) {
  if (loginRSA) {
    const _data = await encryptedData(data)
    console.log('data', data);
  }
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/user/userInfo',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get',
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data,
  })
}

export function updateSysInfo(data) {
  return request({
    url: '/user/updateSysInfo',
    method: 'post',
    data,
  })
}