import _ from 'underscore'

import {
  FILTER_TYPE_ADVANCED, FILTER_TYPE_BASE, FORMAT_FIELD_TYPES, FORMAT_GENERAL_DEFAULT_VALUES, FORMAT_TYPES, OPERATOR,
  OPERATOR_AND,
  PROPERTY_KIND_DATASET,
  PROPERTY_KIND_FIELD,
  PROPERTY_KIND_FILTER
} from './constant'
import { filterRestatement } from './common'

let id = 1

export function generateId () {
  return '$new_' + (id++)
}

export function isGenerateId (id) {
  return id.indexOf('$new_') === 0
}

export function sourceToDatasetEntry (source) {
  const target = {
    id: source.sjjid,
    name: source.sjjmc,
    desc: source.sjjms,
    properties: []
  }
  if (Array.isArray(source['jcSjjSxs'])) {
    source['jcSjjSxs'].forEach(source => {
      target.properties.push(sourceToDatasetProperty(source))
    })
  }
  return target
}
export function datasetEntryToSource (datasetEntry) {
  return {
    'sjjid': datasetEntry['id'],
    'sjjmc': datasetEntry['desc'],
    'sjjms': datasetEntry['desc']
  }
}

export function sourceToDatasetProperty (source = {}) {
  return {
    _kind: PROPERTY_KIND_DATASET,
    id: source.sxmc,
    datasetId: source.sjjid,
    parentId: source.sjsxmc,
    parentDesc: source.sjsxms,
    desc: source.sxms,
    type: source.sxlx,
    groupType: source.sxzlx
  }
}

export function datasetPropertyToFieldProperty (property = {}, role, callback) {
  const target = {
    _kind: PROPERTY_KIND_FIELD,
    id: property.id,
    datasetId: property.datasetId,
    parentId: property.parentId,
    parentDesc: property.parentDesc,
    desc: property.desc,
    type: property.type,
    index: property.index,
    groupType: property.groupType,
    role,
    action: {
      jh: 0,
      pxlx: 0,
      xszt: 1,
      rqlx: 5
    }
  }
  if (_.isFunction(callback)) {
    callback(target)
  }
  return target
}

export function propertyToFilterProperty (property = {}) {
  return {
    _kind: PROPERTY_KIND_FILTER,
    id: property.id,
    desc: property.desc,
    alias: property.alias,
    type: property.type,
    restatement: '',
    filterType: FILTER_TYPE_BASE,
    condition: {}
  }
}

export function sourceToFieldProperty (source = {}, extend = {}) {
  const target = {
    _kind: PROPERTY_KIND_FIELD,
    id: source.sxmc,
    datasetId: extend.datasetId ? extend.datasetId : null,
    parentId: source.sjsxmc,
    parentDesc: source.sjsxms,
    desc: source.sxms,
    alias: source.alias,
    type: source.sxlx,
    groupType: source.sxzlx,
    role: source.tbsxlxbm,
    action: {
      jh: parseInt(source.jh, 10) || 0,
      pxlx: parseInt(source.pxlx, 10) || 0,
      xszt: parseInt(source.xszt, 10),
      rqlx: parseInt(source.rqlx, 10) || 5
    }
  }
  if (source.pxsxz) {
    try {
      target.action['pxsxz'] = JSON.parse(source.pxsxz)
    } catch (e) {
    }
  }
  return target
}

export function fieldPropertyToSource (property) {
  const source = {
    alias: property.alias,
    sxlx: property.type,
    sxmc: property.id,
    sxms: property.desc,
    sxzlx: property.groupType,
    sjsxmc: property.parentId,
    sjsxms: property.parentDesc,
    tbsxlxbm: property.role,
    xh: property.index
  }
  for (const name in property.action || {}) {
    if (!_.isUndefined(property.action[name])) {
      if (name === 'pxsxz') {
        source[name] = JSON.stringify(property.action[name])
      } else {
        source[name] = property.action[name]
      }
    }
  }
  return source
}

