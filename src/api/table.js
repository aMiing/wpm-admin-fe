import request from '@/utils/request'

const baseUrl = '/table/'

export function getList(data) {
  return request({
    url: baseUrl + 'getList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: baseUrl + 'doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: baseUrl + 'doDelete',
    method: 'post',
    data,
  })
}
export function doOffOrOn(data) {
  return request({
    url: baseUrl + 'doOffOrOn',
    method: 'post',
    data,
  })
}
export function resetStock(data) {
  return request({
    url: baseUrl + 'resetStock',
    method: 'post',
    data,
  })
}
