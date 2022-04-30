import request from '@/utils/request';

const baseUrl = '/order/';

export function getList(data) {
  return request({
    url: baseUrl + 'getList',
    method: 'post',
    data,
  });
}

export function createOrder(data) {
  return request({
    url: baseUrl + 'create',
    method: 'post',
    data,
  });
}

export function getDataPreview(data) {
  return request({
    url: baseUrl + 'getDataPreview',
    method: 'post',
    data,
  });
}

export function getOrderStatistics(data) {
  return request({
    url: baseUrl + 'getOrderStatistics',
    method: 'post',
    data,
  });
}
