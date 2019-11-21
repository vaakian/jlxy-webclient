<template>
  <div class="migrate-confirm" @click="OnClose">
    <Overlay>
      <template #content="childProps">
        <div class="inner" @click.stop>
          <div>
            <h3 style="text-align: center">数据迁移</h3>
            <p class="text-black">
              老账号
              <span class="text-blue">{{child.oldChild.nickName}}</span>
            </p>
            <p>的账号信息与权限将迁移到</p>
            <p class="text-black">
              新账号
              <span class="text-blue">{{child.newChild.nickName}}</span>
            </p>
            <p>重要提醒：</p>
            <p>1.老账号信息迁移到新账号后，老账号信息将被清除，新账号将继承所有老账号的权限资料。</p>
            <p>
              <span>2.为确保老账号资料信息为最新，</span>
              <span class="text-red">请确保网络链接正常</span>
              <span>的情况下，登录老账号后正常退出游戏，</span>
              <span class="text-red">上传最新的游戏数据。</span>
            </p>
            <p>
              <span>3.新账号再次登录查看信息时，</span>
              <span class="text-red">请确保网络链接正常，</span>
              <span>否则无法获取到老账号的权限资料。</span>
            </p>
          </div>
          <button class="btn-outline" @click="OnClose">取消</button>
          <button class="btn-blue" @click="OnConfirm">确定</button>
        </div>
      </template>
    </Overlay>
  </div>
</template>

<script>
import Overlay from './Overlay'
export default {
  props: {
    OnConfirm: {
      type: Function,
      isRequired: true,
      default: () => {}
    },
    OnClose: {
      type: Function,
      isRequired: true,
      default: () => {}
    },
    child: {
      type: Object,
      isRequired: true,
      default: { newChild: {}, oldChild: {} }
    }
  },
  components: { Overlay }
}
</script>

<style lang="scss" scoped>
.inner {
  top: 43vh;
  line-height: 1.3em;
  p {
    margin: 10px 0;
    color: #9e9e9e;
  }
  .btn-outline {
    margin-right: 20px;
  }
}
</style>