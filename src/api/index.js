/**
 * @brief 封装异步网络请求
 * @author 熊维建
 * @date 2019年9月21日22:16:05
 */
// api已带上openid、token，只需传入业务参数
import { jlxyHttp, wxHttp } from '../service';
import utils from '../utils';

// 1. 手表列表（登录）
const GetChildren = params => {
  // login请求不带token，单独处理
  // params.sign = utils.GenSign(params);
  const res = jlxyHttp.get('userLogin', params);
  return res;
}

// 2. 学习日志（学习页面）
const GetStudyLog = params => {
  const res = jlxyHttp.get('queryStudyLog', params);
  return res;
}

// 3. 提交任务（互动页面)
const CommitTask = params => {
  const res = jlxyHttp.get('commitTask', params);
  return res;

}

// 4. 最近任务（互动页 判断 任务状态）
const QueryTask = params => {
  const res = jlxyHttp.get('queryTask', params);
  return res;
}

// 5. 任务详情（互动页 如果完成：按照任务id获得）
const TaskDetail = data => {
  const verify = {
    token: Cookies.get('token'),
    openId: Cookies.get('openid')
  };
  data = { ...data, ...verify };
  data.sign = utils.GenSign(data);
  const res = jlxyHttp.post('taskDetail', data);
  return res;
}
// 6. 任务互动（奖励）
const Interact = params => {
  const res = jlxyHttp.get('interact', params);
  return res;
}
// 微信下单
const WeixinPayOrder = params => {
  const res = wxHttp.get('/wx/pay', params)
  return res;
}

export default {
  GetStudyLog,
  WeixinPayOrder,
  GetChildren, CommitTask, QueryTask, TaskDetail,
  Interact
}  