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
//添加角色
export function getAddRole(roleId, roleName, roleDesc) {
  return request({
    url: 'roles',
    method: 'post',
    data: {
      roleId,
      roleName,
      roleDesc
    }
  })
}
//编辑角色
export function getEditRole(id, roleName, roleDesc) {
  return request({
    url: 'roles/' + id,
    method: 'put',
    data: {
      roleName,
      roleDesc
    }
  })
}
//根据id查询角色
export function getQueryRole(id) {
  return request({
    url: 'roles/' + id
  })
}
//删除角色
export function delRole(id) {
  return request({
    url: 'roles/' + id,
    method: 'delete'
  })
}