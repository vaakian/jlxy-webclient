<template>
  <div class="study">
    <img src="../../static/default_banner.png" height="100%" width="100%" />
    <!-- 用户信息 -->
    <div class="user-box">
      <p
        class="level"
        :style="{color: vipExpireDay ? '#FF9907': ''}"
      >{{ vipExpireDay ? '高级VIP': '普通用户' }}</p>
      <div class="user-info">
        <div>
          <div
            class="user-avatar"
            :style="{
            background: `url(./static/avatar${currentChild.img}.png)center center / cover no-repeat`,
            backgroundSize: 'cover'
          }"
          >
            <!-- 切换图标 -->
            <img
              v-if="haveChildren"
              src="../../static/icon/switch.png"
              @click="()=>{ if(currentChild) childShow =! childShow}"
            />
            <!-- 切换用户面板 -->
            <ul class="user-switch" v-show="childShow">
              <li
                v-for="(child, childIndex) in children"
                @click="SwitchToUser(childIndex)"
                :key="childIndex"
              >
                <span
                  class="user-active"
                  :style="{background: childActive == childIndex ? '#5f8ae8': ''}"
                ></span>
                <span>{{ child.nickName}}</span>
              </li>
            </ul>
          </div>

          <div class="user-detail" v-if="currentChild">
            <p class="name">{{ currentChild.nickName}}</p>
            <p class="grade">{{ transformedGrade || '' }}</p>
          </div>
          <div class="user-detail" v-else>
            <p class="name">您还未绑定孩子的手表</p>
            <p class="grade">{{ currentChild.grade }}</p>
          </div>
        </div>
        <!-- <button class="btn-blue" v-if="haveChildren">综合详情</button> -->
      </div>
    </div>

    <div v-if="haveChildren">
      <!-- 学习信息统计 -->
      <div class="study-history">
        <div class="study-statistic">
          <p
            v-if="studyLog.hanzi + studyLog.suanshu + studyLog.chengyu + studyLog.gushi + studyLog.yingyu + studyLog.baike"
          >
            {{ nearestDate }}宝贝学习了
            <template v-for="(subject, type, index) in studyLog">
              <span :key="index">
                <span v-if="index!=0">、</span>
                <span class="text-red">{{ subject.length }}</span>
                <span>{{ cnDescription[type] }}</span>
              </span>
            </template>
            <!-- <span>。</span> -->
          </p>
          <p v-else>您的宝贝很久没上线了</p>
        </div>

        <!-- 小提示 -->
        <div class="study-mission" v-if="ableToCommit">
          <p>
            今天还没给宝贝
            <span class="text-blue">
              <router-link to="/interact">发布任务</router-link>
            </span>
          </p>
        </div>
      </div>

      <!-- 任务动态 -->
      <div class="mission-status" v-if="allFinishedTask.length">
        <p class="sub-title">任务动态</p>
          <Status
            :questions="allFinishedTask[0].data"
            :type="allFinishedTask[0].data[0].subject"
            :timeStamp="allFinishedTask[0].createTime"
          />
        <!-- <template v-for="(task, index) in allFinishedTask">
          <Status
            :questions="task.data"
            :type="task.data[0].subject"
            :timeStamp="task.createTime"
            :key="index"
          />
        </template> -->
      </div>

      <!-- 学习动态 -->
      <div class="study-status" v-if="studyLog.code === undefined && Object.keys(studyLog).length">
        <p class="sub-title">学习动态</p>
        <template v-for="(subject, type, index) in studyLog">
          <Status
            :questions="studyLog[type]"
            :type="type"
            :timeStamp="studyLog[type][0].time"
            :key="index"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Status from './layout/Status';
import { mapState, mapActions, mapGetters } from 'vuex';
import Cookies from 'js-cookie';
import types from '../store/types';
import utils from '../utils';
// map模块三种方法：
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
    SwitchToUser(UserIndex) {
      // 若切换操作成功，更新信息并关闭窗口
      this.childActive = UserIndex;
      this.childShow = false;
      this.GetStudyLog();
      this.QueryTask();
      this.TaskDetail();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/study.scss";
</style>
