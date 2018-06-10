/**
 * 打包后请求static/datas静态文件时的根路径
 * @type {string}
 */
export const requestModulePath = '/ccf.portal/modules/app'

export function getRequestModulePath () {
  // if (process.env.NODE_ENV !== 'production') {
  //   return ''
  // }
  return requestModulePath
}
/*
 *   功能:实现VBScript的addDate功能.
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date()
 *   var newDate = addDate( 'd', 5, now)
 *---------------   addDate(interval,number,date)   -----------------
 */
export function addDate (interval, number, date) {
  switch (interval) {
    case 'y': { // 年
      date.setFullYear(date.getFullYear() + number)
      return date
    }
    case 'q': { // 季度
      date.setMonth(date.getMonth() + number * 3)
      return date
    }
    case 'm': { // 月
      date.setMonth(date.getMonth() + number)
      return date
    }
    case 'w': { // 周
      date.setDate(date.getDate() + number * 7)
      return date
    }
    case 'd': { // 天数
      date.setDate(date.getDate() + number)
      return date
    }
    case 'h': { // 小时
      date.setHours(date.getHours() + number)
      return date
    }
    case 'mm': { // 分钟
      date.setMinutes(date.getMinutes() + number)
      return date
    }
    case 's ': { // 秒
      date.setSeconds(date.getSeconds() + number)
      return date
    }
    default: {
      date.setDate(date.getDate() + number)
      return date
    }
  }
}
/**
 * 获取容器高宽
 * @param doc
 * @returns {{height: number, width: number}}
 */
export function calDomWidthHeight (doc) {
  //  documentElement返回文档的根元素
  var cHeight = Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
  var sHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight)
  var finalHeight = Math.max(sHeight, cHeight)

  var cWidth = Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
  var sWidth = Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth)
  var width = Math.max(cWidth, sWidth)

  return {
    height: finalHeight,
    width: width
  }
}

/**
 * 处理坐标数据，转换格式，便于echarts地图显示
 * @param geoCoordMap 地图坐标数据
 * @param existData 已存在的坐标数据（用于标注）
 * @returns {{res: Array, currentData: Array}}
 */
export function convertData (geoCoordMap, existData, currentDwdm) {
  var res = []
  var currentData = []
  var data = existData
  for (var i = 0; i < data.length; i++) {
    var geoCoord = null
    if (data[i] && data[i]['name'] && geoCoordMap[data[i]['name']]) {
      geoCoord = geoCoordMap[data[i]['name']]
    }
    if (geoCoord) {
      var obj = {
        id: data[i].id,
        name: data[i].name,
        coord: geoCoord, // 设置坐标，便于地图标注打标
        value: data[i].value
      }
      if (data[i]['id'] === currentDwdm) {
        currentData.push(obj)
      } else {
        res.push(obj)
      }
    }
  }
  return {
    data: res,
    currentData: currentData
  }
}

/**
 * 处理数据格式，已存在的数据在地图上selected=true
 * @param mapFeatureData 地图数据
 * @param exsistData 已存在的数据
 * @returns {{maxValue: number, data: Array}}
 */
export function convertMapJson (mapFeatureData, exsistData, selectedDwdm) {
  var rsData = []
  var maxValue = 0
  for (var i = 0; i < mapFeatureData.length; i++) {
    var item = mapFeatureData[i]
    var name = item.properties.name
    var obj = {
      name: name,
      value: 0
    }
    var isExsit = false
    for (var index = 0; index < exsistData.length; index++) {
      var eItem = exsistData[index]
      if (name.indexOf(eItem.name) > -1) {
        obj = {
          name: name,
          value: eItem.value ? eItem.value : 0,
          id: eItem.id
        }
        if (maxValue < obj.value) {
          maxValue = obj.value
        }
        if (eItem.id === selectedDwdm) {
          obj.selected = true
        }
        rsData.push(obj)
        isExsit = true
        return
      }
    }
    if (!isExsit) {
      rsData.push(obj)
    }
  }
  return {
    maxValue: maxValue,
    data: rsData
  }
}
