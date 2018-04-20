import $ from 'jquery'
import Vuex from 'vuex'
import App from './App'
import Store from './store'
import router from './router'

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
  },
  computed: {
    ...Vuex.mapState({
      'chartState': state => state.chartState
    })
  },
  methods: {
    resizeChart () {
      // var charts = $('div[_echarts_instance_]') // chart-models
      // for (var i = 0, len = charts.length; i < len; i++) {
      //   var chartDiv = $($(charts[i]).find('div')[0])
      //   var height = $(charts[i]).innerHeight() === 0 ? window.innerHeight : $(charts[i]).innerHeight()
      //   $(charts[i]).css('height', height)
      //   //  $(charts[i]).css('width', $(charts[i]).parent().innerWidth())
      //   chartDiv.css('height', height)
      //   chartDiv.find('canvas').css('height', height)
      //   var chart = echarts.getInstanceByDom(charts[i])
      //   chart.resize()
      // }
    }
  }
}
