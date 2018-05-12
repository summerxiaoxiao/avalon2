// globals CCF

import $ from 'jquery'
import _ from 'underscore'

import { ENABLE_JH, FORMAT_FIELD_TYPES, FORMAT_TYPES, VISUAL_TYPES } from './constant'
import {
  applySlicers,
  convertFormatToData,
  convertPropertiesToData, reportToSource, sourceToConfig, sourceToConfigBucket,
  sourceToConfigFormatCard,
  sourceToConfigFormatCardSlice, sourceToConfigFormatEnum, sourceToDatasetEntry, sourceToReport,
  sourceToReportDataset,
  sourceToReportItem
} from './data'
import { getFormatValue } from './common'
import { onceRequest, request } from './net'

/**
 * 根据id获取报表信息
 * @param id
 */
const _findById = onceRequest(function (id) {
  return ['/api/jcBb/findBbDto', {id}, 'get']
})

export function findById (id) {
  return _findById(id).then(resp => {
    return sourceToReport(resp)
  })
}

/**
 * 获取基本过滤筛选数据
 */
export const fetchPropertyValues = function (propertyId, datasetId) {
  return request('/api/pzTbsx/getDisTbsx', {sjjid: datasetId, sxmc: propertyId}, 'get')
}

/**
 * 获取图表容器配置
 */
export function fetchVisualContainerConfig () {
  return request('/api/pzTblx/getAllConf', {}, 'get').then((resp) => {
    const config = {}
    const {tblxs = [], gsmjzs = []} = resp || {}
    const enumOptions = {}

    gsmjzs.forEach(row => {
      enumOptions[row.gsbm] = enumOptions[row.gsbm] || []
      enumOptions[row.gsbm].push(sourceToConfigFormatEnum(row))
    })

    tblxs.forEach(row => {
      if (!row.tblx) {
        return
      }

      const tblx = row.tblx
      const type = tblx.tblxbm
      config[type] = sourceToConfig(tblx)
      const buckets = []
      ;(row.sx || []).forEach(sx => {
        buckets.push(sourceToConfigBucket(sx))
      })
      config[type].buckets = buckets

      const formats = []
      const cards = {}
      ;(row.gs || []).forEach(gs => {
        let card
        if (gs.gslxs === '0') {
          return
        }
        if (cards[gs.gslxbm]) {
          card = cards[gs.gslxbm]
        } else {
          card = sourceToConfigFormatCard(gs)
          cards[gs.gslxbm] = card
          formats.push(card)
        }
        const slice = sourceToConfigFormatCardSlice(gs)
        if (slice.type === FORMAT_FIELD_TYPES.LIST || slice.type === FORMAT_FIELD_TYPES.ENUM) {
          if (enumOptions[slice.name]) {
            slice.options = enumOptions[slice.name]
          }
        }
        card.slices.push(slice)
      })
      config[type].formats = formats
    })
    return config
  }).catch(e => {
    console.error(e)
  })
}

function processFetchTableDataParams ({format, params, type}, data) {
  params = params || {}
  if ('pzPxsxs' in params) {
    data['pzPxsxs'] = params['pzPxsxs']
    delete params['pzPxsxs']
  }

  const queryType = getFormatValue(format, FORMAT_TYPES.EXTEND, FORMAT_TYPES.EXTEND_QUERY_MODE)
  if (_.isUndefined(params.qureyType) && !_.isUndefined(queryType)) {
    params['qureyType'] = queryType
  }
  const levelRowValue = getFormatValue(format, FORMAT_TYPES.LEVEL, FORMAT_TYPES.LEVEL_ROW)
  if (!_.isUndefined(levelRowValue)) {
    params['sxzCc'] = levelRowValue
  }
  const levelColumnValue = getFormatValue(format, FORMAT_TYPES.LEVEL, FORMAT_TYPES.LEVEL_COLUMN)
  if (!_.isUndefined(levelRowValue)) {
    params['lcc'] = levelColumnValue
  }
  if (!ENABLE_JH) {
    params['qureyType'] = 2
  }
  if (type === VISUAL_TYPES.SLICER) {
    params['qureyType'] = 1
  }
  data['tbQurey'] = params
  return data
}

