// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Store from './store'
import echarts from 'echarts'

import router from './router'
import {Loading, Message} from 'element-ui'
import {addRequestFailCallback} from './api/net'

Vue.use(Loading)

import './assets/scss/app.scss'

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

addRequestFailCallback(function (xhr) {
  if (xhr.status === 401 || xhr.responseText && xhr.responseText.indexOf('登录') !== -1) {
    Message.warning('会话超时，请重新登录')
    setTimeout(function () {
      location.href = '/login.html'
    }, 2000)
    return Promise.reject()
  }
})

/* eslint-disable no-new */
function loadVue () {
  new Vue({
    el: '#app',
    router,
    store: Store,
    template: '<App/>',
    components: { App },
    created () {
      this.$router.afterEach(() => {
        this.$vuedals.close()
      })
    }
  })
}
const id = window.setInterval(() => {
  if (window.isReuqireLoad) {
    window.clearInterval(id)
    loadVue()
  }
}, 0)
