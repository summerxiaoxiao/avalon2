import request from '@/utils/api'
import {getRequestModulePath} from '../utils/commonutils'
let requestModulePath = getRequestModulePath()
class YkqkService {
  static getInstance () {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }
  /**
   * 查询可控费用
   */
  findList () {
    return request.get(requestModulePath + '/static/datas/zyyszb_chart.json', {})
  }
  findYbpList () {
    return request.get(requestModulePath + '/static/datas/ybp.json', {})
  }
}

export default YkqkService.getInstance()

export function findZblist (params, dwxzName) {
  return new Promise((resolve, reject) => {
    request.get(requestModulePath + '/static/datas/zyyszb_chart.json', params).then((result) => {
      // var chartData = []
      // var legendData = []
      var legendFn = (row) => {
        return row.name
      }
      var seriesDataFn = (row) => {
        return {name: row.name, value: row.code, parentId: row.parentId}
      }
      // result.forEach((item, index) => {
      //   chartData.push({
      //     name: item.name,
      //     value: item.code
      //   })
      //   legendData.push(item.name)
      // })
      let rows = result
      resolve({legendFn, seriesDataFn, rows})
    })
  })
}
export function findYbpList (params, dwxzName) {
  return new Promise((resolve, reject) => {
    request.get(requestModulePath + '/static/datas/ybp.json', params).then((result) => {
      let rows = result.filter(row => {
        return row.dwxz === dwxzName
      })
      resolve({rows})
    })
  })
}
