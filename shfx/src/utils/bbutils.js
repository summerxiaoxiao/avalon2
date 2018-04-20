import _ from 'underscore'
import $ from 'jquery'
import request from '@/utils/api'

/**
 * 查询报表工具中的配置信息
 * 报表名称，报表对应的接口
 * t_bgpz
 * bgmc, bglx, addr, ct
 * @returns {*}
 */
export function loadBBinfo (bbmc) {
  if (window._bbconfig && window._bbconfig.length > 0) {
    return new Promise((resolve, reject) => {
      var data = init(window._bbconfig)
      resolve(data)
    })
  } else {
    return request.get('/static/datas/bbmc.json').then((res) => {
      return init(res)
    })
  }
  function init (res) {
    var pzMap = {}
    $.each(res, function (index, item) {
      pzMap[item.bgmc] = item
    })
    if (bbmc) {
      return pzMap[bbmc]
    }
    return pzMap
  }
}
function loadDataByBBinfo (iframeAddr, fieldArr, params) {
  if (params.tbid && iframeAddr) {
    var newParams = transferCondition(params)
    return request.postUrl(iframeAddr, '/api/pzTb/getTableInfo', newParams).then((res) => {
      var result = operationResultByBBinfo(res, fieldArr)
      return result
    })
  } else {
    return Promise.resolve([])
  }
}
function operationResultByBBinfo (res, fieldArr) { //  处理结果集
  var datas = res.datas
  var result = []
  if (datas) {
    for (var i = 0; i < datas.length; i++) {
      var oldObj = datas[i]
      var obj = {}
      if (fieldArr && fieldArr.length > 0) {
        $.each(fieldArr, function (index, item) {
          if (typeof item === 'string') {
            obj[item] = oldObj[item]
          }
        })
        result.push(obj)
      } else {
        result.push(oldObj)
      }
    }
    if (!fieldArr || fieldArr.length <= 0) {
      result = res
    }
  }
  return result
}

function findKeyByValue (cmap, value) {
  var key = ''
  for (var k in cmap) {
    if (cmap[k] === value) {
      key = k
      return key
    }
  }
  return key
}

export function loadBBData (params) {
  var bbmc = params.bbmc
  var fieldArr = params.fieldArr
  if (!bbmc) {
    throw new Error('缺少参数bbmc!')
  }
  //  1.通过bbmc在bbinfo里查询iframeAddr serverip
  var iframeAddr = ''
  var tbid = ''
  var queryType = 1 //  2 :查询模式 1：聚合模式
  if (!params || typeof params === 'string') {
    params = {}
  }
  return loadBBinfo().then(function (bbmap) {
    //  然后查询数据
    if (bbmap[bbmc]) {
      iframeAddr = bbmap[bbmc].serverip
      tbid = bbmap[bbmc].tbid
      queryType = bbmap[bbmc].bglx
      params.tbid = tbid
      params.qureyType = queryType
      return loadDataByBBinfo(iframeAddr, fieldArr, params)
    } else {
      $.notific8 && $.notific8('没有查询到报表配置信息:' + bbmc, {theme: 'tangerine', heading: '提示', life: 5000})
      throw Error('没有查询到报表配置信息:' + bbmc)
    }
  })
}

export function transferCondition (params) {
  var newParams = {
    tbid: params.tbid,
    'qureyType': params.queryType ? params.queryType : params.qureyType ? params.qureyType : '1'
  }
  // 'basicCondition':{'dwcj':'省','dwmc':'国网河南省电力公司','tjqj':'201612'},'qureyType':'2'
  var basicCondition = {}
  // 以下字段不作为baseicCondition的参数传入
  var exincludeFields = ['queryType', 'qureyType', 'tbid', 'bbmc', 'bbkey', 'fieldArr']
  var includeFields = ['pzGlsxs', 'pzGjgltjs', 'basicCondition']
  for (var key in params) {
    if (_.indexOf(includeFields, key) > -1) {
      newParams[key] = params[key]
    } else if (_.indexOf(exincludeFields, key) <= -1) {
      basicCondition[key] = params[key]
      newParams.basicCondition = basicCondition
    }
  }
  return newParams
}

