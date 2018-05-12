import _ from 'underscore'
import {request} from './net'
import { sourceToDatasetEntry, sourceToDatasetReport, sourceToDatasetItem } from './data'

export function fetchList ({parentId, keyword, sortType}) {
  const data = {
    mllx: 2,
    sortType
  }

  if (!_.isUndefined(keyword) && keyword !== '') {
    data['keyWord'] = keyword
  } else {
    data['sjmlbm'] = parentId || null
  }

  return request('/api/jcSjj/findByParam', data).then(resp => {
    const items = []
    if (Array.isArray(resp)) {
      resp.forEach(item => {
        items.push(sourceToDatasetItem(item))
      })
    }
    return items
  })
}

export function renameItem ({id, type, name}) {
  const data = {
    catalogId: id,
    name,
    type,
    mllx: 2
  }

  return request('/api/jcSjj/updateCatalogName', data).then(resp => {
    if (resp) {
      if (resp.status && (resp.objs && resp.objs.length)) {
        return sourceToDatasetItem(resp.objs[0])
      } else {
        return Promise.reject(resp.msg ? resp.msg : '重命名失败')
      }
    } else {
      return Promise.reject()
    }
  })
}

export function deleteItem ({id, type}) {
  const data = {
    catalogId: id,
    type,
    mllx: 2
  }

  return request('/api/jcSjj/delCatalog', data).then(resp => {
    if (resp.status) {
      return true
    } else {
      return Promise.reject(resp.msg)
    }
  })
}

export function moveItem ({id, type, parentId}) {
  const data = {
    catalogId: id,
    parentId: parentId === 'root' ? null : parentId,
    type,
    mllx: 2
  }

  return request('/api/jcSjj/updateCatalogSjml', data).then(resp => {
    if (resp) {
      if (resp.status && (resp.objs && resp.objs.length)) {
        return sourceToDatasetItem(resp.objs[0])
      } else {
        return Promise.reject(resp.msg ? resp.msg : '移动失败')
      }
    } else {
      return Promise.reject()
    }
  })
}

export function createDirectory ({name, parentId}) {
  if (parentId === 'root') {
    parentId = null
  }
  const data = {
    type: '0',
    parentId,
    name,
    mllx: 2
  }
  return request('/api/jcSjj/addCatalog', data).then(resp => {
    if (resp) {
      if (resp.status && (resp.objs && resp.objs.length)) {
        return sourceToDatasetItem(resp.objs[0])
      } else {
        return Promise.reject(resp.msg ? resp.msg : '创建目录失败')
      }
    } else {
      return Promise.reject()
    }
  })
}

export function fetchDirectoryTree () {
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
  return request('/api/jcMl/getCatalogTree', {mllx: 2}, 'get').then(resp => {
    const tree = []
    if (typeof resp === 'object' && resp.root) {
      addTree(resp.root, tree)
    }
    return tree
  }, () => {
    return []
  })
}

export function fetchDirectoryParents (id) {
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
  return request('/api/jcMl/getCatalogPath', {catalogId: id, mllx: 2}, 'get').then(resp => {
    const parents = []
    if (typeof resp === 'object' && resp.catalogId) {
      addParents(resp, parents)
    }
    return parents
  })
}

export function fetchReportListByDatasetId (datasetId) {
  return request('/api/jcSjj/getRelatedBb', {sjjid: datasetId}, 'get').then(resp => {
    const items = []
    if (Array.isArray(resp)) {
      resp.forEach(item => {
        items.push(sourceToDatasetReport(item))
      })
    }
    return items
  })
}

export function fetchPropertiesById (datasetId) {
  return request('/api/jcSjjsx/findBySjjid', [datasetId]).then(resp => {
    let datasetEntry
    if (Array.isArray(resp)) {
      for (let i = 0; i < resp.length; i++) {
        if (resp[i]['sjjid'] === datasetId) {
          datasetEntry = sourceToDatasetEntry(resp[i])
          break
        }
      }
    }

    if (datasetEntry) {
      return datasetEntry.properties
    } else {
      return Promise.reject()
    }
  })
}
