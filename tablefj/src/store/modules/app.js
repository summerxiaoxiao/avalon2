import CommonService from '@/services/CommonService'
import MainService from '@/services/MainService'
import moment from 'moment'
export default {
  namespaced: true,
  state: {
    dwlist: [], // 单位
    dwxzlist: [], // 单位性质
    selectDw: { // 当前选中的单位
      dwdm: '',
      dwmc: ''
    },
    selectDwxz: { // 当前选中的单位性质
      value: '',
      name: ''
    },
    date: moment(new Date()).format('YYYY-MM'),
    dateZW: moment(new Date()).format('YYYY年MM月'),
    localType: 'fj',
    geoCoordMapData: [], // 地图坐标
    mapFeaturesData: [], // 地图基础数据
    registerMapData: [] // 地图注册数据（显示map图形）
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
    setSelectDw (state, data) {
      state.selectDw = data
    },
    setSelectDwxz (state, data) {
      state.selectDwxz = data
    },
    setDate (state, data) {
      state.date = data
      state.dateZW = moment(data).format('YYYY年MM月')
    },
    set_geoCoordMapData (state, data) {
      state.geoCoordMapData = data
    },
    set_mapFeaturesData (state, data) {
      state.mapFeaturesData = data
    },
    set_registerMapData (state, data) {
      state.registerMapData = data
    }
  },
  actions: {
    /**
     * 单位列表
     * @param commit
     * @param state
     * @param data
     * @returns {PromiseLike<T> | Promise<T> | *}
     */
    loadDwlist ({commit, state}, data) {
      return CommonService.findDwlist().then((result) => {
        commit('setDwlist', result)
        commit('setSelectDw', result[0])
      })
    },
    /**
     * 单位性质列表
     * @param commit
     * @param state
     * @param data
     * @returns {PromiseLike<T> | Promise<T> | *}
     */
    loadDwxzlist ({commit, state}, data) {
      return CommonService.findDwxzlist().then((dwxzlist) => {
        commit('setDwxzlist', dwxzlist)
        commit('setSelectDwxz', dwxzlist[0])
      })
    },
    /**
     * 加载福建map地图
     * @param commit
     * @param data
     */
    loadMap ({commit, state}, data) {
      // var self = this
      // commit('set_mapType', data.mapType)
      // commit('set_mapMark', data.mapMark)
      return CommonService.getMapData(data.mapMark, {mapType: data.mapType}).then((res) => {
        if (data.mapMark) {
          commit('set_geoCoordMapData', res.geoMapJson)
        }
        commit('set_mapFeaturesData', res.mapJson.features)
        commit('set_registerMapData', res.mapJson)
      })
    },
    getJykhzbData ({commit, state}, data) {
      return MainService.getJykhzbData(data)
    },
    getJykhzbFgsData ({commit, state}, data) {
      return MainService.getJykhzbFgsData(data)
    }
  }
}

