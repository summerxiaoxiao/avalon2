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
    this.$nextTick(function () {
    })
  },
  computed: {
    ...Vuex.mapState({
      'chartState': state => state.chartState
    })
  },
  watch: {
    chartState () {
      this.$(window).trigger('resize')
    }
  },
  methods: {
  }
}
