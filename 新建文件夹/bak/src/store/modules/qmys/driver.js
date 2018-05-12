import DriverService from '@/service/DriverService'
export default {
  namespaced: true,
  state: {
    khzblist: [] // 业绩考核指标
  },
  getters: {
  },
  mutations: {
    setKhzblist (state, items) {
      state.khzblist = items
    }
  },
  actions: {
    /**
     * 单位性质列表
     * @param commit
     * @param state
     * @param data
     * @returns {PromiseLike<T> | Promise<T> | *}
     */
    loadKhzblist ({commit, state}, data) {
      return DriverService.findKhzbList().then((list) => {
        commit('setKhzblist', list)
        return list
      })
    }
  }
}

