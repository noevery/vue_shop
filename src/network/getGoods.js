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