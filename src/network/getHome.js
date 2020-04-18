import { request } from './request'
//获取左侧菜单选项
export function getMenus() {
  return request({
    url: '/menus'
  })
}
