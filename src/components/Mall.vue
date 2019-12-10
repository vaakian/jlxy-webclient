<template>
  <div class="mall">
    <!-- 开头文字 -->
    <p class="sub-title">高级VIP套餐</p>
    <p class="current-package">
      当前为
      <span v-if="vipExpireDay">
        <span class="text-orange">高级VIP,</span>
        <span class="text-blue">还剩{{vipExpireDay}}天</span>
      </span>
      <span v-else class="text-blue">普通用户</span>
    </p>
    <!-- 高级VIP套餐 -->
    <div class="mall-package">
      <!-- 套餐项目 -->
      <div class="package-box">
        <div
          :class="{'package-item': true, 'package-selected': vipPackageSelected == 1}"
          @click="vipPackageSelected = 1"
        >
          <p>
            <span v-show="vipExpireDay">续费</span>
            <span class="text-blue">30天</span>
          </p>
          <p>
            ￥
            <span class="text-orange">30</span>
          </p>
          <p>原价￥35元</p>
          <!-- <p class="text-blue">赠送200钻</p> -->
        </div>

        <div
          :class="{'package-item': true, 'package-selected': vipPackageSelected == 2}"
          @click="vipPackageSelected = 2"
        >
          <p>
            <span v-show="vipExpireDay">续费</span>
            <span class="text-blue">180天</span>
          </p>
          <p>
            ￥
            <span class="text-orange">150</span>
          </p>
          <p>原价￥180元</p>
          <!-- <p class="text-blue">赠送1500钻</p> -->
        </div>

        <div
          :class="{'package-item': true, 'package-hot': true, 'package-selected': vipPackageSelected == 3}"
          @click="vipPackageSelected = 3"
        >
          <p>
            <span v-show="vipExpireDay">续费</span>
            <span class="text-blue">365天</span>
          </p>
          <p>
            ￥
            <span class="text-orange">240</span>
          </p>
          <p>原价￥365元</p>
          <!-- <p class="text-blue">赠送4000钻</p> -->
        </div>
      </div>
      <!-- VIP套餐说明 -->
      <div class="package-note">
        <p class="sub-title text-blue">VIP套餐说明</p>
        <p>购买高级VIP会员服务可以在会员有效期内使用所有游戏内的课程+学习服务+所有冒险关卡包括新上线的服务内容</p>

        <!-- 活动 -->
        <!-- <p style="color: red; font-size: 11.5px; ">
          中秋大礼包：买高级VIP包年，赠送超级大礼包（包括小精灵公仔+小精灵书包+每日赠送1000金币），查看详情
          <span class="text-blue">点击这里&gt;</span>
        </p>-->

        <button
          class="btn-blue"
          @click="OnPay"
        >{{vipExpireDay ? '延长VIP时间':'立即加入VIP'}}</button>
      </div>
    </div>

    <!-- 权益详情 -->
    <p class="sub-title">权益详情</p>
    <div class="vip-detail">
      <div class="img-left">
        <img src="../../static/1.png" />
      </div>
      <div class="img-left">
        <img src="../../static/2.png" />
      </div>
      <div class="img-left">
        <img src="../../static/3.png" />
      </div>
      <div class="img-left">
        <img src="../../static/4.png" />
      </div>
    </div>
    <Dilog
      :type="'续费'"
      :confirmText="'确认购买'"
      :cancelText="'取消'"
      :content="['高级VIP/30天', '高级VIP/180天', '高级VIP/365天'][vipPackageSelected - 1]"
      :OnConfirm="OnPayConfirm"
      :OnCancel="()=>{showPayConfirm = false}"
      v-show="showPayConfirm"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { Toast } from 'vant';
import Dilog from './layout/Dilog';
// import { Maps }
export default {
  name: 'mall',
  components: { Dilog },
  data() {
    return {
      showPayConfirm: false,
      vipPackageSelected: 3
    }
  },
  computed: {
    ...mapState(['userInfo']),
    ...mapGetters(['currentChild', 'haveChildren', 'vipExpireDay'])
  },
  methods: {
    ...mapActions(['WeixinPay']),
    OnPayConfirm() {
      // 此处watchId应该都放到store里直接获取
      this.showPayConfirm = false;
      this.WeixinPay({
        type: this.vipPackageSelected
      });
    },
    OnPay() {
      if (!this.haveChildren) {
        Toast.fail('您还未绑定孩子的手表');
        return;
      }
      this.showPayConfirm = true;
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/style/mall.scss";
</style>