export const fetchTableData = function ({fieldProperties, id, params, datasetId, type, sortProperties, filterProperties, format, linkage, slicers}) {
  if (!type) {
    return Promise.reject('图表类型未找到')
  }

  if (type === VISUAL_TYPES.SLICER) {
    type = 1
  }

  let data = {
    pzTbsxs: [],
    tb: {
      tbid: id,
      sjjid: datasetId,
      tblx: type
    }
  }

  data = convertPropertiesToData({id, fieldProperties, sortProperties, filterProperties}, data)
  data = applySlicers(slicers, data)
  data = convertFormatToData({id, format, visualType: type}, data)
  data = processFetchTableDataParams({format, params, type}, data)
  let url
  if (linkage) {
    data.jdid = linkage.jdid
    data.soureData = linkage.soureData
    url = '/api/pzTb/getTableInfoByCtInfo'
  } else {
    url = '/api/pzTb/getTableInfoByTbInfo'
  }
  return request(url, data)
}

let downloadIframeCount = 0
export const exportTableData = function ({fieldProperties, id, params, datasetId, type, sortProperties, filterProperties, format, slicers}) {
  if (type === VISUAL_TYPES.SLICER) {
    type = 1
  }

  let data = {
    pzTbsxs: [],
    tb: {
      sjjid: datasetId,
      tblx: type
    }
  }

  data = convertPropertiesToData({id, fieldProperties, sortProperties, filterProperties}, data)
  data = applySlicers(slicers, data)
  data = convertFormatToData({id, format, visualType: type}, data)
  data = processFetchTableDataParams({format, params}, data)

  const form = document.createElement('form')
  const iframeName = 'download' + (downloadIframeCount++)
  const iframe = document.createElement('iframe')

  const promise = new Promise(function (resolve, reject) {
    function check () {
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        if (iframe.contentDocument.body.innerHTML) {
          console.log(iframe.contentDocument.body.innerHTML)
          reject('导出报表数据失败')
        } else {
          resolve()
        }
        // document.body.removeChild(iframe)
        return
      }
      window.setTimeout(check, 3000)
    }
    check()
  })

  $(iframe).attr('name', iframeName).css({
    display: 'none',
    width: 0,
    height: 0
  }).appendTo(document.body)

  form.setAttribute('action', '/api/pzTb/export')
  form.setAttribute('method', 'post')
  form.setAttribute('target', iframeName)
  const input = document.createElement('input')
  input.setAttribute('name', 'pzTbDto')
  input.setAttribute('value', JSON.stringify(data))
  form.appendChild(input)
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
  return promise
}

export function save ({report, sectionIds, sections, visualContainers, datasetEntries = {}}) {
  return doSave({report, sectionIds, sections, visualContainers, datasetEntries}).then(resp => {
    if (resp.status) {
      const objs = resp.objs
      if (objs[0] && objs[0]['bb']) {
        return sourceToReport(objs[0])
      } else {
        return Promise.reject('保存失败，返回数据为空')
      }
    } else {
      return Promise.reject(resp.msg)
    }
  })
}

const doSave = onceRequest(function ({report, sectionIds, sections, visualContainers, datasetEntries = {}}) {
  const data = reportToSource({
    report,
    sectionIds,
    sections,
    visualContainers,
    datasetEntries
  })
  return ['/api/jcBb/save', data]
})

export function fetchReportList ({parentId, keyword, sortType}) {
  const data = {
    mllx: 1,
    sortType
  }

  if (!_.isUndefined(keyword) && keyword !== '') {
    data['keyWord'] = keyword
  } else {
    data['sjmlbm'] = parentId || null
  }

  return request('/api/jcMl/findByParam', data).then(resp => {
    const items = []
    if (Array.isArray(resp)) {
      resp.forEach(item => {
        items.push(sourceToReportItem(item))
      })
    }
    return items
  })
}

export function renameReportItem ({id, type, name}) {
  const data = {
    catalogId: id,
    name,
    type,
    mllx: 1
  }

  return request('/api/jcMl/updateCatalogName', data).then(resp => {
    if (resp) {
      if (resp.status && (resp.objs && resp.objs.length)) {
        return sourceToReportItem(resp.objs[0])
      } else {
        return Promise.reject(resp.msg ? resp.msg : '重命名失败')
      }
    } else {
      return Promise.reject()
    }
  })
}

export function deleteReportItem ({id, type}) {
  const data = {
    catalogId: id,
    type,
    mllx: 1
  }

  return request('/api/jcMl/delCatalog', data).then(resp => {
    if (resp.status) {
      return true
    } else {
      return Promise.reject(resp.msg)
    }
  })
}

