<template>
  <div class="dilog">
    <Overlay>
      <template v-slot:content="childProps">
        <div class="dilog-content">
          <div class="dilog-text">
            <p>宝宝已经完成了任务，选择一个任务奖励鼓励下</p>
            <ul>
              <li @click="remarkId = 1" :class="{selected: remarkId == 1}"></li>
              <li @click="remarkId = 2" :class="{selected: remarkId == 2}"></li>
              <li @click="remarkId = 3" :class="{selected: remarkId == 3}"></li>
            </ul>
          </div>
          <div class="dilog-button">
            <button class="btn-outline" @click="OnCancel">{{ cancelText }}</button>
            <button class="btn-blue" @click="OnConfirm(remarkId)">{{ confirmText }}</button>
          </div>
        </div>
      </template>
    </Overlay>
  </div>
</template>

<script>
import Overlay from './Overlay';
export default {
  data() {
    return {
      remarkId: 1
    }
  },
  components: { Overlay },
  props: {
    OnCancel: {
      type: Function,
      default: () => { }
    },
    OnConfirm: {
      type: Function,
      default: () => { }
    },
    cancelText: {
      type: String | Number,
      default: '取消'
    },
    confirmText: {
      type: String | Number,
      default: '确定'
    },
  }
}
</script>
<style lang="scss" scoped>
.dilog-content {
  position: fixed;
  // line-height: 40px;
  padding: 10px;
  height: 180px;
  width: 85%;
  background: white;
  top: 30vh;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  .dilog-button {
    display: flex;
    justify-content: space-between;
    button {
      width: 45%;
    }
  }
  .dilog-text {
    p {
      color: #8b8b8b;
      font-size: 12px;
    }
    ul {
      display: flex;
      justify-content: space-around;
      margin: 10px 0;
      li {
        height: 100px;
        width: 80px;
        border: 1.5px solid #dadada;
        display: inline-block;
        border-radius: 5px;
        position: relative;
      }
      li:after {
        content: "";
        background: white;
        height: 16px;
        width: 16px;
        border: 1px solid #e8e8e8;
        border-radius: 10px;
        position: absolute;
        top: 2px;
        right: 2px;
      }
      li:nth-child(1) {
        background: url(../../../static/icon/mission_1.png) no-repeat center;
        background-size: cover;
      }
      li:nth-child(2) {
        background: url(../../../static/icon/mission_2.png) no-repeat center;
        background-size: cover;
      }
      li:nth-child(3) {
        background: url(../../../static/icon/mission_3.png) no-repeat center;
        background-size: cover;
      }
      .selected {
        border-color: #5f8ae8;
      }
      .selected:after {
        content: "";
        background-image: url(../../../static/icon/selected.png);
        background-color: white;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        height: 16px;
        width: 16px;
        position: absolute;
        top: 2px;
        right: 2px;
      }
    }
  }
}

</style>