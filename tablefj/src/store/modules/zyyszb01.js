import ZyyszbService from '@/services/ZyyszbService'
export default {
  namespaced: true,
  state: {
    id: '',
    tableList: [],
    chartData: [],
    legendData: [],
    ybpList: [] // 仪表盘List
  },

  getters: {
    // getid (state) {
    //   return state.id || ''
    // },
  },

  mutations: {
    setTableList (state, data) {
      state.tableList = data
    },
    setChartData (state, data) {
      state.chartData = data
    },
    setLegendData (state, data) {
      state.legendData = data
    },
    setYbpList (state, data) {
      state.ybpList = data
    }
  },
  actions: {
    loadList ({commit}, data) {
      return ZyyszbService.findList().then((result) => {
        commit('setTableList', result)
        var chartData = []
        var legendData = []
        result.forEach((item, index) => {
          chartData.push({
            name: item.name,
            value: item.code
          })
          legendData.push(item.name)
        })
        commit('setChartData', chartData)
        commit('setLegendData', legendData)
      })
    },
    loadYbpList ({commit}, data) {
      return ZyyszbService.findYbpList().then((result) => {
        commit('setYbpList', result)
      })
    }
  }
}