export function sourceToFilterProperty (type, source = {}) {
  const target = {
    _kind: PROPERTY_KIND_FILTER,
    id: source.sxmc,
    desc: source.sxms,
    alias: source.alias,
    type: source.sxlx,
    restatement: source.glms
  }
  if (type === FILTER_TYPE_ADVANCED) {
    target.filterType = FILTER_TYPE_ADVANCED
    target.condition = {
      comparisonOperator1: source.tj1,
      comparisonOperator2: source.tj2,
      comparisonValue1: source.z1,
      comparisonValue2: source.z2,
      logicalOperator: source.qyh
    }
  } else if (type === FILTER_TYPE_BASE) {
    target.filterType = FILTER_TYPE_BASE
    target.condition = {
      inValues: source.containValues || [],
      notInValues: source.notContainValues || []
    }
  }

  return target
}

export function filterPropertyToSource (property) {
  let source = {}
  if (property.filterType === FILTER_TYPE_ADVANCED) {
    const {
      comparisonOperator1 = '',
      comparisonOperator2 = '',
      comparisonValue1 = '',
      comparisonValue2 = '',
      logicalOperator = ''
    } = (property.condition || {})
    source = {
      'qyh': logicalOperator,
      'sxlx': property.type,
      'sxmc': property.id,
      'glms': property.restatement,
      'sxms': property.desc,
      'alias': property.alias,
      'tj1': comparisonOperator1,
      'tj2': comparisonOperator2,
      'z1': comparisonValue1,
      'z2': comparisonValue2,
      'xh': property.index
    }
  } else if (property.filterType === 'base') {
    const {
      inValues = [],
      notInValues = []
    } = (property.condition || {})
    source = {
      'sxmc': property.id,
      'sxms': property.desc,
      'alias': property.alias,
      'glms': property.restatement
    }
    if (inValues && inValues.length) {
      source['containValues'] = inValues
    } else if (notInValues && notInValues.length) {
      source['notContainValues'] = notInValues
    } else {
      source['notContainValues'] = []
    }
  }
  return source
}

export function sourceToConfigBucket (source = {}) {
  return {
    id: source.tbsxlxbm,
    role: source.tbsxlxbm,
    name: source.tbsxlxmc
  }
}

export function sourceToConfig (source = {}) {
  return {
    id: source.tblxbm,
    name: source.tblxmc,
    type: source.tblxbm
  }
}

export function sourceToConfigFormatCard (source = {}) {
  return {
    name: source.gslxbm,
    displayName: source.gslxmc,
    slices: []
  }
}

export function sourceToConfigFormatCardSlice (source = {}) {
  return {
    name: source.gsbm,
    displayName: source.gsmc,
    type: source.zlx,
    parentName: source.sjgsbm,
    max: source.zdz,
    min: source.zxz,
    extra: source.bsz,
    defaultValue: source.mrz ? (source.zlx === FORMAT_FIELD_TYPES.COLOR ? '#' + source.mrz : source.mrz) : ''
  }
}

export function sourceToConfigFormatEnum (source = {}) {
  return {
    value: source.mjzbm,
    displayName: source.mjzmc
  }
}

