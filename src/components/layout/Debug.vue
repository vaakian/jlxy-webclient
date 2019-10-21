<template>
  <div class="debug">
    <p>debug窗口</p>
    <p v-for="(data, key) in userInfo" :key="key">
      {{key}}->{{data}}
    </p>
    <p>{{$store.state.childActive}}</p>
    <p>{{ $store.getters.currentChild }}</p>
    <!-- <p>{{ $store.state }}</p> -->
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import {mapState} from 'vuex';
export default {
  data() {
    return {
      
    }
  },
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>
<style lang="scss">
  .debug {
    position: fixed;
    bottom: 0;
    right: 0;
    background: plum;
    height: 150px;
    width: 80vw;
    color: white;
    overflow: scroll;
    border: 1px solid #7e7e7e;
    -webkit-overflow-scrolling:touch;
    p {
      font-size: 12px;
      font-family: Arial, sans-serif !important;
    }
  }
</style>