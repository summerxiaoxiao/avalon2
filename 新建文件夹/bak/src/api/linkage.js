import _ from 'underscore'
import { request } from './net'
import { VISUAL_TYPE_LIST, VISUAL_TYPES } from './constant'
// import { VISUAL_TYPE_LIST } from './constant'

export function saveNodeName (node, name) {
  return request('/api/pzTbld/updateTbldjd', {
    'jdid': node.id,
    'jdmc': name,
    'ctzd': node.fieldIds.join(';'),
    'ctfs': node.mode,
    'ctlx': node.ctlx,
    'gjdtbid': node.rootId,
    'ytbid': node.parentChartId,
    'fjdid': node.parentId,
    'mbtbid': node.chartId,
    'ldlx': node.ldlx
  })
}

export function deleteNode (id) {
  return request('/api/pzTbld/deleteTbldjd', {'jdId': id}, 'get')
}

export function addNode (root, parent, charts, mode) {
  const data = []
  for (const chart of charts) {
    data.push({
      'ctfs': mode,
      'ctlx': 0,
      'gjdtbid': root.chartId,
      'ytbid': parent.chartId,
      'fjdid': parent.id,
      'mbtbid': chart.id,
      'ldlx': root.ldlx
    })
  }
  return request('/api/pzTbld/saveTbldjd', data)
}

export function fetchSectionItems (id, onlySelfSection = false) {
  return request('/api/jcBb/findBbDtoByTbid', {tbid: id}, 'get').then(resp => {
    let items = []
    if (resp) {
      let selfSectionId
      for (const row of resp.gzbs) {
        const charts = []
        items.push({
          id: row.gzb.gzbid,
          name: row.gzb.gzbmc,
          items: charts
        })
        if (row.tbs) {
          for (const tb of row.tbs) {
            if (onlySelfSection && tb.tb.tbid === id) {
              selfSectionId = row.gzb.gzbid
            }
            const tbType = parseInt(tb.tb.tblx)
            if ([VISUAL_TYPES.TABLE, VISUAL_TYPES.MATRIX].indexOf(tbType) === -1) {
              continue
            }
            charts.push({
              id: tb.tb.tbid,
              name: tb.tb.tbmc || getVisualChartTitle(tb.tb.tblx)
            })
          }
        }
      }
      if (onlySelfSection) {
        if (!selfSectionId) {
          items = []
        } else {
          items = _.filter(items, item => {
            return item.id === selfSectionId
          })
        }
      }
    }
    return items
  })
}

function getVisualChartTitle (type) {
  const typeTitle = (() => {
    for (const row of VISUAL_TYPE_LIST) {
      if (String(row.value) === String(type)) {
        return row.title
      }
    }
  })()
  return typeTitle
}

export function fetchTree (rootChartId, type) {
  return request('/api/pzTbld/findLdjdTree', {tbId: rootChartId, ldlx: type}, 'get').then((resp) => {
    const nodes = []
    for (const row of resp) {
      const {pzTbldjd} = row
      nodes.push({
        id: pzTbldjd.jdid,
        fieldIds: pzTbldjd.ctzd ? pzTbldjd.ctzd.split(';') : [],
        rootId: pzTbldjd.gjdtbid,
        parentId: pzTbldjd.fjdid ? pzTbldjd.fjdid : 0,
        parentChartId: pzTbldjd.ytbid,
        name: pzTbldjd.jdmc || row.mbtbmc,
        chartName: row.mbtbmc,
        sectionName: row.gzbmc,
        chartId: pzTbldjd.mbtbid,
        mode: pzTbldjd.ctfs,
        ctlx: pzTbldjd.ctlx,
        ldlx: pzTbldjd.ldlx === null ? '1' : pzTbldjd.ldlx
      })
    }
    return nodes
  })
}

export function saveMode (node, mode) {
  return request('/api/pzTbld/updateTbldjd', {
    'jdid': node.id,
    'jdmc': node.name,
    'ctzd': node.fieldIds.join(';'),
    'ctfs': mode,
    'ctlx': node.ctlx,
    'gjdtbid': node.rootId,
    'ytbid': node.parentChartId,
    'fjdid': node.parentId,
    'mbtbid': node.chartId,
    'ldlx': node.ldlx
  })
}

export function fetchDataset (chartId) {
  return request('/api/jcSjjsx/findByTbid', {tbid: chartId}, 'get').then((resp) => {
    let dataset = null
    if (resp) {
      dataset = {
        items: []
      }
      dataset.id = resp.sjjid
      dataset.name = resp.sjjms
      if (resp.jcSjjSxs) {
        for (const row of resp.jcSjjSxs) {
          if (row.sxzlx === null) {
            dataset.items.push({
              id: row.sxmc,
              name: row.sxms
            })
          }
        }
      }
    }
    return dataset
  })
}

export function saveFieldRelation ({
                                     linkageId,
                                     id,
                                     sourceDatasetId,
                                     sourceFieldId,
                                     targetDatasetId,
                                     targetFieldId
                                   }) {
  const data = {
    'jdid': linkageId,
    'mbsjjid': targetDatasetId,
    'mbzd': targetFieldId,
    'tjid': id,
    'ysjjid': sourceDatasetId,
    'yzd': sourceFieldId
  }
  return request(id ? '/api/pzTbld/updateTbldtj' : '/api/pzTbld/saveTbldtj', data)
}

export function fetchNodeRelation (id) {
  return request('/api/pzTbld/getTbctByJdId', {jdId: id}, 'get').then(resp => {
    const fields = []
    const fieldRelations = []
    if (resp.cttjs) {
      for (const row of resp.cttjs) {
        fieldRelations.push({
          id: row.tjid,
          targetFieldId: row.mbzd,
          targetFieldName: row.mbzdmc,
          sourceFieldId: row.yzd,
          sourceFieldName: row.yzdmc,
          targetDatasetId: row.mbsjjid,
          targetDatasetName: row.mbsjjmc,
          sourceDatasetId: row.ysjjid,
          sourceDatasetName: row.ysjjmc
        })
      }
    }
    if (resp.ctzds) {
      for (const row of resp.ctzds) {
        fields.push({
          id: row.zdm,
          name: row.zdmc,
          datasetId: row.sjjid,
          datasetName: row.sjjmc
        })
      }
    }
    return {fields, fieldRelations}
  })
}

export function deleteFieldRelation (relationId) {
  return request('/api/pzTbld/deleteTbldtj', {tjid: relationId}, 'get')
}

export function saveFields (node, fieldIds) {
  return request('/api/pzTbld/updateTbldjd', {
    'jdid': node.id,
    'jdmc': node.name,
    'ctzd': fieldIds.join(';'),
    'ctfs': node.mode,
    'ctlx': node.ctlx,
    'gjdtbid': node.rootId,
    'ytbid': node.parentChartId,
    'fjdid': node.parentId,
    'mbtbid': node.chartId,
    'ldlx': node.ldlx
  })
}
