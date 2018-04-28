import request from '@/utils/api'
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
    return request.get('/static/datas/zyyszb_chart.json', {})
  }
  findYbpList () {
    return request.get('/static/datas/ybp.json', {})
  }
}

export default YkqkService.getInstance()

