// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
// import TreeTable from './components/treetable'
import './assets/scss/treetable/index.scss'
import 'iview/dist/styles/iview.css'
import api from './utils/api'
import config from './config'
import echarts from 'echarts'
// import {calDomWidthHeight} from '@/utils/commonutils'
import mycomponents from './components/index'
import $ from 'jquery'

Vue.use(iView)
Vue.use(mycomponents)
// 将API方法绑定到全局
Object.defineProperty(Vue.prototype, '$http', { value: api })
// Vue.use(Loading)
Vue.prototype.$echarts = echarts

import './assets/scss/app.scss'

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
Vue.prototype.resizeIframe = function (tableDom, padding, fixed) {
  function resize () {
    // var doc = tableDom.contentDocument
    // var calObj = calDomWidthHeight(doc)
    var padd = padding || '0'
    tableDom.onload = function () {
      tableDom.parentNode.style.height = 'calc( 100% -' + padd + 'px)'
      tableDom.style.height = '100%'
      if (!fixed) {
        tableDom.style.height = 'calc( 100% - ' + padd + 'px)'
      } else {
        // tableDom.style.height = (calObj.height - padd) + 'px'
        var height = $(tableDom).parent().height()
        if (process.env.NODE_ENV !== 'production') {
          height = $(tableDom).parent().height() - padd - 5
        }
        $(tableDom).height(height)
      }
    }
  }
  resize()
  window.onresize = () => {
    // resize()
  }
}

