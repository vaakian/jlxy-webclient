<template>
  <div id="jlxy" ref="jlxy">
    <!-- 全局导航栏 -->
    <ul class="tab">
      <li
        v-for="(tabItem, index) in tabItems"
        :class="{ 'tab-item': true, 'tab-active': tabActive == index }"
        @click="tabActive = index"
        :key="index"
      >
        <router-link @click="tabActive = index" :to="tabItem.path">{{ tabItem.meta.title }}</router-link>
      </li>
    </ul>
    <transition mode="out-in" :name="transitionName" :duration="{leave: 0}">
      <keep-alive v-if="userInfo.openId && userInfo.token">
        <router-view class="child-view" />
      </keep-alive>
      <h1 style="text-align: center;" v-else>403 FORBIDDEN</h1>
    </transition>

    <!-- <Debug /> -->
  </div>
</template>

<script>
// 导入路由，用于判断标签切换动画方向、全局标题切换
import routes from '@/router/routes';
import Debug from './components/layout/Debug';
import { mapState, mapActions } from 'vuex';
import Cookies from 'js-cookie';
import axios from 'axios';
export default {
  name: 'jlxy',
  components: { Debug },
  data() {
    return {
      transitionName: '',
      tabActive: 0, // 活动标签
      tabItems: [
        ...routes
      ]
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created() {
    this.updateTitle();
    console.log('mount 获取手表');
    this.GetChildren().then(res => {
      // 获取到孩子后，再获取学习记录和任务记录。
      this.GetStudyLog();
      this.QueryTask();
      this.TaskDetail();
    });


  },
  mounted() {
    // 挂载后 更新overlay高度
    // this.resetOverlayHeight();
    // this.$router.afterEach((to, from) => {
    //   this.resetOverlayHeight();
    // });
  },
  watch: {
    // 路由切换动画方向、全局标题切换
    $route(to, from) {
      this.transitionName =
        to.meta.index > from.meta.index
          ? 'slide-left' : 'slide-right';
      this.updateTitle();

    }
  },
  methods: {
    ...mapActions({
      GetChildren: 'GetChildren',
      GetStudyLog: 'study/GetStudyLog',
      QueryTask: 'interact/QueryTask',
      TaskDetail: 'interact/TaskDetail'
    }),
    updateTitle() {
      const jlxyTitle = document.getElementById('jlxy-title');
      jlxyTitle.innerText = this.$route.meta.title;
      this.updateActiveTab();
    },
    updateActiveTab() {
      const { path } = this.$route;
      const { tabItems } = this;
      // 更新活动标签
      for (let index in tabItems) {
        if (tabItems[index].path == path) this.tabActive = index;
      }
    },

  }
}
</script>

<style scoped>
#jlxy {
  min-height: 100vh;
  background: #f8f8f8;
}
/* router-link 占满li */
.tab-item > a {
  display: inline-block;
  height: 100%;
  width: 100%;
  /* border: 1px solid red; */
  padding: 8.3px 0;
}
.tab {
  border: 1px solid #e8e8e8;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.tab-item {
  font-size: 16.7px;
  /* padding: 8.3px; */
  flex: 1;
  text-align: center;
  display: inline-block;
}
.tab-active > a {
  color: #5f8ae8;
  text-decoration: underline;
}

/* 标签切换动画 */

.child-view {
  transition: all 0.3s;
  min-height: calc(100vh - 68px);
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}
</style>
