import { request } from './request'

// 用户数据列表
export function getUserList(query, pagenum, pagesize) {
  return request({
    url: '/users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}
// 修改用户状态
export function modifyUserStatus(uld, type) {
  return request({
    url: 'users/'+uld + '/state/' + type,
    method: 'put'
  })
}
// 添加用户
export function addUsers(params) {
  return request({
    url: 'users',
    method: 'post',
     params // : {
    //   username,
    //   password,
    //   email,
    //   mobile
    // }
  })
}
//根据用户id查询
export function getUserId(id) {
  return request({
    url: '/users/' + id
  })
}
// 修改用户信息
export function editUser(id, email, mobile) {
  return request({
    url: '/users/' + id,
    method: 'put',
    params: {
      email,
      mobile
    }
  })
}
// 删除用户
export function deleteUser(id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}