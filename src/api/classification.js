
import request from '@/utils/request'

//获取分类列表
export function getTypeList(data) {
  return request({
    url: '/classification/getTypeList',
    method: 'post',
    data
  })
} 
//编辑、创建分类
export function doEditType(data,mode) {
  const uri = mode === 'edit' ? 'update' : 'create'
  return request({
    url: '/classification/'+ uri,
    method: 'POST',
    data
  })
}
//删除分类
export function DeleteTypes(data) {
  return request({
    url: '/classification/delete',
    method: 'POST',
    data
  })
}