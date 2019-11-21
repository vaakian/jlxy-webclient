<template>
  <div class="child">
    <div
      class="avatar"
      :style="{'background': `url(./static/avatar${childInfo.img}.png) no-repeat`}"
    ></div>
    <div class="info">
      <p>{{ childInfo.nickName }}</p>
      <p>正在学习 {{childInfo.grade}}年级 设备已绑定</p>
    </div>
    <slot name="edit">
      <!-- <p class="text-blue">修改资料></p> -->
    </slot>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'child',
  props: {
    childInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['userInfo']),
    cnGrade() {
      // return Math.floor(childInfo.grade);
    }
  },
  methods: {
    // OnEmitEditProfile() {
    //   this.$emit('EditProfile', this.childInfo);
    // }
  }
}
</script>
<style lang="scss" scoped>
.child {
  height: 70px;
  background: white;
  padding: 5px;
  margin: 7.5px 0;
  border: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  position: relative;
  // justify-content: center;
  .avatar {
    height: 55px;
    width: 55px;
    border-radius: 35px;
    margin: 0 10px;
    // background: orange;
    border: 1px solid #e8e8e8;
    background-size: cover !important;
    display: inline-block;
  }
  .info {
    font-size: 16px;
    // border: 1px solid red;
    display: inline-block;
    p:first-child {
      font-size: 16.7px;
      line-height: 22px;
    }
    p:nth-child(2) {
      font-size: 9px;
      line-height: 22px;
      color: #7a7a7a;
    }
  }
}
</style>