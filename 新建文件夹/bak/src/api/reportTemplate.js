import {request} from './net'
import _ from 'underscore'
import { sourceToReportItem } from './data'

export function fetchReportList ({parentId, keyword, sortType}) {
  const data = {
    mllx: 3,
    sortType
  }

  if (!_.isUndefined(keyword) && keyword !== '') {
    data['keyWord'] = keyword
  } else {
    data['sjmlbm'] = parentId || null
  }

  return request('/api/jcBb/findTemplateReport', data).then(resp => {
    const items = []
    if (Array.isArray(resp)) {
      resp.forEach(item => {
        items.push(sourceToReportItem(item))
      })
    }
    return items
  })
}

export function deleteReportItem ({id}) {
  return request('/api/jcBb/delBbByid', {id}, 'get').then(resp => {
    if (resp.status) {
      return true
    } else {
      return Promise.reject(resp.msg)
    }
  })
}

export function installReport ({id, parentId}) {
  const data = {
    catalogId: id,
    parentId: parentId === 'root' ? null : parentId
  }
  return request('/api/jcBb/setupReport', data).then(resp => {
    if (resp.status) {
      return true
    } else {
      return Promise.reject(resp.msg)
    }
  })
}
export function renameReportItem ({id, name}) {
  const data = {
    catalogId: id,
    name
  }

  return request('/api/jcBb/updateTemplateName', data).then(resp => {
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
