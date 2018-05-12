import $ from 'jquery'
import _ from 'underscore'
import Vue from 'vue'
import * as report from '../../api/report'

import {
  PROPERTY_TYPES, BUCKET_ROLES, PROPERTY_GROUP_TYPES, VISUAL_TYPES, SECTION_SIZE_MAP,
  FORMAT_TYPES, FORMAT_FIELD_TYPES, FILTER_TYPE_ADVANCED, FILTER_TYPE_BASE, QUERY_TYPE, ENABLE_JH, SORT_TYPE
} from '../../api/constant'

import {
  filterRestatement, formatSliceIsValidByPropertyType, getFormatPropertyFieldOptions, getFormatValue,
  isDataVisualType
} from '../../api/common'
import { toBoolean } from '../../common/utils'
import {
  convertSlicerResponse,
  createSection, createVisualContainer, datasetPropertyToFieldProperty, generateId,
  propertyToFilterProperty
} from '../../api/data'
import { getFirstFieldProperty } from '../../common/visual'

/**
 * 更新图表组件查询类型
 *
 * @param visualContainer
 */
function updateVisualContainerQueryType (visualContainer) {
  if (!visualContainer) {
    return
  }

  const fieldProperties = visualContainer.config.fieldProperties
  const processAction = getFieldPropertyProcessAction(visualContainer)

  Object.keys(fieldProperties).forEach(role => {
    const properties = fieldProperties[role]
    properties.forEach(property => {
      processAction(property)
    })
  })
}

/**
 * 排序属性
 *
 * @param properties
 */
function sortProperties (properties) {
  properties.forEach((property, index) => {
    Vue.set(property, 'index', index)
    if (Array.isArray(property.children)) {
      property.children.forEach((property, index) => {
        Vue.set(property, 'index', index)
      })
    }
  })
}

/**
 * 属性是否执行
 *
 * @param properties
 * @param fieldProperty
 * @returns {boolean}
 */
function isPropertyExists (properties, fieldProperty) {
  let property
  for (let i = 0; i < properties.length; i++) {
    property = properties[i]
    if (property.id === fieldProperty.id) {
      return true
    }
    if (fieldProperty.parentId) {
      if (property.id !== fieldProperty.parentId) {
        continue
      }
      if (property.children) {
        if (
          _.findIndex(property.children, child => {
            return child.id === fieldProperty.id
          }) !== -1) {
          return true
        }
      }
    }
  }
  return false
}

/**
 * 规范格式切片值
 *
 * @param slice
 */
function normalizeSliceValue (slice) {
  let value = slice.value
  if (slice.type === FORMAT_FIELD_TYPES.NUMBER || slice.type === FORMAT_FIELD_TYPES.INTEGER) {
    value = Number(value) || 0
  } else if (slice.type === FORMAT_FIELD_TYPES.BOOLEAN) {
    value = toBoolean(value) ? 1 : 0
  }
  return value
}

/**
 * 填充图表格式值
 *
 * @param visualContainer
 * @param formatDefaultValues
 */
function fillVisualContainerFormat (visualContainer, formatDefaultValues) {
  if (!_.isObject(formatDefaultValues)) {
    return
  }

  if (!visualContainer.format) {
    Vue.set(visualContainer, 'format', {})
  }

  const propertyFieldOptionsCache = {}
  Object.keys(formatDefaultValues).forEach(cardName => {
    if (!visualContainer.format[cardName]) {
      Vue.set(visualContainer.format, cardName, {})
    }
    const slices = formatDefaultValues[cardName]
    /*
    let propertyConfigEnable = true
    if (cardName === FORMAT_TYPES.PROPERTY && slices[FORMAT_TYPES.PROPERTY_CONFIG_ENABLE]) {
      propertyConfigEnable = toBoolean(slices[FORMAT_TYPES.PROPERTY_CONFIG_ENABLE].value)
    }
    */

    Object.keys(slices).forEach(name => {
      const slice = slices[name]
      let parentSlice
      let parentIsProperty = false
      let value = normalizeSliceValue(slice)
      let nowValue = visualContainer.format[cardName][slice.name]

      if (slice.parentName && (parentSlice = slices[slice.parentName]) && parentSlice.type === FORMAT_FIELD_TYPES.PROPERTY) {
        parentIsProperty = true
        let propertyFieldOptions
        if (propertyFieldOptionsCache[parentSlice.name]) {
          propertyFieldOptions = propertyFieldOptionsCache[parentSlice.name]
        } else {
          propertyFieldOptions = getFormatPropertyFieldOptions(visualContainer, parentSlice.extra)
          propertyFieldOptionsCache[parentSlice.name] = propertyFieldOptions
        }
        const valueObject = {}
        propertyFieldOptions.forEach(option => {
          if (formatSliceIsValidByPropertyType(slice, option.type)) {
            /*
            if (!propertyConfigEnable && _.isObject(nowValue) && !(option.value in nowValue) && (name !== FORMAT_TYPES.PROPERTY_CONFIG_ENABLE)) {
              return
            }
            */
            valueObject[option.value] = value
          }
        })
        value = valueObject
      }

      if (_.isUndefined(visualContainer.format[cardName][slice.name])) {
        Vue.set(visualContainer.format[cardName], slice.name, value)
      } else if (parentIsProperty) {
        let parentValue = visualContainer.format[cardName][slice.parentName]
        if (!_.isEmpty(parentValue) && !(parentValue in value)) {
          Vue.set(visualContainer.format[cardName], slice.parentName, '')
        }

        if (!_.isObject(nowValue)) {
          Vue.set(visualContainer.format[cardName], slice.name, value)
        } else {
          Object.keys(nowValue).forEach(key => {
            if (!(key in value)) {
              Vue.delete(nowValue, key)
            }
          })
          Object.keys(value).forEach(key => {
            if (!(key in nowValue)) {
              Vue.set(nowValue, key, slice.value)
            }
          })
        }
      }
    })
  })
}

/**
 * 设置格式
 *
 * @param format
 * @param cardName
 * @param slices
 */
function setFormat (format, cardName, slices) {
  if (!_.isObject(format)) {
    return
  }
  if (!format[cardName]) {
    Vue.set(format, cardName, {})
  }
  if (_.isObject(slices)) {
    Object.keys(slices).forEach(sliceName => {
      Vue.set(format[cardName], sliceName, slices[sliceName])
    })
  }
}

/**
 * 获取字段属性处理动作
 *
 * @param visualContainer
 * @returns {processAction}
 */
function getFieldPropertyProcessAction (visualContainer) {
  const visualType = visualContainer.type
  const format = visualContainer.format
  return function processAction (property) {
    const role = property.role

    if (property.children) {
      property.children.map(processAction)
      return property
    }

    if (!property.action) {
      Vue.set(property, 'action', {})
    }
    const queryType = getFormatValue(format, FORMAT_TYPES.EXTEND, FORMAT_TYPES.EXTEND_QUERY_MODE)
    if (visualType === VISUAL_TYPES.TABLE) {
      if (property.type === PROPERTY_TYPES.NUMBER && ENABLE_JH && queryType === QUERY_TYPE.JH) {
        Vue.set(property.action, 'jh', 1) // 求和
      } else {
        Vue.delete(property.action, 'jh')
      }
    }
    if (visualType === VISUAL_TYPES.MATRIX) {
      if (role === BUCKET_ROLES.VALUE && ENABLE_JH && queryType === QUERY_TYPE.JH) {
        if (property.type !== PROPERTY_TYPES.NUMBER) {
          Vue.set(property.action, 'jh', 20) // 计数
        } else {
          Vue.set(property.action, 'jh', 1) // 求和
        }
      } else {
        Vue.delete(property.action, 'jh')
      }
    }
    return property
  }
}

