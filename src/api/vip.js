import request from '@/utils/request'

const baseUrl = '/vip/'

export function getList() {
  return request({
    url: baseUrl + 'getList',
    method: 'post',
  })
}

export function create(data) {
  return request({
    url: baseUrl + 'create',
    method: 'post',
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

// export function updateBalance(data) {
//   return request({
//     url: baseUrl + 'updateBalance',
//     method: 'post',
//     data,
//   })
// }