export function sourceToVisualContainer (source = {}, extra = {}) {
  const {sectionId, index} = extra
  const {tb = {}, pzTbsxs = [], pzTbgszs = [], pzGjgltjs = [], pzGlsxs = []} = source
  let filterProperties = []
  const sortProperties = {}
  const fieldProperties = convertDataToFieldProperties(pzTbsxs, tb)
  const format = {}

  ;(pzGjgltjs || []).forEach(source => {
    filterProperties.push(sourceToFilterProperty(FILTER_TYPE_ADVANCED, source))
  })

  ;(pzGlsxs || []).forEach(source => {
    filterProperties.push(sourceToFilterProperty(FILTER_TYPE_BASE, source))
  })

  filterProperties = filterProperties.sort((a, b) => a.index - b.index)

  let width = FORMAT_GENERAL_DEFAULT_VALUES.WIDTH
  let height = FORMAT_GENERAL_DEFAULT_VALUES.HEIGHT
  let x = FORMAT_GENERAL_DEFAULT_VALUES.X
  let y = FORMAT_GENERAL_DEFAULT_VALUES.Y

  ;(pzTbgszs || []).forEach(row => {
    let value
    try {
      value = JSON.parse(row.gsz)
    } catch (e) {
      value = row.gsz
    }

    if (!format[row.gslxbm]) {
      format[row.gslxbm] = {}
    }
    if (row.gsbm === FORMAT_TYPES.GENERAL_WIDTH) {
      width = Math.round(value)
    }
    if (row.gsbm === FORMAT_TYPES.GENERAL_HEIGHT) {
      height = Math.round(value)
    }
    if (row.gsbm === FORMAT_TYPES.GENERAL_X) {
      x = Math.round(value)
    }
    if (row.gsbm === FORMAT_TYPES.GENERAL_Y) {
      y = Math.round(value)
    }
    format[row.gslxbm][row.gsbm] = value
  })

  const target = {
    id: tb.tbid,
    datasetId: tb.sjjid,
    sectionId,
    visibility: tb.ycbs === 0,
    type: parseInt(tb.tblx, 10),
    config: {fieldProperties, filterProperties, sortProperties},
    width,
    height,
    x,
    y,
    z: index,
    format
  }

  if (tb.oldId) {
    target.oldId = tb.oldId
  }

  return target
}

export function createVisualContainer ({id, type, datasetId, sectionId, z, format}) {
  const target = {
    id,
    appending: true,
    datasetId,
    sectionId,
    type: type,
    config: {fieldProperties: {}, filterProperties: [], sortProperties: []},
    width: FORMAT_GENERAL_DEFAULT_VALUES.WIDTH,
    height: FORMAT_GENERAL_DEFAULT_VALUES.HEIGHT + 27,
    x: FORMAT_GENERAL_DEFAULT_VALUES.X,
    y: FORMAT_GENERAL_DEFAULT_VALUES.Y,
    z: z,
    visibility: true,
    format: {
      [FORMAT_TYPES.GENERAL]: {
        [FORMAT_TYPES.GENERAL_X]: FORMAT_GENERAL_DEFAULT_VALUES.X,
        [FORMAT_TYPES.GENERAL_Y]: FORMAT_GENERAL_DEFAULT_VALUES.Y,
        [FORMAT_TYPES.GENERAL_WIDTH]: FORMAT_GENERAL_DEFAULT_VALUES.WIDTH,
        [FORMAT_TYPES.GENERAL_HEIGHT]: FORMAT_GENERAL_DEFAULT_VALUES.HEIGHT + 27
      }
    }
  }

  if (_.isObject(format)) {
    target.format = Object.assign(target.format, format)
  }

  return target
}

export function createSection ({id, name}) {
  return {
    id,
    name,
    appending: true,
    viewMode: 0,
    width: 1600,
    height: 900,
    format: {
      [FORMAT_TYPES.SECTION_VIEW]: {
        [FORMAT_TYPES.SECTION_VIEW_MODE]: 0
      },
      [FORMAT_TYPES.BACKGROUND]: {
        [FORMAT_TYPES.BACKGROUND_TRANSPARENCY]: 0
      },
      [FORMAT_TYPES.SECTION_SIZE]: {
        [FORMAT_TYPES.SECTION_SIZE_TYPE]: '1',
        [FORMAT_TYPES.SECTION_WIDTH]: 1600,
        [FORMAT_TYPES.SECTION_HEIGHT]: 900
      }
    },
    visualContainerIds: []
  }
}

