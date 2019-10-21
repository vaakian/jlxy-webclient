/**
 * @brief 学习界面 - 全局状态
 */
import types from '../types';
import api from '../../api';
import { Toast } from 'vant';
const state = {
  taskStatus: {},
  taskDetail: {}
}

const mutations = {
  [types.SET_TASK_STATUS](state, payload) {
    state.taskStatus = payload;
    // state.taskStatus.status = 2;
  },
  [types.SET_TASK_DETAIL](state, payload) {
    state.taskDetail = payload;
  }
}


const getters = {
  // 互动页布置的任务
  currentTask(state) {
    const { taskDetail, taskStatus } = state;
    if (taskStatus.status !== undefined && taskStatus.status != 1 && taskDetail) {
      let currentTask = taskDetail[taskStatus.taskId];
      // 没获取到该任务
      if (!currentTask) return {createTime: 0, status: -1, data: [] };
      // 获取到任务，但没有数据
      if (!currentTask.data) currentTask.data = [];
      return currentTask;
    }
    // 否则一题都没有
    return { createTime: 0, data: [] };
  },
  // 历史任务列表（已完成），taskid索引的任务转数组
  allFinishedTask(state) {
    const { taskDetail } = state;
    let result = [];
    if (taskDetail) {
      let keys = Object.keys(taskDetail);
      for (let k = 0; k < keys.length; ++k) {
        let task = taskDetail[keys[k]];
        if (task.status != 1 && task.data)
          result.push(taskDetail[keys[k]]);
      }
      console.log({ result, taskDetail });
      return result;
    }
    return [];
  }
}
const actions = {
  // 1. 请求任务状态
  async QueryTask({ rootGetters, commit }) {
    const res = await api.QueryTask({
      watchId: rootGetters.currentChild.watchId,
      count: 10
    });
    // 正常返回
    if (res.data.code == 0 && res.data.data instanceof Array) {
      // -1代表没有任何任务详情
      let {data} = res.data;
      data = data.filter(task => [1, 2].indexOf(task.status) != -1);
      if(data.length) {
        // 排序
        data.sort((a, b) => b.createTime-a.createTime);
        data.sort((a, b) => a.status-b.status);
        console.log({data});
      }
      commit(types.SET_TASK_STATUS, data[0] || { status: -1 });
    }
    return res;
  },
  // 2. 请求任务详情
  async TaskDetail({ rootGetters, commit }) {
    const res = await api.TaskDetail({
      watchId: rootGetters.currentChild.watchId
    });
    if (res.data.code == 0 && res.data.data) {
      commit(types.SET_TASK_DETAIL, res.data.data);
    }
  },

  // 提交任务
  async CommitTask({ rootGetters }, { subject, grade, term, type }) {
    if (!rootGetters.currentChild) {
      Toast.fail('您还未绑定孩子的手表');
      return Promise.reject('未绑定手表');
    }
    const res = await api.CommitTask({
      subject,
      grade,
      term,
      type,
      watchId: rootGetters.currentChild.watchId
    });
    return res;
  },
  async Interact({ rootGetters, state }, remarkId) {
    if (state.taskStatus.status == 2) {
      const res = await api.Interact({
        remarkId,
        watchId: rootGetters.currentChild.watchId,
        taskId: state.taskStatus.taskId
      });
      return res;
    }
    return Promise.reject('非法奖励\nstatus != 2');
  }
}



export default {
  namespaced: true, // false注入到根节点，方便调用。(若项目较大，不注入根节点，避免重名)
  state,
  getters,
  actions,
  mutations
}