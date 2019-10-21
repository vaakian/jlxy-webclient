// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import '@/style/global.css';

// 清除微信底部返回栏
let toURL = '/'
router.beforeEach((to, from, next) => {

  if (toURL === to.path) {
    next()
  }
  if (to.path !== from.path) {
    toURL = to.path
    router.replace(to.path)
      .then(res => {
        // console.log('路由promise事件', res);
      }).catch(err => {
        // console.log('路由error promise', err);
      })
    next()
  }
})




Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});


