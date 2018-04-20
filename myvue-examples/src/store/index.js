import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import StoreModule from './store'
import CommonService from '@/services/CommonService'

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    theme: 'black-theme',
    loginName: 'admin',
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
    setLoginName (state, name) {
      state.loginName = name
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
    getLoginContext ({commit}, data) {

    },
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
