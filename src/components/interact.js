import { Toast } from 'vant';
import { mapActions, mapGetters, mapState } from 'vuex';
import utils from '../utils';
import GradeAdapter from './js/adapter';
import taskCase from './js/taskCase';
import Dilog from './layout/Dilog';
import Qtable from './layout/Qtable';
import Remark from './layout/Remark';
import Status from './layout/Status';
export default {
  name: 'interact',
  components: { Status, Dilog, Qtable, Remark },
  data() {
    return {
      folded: true,
      showDilog: false,
      showInteract: false,
      countDown: {
        begin: 0,
        left: '00:00:00'
      },
      examOption: {
        selected: {
          subject: 0,
          grade: 0,
          studyType: 0
        },
      },
      timer: null,
      ...taskCase
    }
  },
  computed: {
    ...mapGetters(['haveChildren', 'currentChild', 'vipExpireDay']),
    ...mapGetters('interact', ['allFinishedTask', 'currentTask']),
    ...mapState('interact', ['taskDetail', 'taskStatus']),
    ...mapState(['childActive']),
    finishTip() {
      const { status } = this.taskStatus;
      const table = {
        3: '已完成奖励',
        4: '已领取奖励',
        6: '点评超时'
      }
      return table[status] || '任务已完成';
    },

    ableToCommit() {
      return !this.haveChildren || this.taskStatus.status == -1 || this.taskStatus == 0;
    },
    timeStampToDate() {
      return utils.timeStampToDate(this.taskStatus.createTime);
    },
    // 已选择任务内容转换
    selectedMissionContent() {
      const { selected } = this.examOption;
      if (selected.subject == -1) return {
        title: '未选择科目',
        type: 'none'
      }
      const tiku = this.subjects[selected.subject].name;
      const grade = this.grades[selected.grade].name + '（' + this.grades[selected.grade].lv + '）';
      const studyType = this.studyTypes[selected.studyType];
      return {
        title: tiku + ' ' + grade + studyType + '题',
        type: this.subjects[selected.subject].type // subject
      }
    },
    missionContent() {
      const { taskStatus } = this;
      const cnGrade = '一二三四五六';
      const cnTerm = ['上', '下'];
      if (taskStatus.subject) {

        const subject = this.subjects[taskStatus.subject - 1];
        const grade = cnGrade[taskStatus.grade - 1];
        const term = cnTerm[taskStatus.term - 1];
        const type = this.studyTypes[taskStatus.type - 1];
        return {
          title: `${subject.name} ${grade}年级（${term}）${type}题`,
          type: subject.type
        }
      } else {
        return false;
      }
    }
    // 待定完成任务内容转换
  },
  activated() {

    // 如果不能发布任务，则开始倒计时。
    if (!this.ableToCommit) {
      this.StartTimeDown();
    }
  },
  watch: {
    // 监视任务状态，如果有变化，如果不能发布任务，就开始倒计时
    // 且：固定选择的题库、禁止点击
    taskStatus(to, from) {
      if (!this.ableToCommit) {
        this.StartTimeDown();
      } else {
        clearInterval(this.timer);
      }
    },
    // 切换孩子，清空已选项
    childActive(to, from) {
      this.examOption.selected = {
        subject: 0,
        grade: 0,
        studyType: 0
      }
    }
  },
  methods: {
    ...mapActions('interact', ['CommitTask', 'QueryTask', 'TaskDetail', 'Interact']),
    OnReloadTask() {
      // this.GetStudyLog();
      this.QueryTask();
      this.TaskDetail();
    },
    OnConfirmInteract(remarkId) {
      // 点评代码合法
      if ([1, 2, 3].indexOf(remarkId) != -1) {
        this.Interact(remarkId).then(res => {
          let { data } = res;
          if (data.code == 0) {
            Toast.success({
              message: '奖励成功',
              duration: 1700
            });
            setTimeout(() => {
              window.location.reload();
            }, 1700)
          } else {
            Toast.fail(data.msg || '错误代码: ' + data.code);
          }
          this.showInteract = false;
        }).catch(err => {
          console.log(err);
          Toast.fail(err);
          this.showInteract = false;
        })
      }
    },
    OnSelectSubject(subject, subjectIndex) {
      if (this.vipExpireDay || !subject.locked) {
        //  用户是vip || 没上锁
        if ([0, 1].indexOf(this.examOption.selected.grade) != -1 && [2, 5].indexOf(subject.id) != -1) {
          // 已经选择了一年级，且题库选择了成语、百科
          Toast({
            message: '一年级没有成语和百科哦',
            duration: 1500
          });
        } else {
          // 正常选择
          this.examOption.selected.subject = subjectIndex;
        }

      } else {
        // 上两条都不满足：不是vip、且上锁了
        Toast({
          message: '加入高级VIP解锁全部内容',
          duration: 1500
        });
      }

    },
    OnSelectGrade(grade, index) {
      if (!grade.locked) this.examOption.selected.grade = index;
      const { selected } = this.examOption;
      // 选了一年级，且是上面题库是 成语、百科
      if ([0, 1].indexOf(index) != -1 && [2, 5].indexOf(this.subjects[selected.subject].id) != -1) {
        Toast({
          message: '一年级没有成语和百科哦',
          duration: 1500
        });
        selected.subject = 0;
      }
    },
    // 确认发布任务弹窗
    OnConfirmCommit() {
      if (this.examOption.selected.subject == -1) {
        Toast.fail('未选择题库');
        return;
      }
      if (!this.haveChildren) {
        Toast.fail('您还未绑定孩子的手表');
        return;
      }
      this.showDilog = true;
    },
    // 确认发送任务到服务器
    OnConfirmNewMission() {
      this.showDilog = false;
      Toast.loading({
        mask: true,
        duration: 10000,
        message: '发布中……'
      });
      const { selected } = this.examOption;
      // 使用适配器将数字11 转换为 {grade: 6, term: 2}
      let gradeTerm = GradeAdapter.numToSet(selected.grade);
      const params = {
        subject: this.subjects[selected.subject].id,
        grade: gradeTerm.grade,
        term: gradeTerm.term,
        type: selected.studyType + 1
      }
      // 发送发布任务请求
      this.CommitTask(params).then(res => {
        if (res.data.code == 0) {
          Toast.success('任务发布成功');
          // 任务发布成功后，获取新的发布时间，然后开始倒计时
          this.QueryTask().then(res => {
            console.log({ newTaskCreateTime: this.taskStatus.createTime })
            if (this.taskStatus.createTime)
              this.StartTimeDown();
          });
        } else {
          Toast(res.data.msg);
        }
      })
    },


    // 发布任务按钮倒计时，最后从服务器获取数据
    StartTimeDown() {
      // 今天0点
      let tempTime = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
      // 明天0点
      let newTime = tempTime + 24 * 60 * 60 * 1000;
      // 先设置一次
      this.SetTimeDown(newTime);
      // 开始倒计时
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.SetTimeDown(newTime);
      }, 1000);

      // 使用适配器将{grade: 1, term: 2} 转换为 2，并更新页面
      // let gradeIndex = GradeAdapter.setToNum({
      //   grade: this.taskStatus.grade,
      //   term: this.taskStatus.term
      // });
      // 更新发布过的任务代码
      // let { selected } = this.examOption
      // selected.subject = this.taskStatus.subject - 1;
      // selected.grade = gradeIndex - 1;
      // selected.studyType = this.taskStatus.type - 1;
    },
    SetTimeDown(endDateStr) {
      let endDate = new Date(endDateStr);
      let nowDate = new Date();
      if (endDate < nowDate) {
        this.countDown.left = '00:00:00';
        return;
      }
      let totalSeconds = parseInt((endDate - nowDate) / 1000);
      // let days = Math.floor(totalSeconds / (60 * 60 * 24));
      let modulo = totalSeconds % (60 * 60 * 24);
      let hours = Math.floor(modulo / (60 * 60));
      modulo = modulo % (60 * 60);
      let minutes = Math.floor(modulo / 60);
      let seconds = modulo % 60;

      if (hours < 10) hours = '0' + hours;
      if (minutes < 10) minutes = '0' + minutes;
      if (seconds < 10) seconds = '0' + seconds;
      this.countDown.left = `${hours}:${minutes}:${seconds}`;
    }
  }
}