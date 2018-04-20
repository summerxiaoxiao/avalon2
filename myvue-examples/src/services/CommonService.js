import request from '@/utils/api'
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
    return request.get('/apis/dwlist.json', {})
  }

  /**
   * 查询单位性质列表
   */
  findDwxzlist () {
    return request.get('/apis/models/dwxz.json', {})
  }
}

export default CommonService.getInstance()

