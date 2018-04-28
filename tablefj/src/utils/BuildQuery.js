import _ from 'lodash'

/**
 * 构建报表工具的查询参数
 */
class BuildQuery {

  constructor (option) {
    this.option = option
    // 初始化
    this.queryParams = {}
    this.pzGjgltjs = [] // 高级筛选
    this.pzGlsxs = [] // 基本筛选
    this.containObject = { // 高级筛选
      glms: '包含',
      qyh: '0', // 0： 且 1：或
      sxlx: 1,
      sxmc: '', // 字段名称： project_id
      sxms: '', // 字段描述： 项目编码
      tj1: '1', // 1: 包含， 2： 不包含 3：开头是 4：开头不是 5：等于 6：不等于 7：为空 8：不为空 （7和8不用传值value）
      tj2: '', // 当qyh=1(或)时，tj2的类型同tj1说明
      xh: 0, // 累加序号
      z1: '', // value: 3109
      z2: '' // 当qyh=1(或)时，tj2的值value
    }

    this.eqObject = { // 基本筛选： 等于多个值
      containValues: [], // value: '201711', '201709', '201611', '201612'
      glms: '等于', // '201711', '201709', '201611', '201612'
      sxmc: '', // 字段名称： month_id
      sxms: '' // 字段描述：日期
    }
  }
  serialize () {
    var condition = _.cloneDeep(this.queryParams)
    if (this.pzGjgltjs && this.pzGjgltjs.length > 0) {
      condition.pzGjgltjs = _.cloneDeep(this.pzGjgltjs)
    }
    if (this.pzGlsxs && this.pzGlsxs.length > 0) {
      condition.pzGlsxs = _.cloneDeep(this.pzGlsxs)
    }
    return condition
  }
  toString () {
    let condition = this.serialize()
    let str = JSON.stringify(condition)
    return str
  }
  // 基础筛选
  /**
   * 基础筛选- 等于多个值
   * @param name 名称
   * @param field 字段英文名
   * @param values 字段值，可以是数组
   */
  eqArray (name, field, values) {
    this.clean(field)
    let queryObject = _.cloneDeep(this.eqObject)
    let mvalues = _.isArray(values) ? values : [values]
    queryObject['sxmc'] = field
    queryObject['sxms'] = name
    queryObject['glms'] = '等于' + _.slice(mvalues, 0, mvalues.length - 1).join('、') + '或' + _.last(mvalues)
    queryObject['containValues'] = mvalues
    this.pzGlsxs.push(queryObject)
  }

  /**
   * 基本等于
   * @param field
   * @param value
   */
  eqMap (field, value) {
    this.clean(field)
    this.queryParams[field] = value
  }
  // 高级筛选
  /**
   * 高级筛选-包含
   * @param name 字段描述
   * @param field 字段名
   * @param value1 字段值1
   * @param type and :且， or: 或
   * @param value2 当or时，字段值2
   * @param filterType2 字段值2的条件类型，
   * filterType2值：
   * 包含： %like%
   * 不包含：!%like%
   * 开头是：like%
   * 开头不是：!like%
   * 等于： =
   * 不等于：!=
   * 为空：isEmpty
   * 不为空：isNotEmpty
   */
  contains (name, field, value1, type, filterType2, value2) {
    let queryObject = this.getQueryObject('1', name, field, value1, type, value2, filterType2)
    this.pzGjgltjs.push(queryObject)
  }

