<template>
  <div class="profile" @click="OnClickOverlay">
    <Overlay>
      <template v-slot:content="childProps">
        <div class="inner" @click.stop="">
          <div
            class="avatar"
            :style="{
            background: `url(./static/${avatar ? 'avatar'+avatar : 'default_avatar'}.png) center center / cover no-repeat`
          }"
          >
            <!-- 切换图标 -->
            <div class="switch" @click="showAvatarList = !showAvatarList"></div>
            <!-- 切换用户面板 -->
            <ul class="avatar-list" v-show="showAvatarList" @click="showAvatarList=false">
              <li @click="avatar = '1'">
                <img :src="'./static/avatar1.png'" alt />
              </li>
              <li @click="avatar = '2'">
                <img :src="'./static/avatar2.png'" alt />
              </li>
              <li @click="avatar = '3'">
                <img :src="'./static/avatar3.png'" alt />
              </li>
              <li @click="avatar = '4'">
                <img :src="'./static/avatar4.png'" alt />
              </li>
            </ul>
          </div>
          <div class="info">
            <div class="input">
              <span>姓名：</span>
              <input v-model="name" type="text" />
              <img :src="'./static/pencil.png'" alt />
            </div>
            <div class="input">
              <span>年级：</span>
              <select v-model="grade">
                <option value="0">一年级（上）</option>
                <option value="1">一年级（下）</option>
                <option value="2">二年级（上）</option>
                <option value="3">二年级（下）</option>
                <option value="4">三年级（上）</option>
                <option value="5">三年级（下）</option>
                <option value="6">四年级（上）</option>
                <option value="7">四年级（下）</option>
                <option value="8">五年级（上）</option>
                <option value="9">五年级（下）</option>
                <option value="10">六年级（上）</option>
                <option value="11">六年级（下）</option>
              </select>
            </div>
          </div>
          <div class="button">
            <button class="btn-blue" @click="Confirm">确定</button>
          </div>
        </div>
      </template>
    </Overlay>
  </div>
</template>
<script>
import Overlay from './Overlay';
import adpater from '../js/adapter';
export default {
  props: {
    OnConfirmProfile: {
      type: Function,
      default: () => { }
    },
    childInfo: {
      type: Object,
      default: {}
    },
    OnClickOverlay: {
      type: Function,
      default: () => {}
    }
  },
  components: { Overlay },
  data() {
    return {
      avatar: 0,
      grade: 0,
      name: '',

      // 逻辑数据
      showAvatarList: false
    }
  },
  watch: {
    childInfo() {
      this.setDefaultInfo();
    }
  },
  mounted() {
    this.setDefaultInfo();
  },
  methods: {
    setDefaultInfo() {
      this.name = this.childInfo.nickName || '宝贝-' + this.childInfo.uid;
      this.avatar = this.childInfo.img || 0;
      const { grade, term } = this.childInfo;
      this.grade = adpater.setToNum({ grade, term }) - 1;
    },
    Confirm() {
      this.showAvatarList = false;
      let { grade: gradeIndex, name, avatar } = this;
      let { grade, term } = adpater.numToSet(gradeIndex);
      this.OnConfirmProfile({ name, avatar, grade, term });
    }
  }
}
</script>
<style lang="scss">
.inner {
  position: fixed;
  line-height: 30px;
  padding: 30px;
  position: absolute;
  // height: 60px;
  width: 75%;
  background: white;
  top: 30vh;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  justify-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .avatar {
    height: 65px;
    width: 65px;
    margin-top: 8px;
    margin-right: 10px;
    border: 1px solid #eeeeee;
    position: relative;
    border-radius: 65px;
    background-size: contain;
    .switch {
      background-color: white;
      border-radius: 10px;
      width: 20px;
      height: 20px;
      border: 1px solid #eeeeee;
      background-image: url(../../../static/drop-down.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 13px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
    .avatar-list {
      border: 1px solid #eee;
      background: white;
      position: absolute;
      top: 100%;
      li {
        width: 65px;
        height: 65px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .button {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-items: center;
    button {
      width: 140px;
      margin: 0 auto;
    }
  }
  .info {
    vertical-align: top;
    .input {
      border: 1px solid #eeeeee;
      margin-top: 10px;
      width: 200px;
      height: 25px;
      line-height: 25px;
      position: relative;
      color: #b0b0b0;
      img {
        height: 25px;
        width: 25px;
        position: absolute;
        right: 0;
        bottom: 0;
        // border: 1px solid red;
      }
      input,
      select {
        background: #ebebeb;
        border: 0;
        width: 130px;
        height: 25px;
        box-sizing: border-box;
        vertical-align: bottom;
        display: block;
        position: absolute;
        top: 0;
        left: 45px;
        color: black;
        font-size: 16px;
      }
      select {
        appearance: none;
        width: 155px;

        //
        background: url(../../../static/drop-down.png) 100% center no-repeat;
        background-size: 25px;
        background-color: #eeeeee;
      }
    }
  }
}
</style>