import { request } from "./request"

// 获取角色列表
export function getRoleList() {
  return request({
    url: 'roles'
  })
}
// 获取权限列表
export function getRightsList(type) {
  return request({
    url: 'rights/' + type
  })
}
//删除角色指定权限
export function deleteRolesRights(roled, rightld) {
  return request({
    url: 'roles/' + roled + '/rights/' + rightld,
    method: 'delete'
  })
}
//角色授权
export function allotRights(roleld, rids) {
  return request({
    url: 'roles/' + roleld + '/rights',
    method: 'post',
    data: {
      rids
    }
  })
}