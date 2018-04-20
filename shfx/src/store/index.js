import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import StoreModule from './store'
import CommonService from '@/services/CommonService'

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    theme: 'white-theme',
    loginContext: null,
    bbConfig: null, // 报表配置信息
    navExpand: false,
    chartState: 0,
    activeModule: 'myhello/index',
    menulist: []
  },
  modules: StoreModule,
  getters: {
  },
  mutations: {
    setChartState (state, num) {
      state.chartState = state.chartState + 1
    },
    setLoginContext (state, data) {
      state.loginContext = data
    },
    setBBConfig (state, data) {
      state.bbConfig = data
    },
    setMenulist (state, items) {
      state.menulist = items
    },
    setActiveModule (state, item) {
      state.activeModule = item
    },
    setNavExpand (state, item) {
      state.navExpand = item
    }
  },
  actions: {
    findMenuList ({commit}, data) {
      return CommonService.findMenuList().then((result) => {
        commit('setMenulist', result)
      })
    },
    activeMenu ({commit}, data) {
      commit('setActiveModule', data)
    },
    expandMenu ({commit}, data) {
      if (data === 'expand') {
        commit('setNavExpand', true)
      } else {
        commit('setNavExpand', false)
      }
    }
  }
})

export default store
