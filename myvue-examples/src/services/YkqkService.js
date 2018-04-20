import request from '@/utils/api'
class YkqkService {
  static getInstance () {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }

  /**
   * 查询项目大类下拉列表
   */
  findXmdlList () {
    return request.get('/apis/xmdllist.json', {})
  }
  /**
   * 通过项目大类查询项目申请类型12个月的数据
   */
  findXmlxInfoByXmdl (xmdlbm, nd) {
    return request.get('/apis/bar.json', {xmdlbm: xmdlbm, nd: '2017'})
  }
}

export default YkqkService.getInstance()

