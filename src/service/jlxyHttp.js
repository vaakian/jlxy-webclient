import axios from 'axios';
import statusCode from './statusCode';
// 最好导入全局提示窗口，便于拦截器提示。
import { Toast } from 'vant';
import Cookies from 'js-cookie';
import utils from '@/utils';
const service = axios.create({
  baseURL: process.env.LOGIC_API,
  // baseURL: 'http://huanchuang.redpoint178.com',
  timeout: 60000,
  withCredentials: false, // allow cookie
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
    duration: 60000
  })
  // 登录数据
  const verify = {
    token: Cookies.get('token'),
    openid: Cookies.get('openid')
  };

  // token、openid缺一不可
  if (!verify.token || !verify.openid) {
    Toast.fail({
      message: '未登录'
    });
    return Promise.reject(new Error('未登录'));
  }


  // GET：params添加sign、token
  if (config.method == 'get') {
    // 如果学习页/userLogin登录，不用token
    if (config.url.indexOf('userLogin') == -1) config.params.token = verify.token;
    config.params.openId = verify.openid;
    const { params } = config;
    config.params.sign = utils.GenSign(params);
  } else {
    // POST 操作
    console.log(config);
  }

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
  // 不返回error|reject则被then捕获
  return Promise.error(error);
});



// 响应拦截

service.interceptors.response.use(response => {
  // 提示获取成功 （可选）
  // Toast.success({
  //   message: '响应成功',
  //   duration: 500
  // });
  Toast.clear();
  return response;
}, error => {
  // 提示响应错误

  // 不reject | error 就被then捕获了
  if (error && error.response) {
    const message = statusCode[error.response.status];
    error.message = message;
    Toast.fail(error.message);
    return Promise.reject(error);
  } else {
    Toast.fail('网络错误');
    // 无状态码，网络错误
    console.log(error);
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
  },
  async post(url, data) {
    return service({
      method: 'post',
      url,
      data,
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    });
  }
}