export function convertDataToFieldProperties (data, tb) {
  const fieldProperties = {}

  ;(data || []).map((source) => {
    return sourceToFieldProperty(source, {datasetId: tb.sjjid})
  }).forEach(property => {
    if (!fieldProperties[property.role]) {
      fieldProperties[property.role] = []
    }
    property.index = fieldProperties[property.role].length
    fieldProperties[property.role].push(property)
  })

  Object.keys(fieldProperties).forEach(role => {
    const properties = fieldProperties[role]
    const children = {}
    const list = []

    properties.forEach(property => {
      if (!property.parentId || _.findIndex(properties, child => child.id === property.parentId) === -1) {
        list.push(property)
        return
      }

      if (!children[property.parentId]) {
        children[property.parentId] = []
      }
      property.index = children[property.parentId].length
      children[property.parentId].push(property)
    })

    fieldProperties[role] = list.map((property, index) => {
      property.index = index
      if (children[property.id]) {
        property.children = children[property.id]
      }
      return property
    })
  })
  return fieldProperties
}

export function convertPropertiesToData ({id = null, fieldProperties, sortProperties, filterProperties}, data) {
  data = data || {}

  const pzTbsxs = []
  Object.keys(fieldProperties).forEach(role => {
    const properties = fieldProperties[role]
    properties.forEach(property => {
      pzTbsxs.push(fieldPropertyToSource(property))
      if (property.children) {
        property.children.forEach(property => {
          pzTbsxs.push(fieldPropertyToSource(property))
        })
      }
    })
  })

  data['pzTbsxs'] = pzTbsxs

  if (sortProperties && sortProperties.length) {
    const pzPxsxs = []
    sortProperties.forEach((property) => {
      pzPxsxs.push({
        pxlx: property.sort || 1,
        sxmc: property.sxmc
      })
    })
    data['pzPxsxs'] = pzPxsxs
  }

  if (filterProperties && filterProperties.length) {
    const pzGjgltjs = []
    const pzGlsxs = []
    filterProperties.forEach(property => {
      if (property.filterType === FILTER_TYPE_ADVANCED) {
        pzGjgltjs.push(filterPropertyToSource(property))
      } else if (property.filterType === FILTER_TYPE_BASE) {
        pzGlsxs.push(filterPropertyToSource(property))
      }
    })
    data['pzGjgltjs'] = pzGjgltjs
    data['pzGlsxs'] = pzGlsxs
  }
  return data
}

export function applySlicers (slicers, data) {
  if (slicers) {
    data['pzGjgltjs'] = data['pzGjgltjs'] || []
    data['pzGlsxs'] = data['pzGlsxs'] || []
    let index = 0
    slicers.forEach(slicer => {
      const {property, condition} = slicer
      if (!condition || !property) {
        return
      }
      let filterType
      const filterProperty = Object.assign({}, property)
      if ((condition.inValues && condition.inValues.length) || (condition.notInValues && condition.notInValues.length)) {
        filterProperty.condition = {
          inValues: condition.inValues || [],
          notInValues: condition.notInValues || []
        }
        filterType = FILTER_TYPE_BASE
      } else if (!_.isUndefined(condition.egt) && !_.isUndefined(condition.elt)) {
        filterProperty.condition = {
          comparisonOperator1: OPERATOR.EGT,
          comparisonOperator2: OPERATOR.ELT,
          comparisonValue1: condition.egt,
          comparisonValue2: condition.elt,
          logicalOperator: OPERATOR_AND
        }
        filterType = FILTER_TYPE_ADVANCED
      }
      if (!_.isUndefined(filterType)) {
        filterProperty.xh = index++
        filterProperty.filterType = filterType
        filterProperty.restatement = filterRestatement(filterProperty, filterType)
        if (filterType === FILTER_TYPE_ADVANCED) {
          data['pzGjgltjs'].push(filterPropertyToSource(filterProperty))
        } else if (filterType === FILTER_TYPE_BASE) {
          data['pzGlsxs'].push(filterPropertyToSource(filterProperty))
        }
      }
    })
  }
  return data
}