function addFieldProperty ({role, property, index, fieldProperties, datasetProperties, processAction, fieldWellBuckets}, replace = false) {
  if (!fieldProperties[role]) {
    Vue.set(fieldProperties, role, [])
  }
  const properties = fieldProperties[role]

  if (isPropertyExists(properties, property)) {
    return
  }

  let datasetProperty
  // 没有父级
  if (!property.parentId) {
    datasetProperty = _.find(datasetProperties, item => {
      return item.id === property.id
    })

    if (!datasetProperty) {
      return
    }

    if (datasetProperty.groupType === PROPERTY_GROUP_TYPES.GROUP) {
      if (datasetProperty.children) {
        datasetProperty.children.forEach((datasetProperty) => {
          properties.push(datasetPropertyToFieldProperty(datasetProperty, role, processAction))
        })
      }
    } else {
      if (datasetProperty.children) {
        Vue.set(property, 'children', datasetProperty.children.map(datasetProperty => {
          return datasetPropertyToFieldProperty(datasetProperty, role, processAction)
        }))
      }
      if (!_.isUndefined(index)) {
        if (index < 0) {
          properties.unshift(property)
        } else {
          properties.splice(index, replace ? 1 : 0, property)
        }
      } else {
        properties.push(property)
      }
    }
  } else {
    datasetProperty = _.find(datasetProperties, item => {
      return item.id === property.parentId
    })
    if (datasetProperty) {
      if (datasetProperty.groupType === PROPERTY_GROUP_TYPES.GROUP) { // 父级是组
        if (_.isUndefined(index)) {
          properties.push(property)
        } else {
          properties.splice(index, replace ? 1 : 0, property)
        }
      } else { // 父级是层次
        const existsBucket = _.find(fieldWellBuckets, bucket => {
          return isPropertyExists(fieldProperties[bucket.role] || [], datasetProperty)
        })

        // 如果存在其中一个 bucket 且 bucket的role 不等于 添加的 role 同一层次的属性只能存在一个 bucket 上
        if (existsBucket && existsBucket.role !== role) {
          return
        }

        if (existsBucket) {
          const parentProperty = _.find(properties, property => {
            return property.id === datasetProperty.id
          })
          if (parentProperty) {
            parentProperty.children.splice(property.index, 0, property)
          }
        } else {
          const parentProperty = datasetPropertyToFieldProperty(datasetProperty, role)
          parentProperty.children = [property]
          processAction(parentProperty)
          if (_.isUndefined(index)) {
            properties.push(parentProperty)
          } else {
            properties.splice(index, replace ? 1 : 0, parentProperty)
          }
        }
      }
    }
  }

  // 重新排序
  properties.forEach((property, index) => {
    Vue.set(property, 'index', index)
    if (Array.isArray(property.children)) {
      property.children.forEach((property, index) => {
        Vue.set(property, 'index', index)
      })
    }
  })
}

function slicerNotify (slicerVisualContainer, visualContainers) {
  const datasetId = slicerVisualContainer.datasetId
  const sectionId = slicerVisualContainer.sectionId
  Object.keys(visualContainers).forEach(id => {
    const visualContainer = visualContainers[id]
    if (visualContainer.sectionId === sectionId && visualContainer.datasetId === datasetId && slicerVisualContainer.id !== visualContainer.id) {
      Vue.set(visualContainer.config, 'needsUpdate', true)
    }
  })
}

function extractSlicers (visualContainers, currentVisualContainer) {
  const slicers = []
  const {datasetId, sectionId, id: currentVisualContainerId} = currentVisualContainer

  Object.keys(visualContainers).forEach(id => {
    const visualContainer = visualContainers[id]
    if (visualContainer.type === VISUAL_TYPES.SLICER && visualContainer.sectionId === sectionId && visualContainer.datasetId === datasetId && id !== currentVisualContainerId) {
      const firstFieldProperty = getFirstFieldProperty(visualContainer.config.fieldProperties)
      if (firstFieldProperty) {
        slicers.push({
          condition: getFormatValue(visualContainer.format, FORMAT_TYPES.SLICER_VALUE, FORMAT_TYPES.SLICER_VALUE_CONDITION),
          property: firstFieldProperty
        })
      }
    }
  })
  return slicers
}

