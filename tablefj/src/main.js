// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import iView from 'iview'
import './assets/scss/treetable/index.scss'
import 'iview/dist/styles/iview.css'
import api from './utils/api'
import echarts from 'echarts'
import mycomponents from './components/index'
import $ from 'jquery'

Vue.use(Vuex)
Vue.use(iView)
Vue.use(mycomponents)
// 将API方法绑定到全局
Object.defineProperty(Vue.prototype, '$http', { value: api })
// Vue.use(Loading)
Vue.prototype.$echarts = echarts

import './assets/scss/app.scss'
import App from './App'
import router from './router'
import Store from './store'

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
function loadVue () {
  new Vue({
    el: '#app',
    router,
    store: Store,
    template: '<App/>',
    components: { App },
    mounted () {
      let loginContext = $('body').data('context')
      let bbConfig = $('body').data('bbconfig')
      if (loginContext) {
        loginContext = JSON.parse(loginContext)
        this.$store.commit('setLoginContext', loginContext)
      }
      if (bbConfig) {
        bbConfig = JSON.parse(bbConfig)
        window._bbconfig = bbConfig
        this.$store.commit('setBBConfig', bbConfig)
      }
      $('body').data('bbconfig', null)
      $('body').data('context', null)
      window.onresize = () => {
        return (() => {
          this.resizeChart()
          if (this.svgs && this.svgs.length > 0) {
            for (var i = 0; i < this.svgs.length; i++) {
              this.svgs[i].call()
            }
          }
        })()
      }
    }
  })
}
/* eslint-disable no-new */
const id = window.setInterval(() => {
  if (window.isReuqireLoad) {
    window.clearInterval(id)
    loadVue()
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
}

Vue.prototype.resizeChart = function () {
  function resize () {
    var mycharts = []
    var charts = $('div[_echarts_instance_]') // chart-models
    for (var i = 0, len = charts.length; i < len; i++) {
      var chart = echarts.getInstanceByDom(charts[i])
      var pp = new Promise((resolve, reject) => {
        chart.resize()
        resolve('ok')
      })
      mycharts.push(pp)
    }
    Promise.all(mycharts).then((res) => {})
  }
  resize()
}

Vue.prototype.resizeSvg = function () {
}
