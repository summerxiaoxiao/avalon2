import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import Report from './modules/report'
import ReportManage from './modules/reportManage'
import ReportTemplateManage from './modules/reportTemplateManage'
import DatasetManage from './modules/datasetManage'
import Linkage from './modules/linkage'
import Qmys from './modules/qmys/qmys'
import Driver from './modules/qmys/driver'

// import initState from './init-state'

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: {
    report: Report,
    linkage: Linkage,
    reportManage: ReportManage,
    datasetManage: DatasetManage,
    reportTemplateManage: ReportTemplateManage,
    qmys: Qmys,
    driver: Driver
  },
  getters: {
  },
  mutations: {
  }
})

export default store