export function convertFormatToData ({format, id, visualType}, data) {
  data = data || {}
  const pzTbgszs = []
  Object.keys(format).forEach(cardName => {
    const slices = format[cardName]
    Object.keys(slices).forEach(sliceName => {
      pzTbgszs.push({
        'gsbm': sliceName,
        'gslxbm': cardName,
        'gsz': JSON.stringify(slices[sliceName]),
        'tbid': id,
        'tblxbm': visualType
      })
    })
  })
  data['pzTbgszs'] = pzTbgszs
  return data
}

export function sourceToReport (source) {
  const report = source.bb || {}
  report.id = report.bbid
  report.directoryId = report.mlid
  report.title = report.bbmc
  report.format = {}

  const sectionIds = []
  const sections = {}
  const visualContainers = {}

  const datasetIds = []
  const datasetEntries = {}

  if (Array.isArray(source['jcsjjs'])) {
    source['jcsjjs'].forEach(source => {
      datasetIds.push(source['sjjid'])
      datasetEntries[source['sjjid']] = sourceToDatasetEntry(source)
    })
  }

  if (Array.isArray(source['pzBbgszs'])) {
    source['pzBbgszs'].forEach(source => {
      if (!report.format[source.gslxbm]) {
        report.format[source.gslxbm] = {}
      }
      let value
      try {
        value = JSON.parse(source.gsz)
      } catch (e) {
        value = source.gsz
      }
      report.format[source.gslxbm][source.gsbm] = value
    })
  }

  ;(source.gzbs || []).forEach(row => {
    const {gzb = {}, tbs = [], pzGzbgszs = []} = row
    const section = {
      id: gzb.gzbid,
      name: gzb.gzbmc
    }

    const format = {}
    let width = 1600
    let height = 900
    let viewMode = 0

    ;(pzGzbgszs || []).forEach(row => {
      if (!format[row.gslxbm]) {
        format[row.gslxbm] = {}
      }
      let value
      try {
        value = JSON.parse(row.gsz)
      } catch (e) {
        value = row.gsz
      }

      format[row.gslxbm][row.gsbm] = value

      if (row.gsbm === FORMAT_TYPES.GENERAL_WIDTH) {
        width = Math.round(value)
      }
      if (row.gsbm === FORMAT_TYPES.GENERAL_HEIGHT) {
        height = Math.round(value)
      }
      if (row.gsbm === FORMAT_TYPES.SECTION_VIEW_MODE) {
        viewMode = Math.round(value)
      }
    })
    section.width = width
    section.height = height
    section.viewMode = Math.round(viewMode)
    section.format = format

    const visualContainerIds = []

    tbs.sort((a, b) => a.xh - b.xh).forEach((row, index) => {
      const visualContainer = sourceToVisualContainer(row, {
        sectionId: gzb.gzbid,
        index
      })
      visualContainers[visualContainer.id] = visualContainer
      visualContainerIds.push(visualContainer.id)
    })

    sectionIds.push(gzb.gzbid)
    section['visualContainerIds'] = visualContainerIds
    sections[section.id] = section
  })

  return {report, sections, sectionIds, visualContainers, datasetIds, datasetEntries}
}

