import { request } from "./request";
//订单数据列表
export function getOrder(params) {
  return request({
    url: 'orders',
    params
  })
}
//查看物流信息
export function getProgress(id) {
  return request({
    url: '/kuaidi/' + id
  })
}