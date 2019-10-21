<template>
  <div class="status">
    <div class="status-top">
      <img :src="`./static/icon/${type}.png`" align="absmiddle" />
      <div class="category">
        <p>{{ cnTitle }}</p>
        <p>{{ cnGrade }}</p>
      </div>
      <span class="score">
        完成情况
        <span :style="{color: statusContent.color}">{{ statusContent.text }}</span>
        ，正确率
        <span :style="{color: true ? '#5f8ae8': '#e9aa02'}">{{ rank*100 + '%' }}</span>
      </span>
      <span class="date">{{ timeStamp ? timeStampToDate : '' }}</span>
    </div>
    <div class="status-detail">
      <div>
        <!-- 未展开显示简略 -->
        <p>
          回答正确：
          <span class="text-blue">
            <span
              v-for="(question, index) in firstThreeRight"
              :key="index"
            >{{ type=='chengyu' ? question.rightAnswer : question.title }}{{ index < firstThreeRight.length-1 ? '、': '' }}</span>
            <span v-if="firstThreeRight.length >= 3">……</span>
          </span>
        </p>
        <p>
          回答错误：
          <span class="text-red" v-if="firstThreeWrong.length">
            <span
              v-for="(question, index) in firstThreeWrong"
              :key="index"
            >{{ type=='chengyu' ? question.rightAnswer : question.title }}{{ index < firstThreeWrong.length-1 ? '、': '' }}</span>
            <span v-if="firstThreeWrong.length >= 3">……</span>
          </span>
          <span class="text-red" v-else>无</span>
        </p>
      </div>
      <!-- 展开后显示 -->
      <div
        :style="{height: showDetail ? `${questions.length + 2.5}em`: 0}"
        class="detail-content"
        ref="detailContent"
      >
        <Qtable :questions="questions" :showRate="showRate" />
      </div>
      <span v-show="showDetailDelayed" @click="OnUnfold" class="unfold text-blue">展开&gt;</span>
      <span v-show="showDetail" @click="OnFold" class="fold text-blue">收起</span>
    </div>
  </div>
</template>
<script>
// import Collapse from './Collapse';
import Qtable from './Qtable';
// import TestCase from '@/components/js/statusTestCase';
// 更加流畅的滑动，原生滑动比较木、卡顿
import BScroll from 'better-scroll';
// store
import { mapActions } from 'vuex';
import utils from '../../utils';

export default {
  props: {
    questions: {
      type: Array,
      default: []
    },
    type: {
      type: String,
      default: ''
    },
    showRate: {
      type: Boolean,
      default: true
    },
    timeStamp: {
      type: Number,
      default: 0
    }
  },
  components: { Qtable },
  data() {
    return {
      showDetail: false,
      showDetailDelayed: true
    }
  },
  computed: {
    timeStampToDate() {
      return utils.timeStampToDate(this.timeStamp);
    },
    rank() {
      let rightCount = 0;
      this.questions.forEach((cur, index) => {
        if (cur.result === 1) {
          ++rightCount;
        }
      });
      const rank = (rightCount / this.questions.length).toFixed(2);
      return parseFloat(rank);
    },
    statusContent() {
      const colors = [{
        color: '#00d714',
        text: '优秀'
      }, {
        color: '#e9aa02',
        text: '良好'
      }, {
        color: '#fa5858',
        text: '一般'
      }];
      const rank = this.rank;
      if (rank > 0.8) return colors[0];
      else if (rank > 0.6) return color[1];
      else return colors[2];
    },
    // 前三个正确、错误
    firstThreeRight() {
      const { questions } = this;
      let result = questions.filter(question => question.result);
      result = result.slice(0, 3);
      // 拷贝一份
      result = JSON.parse(JSON.stringify(result));
      // 处理算数，加上答案
      if (result.length && this.type == 'suanshu' && result[0].title.indexOf('?') != -1) {
        return result.map(question => {
          const { title } = question;
          const len = title.length;
          question.title = title.substr(0, len - 1) + question.rightAnswer;
          return question;
        })
      }
      return result;
    },
    firstThreeWrong() {
      const { questions } = this;
      let result = questions.filter(question => question.result == 0);
      result = result.slice(0, 3);
      // 拷贝一份
      result = JSON.parse(JSON.stringify(result));
      // 处理算数，加上答案
      if (result.length && this.type == 'suanshu' && result[0].title.indexOf('?') != -1) {
        return result.map(question => {
          const { title } = question;
          const len = title.length;
          question.title = title.substr(0, len - 1) + question.wrongAnswer;
          return question;
        })
      }
      return result;
    },
    // 转换中文标题
    cnTitle() {
      const { type } = this;
      const cnTable = {
        hanzi: '学汉字',
        suanshu: '学算数',
        gushi: '学诗词',
        chengyu: '学成语',
        danci: '学英语',
        baike: '学百科'
      };
      return cnTable[type];
    },
    cnGrade() {
      const { questions } = this;
      const cnTable = '一二三四五六';
      let { grade, term } = questions[0];
      console.log(grade);
      return `${cnTable[grade - 1]}年级·${term == 1 ? '上' : '下'}册`
    },
  },
  mounted() {
    // let u = navigator.userAgent;
    // let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    // // 优化安卓终端的滑动体验
    // if (isAndroid) {
    //   this.scroll = new BScroll(this.$refs.detailContent);
    // }
  },
  methods: {
    // 收起
    ...mapActions('study', ['GetStudyLog']),
    OnFold() {
      this.showDetail = false;
      setTimeout(() => {
        this.showDetailDelayed = true;
      }, 400);
    },
    // 展开
    OnUnfold() {
      this.showDetail = true;
      this.showDetailDelayed = false;
    }
  }
}
</script>
<style lang="scss">
@import "@/style/status.scss";
</style>