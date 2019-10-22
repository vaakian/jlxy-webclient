/**
 * @brief 学习界面 - 全局状态
 */
import types from '../types';
import api from '../../api';

const state = {
  studyLog: {
  }
}
const mutations = {
  [types.SET_STUDY_LOG](state, payload) {
    state.studyLog = payload;
  }
}
const actions = {
  /**
   * @brief 获取学习统计信息
   */
  async GetStudyLog({ commit, state, dispatch, rootState, rootGetters }) {
    const res = await api.GetStudyLog({
      watchId: rootGetters.currentChild.watchId
    });


    // 请求到数据，没请求到，清空之前的数据！
    if (Object.keys(res.data).indexOf('code') == -1) {
      commit(types.SET_STUDY_LOG, res.data);
    } else {
      commit(types.SET_STUDY_LOG, {});
    }
    return res;
  }
}



export default {
  namespaced: true, // false注入到根节点，方便调用。(若项目较大，不注入根节点，避免重名)
  state,
  actions,
  mutations
}