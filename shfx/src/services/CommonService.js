import request from '@/utils/api'
import bbutils from '@/utils/bbutils'
import $ from 'jquery'
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
    return request.get('/static/datas/dwlist.json', {})
  }

  getTableInfo (bbmc, params, colMap, headerType) {
    var pp = JSON.parse(JSON.stringify(params))
    pp.bbmc = bbmc
    return new Promise((resolve, reject) => {
      bbutils.loadBBData(pp).then((res) => {
        var allFieldMap = {} // 多维表头
        if (headerType === 'mutiple' || headerType === 2) {
          allFieldMap = bbutils.getFieldsByMutiple(res.headers) // 多维表头
        } else {
          allFieldMap = bbutils.getFieldsSingle(res.headers)// 单维表
        }
        // 总体数据
        var zjrow = bbutils.transferFieldRow(res.zjdata, allFieldMap, colMap)
        var rtMap = {}
        rtMap.total = zjrow

        if (res.datas && res.datas.length > 0) {
          // 转换字段名
          var datas = []
          $.each(res.datas, function (i, item) {
            var row = bbutils.transferFieldRow(item, allFieldMap, colMap)
            datas.push(row)
          })
          rtMap.data = datas
        }
        resolve(rtMap)
      })
    })
  }

  getTableInfoAll (bbmc, params) {
    var pp = JSON.parse(JSON.stringify(params))
    pp.bbmc = bbmc
    return bbutils.loadBBData(pp)
  }
}

export default CommonService.getInstance()

