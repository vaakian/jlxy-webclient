<template>
  <div class="interact">
    <!-- 任务提示区 -->
    <!-- 提示框 -->
    <Dilog
      type="发布"
      confirmText="确认发布"
      cancelText="再考虑一下"
      :content="selectedMissionContent.title"
      :OnConfirm="OnConfirmNewMission"
      :OnCancel="() => {showDilog = false}"
      v-show="showDilog"
    />
    <!-- 已发布，显示内容 -->

    <div
      class="mission mission-still"
      v-if="haveChildren && (taskStatus.status === 1 || taskStatus.status === 2)"
      style="color: #818181"
    >
      <!-- 有孩子、有任务 -->
      <p>
        <span>{{timeStampToDate}}</span>
        <span>你给</span>
        <span class="text-blue">{{currentChild.nickName || '宝贝'}}</span>
        <span>发布了一个任务：</span>
      </p>
      <p class="mission-content text-blue">
        <img :src="`./static/icon/${missionContent.type}.png`" alt />
        <span>{{missionContent.title || ''}}</span>
      </p>
      <hr size="1" color="#e8e8e8" />
      <div class="mission-below">
        <!-- 未完成 -->
        <div class="text" v-if="taskStatus.status === 1">
          <p class="text-blue">任务等待完成中</p>
          <p class="text-blue" @click="folded = !folded">请耐心等待……</p>
        </div>
        <!-- 已完成 -->
        <div v-else-if="taskStatus.status === 2">
          <p class="text-done">任务已完成</p>
          <p class="text-blue" @click="folded = !folded">查看详情点击展开></p>
        </div>
        <!-- 未完成应该是disable状态 -->
        <button class="btn-red" :disabled="taskStatus.status != 2" @click="showInteract = true">奖励</button>
        <!-- 展开后的题目 -->
        <div class="detail" :style="{height: folded ? 0: '150px'}">
          <Qtable :style="{height: '130px'}" :questions="currentTask.data" />
        </div>
        <span v-show="!folded" class="fold text-blue" @click="folded = true">收起</span>
      </div>
    </div>

    <!-- 未发布，提示发布 -->
    <div class="mission" v-else>
      <p>请给你的孩子发布一个学习任务吧</p>
    </div>
    <!-- 题型选择 -->
    <p class="sub-title">题型选择</p>
    <div class="exam-type">
      <div class="exam-wrap">
        <p>选择题库</p>
        <ul>
          <!-- 锁定的选项 不能点击 -->
          <li
            v-for="(subject, index) in subjects"
            @click="OnSelectSubject(subject, index)"
            :class="{
              'exam-locked': subject.locked && !vipExpireDay, 
              'exam-selected': examOption.selected.subject == index,
              'exam-disabled': (subject.type=='chengyu' || subject.type=='baike') && examOption.selected.grade <= 1}"
            :key="index"
          >
            <p>{{ subject.name }}</p>
            <img :src="`./static/icon/${subject.type}.png`" />
          </li>
        </ul>
      </div>

      <div class="exam-wrap">
        <p>选择年级</p>
        <ul>
          <li
            v-for="(grade, index) in grades"
            @click="OnSelectGrade(grade,index)"
            :class="{'exam-locked': grade.locked, 'exam-selected': examOption.selected.grade == index}"
            :key="index"
          >
            <p>
              {{ grade.name }}
              <br />
              ({{ grade.lv }})
            </p>
          </li>
        </ul>
      </div>

      <div class="exam-wrap">
        <p>选择类型</p>
        <ul>
          <li
            v-for="(studyType, index) in studyTypes"
            @click="()=>{if(!studyType.locked) examOption.selected.studyType = index}"
            :class="{'exam-selected': examOption.selected.studyType == index }"
            :key="index"
          >
            <p>{{ studyType }}</p>
          </li>
        </ul>
      </div>
      <button class="btn-red" v-if="!ableToCommit">离下次任务发布倒计时：{{ countDown.left }}</button>
      <button class="btn-blue" @click="OnConfirmCommit" v-else>确定发布新任务</button>
    </div>

    <!-- 历史情况 -->
    <div class="study-status" v-if="allFinishedTask.length">
      <p class="sub-title">历史情况</p>
      <template v-for="(task, index) in allFinishedTask">
        <Status
          :questions="task.data"
          :type="task.data[0].subject"
          :timeStamp="task.createTime"
          :key="index"
        />
      </template>
    </div>
    <Remark
    :OnConfirm="OnConfirmInteract"
    :OnCancel="()=>{showInteract = false}"
    confirmText="确认奖励"
    cancelText="再想想"
    v-show="showInteract"
    />
  </div>
</template>
<script>
import interact from './interact';
export default interact;
</script>
<style lang="scss" scoped>
@import "@/style/interact.scss";
</style>