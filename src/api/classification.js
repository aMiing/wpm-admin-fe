
import request from '@/utils/request'
const baseUrl = '/categories/'
//获取分类列表
export function getTypeList(data) {
  return request({
    url: baseUrl+'getTypeList',
    method: 'post',
    data
  })
} 
//编辑、创建分类
export function doEditType(data,mode) {
  const uri = mode === 'edit' ? 'update' : 'create'
  return request({
    url: baseUrl+''+ uri,
    method: 'POST',
    data
  })
}
//删除分类
export function DeleteTypes(data) {
  return request({
    url: baseUrl+'delete',
    method: 'POST',
    data
  })
}