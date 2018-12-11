import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
// import router from './router'
// 300m秒延时
import fastclick from 'fastclick'

import 'common/stylus/index.styl'
fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