export function reportToSource ({report, sectionIds, sections, visualContainers, datasetEntries = {}}) {
  const data = {
    'bb': {
      'bbid': report.id,
      'mlid': report.directoryId,
      'bbmc': report.title
    },
    'gzbs': []
  }

  if (report.format) {
    const pzBbgszs = []
    Object.keys(report.format).forEach(cardName => {
      const slices = report.format[cardName]
      Object.keys(slices).forEach(sliceName => {
        pzBbgszs.push({
          'gsbm': sliceName,
          'gslxbm': cardName,
          'gsz': JSON.stringify(slices[sliceName]),
          'tbid': report.id
        })
      })
    })
    data['pzBbgszs'] = pzBbgszs
  }

  sectionIds.forEach((sectionId, index) => {
    const section = sections[sectionId]
    if (!section) {
      return
    }

    let isNewSection = false
    if (typeof section.id === 'string' && isGenerateId(section.id)) {
      isNewSection = true
    }

    const gzb = {
      'gzb': {
        'bbid': report.id,
        'gzbmc': section.name,
        'gzbid': isNewSection ? null : section.id,
        'xh': index
      }
    }

    const format = section.format || {}
    const pzGzbgszs = []

    Object.keys(format).forEach(cardName => {
      const slices = format[cardName]
      Object.keys(slices).forEach(sliceName => {
        pzGzbgszs.push({
          'gsbm': sliceName,
          'gslxbm': cardName,
          'gsz': JSON.stringify(slices[sliceName]),
          'tbid': isNewSection ? null : section.id
        })
      })
    })

    gzb['pzGzbgszs'] = pzGzbgszs

    const tbs = []
    ;(section.visualContainerIds || []).forEach(visualContainerId => {
      const visualContainer = visualContainers[visualContainerId]
      if (!visualContainer) {
        return
      }

      let isNewVisualContainer = false
      if (typeof visualContainerId === 'string' && isGenerateId(visualContainerId)) {
        isNewVisualContainer = true
      }

      const id = isNewVisualContainer ? null : visualContainerId
      const {fieldProperties = {}, sortProperties = [], filterProperties = []} = visualContainer.config || {}
      let tb = {
        'tb': {
          'tbid': id,
          'oldId': visualContainer.oldId ? visualContainer.oldId : visualContainerId,
          'tblx': visualContainer.type,
          'sjjid': visualContainer.datasetId,
          'xh': visualContainer.z,
          'ycbs': visualContainer.visibility === true ? 0 : 1
        }
      }
      tb = convertPropertiesToData({id, fieldProperties, sortProperties, filterProperties}, tb)

      const format = visualContainer.format || {}
      tb = convertFormatToData({id, format, visualType: visualContainer.type}, tb)
      tbs.push(tb)
    })

    gzb['tbs'] = tbs
    data['gzbs'].push(gzb)
  })

  if (_.isObject(datasetEntries)) {
    const jcsjjs = []
    Object.keys(datasetEntries).forEach(key => {
      jcsjjs.push(datasetEntryToSource(datasetEntries[key]))
    })
    data['jcsjjs'] = jcsjjs
  }
  return data
}

export function sourceToReportItem (source) {
  return {
    id: source.catalogId,
    name: source.name,
    type: source.type,
    updatedAt: source.lastUpdateDate,
    owner: source.owner,
    parentId: source.parentId,
    worksheetCount: source.workSheetCount,
    visualCount: source.reportCount
  }
}

export function sourceToDatasetItem (source) {
  return {
    id: source.catalogId,
    name: source.name,
    type: source.type,
    updatedAt: source.lastUpdateDate,
    owner: source.owner,
    parentId: source.parentId,
    fieldCount: source.sxCount,
    visualCount: source.tbCount
  }
}

export function sourceToReportDataset (source) {
  return {
    id: source.sjjid,
    name: source.sjjms,
    _source: source
  }
}

export function sourceToDatasetReport (source) {
  return {
    id: source.bbid,
    name: source.bbmc,
    owner: source.syz,
    _source: source
  }
}

export function createEmptyDirectory ({name, parentId}) {
  return {
    id: generateId(),
    appending: true,
    parentId,
    type: '0',
    name
  }
}

export function createNotification ({type, message, title, delay}) {
  return {
    id: generateId(),
    title,
    type,
    delay,
    message
  }
}

export function convertSlicerResponse (resp, property) {
  const result = []
  if (resp && property) {
    const propertyId = property.id
    const {datas} = resp
    if (Array.isArray(datas)) {
      datas.forEach(row => {
        if (!_.isUndefined(row[propertyId])) {
          result.push(row[propertyId])
        }
      })
    }
  }
  return result
}
