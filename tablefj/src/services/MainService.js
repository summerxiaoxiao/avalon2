import request from '@/utils/api'
import {getRequestModulePath} from '../utils/commonutils'
let requestModulePath = getRequestModulePath()
class MainService {
  static getInstance () {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }
  /**
   * 查询经营考核指标
   */
  getJykhzbData () {
    return request.get(requestModulePath + '/static/datas/jykhzb.json', {})
  }
  /**
   * 查询经营考核指标--分公司
   */
  getJykhzbFgsData () {
    return request.get(requestModulePath + '/static/datas/jykhzb_fgs.json', {})
  }
}

export default MainService.getInstance()

