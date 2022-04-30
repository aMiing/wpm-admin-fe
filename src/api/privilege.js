/**
 * 会员活动
 */
import request from '@/utils/request';

const baseUrl = '/privilege/';

export function getPrivilege() {
  return request({
    url: baseUrl + 'getPrivilege',
    method: 'get',
  });
}

export function updatePrivilege(data) {
  return request({
    url: baseUrl + 'setPrivilege',
    method: 'post',
    data,
  });
}
