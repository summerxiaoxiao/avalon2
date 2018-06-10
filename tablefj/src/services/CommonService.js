import request from '@/utils/api'
import bbutils from '@/utils/bbutils'
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
    return request.get(requestModulePath + '/static/datas/dwlist.json', {})
  }

  /**
   * 查询单位性质列表
   */
  findDwxzlist () {
    return request.get(requestModulePath + '/static/datas/dwxz.json', {})
  }
  findTableData (bbmc, params) {
    return bbutils.loadBBData(bbmc, params)
  }

  /**
   * 获取福建省地图数据, 用于显示地图map
   * @param mark 是否显示坐标
   * @param params mapType： 地图类型，默认显示fj, fj , china
   * @returns {Promise<any>}
   */
  getMapData (mark, params) {
    //  var url = 'api/mapdata/geometryProvince/35.json'
    var url = '/api/mapdata/geometryProvince/41.json'
    var url2 = '/api/mapdata/china.json' // 中国地图
    var mapType = params.mapType || 'fj'
    url = mapType === 'china' ? url2 : url

    return new Promise(function (resolve, reject) {
      request.getUrl(url, params).then((res) => {
        var rs = {}
        if (mark) { // 坐标数据，便于打标
          // 获取福建坐标, 用于标注
          request.getUrl('/api/mapdata/fjgeomap.json', params).then((geoMapJson) => {
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

