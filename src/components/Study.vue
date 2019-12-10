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
            background: `url(./static/avatar${currentChild.img || 'default'}.png)center center / cover no-repeat`,
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
import study from './study';
export default study;
</script>

<style lang="scss" scoped>
@import "@/style/study.scss";
</style>
