import Vuex from 'vuex'
import App from './App'
import Store from './store'
import router from './router'
import $ from 'jquery'

export default {
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
      })()
    }
  },
  computed: {
    ...Vuex.mapState({
      'chartState': state => state.chartState
    })
  },
  data () {
    return {
      charts: []
    }
  },
  watch: {
    chartState () {
      this.$(window).trigger('resize')
    }
  },
  methods: {
    resizeChart () {
      var charts = $('div[_echarts_instance_]') // chart-models
      for (var i = 0, len = charts.length; i < len; i++) {
        var chart = this.$echarts.getInstanceByDom(charts[i])
        var pp = new Promise((resolve, reject) => {
          chart.resize()
          resolve('ok')
        })
        this.charts.push(pp)
      }
      Promise.all(this.charts).then((res) => {})
    }
  }
}
