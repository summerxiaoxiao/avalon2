// globals CCF

import { request } from '../api/net'
import {getRequestModulePath} from '../utils/commonutils'
let requestModulePath = getRequestModulePath()
class CommonService {
  static getInstance () {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }
  /**
   *查询单位列表
   */
  findDwlist () {
    return request(requestModulePath + '/static/datas/dwlist.json', {}, 'get')
  }

  /**
   * 查询单位性质列表
   */
  findDwxzlist () {
    return request(requestModulePath + '/static/datas/dwxz.json', {}, 'get')
  }

  /**
   * 获取福建省地图数据, 用于显示地图map
   * @param mark 是否显示坐标
   * @param params mapType： 地图类型，默认显示fj, fj , china
   * @returns {Promise<any>}
   */
  getMapData (mark, params) {  //  var url = 'api/mapdata/geometryProvince/35.json'
    var url = '/api/mapdata/geometryProvince/41.json'
    var url2 = '/api/mapdata/china.json' // 中国地图
    var mapType = params.mapType || 'fj'
    url = mapType === 'china' ? url2 : url

    return new Promise(function (resolve, reject) {
      request(url, params, 'get').then((res) => {
        var rs = {}
        if (mark) { // 坐标数据，便于打标
          // 获取福建坐标, 用于标注
          request('/api/mapdata/fjgeomap.json', params, 'get').then((geoMapJson) => {
            rs = {
              geoMapJson: geoMapJson,
              mapJson: res
            }
            resolve(rs)
          })
        } else {
          rs = {
            mapJson: res
          }
          resolve(rs)
        }
      })
    })
  }
}

export default CommonService.getInstance()

