<template>
  <div class="overlay" ref="overlay">
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  props: ['content', 'OnCancel', 'OnConfirm', 'cancelText', 'confirmText', 'type'],
  // mounted() {
  //   // 挂载后 更新overlay高度
  //   this.resetOverlayHeight();
  //   this.$router.afterEach((to, from) => {
  //     this.resetOverlayHeight();
  //   });
  // },
  // methods: {
  //   // overlay高度适应
  //   resetOverlayHeight() {
  //     function hasScrollbar() {
  //       return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
  //     }
  //     let dom = this.$refs.overlay;
  //     dom.style.height = !hasScrollbar() ? '100vh' : '100%';
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.overlay {
  position: absolute;
  background: rgba(0, 0, 0, 0.2);
  height: 100%;
  // 如果高度100%未占满100vh，则设置为100vh将其占满
  // @media screen and (min-height: calc(98vh)) {
  //   height: 100vh;
  // }
  width: 100%;
  left: 0;
  top: 0;
  z-index: 999;
}
</style>