  /**
   * 高级筛选-不包含
   */
  notContains (name, field, value1, type, filterType2, value2) {
    let queryObject = this.getQueryObject('2', name, field, value1, type, value2, filterType2)
    this.pzGjgltjs.push(queryObject)
  }
  /**
   * 高级筛选-开头是
   */
  start (name, field, value1, type, filterType2, value2) {
    let queryObject = this.getQueryObject('3', name, field, value1, type, value2, filterType2)
    this.pzGjgltjs.push(queryObject)
  }
  /**
   * 高级筛选-开头不是
   */
  notStart (name, field, value1, type, filterType2, value2) {
    let queryObject = this.getQueryObject('4', name, field, value1, type, value2, filterType2)
    this.pzGjgltjs.push(queryObject)
  }
  /**
   * 高级筛选-等于
   * @param name 字段描述
   * @param field 字段名
   * @param value1 字段值1
   * @param type and :且， or: 或
   * @param value2 当or时，字段值2
   * @param filterType2 字段值2的条件类型，1：包含，2：不包含......略
   */
  eq (name, field, value1, type, filterType2, value2) {
    let queryObject = this.getQueryObject('5', name, field, value1, type, value2, filterType2)
    this.pzGjgltjs.push(queryObject)
  }
  /**
   * 高级筛选-不等于
   */
  notEq (name, field, value1, type, filterType2, value2) {
    let queryObject = this.getQueryObject('6', name, field, value1, type, value2, filterType2)
    this.pzGjgltjs.push(queryObject)
  }
  /**
   * 高级筛选-为空
   */
  empty (name, field, type, filterType2, value2) {
    let queryObject = this.getQueryObject('7', name, field, '', type, value2, filterType2)
    this.pzGjgltjs.push(queryObject)
  }
  /**
   * 高级筛选-不为空
   */
  notEmpty (name, field, type, filterType2, value2) {
    let queryObject = this.getQueryObject('8', name, field, '', type, value2, filterType2)
    this.pzGjgltjs.push(queryObject)
  }

  /**
   * 根据条件封装参数
   * @param filterType
   * @param name
   * @param field
   * @param value1
   * @param type 默认值and, and: 且 or: 或
   * @param value2
   * @param filterType2
   * @returns {*}
   */
  getQueryObject (filterType, name, field, value1, type, value2, filterType2) {
    this.clean(field)
    let queryObject = _.cloneDeep(this.containObject)
    let xh = this.pzGjgltjs.length // 序号
    let qyh = type && type === 'or' ? 1 : 0 // 0: 且， 1：或
    let desc = this.getDesc(filterType).desc + value1

    queryObject['glms'] = desc
    queryObject['qyh'] = qyh
    queryObject['sxmc'] = field // 字段英文名
    queryObject['sxms'] = name // 字段中文名
    queryObject['tj1'] = filterType // 等于, 包含。。。。。
    queryObject['z1'] = value1 // 字段对应的值
    queryObject['xh'] = xh // 序号

    if (value2 || filterType2) { // 当value2 或filterType2不为空时
      var ftype2 = filterType2 || filterType // 为空就和字段1的类型相同
      let typeName = type && type === 'or' ? '或' : '且'
      let descObj = this.getDesc(ftype2)
      let desc2 = descObj.desc + value2
      queryObject['glms'] = queryObject['glms'] + typeName + desc2 // 包含2017且不等于201701
      queryObject['tj2'] = descObj.type // 包含，不包含，等于，不等于.....略
      queryObject['z2'] = value2 // 字段对应的值
    }
    return queryObject
  }

  getDesc (key) {
    let desc = ''
    let type = '1'
    switch (key) {
      case '1':
      case '%like%':
        desc = '包含'
        type = '1'
        break
      case '2':
      case '!%like%':
        desc = '不包含'
        type = '2'
        break
      case '3':
      case 'like%':
        desc = '开头是'
        type = '3'
        break
      case '4':
      case '!like%':
        desc = '开头不是'
        type = '4'
        break
      case '5':
      case '=':
        desc = '等于'
        type = '5'
        break
      case '6':
      case '!=':
        desc = '不等于'
        type = '6'
        break
      case '7':
      case 'isEmpty':
        desc = '为空'
        type = '7'
        break
      case '8':
      case 'isNotEmpty':
        desc = '不为空'
        type = '8'
        break
      default:
        desc = '包含'
        type = '1'
        break
    }
    return {
      desc: desc,
      type: type
    }
  }

  /**
   * 根据field 清除已存在的参数
   * @param field
   */
  clean (field) {
    if (this.pzGjgltjs && this.pzGjgltjs.length > 0) {
      var index = _.findIndex(this.pzGjgltjs, {'sxmc': field})
      _.pullAt(this.pzGjgltjs, index)
    }
    if (this.pzGlsxs && this.pzGlsxs.length > 0) {
      var index2 = _.findIndex(this.pzGlsxs, {'sxmc': field})
      _.pullAt(this.pzGlsxs, index2)
    }
    var kk = _.pick(this.queryParams, [field])
    if (!_.isEmpty(kk)) {
      delete this.queryParams[field]
    }
  }

}

export default BuildQuery
