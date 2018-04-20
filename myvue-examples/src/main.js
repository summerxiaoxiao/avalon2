// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import api from './utils/api'
import config from './config'
import echarts from 'echarts'
import {calDomWidthHeight} from '@/utils/commonutils'

// import {Loading} from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import * as uiv from 'uiv'
// import locale from 'uiv/src/locale/lang/zh-CN'

// Vue.use(uiv, { locale })
Vue.use(iView)
// 将API方法绑定到全局
Object.defineProperty(Vue.prototype, '$http', { value: api })
// Vue.use(Loading)
Vue.prototype.$echarts = echarts

import './assets/scss/app.scss'
import './assets/scss/flex/bootstrap-flex.scss'

Vue.config.productionTip = false

// addRequestFailCallback(function (xhr) {
//   if (xhr.status === 401 || xhr.responseText && xhr.responseText.indexOf('登录') !== -1) {
//     Message.warning('会话超时，请重新登录')
//     setTimeout(function () {
//       location.href = '/login.html'
//     }, 2000)
//     return Promise.reject()
//   }
// })

/* eslint-disable no-new */
const id = window.setInterval(() => {
  if (window.isReuqireLoad) {
    window.clearInterval(id)
    new Vue(config)
  }
}, 0)

/**
 * 计算iframe的高度，避免超出div范围
 * @param tableDom
 */
Vue.prototype.resizeIframe = function (tableDom) {
  var doc = tableDom.contentDocument
  var calObj = calDomWidthHeight(doc)
  tableDom.onload = function () {
    tableDom.style.height = (calObj.height - 15) + 'px'
  }
}