export function getCompanyData (params, callback) { //  根据单位层级获取单位列表
  var dwcj = JSON.parse(localStorage.getItem('_dwmclist'))
  var dwmclist = dwcj[params.key1 || params.dwcj]
  callback && callback(dwmclist)
}
export function getDwcjByBB (params, callback) { //  获取单位层级，区域，非供电单位, 静态数据Json文件读取
  localStorage.removeItem('_dwmclist')
  params.bbmc = 'filter'
  var arr = ['省', '区域', '市', '县', '非供电单位']
  loadBBData(params).then(function (res) {
    //  处理res
    $.each(res, function (index, item) {
      var dwcj = item['dwcj']
      if (!dwcj || dwcj === 'null') {
        dwcj = '非供电单位'
      }
      item['dwcj'] = dwcj
    })
    var dd = _.groupBy(res, 'dwcj')
    localStorage.setItem('_dwmclist', JSON.stringify(dd))
    var dwcjlist = []
    Object.keys(dd).each(function (index, item) {
      var dwmc = !item || item === 'null' ? '非供电单位' : item
      dwcjlist.push({
        dwdm: item,
        dwmc: dwmc
      })
    })
    // 单位层级排序
    var sortDwcjlist = []
    $.each(arr, function (index, item) {
      var vv = _.findKey(dwcjlist, {dwmc: item})
      if (dwcjlist[vv]) {
        sortDwcjlist.push(dwcjlist[vv])
      }
    })
    if (sortDwcjlist.length !== dwcjlist.length) {
      $.each(dwcjlist, function (index, item) {
        var vv = _.findKey(sortDwcjlist, {dwmc: item.dwmc})
        if (!sortDwcjlist[vv]) {
          sortDwcjlist.push(item)
        }
      })
    }

    //  省、区域、市、县、非电单位
    callback && callback(sortDwcjlist)
  })
}

export function buildIframe (params) {
  var tableCondition = params.tableCondition
  var iframeAddr = window._fengxian_module.bbserver || params.iframeAddr
  var iframeContainer = params.iframeContainer
  var iframe = iframeContainer
  var urlstr = []
  urlstr.push(iframeAddr + '/table-iframe?initIframeObject=')
  urlstr.push(encodeURIComponent(JSON.stringify(tableCondition)))
  urlstr.push('&tableConfig=' + encodeURIComponent(JSON.stringify({
    isCt: true
  })
  ))
  if (!$(iframeContainer).is('iframe')) {
    iframe = document.createElement('iframe')
  }
  iframe.src = urlstr.join('')
  // iframe.src = iframeAddr + '/table-iframe?initIframeObject=' + encodeURIComponent(JSON.stringify(tableCondition)) + '&tableConfig=' + encodeURIComponent(JSON.stringify({
  //     isCt: true
  //   }))
  iframe.id = params.id || 'receiver'
  if (iframeAddr && iframeContainer && !$(iframeContainer).is('iframe')) {
    iframeContainer.appendChild(iframe)
  }
}
export function refreshIframe (params) { // 刷新iframe
  var condition = params.tableCondition
  var iframeAddr = window._fengxian_module.bbserver || params.iframeAddr
  var iframeContainer = params.iframeContainer
  var iframeDom = iframeContainer
  if (!$(iframeContainer).is('iframe')) {
    iframeDom = $(iframeContainer).find('iframe')[0]
  }
  //  * condistion = {
  //            *    basicCondition: {tjqj:'201612'},
  //            *    queryType:2
  //            * }
  //  window.frames[0].postMessage(JSON.stringify(condition),iframeAddr)
  iframeDom.contentWindow.postMessage(JSON.stringify(condition), iframeAddr)
}

export function transferFieldRow (oldRow, allColMap, needFieldMap, defaultValue) {
  var emptyRow = {}
  if (allColMap) {
    defaultValue = defaultValue || 0
    for (var key in oldRow) { // 遍历当前行的所有字段
      var ckey = findKeyByValue(allColMap, key) // 通过字段名查询中文名， yss查找'预算数'
      if (allColMap[ckey] && needFieldMap && needFieldMap[ckey]) {
        emptyRow[needFieldMap[ckey]] = oldRow[key] || defaultValue // 保存需要映射出去的字段对应的值
      }
    }
  }
   // emptyRow = { //将本年累计转换成bnlj
   //     'bnlj': 123
   // }
  return emptyRow
}

