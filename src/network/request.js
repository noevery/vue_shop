import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })
  // 拦截器
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
  }, err => {
    console.log(err);
  })
  // 响应器
  instance.interceptors.response.use(res => {
    return res;
  }, err => {
    console.log(err);
  })
  // 发送网络请求
  return instance(config)
}
