import request from '@/utils/request'

const baseUrl = '/goods/'

export function getList(data) {
  return request({
    url: baseUrl + 'getList',
    method: 'get',
    data,
  })
}

export function doEdit(data, mode) {
  const uri = mode === 'edit' ? 'update' : 'create'
  return request({
    url: baseUrl + uri,
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: baseUrl + 'delete',
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