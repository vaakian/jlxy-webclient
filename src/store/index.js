import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';
import api from '../api';
/* 导入某些子状态进行合并 */
import { study, interact } from './modules';
import types from './types';
import { Toast } from 'vant';
import utils from '../utils';
Vue.use(Vuex);

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
  childActive: childActive, // 当前选择的孩子编号
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
      return children[childActive];
    },
    vipExpireDay(state) {
      // return 30;
      const { children, childActive } = state;

      // 没有绑定手表
      if (children.length == 0) return 0;

      let currentChild = children[childActive];
      // 有绑定手表，未购买vip
      if(currentChild.vipExpire == 0) return 0;

      // 有数据
      let nowSeconds = new Date().getTime() / 1000;
      let expireSeconds = currentChild.vipExpire - nowSeconds;
      if (expireSeconds <= 0) return 0;
      let leftSeconds = expireSeconds / 60 / 60 / 24;
      return leftSeconds.toFixed(0);
    },
    haveChildren(state) {
      return state.children.length > 0;
      // return true;
    }
  },
  mutations: {
    // commit触发，同步更新state
    [types.SWITCH_CHILD](state, payload) {
      localStorage.setItem('childActive', payload);
      state.childActive = payload;
    },
    [types.SET_CHILDREN](state, payload) {
      state.children = payload;
    }
  },
  actions: {
    // dispatch触发，最后进行commit，（可选）
    async GetChildren({ commit, state }) {
      // 不带token，单独处理
      const { openId, nickName } = state.userInfo;
      if (openId && nickName) {
        const time = parseInt((new Date).getTime() / 1000);
        const res = await api.GetChildren({
          openId,
          nickName,
          time
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
      /**
       * 无法解析res的数据
       */
    },
    async WeixinPay({ commit, state, dispatch, getters }, params) {
      const { watchId } = getters.currentChild;
      if (!getters.currentChild) {
        Toast.fail('您还没有绑定孩子的手表');
        return Promise.reject('未绑定手表');
      }
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

/**
 * 1. 先写api不用await，
 * 2. actions里面使用async，await后 判断是否进行commit（async本身就是一个promise）
 * 3. async后的actions可以进一步then 做其他操作
 */


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