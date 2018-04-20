import CommonService from '@/services/CommonService'
export default {
  namespaced: true,
  state: {
    id: '',
    dwlist: [], // 单位
    dwxzlist: [], // 单位性质
    selectDwxz: '',
    selectDwdm: '12',
    date: '' //  new Date().Format('yyyy-MM'),
  },

  getters: {
    // getid (state) {
    //   return state.id || ''
    // },
  },

  mutations: {
    setDwlist (state, items) {
      state.dwlist = items
    },
    setDwxzlist (state, items) {
      state.dwxzlist = items
    },
    setSelectDwdm (state, data) {
      state.selectDwdm = data
    },
    setDate (state, data) {
      state.date = data
    }
  },
  actions: {
    loadBar ({commit, state}, data) {
      return CommonService.findDwlist().then((result) => {
        commit('setDwlist', result)
        // CommonService.findDwxzlist().then((dwxzlist) => {
        //   commit('setDwxzlist', dwxzlist)
        // })
      })
    }
  }
}

