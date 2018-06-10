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
        if (this.svgs && this.svgs.length > 0) {
          for (var i = 0; i < this.svgs.length; i++) {
            this.svgs[i].call()
          }
        }
      })()
    }
  },
  computed: {
    ...Vuex.mapState({
      'svgs': state => state.svgs
    })
  },
  data () {
    return {
      hello: 1
    }
  },
  watch: {
    svgs () {
    }
  },
  methods: {
  }
}
