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
    case 's': { // 秒
      date.setSeconds(date.getSeconds() + number)
      return date
    }
    default: {
      date.setDate(date.getDate() + number)
      return date
    }
  }
}
// var monthOptions = {
//   glms: '包含' + state.date,
//   qyh: '0',
//   sxlx: 1,
//   sxmc: 'month_id',
//   sxms: '日期',
//   tj1: '1',
//   tj2: '',
//   xh: 1,
//   z1: '' + state.year.replace('年', ''),
//   z2: ''
// }
//pzGjgltjs.push(monthOptions)
