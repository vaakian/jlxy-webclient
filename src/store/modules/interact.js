/* 学习界面 - 全局状态 */
import types from '../types';
import api from '../../api';
import { Toast } from 'vant';
const isToday = timestamp => {
  let now = new Date();
  let cmp = new Date(timestamp * 1000);
  return now.getFullYear() == cmp.getFullYear() &&
    now.getDate() == cmp.getDate() &&
    now.getMonth() == cmp.getMonth();
}
const state = {
  taskStatus: {},
  taskDetail: {}
}

const mutations = {
  [types.SET_TASK_STATUS](state, data) {
    // 测试数据，往后倒23.5小时
    // data = [{createTime: (new Date()).getTime() / 1000 - 23.5 * 60 * 60}];
    // 先筛选出今天的任务，那么最后放到taskStatus的绝对是今天的， -1则没有
    data = data.filter(task => isToday(task.createTime));
    if (data.length) {
      // 按创建时间降序，次要按状态升序
      data.sort((a, b) => a.status - b.status);
      data.sort((a, b) => b.createTime - a.createTime);
      state.taskStatus = data[0];
    } else {
      state.taskStatus = { status: -1 };
    }

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
    if (taskStatus.status !== undefined && taskDetail) {
      let currentTask = taskDetail[taskStatus.taskId];
      // 没获取到该任务
      if (!currentTask) return { createTime: 0, status: -1, data: [] };
      // 获取到任务，但没有数据
      if (!currentTask.data) currentTask.data = [];
      return currentTask;
    }
    // 否则一题都没有
    return { createTime: 0, data: [] };
  },
  // 历史任务列表（已完成），先将taskid索引的任务转数组
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
      let { data } = res.data;
      commit(types.SET_TASK_STATUS, data);
    }
    return res;
  },
  // 请求任务详情
  async TaskDetail({ rootGetters, commit }) {
    const res = await api.TaskDetail({
      watchId: rootGetters.currentChild.watchId
    });
    if (res.data.code == 0 && res.data.data) {
      commit(types.SET_TASK_DETAIL, res.data.data);
    } else {
      commit(types.SET_TASK_DETAIL, []);
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