export function moveReportItem ({id, type, parentId}) {
  const data = {
    catalogId: id,
    parentId: parentId === 'root' ? null : parentId,
    type,
    mllx: 1
  }

  return request('/api/jcMl/updateCatalogSjml', data).then(resp => {
    if (resp) {
      if (resp.status && (resp.objs && resp.objs.length)) {
        return sourceToReportItem(resp.objs[0])
      } else {
        return Promise.reject(resp.msg ? resp.msg : '移动失败')
      }
    } else {
      return Promise.reject()
    }
  })
}

export function createReportDirectory ({name, parentId}) {
  if (parentId === 'root') {
    parentId = null
  }
  const data = {
    type: '0',
    parentId,
    name,
    mllx: 1
  }
  return request('/api/jcMl/addCatalog', data).then(resp => {
    if (resp) {
      if (resp.status && (resp.objs && resp.objs.length)) {
        return sourceToReportItem(resp.objs[0])
      } else {
        return Promise.reject(resp.msg ? resp.msg : '创建目录失败')
      }
    } else {
      return Promise.reject()
    }
  })
}

export function fetchReportDirectoryParents (id) {
  function addParents (node, parents) {
    parents.push({
      id: node.catalogId === 'root' ? null : node.catalogId,
      name: node.name
    })
    if (node.children) {
      node.children.forEach(node => {
        addParents(node, parents)
      })
    }
  }
  return request('/api/jcMl/getCatalogPath', {catalogId: id, mllx: 1}, 'get').then(resp => {
    const parents = []
    if (typeof resp === 'object' && resp.catalogId) {
      addParents(resp, parents)
    }
    return parents
  })
}

export function fetchReportDirectoryTree () {
  function addTree (node, tree) {
    const newNode = {
      id: node.catalogId,
      parentId: node.parentId,
      name: node.name
    }
    if (node.children) {
      newNode.children = []
      node.children.forEach(node => {
        addTree(node, newNode.children)
      })
    }
    tree.push(newNode)
    return tree
  }
  return request('/api/jcMl/getCatalogTree', {mllx: 1}, 'get').then(resp => {
    const tree = []
    if (typeof resp === 'object' && resp.root) {
      addTree(resp.root, tree)
    }
    return tree
  }, () => {
    return []
  })
}

export function fetchDatasetList () {
  return request('/api/jcSjj/findAll', {}, 'get').then(resp => {
    const items = []
    if (Array.isArray(resp)) {
      resp.forEach(item => {
        items.push(sourceToReportDataset(item))
      })
    }
    return items
  })
}

export function fetchDatasetListByReportId (reportId) {
  return request('/api/jcBb/getRelatedBbsjj', {id: reportId}, 'get').then(resp => {
    const items = []
    if (Array.isArray(resp)) {
      resp.forEach(item => {
        items.push(sourceToReportDataset(item))
      })
    }
    return items
  })
}

export function fetchDatasetListByIds (datasetIds) {
  return request('/api/jcSjjsx/findBySjjid', datasetIds).then(resp => {
    const datasetIds = []
    const datasetEntries = {}

    if (Array.isArray(resp)) {
      resp.forEach(row => {
        datasetIds.push(row['sjjid'])
        datasetEntries[row['sjjid']] = sourceToDatasetEntry(row)
      })
    }
    return {datasetIds, datasetEntries}
  })
}

export function createReport ({datasetList, parentId}) {
  const jcsjjs = []
  datasetList.forEach(dataset => {
    jcsjjs.push({
      'sjjid': dataset.id,
      'sjjms': dataset.name
    })
  })
  const data = {
    bb: {
      bbmc: '未命名',
      mlid: parentId === 'root' ? null : parentId
    },
    gzbs: [{
      'gzb': {
        'gzbms': '工作表1'
      }
    }],
    jcsjjs
  }
  return request('/api/jcBb/addReport', data).then(resp => {
    if (resp && resp.bb && resp.bb.bbid) {
      return resp.bb.bbid
    } else {
      console.error(resp)
      return Promise.reject('创建报表失败')
    }
  })
}

export function copyReport (id) {
  return request('/api/jcBb/copyReport', {sourceId: id}, 'get').then(resp => {
    if (resp.status && (resp.objs && resp.objs.length)) {
      return sourceToReportItem(resp.objs[0])
    } else {
      return Promise.reject(resp.msg ? resp.msg : '创建副本失败')
    }
  })
}

export function publishReport (id) {
  return request('/api/jcBb/copyTemplateReport', {sourceId: id}, 'get').then(resp => {
    if (resp.status && (resp.objs && resp.objs.length)) {
      return sourceToReportItem(resp.objs[0])
    } else {
      return Promise.reject(resp.msg ? resp.msg : '发布报表失败')
    }
  })
}
