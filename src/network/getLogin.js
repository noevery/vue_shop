import {request} from './request'
// 登录验证
export function getLogin(username, password) {
  return request({
    url: 'login',
    params: {
      username,
      password,
    }
  })
}