export default {
  namespaced: true,
  state: {
    isSelectCanvasItems: false,
    isChanged: false,
    notifications: [],
    saving: false,
    spotlight: null,
    formatDefaultValues: {},
    isInit: false,
    report: null,
    visualContainerConfig: {},
    currentDatasetId: null,
    datasetIds: [],
    datasetEntries: {},
    currentVisualContainerId: null,
    currentSectionId: null,
    sectionIds: [],
    visualContainers: {},
    propertyValues: {},
    saveError: {},
    sections: {}
  },

  getters: {
    currentFieldProperties (state, getters) {
      const currentVisualContainer = getters.currentVisualContainer
      if (!currentVisualContainer) {
        return {}
      }
      return currentVisualContainer.config.fieldProperties || {}
    },

    currentFilterProperties (state, getters) {
      const currentVisualContainer = getters.currentVisualContainer
      if (!currentVisualContainer) {
        return []
      }
      return currentVisualContainer.config.filterProperties || []
    },

    currentSortProperties (state, getters) {
      const currentVisualContainer = getters.currentVisualContainer
      if (!currentVisualContainer) {
        return []
      }
      return currentVisualContainer.config.sortProperties || []
    },

    currentFormatDefaultValues (state, getters) {
      const currentVisualContainer = getters.currentVisualContainer
      if (!currentVisualContainer) {
        return {}
      }
      return state.formatDefaultValues[currentVisualContainer.type] || {}
    },

    currentFormatProperties (state, getters) {
      const currentVisualContainer = getters.currentVisualContainer
      if (!currentVisualContainer) {
        return []
      }
      let formats
      if (state.visualContainerConfig[currentVisualContainer.type]) {
        formats = state.visualContainerConfig[currentVisualContainer.type].formats
      }
      return formats || []
    },

    currentSections (state) {
      const sections = []
      state.sectionIds.forEach(id => {
        if (state.sections[id]) {
          sections.push(state.sections[id])
        }
      })
      return sections
    },

    currentSection (state) {
      return state.sections[state.currentSectionId] || null
    },

    currentVisualContainers (state, getters) {
      const currentSection = getters.currentSection
      const containers = []
      if (currentSection) {
        for (const containerId of currentSection.visualContainerIds) {
          if (state.visualContainers[containerId]) {
            containers.push(state.visualContainers[containerId])
          }
        }
      }
      return containers
    },

    currentVisualContainer (state) {
      return state.visualContainers[state.currentVisualContainerId] || null
    },

    datasetList (state) {
      const list = []
      state.datasetIds.forEach(id => {
        if (state.datasetEntries[id]) {
          list.push(state.datasetEntries[id])
        }
      })
      return list
    },

    datasetPropertyList (state) {
      if (!state.currentDatasetId) {
        return []
      }

      if (!state.datasetEntries[state.currentDatasetId]) {
        return []
      }

      const datasetPropertyList = state.datasetEntries[state.currentDatasetId].properties || []
      const list = []
      const children = {}
      datasetPropertyList.forEach(property => {
        if (!property.parentId) {
          return
        }
        const copyProperty = Object.assign({}, property, {isLeaf: true})
        if (!children[property.parentId]) {
          children[property.parentId] = []
        }
        copyProperty.index = children[property.parentId].length
        children[property.parentId].push(copyProperty)
      })
      datasetPropertyList.forEach((property, index) => {
        if (!property.parentId) {
          const copyProperty = Object.assign({}, property, {index})
          if (children[property.id]) {
            Object.assign(copyProperty, {children: children[property.id]})
          }
          if (!copyProperty.type && copyProperty.children && copyProperty.children) {
            copyProperty.type = copyProperty.children[0].type
          }
          list.push(copyProperty)
        }
      })
      return list
    },

    fieldWellBuckets (state, getters) {
      const currentVisualContainer = getters.currentVisualContainer
      if (currentVisualContainer) {
        if (state.visualContainerConfig[currentVisualContainer.type]) {
          return state.visualContainerConfig[currentVisualContainer.type].buckets
        } else {
          return []
        }
      } else {
        return [{id: BUCKET_ROLES.VALUE, role: BUCKET_ROLES.VALUE, name: '值'}]
      }
    },

    isShowGrid (state) {
      return state.report && toBoolean(getFormatValue(state.report.format, FORMAT_TYPES.REPORT_VIEW, FORMAT_TYPES.REPORT_VIEW_SHOW_GRID))
    },

    isAdjustGrid (state) {
      return state.report && toBoolean(getFormatValue(state.report.format, FORMAT_TYPES.REPORT_VIEW, FORMAT_TYPES.REPORT_VIEW_ADJUST_GRID))
    },

    popOutId (state) {
      const currentSection = state.sections[state.currentSectionId]
      if (!currentSection) {
        return null
      }
      const popOutId = getFormatValue(currentSection.format, FORMAT_TYPES.REPORT_VIEW, FORMAT_TYPES.SECTION_VIEW_CURRENT_POP_OUT)
      if (!currentSection.visualContainerIds || currentSection.visualContainerIds.indexOf(popOutId) === -1) {
        return null
      }
      return popOutId
    }
  },

  mutations: {
    /**
     * 重置保存错误信息
     *
     * @param state
     */
    resetSaveError (state) {
      state.saveError = {}
    },

    /**
     * 设置保存错误信息
     *
     * @param state
     * @param code
     */
    setSaveError (state, {code} = {}) {
      Vue.set(state.saveError, code, true)
    },

    /**
     * 通知
     *
     * @param state
     * @param notification
     */
    notify (state, notification) {
      state.notifications.push(notification)
    },

    /**
     * 关闭通知
     *
     * @param state
     * @param id
     */
    dismissNotification (state, {id}) {
      const index = _.findIndex(state.notifications, notification => {
        return notification.id === id
      })
      if (index > -1) {
        state.notifications.splice(index, 1)
      }
    },

    /**
     * 选择工作表
     * @param state
     * @param id
     */
    selectSection (state, id) {
      state.currentSectionId = id
      state.currentVisualContainerId = null
      setFormat(state.report.format, FORMAT_TYPES.REPORT_VIEW, {
        [FORMAT_TYPES.REPORT_VIEW_CURRENT_SECTION]: id
      })
    },

    /**
     * 选择一个图表
     *
     * @param state
     * @param id
     */
    selectVisualContainer (state, id) {
      let currentVisualContainer = state.visualContainers[state.currentVisualContainerId] || null
      if (!currentVisualContainer || currentVisualContainer.id !== id) {
        state.currentVisualContainerId = id
        currentVisualContainer = state.visualContainers[id]
        if (currentVisualContainer) {
          state.currentDatasetId = currentVisualContainer.datasetId
          Vue.set(state.visualContainers, currentVisualContainer.id, currentVisualContainer)
        }
      }
    },

    /**
     * 高亮图表
     *
     * @param state
     * @param id
     */
    spotlightVisualContainer (state, id) {
      state.spotlight = id
    },

    /**
     * 设置工作表显示选项
     *
     * @param state
     * @param payload
     */
    setSectionDisplayOption (state, payload) {
      const section = state.sections[payload.id]
      if (section) {
        Vue.set(section, 'displayOption', parseInt(payload.displayOption, 10))
        Vue.set(state.sections, payload.id, section)
      }
    },

    /**
     * 更新工作表
     *
     * @param state
     * @param id
     * @param values
     */
    updateSection (state, {id, values}) {
      const section = state.sections[id]
      if (section) {
        Object.keys(values).forEach(key => {
          Vue.set(section, key, values[key])
        })
      }
    },

    /**
     * 设置工作表格式
     *
     * @param state
     * @param id
     * @param cardName
     * @param sliceValues
     */
    setSectionFormat (state, {id, cardName, sliceValues}) {
      const section = state.sections[id]
      if (section) {
        const format = section.format || {}

        if (FORMAT_TYPES.SECTION_SIZE_TYPE in sliceValues && sliceValues[FORMAT_TYPES.SECTION_SIZE_TYPE] !== '') {
          const sizeType = sliceValues[FORMAT_TYPES.SECTION_SIZE_TYPE]
          if (sizeType !== '4' && sizeType in SECTION_SIZE_MAP) {
            sliceValues = {
              [FORMAT_TYPES.SECTION_SIZE_TYPE]: sizeType,
              [FORMAT_TYPES.SECTION_WIDTH]: SECTION_SIZE_MAP[sizeType][0],
              [FORMAT_TYPES.SECTION_HEIGHT]: SECTION_SIZE_MAP[sizeType][1]
            }
          }
        }

        if (FORMAT_TYPES.SECTION_WIDTH in sliceValues) {
          Vue.set(section, 'width', sliceValues[FORMAT_TYPES.SECTION_WIDTH])
        }

        if (FORMAT_TYPES.SECTION_HEIGHT in sliceValues) {
          Vue.set(section, 'height', sliceValues[FORMAT_TYPES.SECTION_HEIGHT])
        }

        format[cardName] = Object.assign({}, format[cardName] || {}, sliceValues || {})
        Vue.set(section, 'format', Object.assign({}, format))
        Vue.set(state.sections, id, section)
      }
    },

    /**
     * 设置工作表视图模式
     *
     * @param state
     * @param id
     * @param viewMode
     */
    setSectionViewMode (state, {id, viewMode}) {
      const section = state.sections[id]
      if (section) {
        const format = section.format || {}
        format[FORMAT_TYPES.SECTION_VIEW] = Object.assign({}, format[FORMAT_TYPES.SECTION_VIEW] || {}, {
          [FORMAT_TYPES.SECTION_VIEW_MODE]: viewMode
        })
        Vue.set(section, 'viewMode', viewMode)
        Vue.set(section, 'format', format)
        Vue.set(state.sections, id, section)
      }
    },

    /**
     * 移除一个图表
     *
     * @param state
     * @param id
     */
    removeVisualContainer (state, id) {
      const currentSection = state.sections[state.currentSectionId]
      if (!currentSection) {
        return
      }
      if (currentSection.visualContainerIds) {
        const index = currentSection.visualContainerIds.indexOf(id)
        if (index > -1) {
          currentSection.visualContainerIds.splice(index, 1)
        }
        Vue.delete(state.visualContainers, id)
        currentSection.visualContainerIds.forEach((id, index) => {
          if (state.visualContainers[id]) {
            // Vue.set(state.visualContainers, id, Object.assign(state.visualContainers[id], {z: index}))
            Vue.set(state.visualContainers[id], 'z', index)
          }
        })
        // Vue.set(state.sections, state.currentSectionId, currentSection)
      }
    },

    /**
     * 创建一个图表
     *
     * @param state
     * @param type
     * @param format
     */
    createVisualContainer (state, {type = VISUAL_TYPES.TABLE, format} = {}) {
      const currentSection = this.getters['report/currentSection']

      if (!currentSection) {
        return
      }

      let currentDatasetId = state.currentDatasetId
      if (!currentDatasetId && state.datasetIds.length && isDataVisualType(type)) {
        currentDatasetId = state.datasetIds[0]
        state.currentDatasetId = currentDatasetId
      }

      if (type === VISUAL_TYPES.TABLE) {
        format = format || {}
        format[FORMAT_TYPES.EXTEND] = format[FORMAT_TYPES.EXTEND] || {}
        format[FORMAT_TYPES.EXTEND][FORMAT_TYPES.EXTEND_QUERY_MODE] = QUERY_TYPE.NORMAL
      }

      const id = generateId()
      const visualContainer = createVisualContainer({id, type, datasetId: currentDatasetId, sectionId: currentSection.id, z: currentSection.visualContainerIds.length, format})
      fillVisualContainerFormat(visualContainer, state.formatDefaultValues[visualContainer.type])
      state.currentVisualContainerId = id
      Vue.set(state.visualContainers, id, visualContainer)
      currentSection.visualContainerIds.push(id)
      Vue.set(state.sections, currentSection.id, currentSection)
    },

    /**
     * 转化图表类型
     *
     * @param state
     * @param id
     * @param targetType
     */
    transformVisualType (state, {id, type: targetType}) {
      if (!isDataVisualType(targetType)) {
        return
      }

      const visualContainer = state.visualContainers[id]
      if (!visualContainer || !isDataVisualType(visualContainer.type)) {
        return
      }

      const sourceType = visualContainer.type
      if (sourceType === targetType) {
        return
      }

      let fieldProperties = visualContainer.config.fieldProperties || {}
      const {visualContainerConfig} = state
      if (!visualContainerConfig[targetType]) {
        return
      }
      const buckets = visualContainerConfig[targetType].buckets || []
      const newFieldProperties = {}
      buckets.forEach(buck => {
        newFieldProperties[buck.role] = []
      })
      if (sourceType === VISUAL_TYPES.TABLE && targetType === VISUAL_TYPES.MATRIX) {
        Object.keys(fieldProperties).forEach(role => {
          const properties = fieldProperties[role]
          let i = 0
          properties.forEach(property => {
            if (property.type === PROPERTY_TYPES.NUMBER) {
              if (newFieldProperties[BUCKET_ROLES.VALUE]) {
                property.role = BUCKET_ROLES.VALUE
                if (Array.isArray(property.children)) {
                  property.children.map(property => { property.role = BUCKET_ROLES.VALUE })
                }
                newFieldProperties[BUCKET_ROLES.VALUE].push(property)
              }
            } else {
              if (i === 1 && newFieldProperties[BUCKET_ROLES.COLUMN]) {
                property.role = BUCKET_ROLES.COLUMN
                if (Array.isArray(property.children)) {
                  property.children.map(property => { property.role = BUCKET_ROLES.COLUMN })
                }
                newFieldProperties[BUCKET_ROLES.COLUMN].push(property)
              } else if (newFieldProperties[BUCKET_ROLES.ROW]) {
                property.role = BUCKET_ROLES.ROW
                if (Array.isArray(property.children)) {
                  property.children.map(property => { property.role = BUCKET_ROLES.ROW })
                }
                newFieldProperties[BUCKET_ROLES.ROW].push(property)
              }
              i++
            }
          })
        })
      } else if (sourceType === VISUAL_TYPES.MATRIX && targetType === VISUAL_TYPES.TABLE) {
        [BUCKET_ROLES.ROW, BUCKET_ROLES.COLUMN, BUCKET_ROLES.VALUE].forEach(role => {
          (fieldProperties[role] || []).forEach(property => {
            property.role = BUCKET_ROLES.VALUE
            if (Array.isArray(property.children)) {
              property.children.map(property => { property.role = BUCKET_ROLES.VALUE })
            }
            newFieldProperties[BUCKET_ROLES.VALUE].push(property)
          })
        })
      } else {
        buckets.forEach(buck => {
          (fieldProperties[buck.role] || []).forEach(property => {
            property.role = BUCKET_ROLES.VALUE
            if (Array.isArray(property.children)) {
              property.children.map(property => { property.role = BUCKET_ROLES.VALUE })
            }
            newFieldProperties[BUCKET_ROLES.VALUE].push(property)
          })
        })
      }

      Object.keys(newFieldProperties).forEach(role => {
        if (!newFieldProperties[role].length) {
          delete newFieldProperties[role]
          return
        }
        newFieldProperties[role].forEach((property, index) => {
          property.index = index
          if (Array.isArray(property.children)) {
            property.children.forEach((property, index) => {
              property.index = index
            })
          }
        })
      })

      if (targetType === VISUAL_TYPES.SLICER && newFieldProperties[BUCKET_ROLES.VALUE]) {
        newFieldProperties[BUCKET_ROLES.VALUE].splice(1)
        if (newFieldProperties[BUCKET_ROLES.VALUE][0] && newFieldProperties[BUCKET_ROLES.VALUE][0].children) {
          newFieldProperties[BUCKET_ROLES.VALUE][0].children.splice(1)
        }
      }

      Vue.delete(visualContainer, 'data')
      Vue.set(visualContainer, 'type', targetType)
      Vue.set(visualContainer.config, 'fieldProperties', newFieldProperties)
      Vue.set(visualContainer.config, 'needsUpdate', !_.isEmpty(newFieldProperties))
      const processAction = getFieldPropertyProcessAction(visualContainer)
      fieldProperties = visualContainer.config.fieldProperties
      Object.keys(fieldProperties).forEach(role => {
        const properties = fieldProperties[role]
        properties.forEach(property => {
          processAction(property)
        })
      })
      fillVisualContainerFormat(visualContainer, state.formatDefaultValues[visualContainer.type])
    },

    /**
     * 创建工作表
     *
     * @param state
     */
    createSection (state) {
      const id = generateId()
      const name = `工作表${state.sectionIds.length + 1}`
      const section = createSection({id, name})
      Vue.set(state.sections, id, section)
      state.currentSectionId = id
      state.currentVisualContainerId = null
      state.sectionIds.push(id)
      setFormat(state.report.format, FORMAT_TYPES.REPORT_VIEW, {
        [FORMAT_TYPES.REPORT_VIEW_CURRENT_SECTION]: id
      })
    },

    /**
     * 移动工作表
     *
     * @param state
     * @param fromIndex
     * @param toIndex
     */
    moveSection (state, {fromIndex, toIndex}) {
      const fromSection = state.sectionIds[fromIndex]
      if (!fromSection) {
        return
      }
      state.sectionIds.splice(fromIndex, 1)
      state.sectionIds.splice(toIndex, 0, fromSection)
    },

    /**
     * 移除工作表
     *
     * @param state
     * @param id
     */
    removeSection (state, {id}) {
      const index = state.sectionIds.indexOf(id)
      Vue.delete(state.sectionIds, index)
      if (id) {
        Vue.delete(state.sections, id)
      }
      if (id === state.currentSectionId && state.sectionIds) {
        state.currentSectionId = state.sectionIds[state.sectionIds.length - 1]
      }
    },

    /**
     * 重命名工作表
     *
     * @param state
     * @param name
     * @param id
     */
    renameSection (state, {name, id}) {
      const section = state.sections[id]
      if (section) {
        section.name = name
        Vue.set(state.sections, id, section)
      }
    },

    /**
     * 设置图表配置
     *
     * @param state
     * @param config
     */
    setVisualContainerConfig (state, config) {
      const formatDefaultValues = {}
      Object.keys(config).forEach(key => {
        const formats = config[key].formats || []
        formatDefaultValues[key] = {}
        formats.forEach(format => {
          formatDefaultValues[key][format.name] = {}
          ;(format.slices || []).forEach(slice => {
            if (!_.isUndefined(slice.defaultValue)) {
              let value = slice.defaultValue
              if (slice.type === FORMAT_FIELD_TYPES.BOOLEAN) {
                value = toBoolean(value) ? 1 : 0
              } else if (slice.type === FORMAT_FIELD_TYPES.NUMBER) {
                value = parseFloat(value) || 0
              } else if (slice.type === FORMAT_FIELD_TYPES.INTEGER) {
                value = parseInt(value) || 0
              } else if (slice.type === FORMAT_FIELD_TYPES.RANGE) {
                value = parseFloat(value) || 0
              }
              formatDefaultValues[key][format.name][slice.name] = {
                type: slice.type,
                name: slice.name,
                parentName: slice.parentName,
                value: value,
                extra: slice.extra
              }
            }
          })
        })
      })
      state.visualContainerConfig = config
      state.formatDefaultValues = formatDefaultValues
      state.isInit = true
    },

    /**
     * 新报表
     *
     * @param state
     * @param resp
     */
    newReport (state, resp) {
      const {directoryId, datasetEntries = [], datasetIds = [], visualContainers = {}} = resp

      const sectionId = generateId()
      const name = `工作表${state.sectionIds.length + 1}`
      const section = createSection({id: sectionId, name})

      state.isChanged = true
      state.saving = false
      state.spotlight = null
      state.notifications = []

      state.report = {
        title: '未命名',
        directoryId: directoryId,
        format: {
          [FORMAT_TYPES.REPORT_VIEW]: {
            [FORMAT_TYPES.REPORT_VIEW_CURRENT_SECTION]: sectionId
          }
        }
      }

      state.datasetEntries = datasetEntries
      state.datasetIds = datasetIds
      state.sections = {[sectionId]: section}
      state.sectionIds = [sectionId]
      state.currentSectionId = sectionId
      state.visualContainers = visualContainers
      state.currentDatasetId = datasetIds.length ? datasetIds[0] : null
      state.currentVisualContainerId = null
    },

    /**
     * 卸载报表
     *
     * @param state
     */
    unsetReport (state) {
      state.isSelectCanvasItems = false
      state.isChanged = false
      state.saving = false
      state.spotlight = null
      state.notifications = []

      state.report = null

      state.datasetEntries = {}
      state.datasetIds = []
      state.sections = {}
      state.sectionIds = []
      state.currentSectionId = null
      state.visualContainers = {}
      state.currentDatasetId = null
      state.currentVisualContainerId = null
    },

    /**
     * 设置报表
     *
     * @param state
     * @param resp
     */
    setReport (state, resp) {
      if (!resp) {
        return
      }

      const {report = {}, datasetEntries = [], datasetIds = [], sections = {}, sectionIds = [], visualContainers = {}} = resp

      const formatDefaultValues = state.formatDefaultValues

      Object.keys(visualContainers).forEach(key => {
        const visualContainer = visualContainers[key]
        fillVisualContainerFormat(visualContainer, formatDefaultValues[visualContainer.type])
      })

      let currentSectionId = getFormatValue(report.format, FORMAT_TYPES.REPORT_VIEW, FORMAT_TYPES.REPORT_VIEW_CURRENT_SECTION)
      if (!currentSectionId || sectionIds.indexOf(currentSectionId) === -1) {
        currentSectionId = sectionIds.length ? sectionIds[0] : null
        report.format = report.format || {}
        report.format[FORMAT_TYPES.REPORT_VIEW] = report.format[FORMAT_TYPES.REPORT_VIEW] || {}
        report.format[FORMAT_TYPES.REPORT_VIEW][FORMAT_TYPES.REPORT_VIEW_CURRENT_SECTION] = currentSectionId
      }

      state.isChanged = false
      state.saving = false
      state.spotlight = null
      state.notifications = []

      state.report = report
      state.datasetEntries = datasetEntries
      state.datasetIds = datasetIds
      state.sections = sections
      state.sectionIds = sectionIds
      state.visualContainers = visualContainers
      state.currentSectionId = currentSectionId
      state.currentVisualContainerId = null
      state.currentDatasetId = datasetIds.length ? datasetIds[0] : null
    },

    /**
     * 刷新报表
     *
     * @param state
     * @param resp
     */
    refreshReport (state, resp) {
      if (!resp) {
        return
      }
      const {report = {}, sections = {}, sectionIds = [], visualContainers = {}, currentSectionIndex} = resp

      // const formatDefaultValues = state.formatDefaultValues
      const oldIdMap = {}
      Object.keys(visualContainers).forEach(key => {
        let newVisualContainer = visualContainers[key]
        let oldVisualContainer = state.visualContainers[key]
        if (!oldVisualContainer) {
          oldVisualContainer = state.visualContainers[newVisualContainer.oldId]
        }
        oldIdMap[newVisualContainer.oldId] = newVisualContainer.id
        if (state.currentVisualContainerId === newVisualContainer.oldId && (newVisualContainer.id !== newVisualContainer.oldId)) {
          state.currentVisualContainerId = newVisualContainer.id
        }
        if (oldVisualContainer) {
          visualContainers[key] = _.extend(oldVisualContainer, newVisualContainer)
          delete visualContainers[key].appending
        }
        // fillVisualContainerFormat(visualContainer, formatDefaultValues[visualContainer.type])
      })

      const currentSectionId = sectionIds.length ? (sectionIds[currentSectionIndex] ? sectionIds[currentSectionIndex] : null) : null

      report.format = report.format || {}
      report.format[FORMAT_TYPES.REPORT_VIEW] = report.format[FORMAT_TYPES.REPORT_VIEW] || {}
      report.format[FORMAT_TYPES.REPORT_VIEW][FORMAT_TYPES.REPORT_VIEW_CURRENT_SECTION] = currentSectionId

      if (sections[currentSectionId]) {
        const currentSection = sections[currentSectionId]
        const popId = getFormatValue(currentSection.format, FORMAT_TYPES.SECTION_VIEW, FORMAT_TYPES.SECTION_VIEW_CURRENT_POP_OUT)
        if (popId && oldIdMap[popId]) {
          currentSection.format = currentSection.format || {}
          currentSection.format[FORMAT_TYPES.SECTION_VIEW][FORMAT_TYPES.SECTION_VIEW_CURRENT_POP_OUT] = oldIdMap[popId]
        }
      }

      state.isChanged = false
      state.saving = false
      state.spotlight = null

      state.report = report
      // state.datasetEntries = datasetEntries
      // state.datasetIds = datasetIds
      state.sections = sections
      state.sectionIds = sectionIds
      state.visualContainers = visualContainers
      state.currentSectionId = currentSectionId
    },

    /**
     * 设置报表标题
     *
     * @param state
     * @param title
     */
    setReportTitle (state, title) {
      Vue.set(state.report, 'title', title)
    },

    /**
     * 设置报表格式
     * @param state
     * @param cardName
     * @param sliceName
     * @param value
     */
    setReportFormat (state, {cardName, sliceName, value}) {
      if (!state.report.format[cardName]) {
        Vue.set(state.report.format, cardName, {})
      }
      Vue.set(state.report.format[cardName], sliceName, value)
    },

    /**
     * 设置当前数据集
     * @param state
     * @param datasetId
     */
    changeDataset (state, datasetId) {
      state.currentDatasetId = datasetId
    },

    /**
     * 字段属性动作
     *
     * @param state
     * @param visualContainerId
     * @param propertyId
     * @param role
     * @param index
     * @param childIndex
     * @param action
     * @param value
     */
    actionFieldProperty (state, {visualContainerId, propertyId, role, index, childIndex, action, value}) {
      let visualContainer
      if (visualContainerId) {
        visualContainer = state.visualContainers[visualContainerId]
      } else {
        visualContainer = this.getters['report/currentVisualContainer']
      }

      if (!visualContainer) {
        return
      }

      const fieldProperties = visualContainer.config.fieldProperties || {}
      let property
      let properties
      if (_.isUndefined(role) && propertyId) {
        for (const key in fieldProperties) {
          properties = fieldProperties[key] || []
          for (let i = 0; i < properties.length; i++) {
            if (properties[i].id === propertyId) {
              role = key
              index = i
              childIndex = void 0
              break
            }
            if (Array.isArray(property[i].children)) {
              const tempIndex = _.findIndex(property[i].children, childProperty => {
                return childProperty.id === propertyId
              })
              if (tempIndex !== -1) {
                role = key
                childIndex = tempIndex
                index = i
                break
              }
            }
          }

          if (!_.isUndefined(role)) {
            break
          }
        }
      }

      if (_.isUndefined(role)) {
        return
      }

      properties = fieldProperties[role] || []
      property = properties[index]
      if (!property) {
        return
      }

      function updateOtherSort (otherProperty) {
        if (property.type === PROPERTY_TYPES.NUMBER) {
          if (otherProperty.action) {
            Vue.set(otherProperty.action, 'pxlx', SORT_TYPE.DEFAULT)
          }
        } else if (otherProperty.type === PROPERTY_TYPES.NUMBER) {
          if (otherProperty.action) {
            Vue.set(otherProperty.action, 'pxlx', SORT_TYPE.DEFAULT)
          }
        }
      }

      if (action === 'pxlx') {
        Object.keys(fieldProperties).forEach(role => {
          const properties = fieldProperties[role]
          properties.forEach(property => {
            updateOtherSort(property)
            if (_.isArray(property.children)) {
              property.children.map(updateOtherSort)
            }
          })
        })
      }

      let propertyAction
      if (childIndex !== undefined && property.children && property.children[childIndex]) {
        property = property.children[childIndex]
      }

      Vue.set(property, 'action', property.action || {})
      propertyAction = property.action
      Vue.set(propertyAction, action, value)
      if (action === 'pxsxz') {
        Vue.set(propertyAction, 'pxlx', SORT_TYPE.MANUAL)
      }
      Vue.set(visualContainer.config, 'needsUpdate', true)
      if (action === 'jh') {
        fillVisualContainerFormat(visualContainer, state.formatDefaultValues[visualContainer.type])
      }
    },

    /**
     * 添加字段属性
     * @param state
     * @param role
     * @param datasetProperty
     * @param index
     */
    addFieldProperty (state, {role, datasetProperty, index}) {
      const fieldWellBuckets = this.getters['report/fieldWellBuckets']
      const visualContainer = this.getters['report/currentVisualContainer']

      if (!fieldWellBuckets || !fieldWellBuckets.length || !visualContainer) {
        return
      }

      const visualType = visualContainer.type
      const fieldProperties = visualContainer.config.fieldProperties
      const datasetProperties = this.getters['report/datasetPropertyList']

      const processAction = getFieldPropertyProcessAction(visualContainer)

      if (datasetProperty.parentId) {
        const parentDatasetProperty = _.find(datasetProperties, item => {
          return item.id === datasetProperty.parentId
        })

        if (parentDatasetProperty && parentDatasetProperty.groupType === PROPERTY_GROUP_TYPES.LEVEL) {
          const existsBucket = _.find(fieldWellBuckets, bucket => {
            return isPropertyExists(fieldProperties[bucket.role] || [], parentDatasetProperty)
          })
          if (existsBucket) {
            role = existsBucket.role
          }
        }
      }

      // 处理 多维表 属性添加
      if (role === void 0 && visualType === VISUAL_TYPES.MATRIX) {
        if (datasetProperty.type === PROPERTY_TYPES.NUMBER) {
          role = BUCKET_ROLES.VALUE
        } else {
          const columnProperties = fieldProperties[BUCKET_ROLES.COLUMN] || []
          const rowProperties = fieldProperties[BUCKET_ROLES.ROW] || []
          if (!columnProperties.length && rowProperties.length) {
            role = BUCKET_ROLES.COLUMN
          } else {
            role = BUCKET_ROLES.Row
          }
        }
      }

      if (!role) {
        let bucket
        for (let i = 0; i < fieldWellBuckets.length; i++) {
          bucket = fieldWellBuckets[i]
          if (bucket.type === datasetProperty.type) {
            role = bucket.role
            break
          }
        }
        if (!role) {
          role = fieldWellBuckets[0].role
        }
      }

      if (visualType === VISUAL_TYPES.MATRIX) {
        if (role !== BUCKET_ROLES.VALUE && datasetProperty.type === PROPERTY_TYPES.NUMBER) {
          return
        }
      }

      if (visualType === VISUAL_TYPES.SLICER && fieldProperties[BUCKET_ROLES.VALUE] && fieldProperties[BUCKET_ROLES.VALUE].length) {
        return
      }

      const fieldProperty = datasetPropertyToFieldProperty(datasetProperty, role, processAction)
      addFieldProperty({
        role,
        index,
        property: fieldProperty,
        fieldProperties,
        datasetProperties,
        processAction,
        fieldWellBuckets
      })
      if (visualType === VISUAL_TYPES.SLICER && fieldProperties[BUCKET_ROLES.VALUE]) {
        fieldProperties[BUCKET_ROLES.VALUE].splice(1)
        if (fieldProperties[BUCKET_ROLES.VALUE][0] && fieldProperties[BUCKET_ROLES.VALUE][0].children) {
          fieldProperties[BUCKET_ROLES.VALUE][0].children.splice(1)
        }
      }
      Vue.set(visualContainer.config, 'needsUpdate', true)
      fillVisualContainerFormat(visualContainer, state.formatDefaultValues[visualContainer.type])
    },

    /**
     * 移除字段属性
     *
     * @param state
     * @param datasetProperty
     */
    removeFieldProperty (state, datasetProperty) {
      const fieldWellBuckets = this.getters['report/fieldWellBuckets']
      const visualContainer = this.getters['report/currentVisualContainer']

      if (!fieldWellBuckets || !fieldWellBuckets.length || !visualContainer) {
        return
      }

      const fieldProperties = visualContainer.config.fieldProperties || {}

      fieldWellBuckets.forEach(bucket => {
        let properties = fieldProperties[bucket.role] || []
        let update = false

        if (datasetProperty.groupType === PROPERTY_GROUP_TYPES.GROUP) {
          properties = properties.filter(property => {
            if (property.parentId !== datasetProperty.id) {
              return property
            }
          })
          update = true
        } else {
          let childIndex = -1
          const index = _.findIndex(properties, property => {
            if (datasetProperty.parentId && datasetProperty.parentId === property.id) {
              if (property.children) {
                childIndex = _.findIndex(property.children, child => {
                  return child.id === datasetProperty.id
                })
                return true
              } else {
                return true
              }
            } else if (datasetProperty.groupType === PROPERTY_GROUP_TYPES.GROUP) {
              return property.parentId === datasetProperty.id
            } else {
              return property.id === datasetProperty.id
            }
          })

          if (index > -1) {
            if (childIndex > -1) {
              properties[index].children.splice(childIndex, 1)
              if (!properties[index].children.length) {
                properties.splice(index, 1)
              }
            } else {
              properties.splice(index, 1)
            }
            update = true
          }
        }

        if (!update) {
          return
        }

        sortProperties(properties)

        if (properties.length) {
          Vue.set(fieldProperties, bucket.role, properties)
        } else {
          Vue.delete(fieldProperties, bucket.role)
        }

        if (visualContainer.type === VISUAL_TYPES.SLICER) {
          slicerNotify(visualContainer, state.visualContainers)
        }

        fillVisualContainerFormat(visualContainer, state.formatDefaultValues[visualContainer.type])
        Vue.set(visualContainer.config, 'needsUpdate', true)
      })
    },

    /**
     * 移动字段属性
     *
     * @param state
     * @param sourceRole
     * @param targetRole
     * @param fromIndex
     * @param toIndex
     */
    moveFieldProperty (state, {sourceRole, targetRole, fromIndex, toIndex}) {
      const visualContainer = this.getters['report/currentVisualContainer']
      if (!visualContainer) {
        return
      }

      const fieldProperties = visualContainer.config.fieldProperties || {}
      const sourceProperties = fieldProperties[sourceRole] || []
      const targetProperties = fieldProperties[targetRole] || []

      Vue.set(fieldProperties, sourceRole, sourceProperties)
      Vue.set(fieldProperties, targetRole, targetProperties)

      if (sourceRole === targetRole && fromIndex === toIndex) {
        return
      }

      const property = sourceProperties[fromIndex]
      if (!property) {
        return
      }

      if (sourceRole !== targetRole && isPropertyExists(targetProperties, property)) {
        return
      }
      sourceProperties.splice(fromIndex, 1)
      if (sourceRole === targetRole) {
        if (toIndex === -1) {
          sourceProperties.unshift(property)
        } else if (fromIndex > toIndex) {
          sourceProperties.splice(toIndex, 0, property)
        } else {
          sourceProperties.splice(toIndex - 1, 0, property)
        }
      } else {
        Vue.set(property, 'role', targetRole)
        if (Array.isArray(property.children)) {
          property.children.forEach(property => {
            Vue.set(property, 'role', targetRole)
          })
        }
        targetProperties.splice(toIndex, 0, property)
      }

      // 重新排序
      sortProperties(sourceProperties)
      sortProperties(targetProperties)

      if (!sourceProperties.length) {
        Vue.delete(fieldProperties, sourceRole)
      }

      if (!targetProperties.length) {
        Vue.delete(fieldProperties, targetRole)
      }
      Vue.set(visualContainer.config, 'needsUpdate', true)
    },

    replaceFieldProperty (state, {sourceRole, datasetProperty, index}) {
      const fieldWellBuckets = this.getters['report/fieldWellBuckets']
      const visualContainer = this.getters['report/currentVisualContainer']

      if (!fieldWellBuckets || !fieldWellBuckets.length || !visualContainer) {
        return
      }

      const visualType = visualContainer.type
      const fieldProperties = visualContainer.config.fieldProperties
      const datasetProperties = this.getters['report/datasetPropertyList']

      const processAction = getFieldPropertyProcessAction(visualContainer)
      const fieldProperty = datasetPropertyToFieldProperty(datasetProperty, sourceRole, processAction)
      addFieldProperty({
        role: sourceRole,
        index,
        property: fieldProperty,
        fieldProperties,
        datasetProperties,
        processAction,
        fieldWellBuckets
      }, true)
      if (visualType === VISUAL_TYPES.SLICER && fieldProperties[BUCKET_ROLES.VALUE]) {
        fieldProperties[BUCKET_ROLES.VALUE].splice(1)
        if (fieldProperties[BUCKET_ROLES.VALUE][0] && fieldProperties[BUCKET_ROLES.VALUE][0].children) {
          fieldProperties[BUCKET_ROLES.VALUE][0].children.splice(1)
        }
        Vue.set(visualContainer, 'data', null)
      }
      Vue.set(visualContainer.config, 'needsUpdate', true)
      fillVisualContainerFormat(visualContainer, state.formatDefaultValues[visualContainer.type])
    },

    /**
     * 删除字段属性
     *
     * @param state
     * @param role
     * @param index
     * @param childIndex
     */
    deleteFieldProperty (state, {role, index, childIndex}) {
      const visualContainer = this.getters['report/currentVisualContainer']
      if (!visualContainer) {
        return
      }

      const fieldProperties = visualContainer.config.fieldProperties || {}
      const properties = fieldProperties[role] || []
      if (!properties.length) {
        return
      }

      const property = properties[index]
      if (!property) {
        return
      }
      if (childIndex !== undefined && Array.isArray(property.children)) {
        property.children.splice(childIndex, 1)
        if (!property.children.length) {
          properties.splice(index, 1)
        }
      } else {
        properties.splice(index, 1)
      }

      // 重新排序
      sortProperties(properties)

      if (!properties.length) {
        Vue.delete(fieldProperties, role)
      }

      if (visualContainer.type === VISUAL_TYPES.SLICER) {
        slicerNotify(visualContainer, state.visualContainers)
      }

      fillVisualContainerFormat(visualContainer, state.formatDefaultValues[visualContainer.type])
      Vue.set(visualContainer.config, 'needsUpdate', true)
    },

    /**
     * 重命名字段属性
     *
     * @param state
     * @param role
     * @param name
     * @param index
     * @param childIndex
     */
    renameFieldProperty (state, {role, name, index, childIndex}) {
      const visualContainer = this.getters['report/currentVisualContainer']
      if (!visualContainer) {
        return
      }
      const fieldProperties = visualContainer.config.fieldProperties || {}
      const filterProperties = visualContainer.config.filterProperties || {}

      const properties = fieldProperties[role] || []
      let property = properties[index]
      if (!property) {
        return
      }

      if (childIndex !== undefined && property.children && property.children[childIndex]) {
        property = property.children[childIndex]
      }

      Vue.set(property, 'alias', name)
      Vue.set(visualContainer.config, 'needsUpdate', true)

      const filterProperty = _.find(filterProperties, filterProperty => {
        return property.id === filterProperty.id
      })

      if (filterProperty) {
        Vue.set(filterProperty, 'alias', name)
      }
      Vue.set(state.visualContainers, visualContainer.id, visualContainer)
    },

    /**
     * 更新图表数据
     *
     * @param state
     * @param id
     * @param data
     * @param refreshData
     */
    updateVisualContainerData (state, {id, data, refreshData = true}) {
      const visualContainer = state.visualContainers[id]
      if (!visualContainer) {
        return
      }
      if (refreshData) {
        Vue.set(visualContainer, 'data', data)
      }
      Vue.set(visualContainer.config, 'needsUpdate', false)
    },

    /**
     * 添加过滤属性
     *
     * @param state
     * @param property
     */
    addFilterProperty (state, property) {
      const visualContainer = this.getters['report/currentVisualContainer']
      if (!visualContainer || property.children) {
        return
      }

      property = propertyToFilterProperty(property)

      const properties = visualContainer.config.filterProperties || []
      const existsIndex = _.findIndex(properties, item => {
        return item.id === property.id
      })
      if (existsIndex !== -1) {
        return
      }
      if (property.type === PROPERTY_TYPES.NUMBER) {
        property.filterType = FILTER_TYPE_ADVANCED
      } else {
        property.filterType = FILTER_TYPE_BASE
      }
      property.index = properties.length
      properties.push(property)
    },

    /**
     * 移除过滤属性
     *
     * @param state
     * @param index
     */
    removeFilterProperty (state, index) {
      const visualContainer = this.getters['report/currentVisualContainer']
      if (!visualContainer) {
        return
      }
      const properties = visualContainer.config.filterProperties || []
      const property = properties[index]
      if (!property) {
        return
      }
      const needsUpdate = !_.isEqual(property.condition || {}, {})
      properties.splice(index, 1)

      // 重新排序
      properties.forEach((property, index) => {
        Vue.set(property, 'index', index)
      })
      Vue.set(visualContainer.config, 'needsUpdate', needsUpdate)
    },

    /**
     * 更新过滤属性
     *
     * @param state
     * @param payload
     */
    updateFilterProperty (state, payload) {
      const visualContainer = this.getters['report/currentVisualContainer']
      if (!visualContainer) {
        return
      }
      const {index} = payload
      const fieldProperties = visualContainer.config.fieldProperties
      const properties = visualContainer.config.filterProperties
      let property = properties[index]
      if (!property) {
        return
      }
      let needsUpdate = false
      const update = {};
      ['condition', 'filterType', 'filterExpand'].forEach(key => {
        if (typeof payload[key] !== 'undefined') {
          update[key] = _.isObject(payload[key]) ? Object.assign({}, payload[key]) : payload[key]
        }
      })
      if ('condition' in payload) {
        needsUpdate = !_.isEqual(property['condition'] || {}, payload['condition'])
      }
      if (_.isEmpty(update)) {
        return
      }
      for (const key in update) {
        Vue.set(property, key, update[key])
      }
      Vue.set(property, 'restatement', filterRestatement(property, property.filterType))
      Vue.set(visualContainer.config, 'needsUpdate', needsUpdate && !_.isEmpty(fieldProperties))
    },

    /**
     * 设置属性值
     *
     * @param state
     * @param id
     * @param data
     */
    setPropertyValues (state, {id, data}) {
      Vue.set(state.propertyValues, id, data)
    },

    /**
     * 设置图表格式
     *
     * @param state
     * @param id
     * @param cardName
     * @param sliceValues
     */
    setVisualContainerPropertyFormat (state, {id, cardName, sliceValues}) {
      const visualContainer = state.visualContainers[id]
      if (visualContainer) {
        if (!visualContainer.format) {
          Vue.set(visualContainer, 'format', {})
        }
        const format = visualContainer.format
        if (FORMAT_TYPES.GENERAL_X in sliceValues) {
          Vue.set(visualContainer, 'x', Math.round(sliceValues[FORMAT_TYPES.GENERAL_X]))
        }
        if (FORMAT_TYPES.GENERAL_Y in sliceValues) {
          Vue.set(visualContainer, 'y', Math.round(sliceValues[FORMAT_TYPES.GENERAL_Y]))
        }
        if (FORMAT_TYPES.GENERAL_WIDTH in sliceValues) {
          Vue.set(visualContainer, 'width', Math.round(sliceValues[FORMAT_TYPES.GENERAL_WIDTH]))
        }
        if (FORMAT_TYPES.GENERAL_HEIGHT in sliceValues) {
          Vue.set(visualContainer, 'height', Math.round(sliceValues[FORMAT_TYPES.GENERAL_HEIGHT]))
        }

        if (!format[cardName]) {
          Vue.set(visualContainer, 'format', Object.assign({}, format, {[cardName]: sliceValues}))
        } else {
          Vue.set(visualContainer, 'format', Object.assign({}, format, {[cardName]: Object.assign({}, format[cardName], sliceValues)}))
        }

        if (FORMAT_TYPES.SLICER_VALUE_CONDITION in sliceValues) {
          slicerNotify(visualContainer, state.visualContainers)
        }

        if (FORMAT_TYPES.EXTEND_QUERY_MODE in sliceValues) {
          updateVisualContainerQueryType(visualContainer)
        }
      }
    },

    /**
     * 设置图表格式状态
     *
     * @param state
     * @param id
     * @param cardName
     * @param name
     * @param value
     */
    setVisualContainerPropertyCard (state, {id, cardName, name, value}) {
      const visualContainer = state.visualContainers[id]
      if (visualContainer) {
        const cards = visualContainer.cards || {}
        if (cards[cardName]) {
          cards[cardName] = Object.assign({}, cards[cardName], {[name]: value})
        } else {
          cards[cardName] = {[name]: value}
        }

        Vue.set(visualContainer, 'cards', Object.assign({}, cards))
      }
    },

    /**
     * 图表是否聚焦放大
     *
     * @param state
     * @param popOut
     * @param id
     */
    visualContainerPopOut (state, {popOut, id}) {
      const section = state.sections[state.currentSectionId]
      if (!section) {
        return
      }
      if (section.format[FORMAT_TYPES.SECTION_VIEW]) {
        Vue.set(section.format, FORMAT_TYPES.SECTION_VIEW, {})
      }
      Vue.set(section.format[FORMAT_TYPES.SECTION_VIEW], FORMAT_TYPES.SECTION_VIEW_CURRENT_POP_OUT, popOut ? id : null)
    },

    /**
     * 设置是报表否保存中
     *
     * @param state
     * @param saving
     */
    setSaving (state, saving) {
      state.saving = saving
    },

    /**
     * 设置报表是否改变
     *
     * @param state
     * @param changed
     */
    setReportChanged (state, changed) {
      state.isChanged = changed
    },

    /**
     * 复制工作表
     *
     * @param state
     * @param sectionId
     */
    copySection (state, sectionId) {
      const section = state.sections[sectionId]
      if (!section) {
        return
      }

      Vue.set(section, 'copyCount', section.copyCount ? (section.copyCount + 1) : 1)
      const newSection = $.extend(true, {}, section)
      newSection.copyCount = 0
      newSection.id = generateId()
      newSection.name = section.name + '副本(' + section.copyCount + ')'
      const visualContainerIds = []
      ;(newSection.visualContainerIds || []).forEach(visualContainerId => {
        const visualContainer = state.visualContainers[visualContainerId]
        if (visualContainer) {
          const newVisualContainer = $.extend(true, {}, visualContainer)
          newVisualContainer.id = generateId()
          newVisualContainer.appending = true
          Vue.set(state.visualContainers, newVisualContainer.id, newVisualContainer)
          visualContainerIds.push(newVisualContainer.id)
        }
      })
      newSection.visualContainerIds = visualContainerIds
      Vue.set(state.sections, newSection.id, newSection)
      state.sectionIds.push(newSection.id)
      state.currentSectionId = newSection.id
    },

    /**
     * 设置图表可见度
     * @param state
     * @param id
     * @param visibility
     */
    setVisualContainerVisibility (state, {id, visibility}) {
      if (!Array.isArray(id)) {
        id = [id]
      }
      const visualContainers = state.visualContainers
      id.forEach(id => {
        const visualContainer = visualContainers[id]
        if (visualContainer) {
          Vue.set(visualContainer, 'visibility', !!visibility)
        }
      })
    },

    sortVisualContainer (state, {id, fromIndex, toIndex}) {
      if (fromIndex === toIndex) {
        return
      }

      const currentSection = state.sections[state.currentSectionId] || null
      if (!currentSection) {
        return
      }

      const visualContainerIds = currentSection.visualContainerIds
      visualContainerIds.splice(fromIndex, 1)

      if (toIndex === -1) {
        visualContainerIds.unshift(id)
      } else if (fromIndex > toIndex) {
        visualContainerIds.splice(toIndex, 0, id)
      } else {
        visualContainerIds.splice(toIndex - 1, 0, id)
      }
      currentSection.visualContainerIds.forEach((id, index) => {
        if (state.visualContainers[id]) {
          Vue.set(state.visualContainers[id], 'z', index)
        }
      })
    },
    toggleSelectCanvasItems (state, isSelectedCanvasItems) {
      state.isSelectCanvasItems = isSelectedCanvasItems
    },

    startLinkage (state, {data}) {
      const {visualContainers} = state
      for (const row of data) {
        const visualContainer = visualContainers[row.visualContainerId]
        if (visualContainers[row.visualContainerId]) {
          Vue.set(visualContainer.config, 'linkage', row.linkage)
          Vue.set(visualContainer.config, 'needsUpdate', true)
        }
      }
    },

    stopLinkage (state, {data}) {
      const {visualContainers} = state
      for (const row of data) {
        const visualContainer = visualContainers[row.visualContainerId]
        if (visualContainers[row.visualContainerId]) {
          Vue.delete(visualContainer.config, 'linkage')
          Vue.set(visualContainer.config, 'needsUpdate', true)
        }
      }
    },

    addDataset (state, {datasetIds, datasetEntries}) {
      datasetIds.forEach(id => {
        state.datasetIds.push(id)
      })
      Object.keys(datasetEntries).forEach(id => {
        Vue.set(state.datasetEntries, id, datasetEntries[id])
      })
      if (state.currentDatasetId === null && datasetIds.length) {
        state.currentDatasetId = datasetIds[0]
      }
    },

    removeDataset (state, datasetIds) {
      let removeVisualContainerIds = []
      datasetIds.forEach(datasetId => {
        const index = state.datasetIds.indexOf(datasetId)
        if (index > -1) {
          state.datasetIds.splice(index, 1)
        }
        Vue.delete(state.datasetEntries, datasetId)
        Object.keys(state.visualContainers).forEach(visualId => {
          const visualContainer = state.visualContainers[visualId]
          if (visualContainer.datasetId === datasetId) {
            removeVisualContainerIds.push(visualId)
            Vue.delete(state.visualContainers, visualId)
          }
        })
      })

      if (state.currentDatasetId && datasetIds.indexOf(state.currentDatasetId) > -1) {
        state.currentDatasetId = state.datasetIds.length ? state.datasetIds[0] : null
      }

      if (!removeVisualContainerIds.length) {
        return
      }

      Object.keys(state.sections).forEach(sectionId => {
        const section = state.sections[sectionId]
        const removeIds = _.intersection(section.visualContainerIds, removeVisualContainerIds)
        if (removeIds.length) {
          Vue.set(section, 'visualContainerIds', _.without(section.visualContainerIds, ...removeIds))
        }
      })
    }
  },

  actions: {
    /**
     * 查找报表
     *
     * @param commit
     * @param id
     */
    findReport ({commit}, id) {
      return report.findById(id).then((resp) => {
        commit('setReport', resp)
        if (!resp.sectionIds || !resp.sectionIds.length) {
          commit('createSection')
        }
      }, (e) => {
        if (e instanceof Error && e.name === 'RequestCancel') {
          return
        }
        return Promise.reject(e)
      })
    },

    /**
     * 导出图表数据
     *
     * @param state
     * @param id
     * @param params
     */
    exportTableData ({state}, {id, params}) {
      const visualContainer = state.visualContainers[id]
      if (!visualContainer) {
        return
      }

      const {type, datasetId} = visualContainer
      const {fieldProperties, sortProperties, filterProperties} = visualContainer.config || {}
      const format = visualContainer.format || {}

      if (_.isEmpty(fieldProperties)) {
        return
      }

      const slicers = extractSlicers(state.visualContainers, visualContainer)

      return report.exportTableData({
        id,
        type,
        datasetId,
        slicers,
        filterProperties,
        sortProperties,
        fieldProperties,
        format,
        params
      })
    },

    /**
     * 获取图表数据
     *
     * @param commit
     * @param state
     * @param id
     * @param params
     */
    fetchTableData ({commit, state}, {id, params}) {
      const visualContainer = state.visualContainers[id]
      if (!visualContainer) {
        return
      }

      const {type, datasetId} = visualContainer
      const {fieldProperties, sortProperties, filterProperties, linkage} = visualContainer.config || {}
      const format = visualContainer.format || {}

      if (_.isEmpty(fieldProperties)) {
        commit('updateVisualContainerData', {id, data: null})
        return
      }

      const slicers = extractSlicers(state.visualContainers, visualContainer)

      return report.fetchTableData({
        id: visualContainer.appending ? null : id,
        type,
        datasetId,
        linkage,
        filterProperties,
        sortProperties,
        fieldProperties,
        slicers,
        format,
        params
      }).then(resp => {
        let refreshData = false
        if (resp.checkQueryResult &&
          resp.checkQueryResult &&
          [3, 4, 20, 21, 22].indexOf(resp.checkQueryResult.checkCode) === -1
        ) {
          refreshData = true
        }
        if (type === VISUAL_TYPES.SLICER) {
          resp = convertSlicerResponse(resp, getFirstFieldProperty(fieldProperties))
        }
        commit('updateVisualContainerData', {id, data: resp, refreshData})
        return resp
      }, e => {
        if (!(e instanceof Error && e.name === 'RequestCancel')) {
          commit('updateVisualContainerData', {id, data: null})
          console.error(e)
          throw new Error(e)
        }
      })
    },

    /**
     * 获取属性值
     *
     * @param commit
     * @param propertyId
     * @param datasetId
     */
    fetchPropertyValues ({commit}, {propertyId, datasetId}) {
      return report.fetchPropertyValues(propertyId, datasetId).then(resp => {
        commit('setPropertyValues', {id: propertyId + '###' + datasetId, data: resp || []})
        return resp || []
      })
    },

    /**
     * 报表初始化
     *
     * @param commit
     */
    initReport ({commit}) {
      return report.fetchVisualContainerConfig().then(config => {
        commit('setVisualContainerConfig', config)
      })
    },

    /**
     * 新建一个报表
     *
     * @param commit
     * @param parentId
     * @param datasetIds
     */
    newReport ({commit}, {parentId, datasetIds}) {
      return report.fetchDatasetListByIds(datasetIds).then(resp => {
        resp.directoryId = parentId
        commit('newReport', resp)
      }, (e) => {
        return typeof e === 'string' ? e : '获取数据集信息失败'
      })
    },

    /**
     * 保存报表
     *
     * @param state
     * @param commit
     * @param title
     */
    saveReport ({state, commit}, {title} = {}) {
      commit('resetSaveError')
      commit('setSaving', true)
      if (!_.isUndefined(title)) {
        commit('setReportTitle', title)
      }
      return report.save({
        report: state.report,
        sectionIds: state.sectionIds,
        sections: state.sections,
        visualContainers: state.visualContainers,
        datasetEntries: state.datasetEntries
      }).then((resp) => {
        resp.currentSectionIndex = state.sectionIds.indexOf(state.currentSectionId)
        commit('refreshReport', resp)
        return state.report
      }, e => {
        commit('setSaving', false)
        if (e instanceof Error && e.name === 'RequestCancel') {
          return Promise.reject(e)
        }
        if (typeof e === 'string' && e.indexOf('报表名称已存在') !== -1) {
          commit('setSaveError', {code: 'titleExists'})
        }
        console.error(e)
        return Promise.reject(e)
      })
    },

    addDataset ({commit}, datasetIds) {
      return report.fetchDatasetListByIds(datasetIds).then(resp => {
        commit('addDataset', resp)
      })
    }
  }
}
