import _ from 'underscore'
import tinycolor from 'tinycolor2'

import {
  DATE_OPERATOR_LIST,
  FILTER_TYPE_ADVANCED, FILTER_TYPE_BASE, FORMAT_PROPERTY_EXTRA, FORMAT_TEXT_ALIGN_MAP, FORMAT_TYPES,
  MENU_ACTION_VALUE_MAP,
  NUMBER_OPERATOR_LIST,
  OPERATOR_AND, PROPERTY_TYPES,
  TEXT_OPERATOR_LIST,
  VISUAL_TYPES
} from './constant'
import { isNumeric, toBoolean } from '../common/utils'

export function isDataVisualType (type) {
  return [
    VISUAL_TYPES.IMAGEBOX,
    VISUAL_TYPES.TEXTBOX,
    VISUAL_TYPES.BASE_SHAPE
  ].indexOf(type) === -1
}

function isCanAppendFieldOptions (property, formatPropertyExtra) {
  if (_.isUndefined(formatPropertyExtra)) {
    return true
  }
  switch (formatPropertyExtra) {
    case FORMAT_PROPERTY_EXTRA.ALL:
      return true
    case FORMAT_PROPERTY_EXTRA.TEXT_DATE:
      return property.type === PROPERTY_TYPES.TEXT || property.type === PROPERTY_TYPES.DATE
    case FORMAT_PROPERTY_EXTRA.NUMBER:
      return property.type === PROPERTY_TYPES.NUMBER || (property.action && property.action.jh)
    default:
      return false
  }
}

export function getFormatPropertyFieldOptions (visualContainer, formatPropertyExtra) {
  if (!visualContainer) {
    return []
  }

  const fieldProperties = visualContainer.config ? (visualContainer.config.fieldProperties || {}) : {}
  const options = []
  Object.keys(fieldProperties).forEach(key => {
    fieldProperties[key].forEach(property => {
      if (property.children) {
        property.children.forEach(property => {
          if (isCanAppendFieldOptions(property, formatPropertyExtra)) {
            options.push({
              value: property.id,
              type: property.type,
              displayName: propertyDisplayName(property)
            })
          }
        })
      } else {
        if (isCanAppendFieldOptions(property, formatPropertyExtra)) {
          options.push({
            value: property.id,
            type: property.type,
            displayName: propertyDisplayName(property)
          })
        }
      }
    })
  })
  return options
}

/**
 * 根据属性类型判断格式类型是否有效
 *
 * @param slice
 * @param propertyType
 * @returns {boolean}
 */
export function formatSliceIsValidByPropertyType (slice, propertyType) {
  if (slice.extra === FORMAT_PROPERTY_EXTRA.NUMBER && propertyType !== PROPERTY_TYPES.NUMBER) {
    return false
  }
  return true
}

export function propertyDisplayName (property) {
  if (property.alias) {
    return property.alias
  }
  const action = property.action || {}
  if (action.jh) {
    return `${MENU_ACTION_VALUE_MAP[action.jh]} （${property.desc}）`
  } else {
    return property.desc
  }
}

export function searchTree (tree, id) {
  let node
  for (let i = 0; i < tree.length; i++) {
    node = tree[i]
    if (node.id === id) {
      return node
    } else if (node.children && Array.isArray(node.children)) {
      node = searchTree(node.children, id)
      if (node) {
        return node
      }
    }
  }
}

export function getFormatValue (format, cardName, sliceName, defaultValue) {
  if (!_.isObject(format)) {
    return defaultValue
  }
  if (cardName in format) {
    const card = format[cardName]
    if (sliceName in card) {
      return card[sliceName]
    }
  }
  return defaultValue
}

function getComparisionOperatorValue (filterProperty, operator, value) {
  let operatorList
  if (filterProperty.type === PROPERTY_TYPES.NUMBER) {
    operatorList = NUMBER_OPERATOR_LIST
  } else if (filterProperty.type === PROPERTY_TYPES.DATE) {
    operatorList = DATE_OPERATOR_LIST
  } else {
    operatorList = TEXT_OPERATOR_LIST
  }
  const result = _.findWhere(operatorList, {value: operator})
  const operatorName = result ? result.name : ''

  if (['7', '8'].indexOf(operator) > -1) {
    return operatorName
  }
  value = filterProperty.type === PROPERTY_TYPES.NUMBER ? value : `"${value}"`
  return operatorName + value
}

export function filterRestatement (filterProperty, filterType) {
  const {condition = {}} = filterProperty
  if (filterType === FILTER_TYPE_ADVANCED) {
    const str = []
    if (!_.isEmpty(condition.comparisonOperator1)) {
      str.push(getComparisionOperatorValue(filterProperty, condition.comparisonOperator1, condition.comparisonValue1))
    }

    if (!_.isEmpty(condition.comparisonOperator2)) {
      str.push(getComparisionOperatorValue(filterProperty, condition.comparisonOperator2, condition.comparisonValue2))
    }
    if (str.length === 2) {
      str.splice(1, 0, condition.logicalOperator === OPERATOR_AND ? '且' : '或')
    }
    return str.join('')
  } else if (filterType === FILTER_TYPE_BASE) {
    const notIn = Array.isArray(condition.notInValues) && condition.notInValues.length
    let values
    if (notIn) {
      values = condition.notInValues
    } else {
      values = Array.isArray(condition.inValues) ? condition.inValues : []
    }

    if (values.length) {
      if (values.length > 2) {
        return (notIn ? '不' : '') + '等于' + values.slice(0, -1).join('、') + '或' + values[values.length - 1]
      } else {
        return (notIn ? '不' : '') + '等于' + values.join('或')
      }
    }
  }
  return ''
}

export function getVisualTitleProperties (format) {
  const properties = {}
  if (FORMAT_TYPES.TITLE_CARD in format) {
    const card = format[FORMAT_TYPES.TITLE_CARD] || {}
    Object.assign(properties, {
      enable: toBoolean(card[FORMAT_TYPES.TITLE]),
      backgroundColor: card[FORMAT_TYPES.TITLE_BACKGROUND_COLOR],
      color: card[FORMAT_TYPES.TITLE_COLOR],
      align: card[FORMAT_TYPES.TITLE_ALIGN],
      fontFamily: card[FORMAT_TYPES.TITLE_FONT_FAMILY],
      fontSize: card[FORMAT_TYPES.TITLE_FONT_SIZE]
    })
    if (isNumeric(properties['fontSize'])) {
      properties['lineHeight'] = 1.5
      properties['height'] = properties['fontSize'] * properties['lineHeight']
    }
  }
  return properties
}

export function getVisualTitleStyle (properties) {
  const style = {}
  if (!properties['enable']) {
    return style
  }

  if (properties['backgroundColor'] && tinycolor(properties['backgroundColor']).isValid()) {
    style['background-color'] = properties['backgroundColor']
  }

  if (properties['color'] && tinycolor(properties['color']).isValid()) {
    style['color'] = properties['color']
  }

  if (properties['align']) {
    style['text-align'] = FORMAT_TEXT_ALIGN_MAP[properties['align']] || 'left'
  }

  if (properties['fontFamily']) {
    style['font-family'] = properties['fontFamily']
  }

  if (isNumeric(properties['fontSize'])) {
    style['font-size'] = properties['fontSize'] + 'px'
  }

  if (properties['lineHeight']) {
    style['line-height'] = properties['lineHeight']
  }

  if (properties['height']) {
    style['height'] = properties['height'] + 'px'
  }

  return style
}
