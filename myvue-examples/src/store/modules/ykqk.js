import CommonService from '@/services/CommonService'
import YkqkService from '@/services/YkqkService'
export default {
  namespaced: true,
  state: {
    id: '',
    isBarFinish: false,
    bgmc_xmdl: 'ztfx_wxzc', // 项目大类 table bgmc
    dwlist: [],
    xmdllist: [],
    selectDwdm: '12',
    date: '', //  new Date().Format('yyyy-MM'),
    xmdl: '',
    selectXmdl: '13',
    chartMap: {
      categorys: [],
      data: []
    },
    chartPadding: 25,
    chartlist: [],
    xmbm: ''
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
    setXmdllist (state, items) {
      state.xmdllist = items
    },
    setChartlist (state, items) {
      state.chartlist = items
    },
    setChartMap (state, items) {
      state.chartMap = items
    },
    setSelectXmdl (state, data) {
      state.selectXmdl = data
    },
    setSelectDwdm (state, data) {
      state.selectDwdm = data
    },
    setDate (state, data) {
      state.date = data
    },
    setChartPadding (state, data) {
      state.chartPadding = 15
    }
  },
  actions: {
    loadBar ({commit, state}, data) {
      return CommonService.findDwlist().then((result) => {
        commit('setDwlist', result)
      })
    },
    loadContent ({commit}, data) {
      return YkqkService.findXmdlList().then((xmdlResult) => {
        commit('setXmdllist', xmdlResult)
      })
    },
    loadContentChart ({commit, state}, data) {
      return YkqkService.findXmlxInfoByXmdl(state.selectXmdl).then((result) => {
        let categorys = []
        result.forEach((item, index) => {
          categorys.push(item['date'])
        })
        commit('setChartMap', {
          categorys: categorys,
          data: result
        })
        commit('setChartlist', result)
      })
    },
    hello ({commit}, data) {
      return YkqkService.hello({name: data}).then((result) => {
        commit('setList', result)
      })
    }

  }
}

