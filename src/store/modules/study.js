/* 学习界面 - 全局状态 */
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
  // 获取学习统计信息
  async GetStudyLog({ commit, state, dispatch, rootState, rootGetters }) {
    const res = await api.GetStudyLog({
      watchId: rootGetters.currentChild.watchId
    });


    // 如果没请求到数据，需要清空之前的数据
    if (Object.keys(res.data).indexOf('code') == -1) {
      commit(types.SET_STUDY_LOG, res.data);
    } else {
      commit(types.SET_STUDY_LOG, {});
    }
    return res;
  }
}



export default {
  namespaced: true,
  state,
  actions,
  mutations
}