export function getFieldsSingle (headers) {
  var colMap = {}
  if (headers) {
    $.each(headers, function (index, item) {
      if (item['isInData']) {
        if (!item['sxct']) { // 单维表
          colMap[item['header']] = item['field'] // colMap['预算数']='yss'
        }
      }
    })
  }
  return colMap
}
// export function getFieldsAll (headers) {
//   var colObj = {}
//   $.each(headers, function (index, item) {
//     if (item['isInData']) { // 直接取field值
//       var field_value = item['field'] // 字段属性名
//       var field_name = item['header'] // 字段属性中文名
//
//       if (item['sxct'] && item['sxct']['lsxmcVauleMap']) { //多维表头
//
//       }
//
//       colObj[field_name] = field_value
//     }
//   }
// }
export function getFieldsByMutiple (headers) { // 多维表头字段名获取
  var fields = {
    // '固定资产原值':{
    //     qcs :null,
    //     qms : null,
    //     zjs : null,
    //     jss : null,
    //     name : 'dydjmc',
    //     p_field:null
    // }
  }
  var colObj = {}
  $.each(headers, function (index, item) {
    if (item['isInData']) {
      if (item['sxct']) {
        colObj['name'] = item['sxct']['hsxmcs'] && item['sxct']['hsxmcs'].length > 0 ? item['sxct']['hsxmcs'][0] : ''
        if (item['sxct']['lsxmcVauleMap']) {
          var parent = item['sxct']['lsxmcVauleMap']
          if (parent['gdzc_jzflmc']) {
            var pname = parent['gdzc_jzflmc']  //  固定资产原值 --价值分类名称
            var pfield = findFieldName(pname)
            if (colObj['p_field'] && colObj['p_field'] !== pfield['field']) {
              colObj = {}
            }
            colObj['p_field'] = pfield['field']
            colObj['p_name'] = pfield['header']
            fields[parent['gdzc_jzflmc']] = colObj
          }
        }
        colObj[item['header']] = item['field']
      }
    }
  })
  //  通过名称查找相应的field name
  function findFieldName (name) {
    var vv = headers.filter(function (item) {
      return item['header'] === name
    })
    return vv[0] || {}
  }
  return fields
}

/**
 * 导出
 * @param bbmc
 * @param tableCondition {dwcj: '', name: '', pzGlsxs: []}
 * @param fields 导出的字段
 */
