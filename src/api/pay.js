import request from '@/utils/request'

export function requestPay(data) {
  return request({
    url: '/pay',
    method: 'post',
    data,
  })
}
