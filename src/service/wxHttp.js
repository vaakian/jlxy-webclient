import axios from 'axios';
import statusCode from './statusCode';
// 导入全局提示窗口便于拦截器提示
import { Toast } from 'vant';
import Cookies from 'js-cookie';
import utils from '@/utils';
const service = axios.create({
  baseURL: process.env.BASE_API,
  // baseURL: 'http://huanchuang.redpoint178.com',
  timeout: 30000,
  withCredentials: false,
});
// 取消请求接口
const CancelToken = axios.CancelToken;

let cancel, promiseArr = {};
window.Cookies = Cookies
// 请求拦截器
service.interceptors.request.use(config => {
  // 请求数据config
  Toast.loading({
    mask: true,
    message: '加载中……',
    duration: 30000
  })
  // 请求自动带上token、openId
  config.params.token = Cookies.get('token')
  config.params.openId = Cookies.get('openid')
  if (!Cookies.get('token') || !Cookies.get('openid')) {
    Toast.fail({
      message: '未登录'
    });
  }
  const { params } = config
  config.params.sign = utils.GenSign(params)
  if (promiseArr[config.url]) {
    // 执行cancel（）取消请求
    promiseArr[config.url]('取消请求');
  }
  // 加入cancel方法
  promiseArr[config.url] = cancel;
  return config;
}, error => {
  //  提示请求错误
  Toast('请检查您的网络~');
  return Promise.error(error);
});



// 响应拦截

service.interceptors.response.use(response => {
  // 提示获取成功 （可选）
  Toast.success({
    message: '响应成功',
    duration: 500
  });
  return response;
}, error => {
  // 提示http错误码对应的错误

  if (error && error.response) {
    const message = statusCode[error.response.status];
    error.message = message;
    Toast.fail(error.message);
    return Promise.reject(error);
  } else {
    Toast.fail('网络错误');
    // 无状态码，网络错误
    return Promise.error(error);
  }
});

export default {
  async get(url, params) {
    return service({
      method: 'get',
      url,
      params,
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    });
  }
}
