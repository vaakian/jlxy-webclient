<template>
  <div class="migrate-panel" @click="OnClose">
    <Overlay>
      <template #content="childProps">
        <div class="inner" @click.stop>
          <div class="container">
            <!-- 左边头像、文字 -->
            <div
              class="avatar"
              :style="{
            background: `url(./static/avatar${oldChild.img}.png) center center / cover no-repeat`
          }"
            >
              <p class="top">旧账号</p>
              <p class="bottom">姓名：{{oldChild.nickName}}</p>
            </div>
            <!-- 中间箭头、文字 -->
            <div class="arrow">
              <span class="text-red" v-if="isLoading">转移中</span>
              <span class="text-blue" v-else>
                <span :class="isSuccess ? 'text-green': 'text-red'" v-if="msg !== ''">{{msg}}</span>
                <span v-else>转移</span>
              </span>
            </div>
            <!-- 右边头像、文字 -->
            <div
              class="avatar"
              :style="{
            background: newWatchId === '' ? '#c6f8ff': `url(./static/avatar${newChild.img}.png) center center / cover no-repeat`,
          }"
            >
              <p class="top">新账号</p>
              <p class="bottom">
                <span v-if="newWatchId !== ''">姓名：{{newChild.nickName}}</span>
              </p>
              <!-- 切换图标 -->
              <div class="switch" v-show="!isSuccess" @click="showAvatarList = !showAvatarList"></div>
              <!-- 切换用户面板 -->
              <ul class="avatar-list" v-show="showAvatarList" @click="showAvatarList=false">
                <li
                  v-for="(child, index) in childToBeSelected"
                  :key="index"
                  @click="newWatchId = child.watchId"
                >
                  <img :src="`./static/avatar${child.img}.png`" alt />
                  <p>{{child.nickName}}</p>
                </li>
              </ul>
            </div>
          </div>
          <br />
          <div class="btn-container">
            <!-- 确定按钮 -->
            <button
              :class="{
                'submit': true,
                'btn-disabled': !ableToMigrate,
                'btn-blue': ableToMigrate
              }"
              @click="showConfirm = ableToMigrate"
              v-show="!isSuccess"
            >确定</button>
          </div>
        </div>
      </template>
    </Overlay>
    <!-- 确认迁移面板 -->
    <div @click.stop>
      <MigrateConfirm
        :child="{newChild, oldChild}"
        :OnConfirm="OnConfirm"
        :OnClose="() => {showConfirm = false}"
        v-show="showConfirm"
      />
    </div>
  </div>
</template>

<script>

import Overlay from './Overlay';
import MigrateConfirm from './Migrate-confirm';
import { mapState, mapGetters, mapActions } from 'vuex';
import { Toast } from 'vant';
export default {
  props: {
    oldChild: {
      type: Object,
      isRequired: true,
      default: {}
    },
    OnClose: {
      type: Function,
      isRequired: false,
      default: () => {}
    }
  },
  components: { Overlay, MigrateConfirm },
  data() {
    return {
      showAvatarList: false,
      showConfirm: false,
      isLoading: false,
      isSuccess: false,
      newWatchId: '',
      msg: ''
    };
  },
  computed: {
    ...mapState(['children']),
    ...mapGetters(['haveChildren']),
    ableToMigrate() {
      return this.haveChildren && this.newWatchId !== '';
    },
    newChild() {
      return this.newWatchId
        ? this.childToBeSelected.find(child => {
            console.log(child);
            return child.watchId === this.newWatchId;
          })
        : {};
    },
    // 待选孩子
    childToBeSelected() {
      return this.children.filter(
        child => child.watchId !== this.oldChild.watchId
      );
    }
  },
  methods: {
    ...mapActions(['AccountMigrate']),
    // 点击确定迁移回调函数
    OnConfirm() {
      const TOAST_DURATION = 5000;
      this.showConfirm = false;
      const { AccountMigrate } = this;
      // set isLoading, isSuccess
      this.isLoading = true;
      this.isSuccess = false;
      const { oldChild, newChild } = this;
      AccountMigrate({
        oldWatchId: oldChild.watchId,
        newWatchId: newChild.watchId
      })
        .then(({ data: { code, msg } }) => {
          // set success
          if (code == 0) {
            // 转移成功：显示 绿色 '转移成功'
            this.isSuccess = true;
            this.msg = '转移成功';
            Toast({
              message: '转移成功，3后重新载入！',
              duration: 2500
            });
            setTimeout(() => {
              location.reload();
            }, 3000);
          } else {
            // 转移失败：显示 红色 返回的msg
            this.msg = msg;
            Toast({
              message: msg,
              duration: 2500
            });
          }
        })
        .catch(err => {
          console.log({ err });
          this.errMsg = '网络错误';
        })
        .finally(fin => {
          console.log({ fin });
          this.isLoading = false;
        });
    }
  },
  watch: {
    oldChild() {
      // 老手表切换，清空数据
      this.newWatchId = '';
      this.isSuccess = false;
    },
    newChild() {
      // 新手标切换，清空成功、消息
      this.isSuccess = false;
      this.msg = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.inner {
  padding: 15px;
  padding-bottom: 25px;
  width: 85%;
  .container {
    display: flex;
    justify-items: center;
    justify-content: center;
    .avatar {
      ul {
        left: -50%;
        max-height: 285px;
        overflow-y: scroll;
      }
      li {
        width: 130px;
        height: calc(65px + 1em);
        padding-bottom: 0.5em;
        border: 1px solid #ddd;
        text-align: center;
        p {
          margin-top: -1em;
          // border: 1px solid green;
        }
        img {
          // border: 1px solid red;
          width: 65px !important;
          height: 65px;
        }
      }
      .top {
        text-align: center;
        position: absolute;
        width: 67px;
        left: 0;
        top: -1.5em;
      }
      .bottom {
        width: 67px;
        text-align: center;
        font-size: 13px;
        position: absolute;
        left: 0;
        bottom: -2em;
        transform: translateX(-17%);
        white-space: nowrap;
        color: #999;
      }
    }
  }
  .btn-container {
    display: block;
    // justify-content: center;
    // justify-items: center;
    // flex-wrap: wrap;
    .submit {
      width: 180px;
      margin-top: 2em;
      margin-bottom: -20px;
    }
  }
  .arrow {
    height: 18px;
    width: 130px;
    background-size: cover;
    background: url(../../../static/arrow.png) center center / cover no-repeat;
    // border: 1px solid red;
    margin-top: 33px;
    margin-left: -5px;
    position: relative;
    text-align: center;
    span {
      display: inline-block;
      width: 130px;
      position: absolute;
      left: 0;
      top: -0.8em;
      font-size: 14px;
    }
  }
}
</style>