export function download (bbmc, tableCondition, fields) {
  var mfields = fields || ''
  var iframeAddr = window._fengxian_module.bbserver
  var config = {}
  bbutils.loadBBItemByBbmc(bbmc).then((bbItem) => {
    config.queryType = bbItem['bglx']
    config.tbid = bbItem['tbid']
    iframeAddr = window._fengxian_module.bbserver || bbItem['serverip']
    // 合并查询参数
    var condition = $.extend(tableCondition, config)
    var queryCondition = transferCondition(condition) // 转换参数格式
    run(queryCondition)
  })
  function run (queryCondition) {
    var iframe = document.createElement('iframe')
    var form = document.createElement('form')
    var iframeName = 'download_' + Math.random() * 100
    $(iframe).attr('name', iframeName).css({
      display: 'none',
      width: 0,
      height: 0
    }).appendTo(document.body)
    form.setAttribute('action', iframeAddr + '/api/pzTb/export/tableinfo')
    form.setAttribute('method', 'post')
    form.setAttribute('target', iframeName)
    var input1 = document.createElement('input')
    var input2 = document.createElement('input')
    input1.style.display = 'none'
    input1.setAttribute('name', 'tableQureyDto')
    input1.setAttribute('value', JSON.stringify(queryCondition))
    input2.setAttribute('name', 'fields') // 是一个用逗号隔开的字符串，用于显示指定的数字字段
    input2.setAttribute('value', mfields)
    form.appendChild(input1)
    form.appendChild(input2)
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }
}
var bbutils = {
  /**
   * 通过报表名称bbmc, 查询相应报表的配置信息，报表类型，报表接口地址
   * 参数：{
   *  bbmc: 'zc_all'
   * }
   */
  loadBBItemByBbmc: loadBBinfo,
  /**
   * 通过报表名称bbmc, 和其他过滤参数查询报表数据，先会通过bbmc查询报表接口，然后获取报表数据
   * 参数：{
   * bbmc: 'zc_all',
   * dwdm: '123',
   * tjqj: '2012-06'
   * }
   */
  loadBBData: loadBBData,
  /**
   * 导出报表数据
   * 参数：(bbmc, tableCondition, fields)
   * 参数说明：
   * bbmc : 报表名称
   * tableCondition: {dwcj: '', name: '', pzGlsxs: []}
   * fields: 可以不传，导出的字段
   */
  download: download,
  /**
   *转换参数为报表参数格式
   * 如：{tbid:'1234',querytype:1,dwdm:'1111',date:'2012-06'}
   * 转换为：{
   *  basicCondition:{dwdm:'1111',date:'2012-06'},
   *  qureyType: 1,
   *  tbid: '1234'
   * }
   */
  transferCondition: transferCondition,
  /**
   *根据单位层级获取单位列表
   * 参数：{dwcj:'123'}
   */
  getCompanyData: getCompanyData,
  /**
   * 获取单位层级，区域，非供电单位, 静态数据Json文件读取
   */
  getDwcjByBB: getDwcjByBB,
  /**
   * 嵌入报表工具中的table
   * 创建table iframe
   * 参数：
   * {
           tableCondition: {
               basicCondition:{
                 dwcj: '省',
                 dwdm:'2100'
               },
               pzGlsxs:[],
               pzGltjs:[],
               qureyType:2,
               tbid : '1222222'
            },
           iframeAddr : iframeAddr,
           iframeContainer: document.querySelector('.table-area'),
           id : 'receiver'
     }
   */
  buildIframe: buildIframe,
  /**
   * 刷新嵌入的报表table
   * 刷新iframe table 数据
   * 参数：
   * {
         tableCondition: {
             basicCondition:{
               dwcj: '省',
               dwdm:'2100'
             },
             pzGlsxs:[],
             pzGltjs:[],
             qureyType:2,
             tbid : '1222222'
          },
         iframeAddr : iframeAddr,
         iframeDom: window.frames[0]
   * }
   */
  refreshIframe: refreshIframe,
  /**
   * 参数：{oldRow,allColMap,needFieldMap,defaultValue}
   * @param oldRow  当前行数据{bnljs:1,ljtbs:2,hyss:3}
   * @param allColMap 所有表格原字段名｛‘本年累计’:'bnljs','累计同比':'ljtbs','预算数':"hyss'｝
   * @param needFieldMap 需要转换的字段名 ｛‘本年累计’:'bnlj','累计同比':'tb'｝
   * @param defaultValue 默认值，当字段数据为空时，默认赋值，可以不传
   * @returns {*}  转换后的：{bnlj: 1, tb: 2}
   */
  transferFieldRow: transferFieldRow,
  /**
   * 获取所有表格原字段名
   * 报表工具中的单维表头处理
   * @param headers
   * @returns {{}}
   * {
   *   '原值期末数':'yzqms',
   *   '原值年初数':'yzqcs',
   *   '本年增加数':'bnzjs'
   * }
   */
  getFieldsSingle: getFieldsSingle,
  /**
   * 获取所有表格原字段名
   * 多维表头字段名获取
   * @param headers
   * @returns {{}}
   * {
   *   '固定资产原值':{
   *       '年末数':'c_0_1',
   *       '年初数':'c_0_2',
   *       '增加数':'c_0_3',
   *       'p_field':'c_0',
   *       'p_name':'固定资产原值'
   *   },
   *   '累计折旧':{
   *      '年末数':'c_1_1',
   *      '年初数':'c_1_2',
   *      'p_field':'c_1',
   *      'p_name':'累计折旧'
   *   }
   * }
   */
  getFieldsByMutiple: getFieldsByMutiple
}

export default bbutils
