import { request } from "./request";

// 商品分类管理
export function getCate(params) {
  return request({
    url: 'categories',
    params
  })
}
// 添加分类
export function addCate(data) {
  return request({
    url: 'categories',
    method: 'post',
    data
  })
}
//  分类参数管理
export function getCateParams(id, sel) {
  return request({
    url: 'categories/'+ id + '/attributes',
    params: {
      sel
    }
  })
}
//  添加动态参数或者静态属性
export function addCateParams(id, attr_name, attr_sel, attr_vals) {
  return request({
    url: 'categories/'+ id + '/attributes',
    method: 'post',
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}
//  根据 id 查询参数
// export function getIdCate(id, attrld, attr_sel, attr_vals) {
//   return request({
//     url: 'categories/' + id + '/attributes/' + attrld,
//     params: {
//       attr_sel,
//       attr_vals
//     }
//   })
// }
//  编辑提交参数
export function modifyCateParams(id, attrId, attr_name, attr_sel, attr_vals) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrId,
    method: 'put',
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}
//  删除参数
export function deleteParams(id, attrid) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrid,
    method: 'delete'
  })
}