<template>
  <div class="dilog">
    <Overlay>
      <template v-slot:content="childProps">
        <div class="dilog-content">
          <div class="dilog-text">
            <p>您正在给 <span class="text-blue">{{ currentChild.nickName || '宝贝-' + currentChild.uid }}</span> {{ type }}：</p>
            <p>
              "
              <span class="text-blue">{{content}}</span>"请再次确认！
            </p>
          </div>
          <div class="dilog-button">
            <button class="btn-outline" @click="OnCancel">{{ cancelText }}</button>
            <button class="btn-blue" @click="OnConfirm">{{ confirmText }}</button>
          </div>
        </div>
      </template>
    </Overlay>
  </div>
</template>

<script>
import Overlay from './Overlay';
import { mapGetters } from 'vuex';
export default {
  components: { Overlay },
  props: ['content', 'OnCancel', 'OnConfirm', 'cancelText', 'confirmText', 'type'],
  computed: {
    ...mapGetters(['currentChild'])
  }
}
</script>
<style lang="scss" scoped>
.dilog-content {
  position: fixed;
  line-height: 40px;
  padding: 20px;
  height: 130px;
  width: 80%;
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
}

.btn-outline {
  font-size: 13.9px;
  color: #5f8ae8;
  width: 90px;
  height: 40px;
  background: white;
  border: 1.5px solid #3f69c4;
  border-radius: 5px;
}
</style>