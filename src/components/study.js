import Status from './layout/Status';
import { mapState, mapActions, mapGetters } from 'vuex';
import types from '../store/types';
import utils from '../utils';

export default {
  name: 'Study',
  components: { Status },
  data() {
    return {
      childShow: false,
      cnDescription: {
        suanshu: '道算术题',
        hanzi: '个汉字',
        chengyu: '个成语',
        gushi: '首诗词',
        baike: '个百科知识',
        danci: '个英语单词'
      }
    }
  },
  computed: {
    // 年级转换
    transformedGrade() {
      const { grade, term } = this.currentChild;
      const gradeTable = '一二三四五六';
      return `${gradeTable[grade - 1]}年级·${term == 1 ? '上' : '下'}学期`
    },
    ...mapGetters(['currentChild', 'haveChildren', 'vipExpireDay']),
    ...mapGetters('interact', ['allFinishedTask']),
    ...mapState('study', {
      studyLog: 'studyLog'
    }),
    ...mapState('interact', ['taskStatus']),
    ...mapState([
      'children',
      'userInfo'
    ]),

    // 宝贝完成时间
    nearestDate() {
      let keys = Object.keys(this.studyLog);
      // 学习日志空，或请求失败
      if (keys.length === 0 && keys.indexOf('code') !== -1) {
        return '';
      }
      let MaxTimeStamp = 0;
      for (let i = 0; i < keys.length; ++i) {
        const subject = this.studyLog[keys[i]];
        if (subject[0].time > MaxTimeStamp) {
          MaxTimeStamp = subject[0].time;
        }
      }
      let date = utils.timeStampToDate(MaxTimeStamp);
      date = date.split('.');

      return `${date[1]}月${date[2]}日`;

    },
    childActive: {
      get() {
        return this.$store.state.childActive;
      },
      set(v) {
        this.$store.commit(types.SWITCH_CHILD, v);
      }
    },
    ableToCommit() {
      return this.taskStatus.status == -1;
    },
  },
  methods: {
    ...mapActions({
      GetStudyLog: 'study/GetStudyLog',
      QueryTask: 'interact/QueryTask',
      TaskDetail: 'interact/TaskDetail'
    }),
    SwitchToUser(userIndex) {
      // 若切换操作成功，更新信息并关闭窗口
      this.childActive = userIndex;
      this.childShow = false;
      // 可同时请求
      this.GetStudyLog();
      this.QueryTask();
      this.TaskDetail();
    }
  }
}