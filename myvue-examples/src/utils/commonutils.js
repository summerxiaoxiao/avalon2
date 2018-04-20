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

