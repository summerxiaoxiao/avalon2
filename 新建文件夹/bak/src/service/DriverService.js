// globals CCF

import { request } from '../api/net'
import {getRequestModulePath} from '../utils/commonutils'
let requestModulePath = getRequestModulePath()
class DriverService {
  static getInstance () {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }
  /**
   * 查询业绩考核指标
   */
  findKhzbList () {
    return request(requestModulePath + '/static/datas/ybp.json', {}, 'get')
  }
}

export default DriverService.getInstance()

