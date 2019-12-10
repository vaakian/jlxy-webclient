import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';
import api from '../api';
import { study, interact } from './modules';
import types from './types';
import { Toast } from 'vant';
import utils from '../utils';
Vue.use(Vuex);


/* ----- debug ------ */
// Cookies.set('token', 'none')
// Cookies.set('openid', 'oEgLkskV4p8fuhcIT-Srz8EhdX7o')
// Cookies.set('nickname', 'Eugene')
/* ----- debug ------ */


// 从本地缓存、cookies读入数据
const userInfo = {
  openId: Cookies.get('openid'),
  token: Cookies.get('token'),
  headImgUrl: Cookies.get('headimgurl'),
  nickName: Cookies.get('nickname')
}
const childActive = localStorage.getItem('childActive') || 0;
// 根节点状态，适用于全局
const state = {
  children: [
  ],
  childActive, // 当前选择的孩子编号
  userInfo
}


export default new Vuex.Store({
  modules: {
    // 子节点的数据
    study,
    interact
  },
  state,
  getters: {
    currentChild(state) {
      const { children, childActive } = state;
      if (children.length == 0) return false;
      let child = children[childActive];
      if (!child) {
        localStorage.setItem('childActive', 0);
        state.childActive = 0;
        return children[0];
      }
      return child;
    },
    // 返回剩余天数取整数
    vipExpireDay(state) {
      // return 30;
      const { children, childActive } = state;

      // 没有绑定手表
      if (children.length == 0) return 0;

      let currentChild = children[childActive];
      // 有绑定手表，未购买vip
      if (currentChild.vipExpire == 0) return 0;

      // 有数据
      let nowSeconds = new Date().getTime() / 1000;
      let expireSeconds = currentChild.vipExpire - nowSeconds;
      if (expireSeconds <= 0) return 0;
      let leftSeconds = expireSeconds / 60 / 60 / 24;
      return leftSeconds.toFixed(0);
    },
    // 有绑定手表状态
    haveChildren(state) {
      return state.children.length > 0;
    }
  },
  mutations: {
    // commit触发，同步更新state
    [types.SWITCH_CHILD](state, payload) {
      localStorage.setItem('childActive', payload);
      state.childActive = payload;
    },
    [types.SET_CHILDREN](state, payload) {

      let cachedChildren = localStorage.getItem('children');
      if (cachedChildren) {
        cachedChildren = JSON.parse(cachedChildren);
        console.log({ cachedChildren })
        // 从缓存，读children，并修改信息
        payload = payload.map(child => {
          cachedChildren.forEach(cachedChild => {
            if (cachedChild.watchId == child.watchId) {
              child.nickName = cachedChild.nickName || '宝贝-' + child.uid;
              child.img = cachedChild.img || 'default';
              child.grade = cachedChild.grade;
              child.term = cachedChild.term;
            }
          });
          return child;
        });
      }
      // 最后设置默认昵称
      payload = payload.map(child => {
        child.nickName = child.nickName || '宝贝-' + child.uid;
        child.img = child.img || 'default';
        return child;
      });

      // 测试代码
      // state.children = [...payload,];
      state.children = payload;
    }
  },
  actions: {
    // dispatch触发，最后进行commit，（可选）
    async AccountMigrate({ state }, params) {
      const { openId } = state.userInfo;
      const res = await api.AccountMigrate({ openId, ...params });
      return res;
    },
    async GetChildren({ commit, state }) {
      // 不带token，单独处理
      const { openId, nickName } = state.userInfo;
      if (openId && nickName) {
        const time = parseInt((new Date).getTime() / 1000);
        const res = await api.GetChildren({
          openId,
          nickName,
          time,
          from: 1
        });
        console.log(res.data);
        if (res.data && res.data.code == 0) {
          if (res.data.code == 0) {
            // 更新最新的token
            Cookies.set('token', res.data.data.token);
            const { children } = res.data.data;
            children instanceof Object
              ? commit(types.SET_CHILDREN, utils.ObjToArr(children))
              : commit(types.SET_CHILDREN, children);
          }
        }
        return res;
      }
      return Promise.reject('未登录');
    },
    async WeixinPay({ commit, state, dispatch, getters }, params) {
      const { watchId } = getters.currentChild;
      if (!getters.currentChild) {
        Toast.fail('您还没有绑定孩子的手表');
        return Promise.reject('未绑定手表');
      }
      // 有孩子则向服务器进行下单
      params.watchId = watchId;
      const res = await api.WeixinPayOrder(params);
      const orderInfo = res.data;

      // 调用微信支付
      if (orderInfo.package) {
        orderInfo.paySign = orderInfo.sign;
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          // 订单信息
          orderInfo,
          payRes => {
            if (payRes.err_msg == "get_brand_wcpay_request:ok") {
              Toast.success('支付成功');
              setTimeout(() => {
                location.reload();
              }, 1800);
            } else if (payRes.err_msg == "get_brand_wcpay_request:cancel") {
              Toast.fail('您取消了支付');
            }
          });
      }
      return res;
    }
  }
})



/*
NJVYC-BMHX2-G77MM-4XJMR-6Q8Qg
NJVYC-BMHX2-G77MM-4XJMR-6Q8Qh
NJVYC-BMHX2-G77MM-4XJMR-6Q8Qi
NJVYC-BMHX2-G77MM-4XJMR-6Q8Qj
NJVYC-BMHX2-G77MM-4XJMR-6Q8Qk
NJVYC-BMHX2-G77MM-4XJMR-6Q8Ql
NJVYC-BMHX2-G77MM-4XJMR-6Q8Qm
NJVYC-BMHX2-G77MM-4XJMR-6Q8Qn
*/