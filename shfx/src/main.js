// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import api from './utils/api'
import config from './config'
import echarts from 'echarts'
import $ from 'jquery'

import {Loading} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import * as uiv from 'uiv'
// import locale from 'uiv/src/locale/lang/zh-CN'

// Vue.use(uiv, { locale })

// 将API方法绑定到全局
Object.defineProperty(Vue.prototype, '$http', { value: api })
Vue.use(Loading)
Vue.prototype.$echarts = echarts
Vue.prototype.$ = $

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
let id = null
let myvue = null
/* eslint-disable no-new */
id = window.setInterval(() => {
  if (window._fengxian_module && window._fengxian_module.isReuqireLoad) {
    window.clearInterval(id)
    myvue = new Vue(config)
    $(document).data('app', myvue)
  }
}, 0)
/**
 * 计算iframe的高度，避免超出div范围
 * @param tableDom
 */
Vue.prototype.resizeIframe = function (tableDom, padding, fixed) {
  function resize () {
    var padd = padding || '25'
    tableDom.onload = function () {
      tableDom.parentNode.style.height = 'calc( 100% -' + padd + 'px)'
      tableDom.style.height = '100%'
      if (!fixed) {
        tableDom.style.height = 'calc( 100% - ' + padd + 'px)'
      } else {
        // tableDom.style.height = (calObj.height - padd) + 'px'
        var height = $(tableDom).parent().height()
        if (process.env.NODE_ENV !== 'production') {
          height = $(tableDom).parents('.h-iframe-box').parent().height() - padd - 5
        }
        console.log('resize...height' + height)
        $(tableDom).height(height)
      }
      // $(tableDom).css({
      //   'position': 'absolute',
      //   'width': '100%'
      // })
    }
  }
  resize()
}
