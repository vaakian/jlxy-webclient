<template>
  <div class="setting">
    <!-- 遍历children列表 -->
    <template v-for="(child, index) in children">
      <Child :childInfo="child" :key="index" />
    </template>

    <!-- 添加孩子按钮 -->
    <div class="add-child">
      <div class="add-icon" @click="OnAddChild"></div>
      <div>
        <p>添加孩子</p>
      </div>
    </div>

    <!-- overlay提示弹窗 -->
    <div v-show="showDilog" @click="showDilog = false;">
      <Overlay style="height: 100vh;">
        <template v-slot:content="childProps">
          <div class="inner">
            <p>请用微信扫描新设备的二维码，添加新的用户</p>
          </div>
        </template>
      </Overlay>
    </div>
  </div>
</template>

<script>
import Child from './layout/Child';
import { mapState } from 'vuex';
import Overlay from './layout/Overlay';
export default {
  name: 'Setting',
  components: { Child, Overlay },
  data() {
    return {
      showDilog: false
    }
  },
  computed: {
    // 获取孩子列表
    ...mapState(['children'])
  },
  methods: {
    OnAddChild() {
      console.log('OnAddChild');
      this.showDilog = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  padding: 15px 8px;
  position: relative;
  .inner {
    position: fixed;
    line-height: 30px;
    padding: 30px;
    position: absolute;
    // height: 60px;
    width: 60%;
    background: white;
    top: 15vh;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .add-child {
    height: 70px;
    margin: 7.5px 0;
    color: #5f8ae8;
    background: white;
    border: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    padding: 5px;
    .add-icon {
      width: 53px;
      height: 53px;
      margin: 0 10px;
      border: 2px solid #5f8ae8;
      border-radius: 30px;
      position: relative;
    }
    .add-icon:before,
    .add-icon:after {
      content: "";
      height: 50%;
      width: 3px;
      background: #5f8ae8;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
    .add-icon:after {
      transform: translateX(-50%) translateY(-50%) rotate(90deg);
    }
  }
}
</style>