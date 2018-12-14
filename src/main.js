import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
// import router from './router'
// 300m秒延时
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store/index'

Vue.use(VueLazyload)

// or with options
Vue.use(VueLazyload, {
  loading: './common/image/default.png'
})

import 'common/stylus/index.styl'
fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
