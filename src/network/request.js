import axios from 'axios'
//引入进度条
import NProgress from 'nprogress'

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    // http://127.0.0.1:8888/api/private/v1/
    // http://timemeetyou.com:8889/api/private/v1/
    timeout: 5000,
    headers: {
      'Content-Type':'application/json; charset=UTF-8'
    },
  })
  instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  // 拦截器
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    NProgress.start();
    return config;
  }, err => {
    console.log(err);
  })
  // 响应器
  instance.interceptors.response.use(res => {
    NProgress.done();
    return res;
  }, err => {
    console.log(err);
  })
  // 发送网络请求
  return instance(config)
}
