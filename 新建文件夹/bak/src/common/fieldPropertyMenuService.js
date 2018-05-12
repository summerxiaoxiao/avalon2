import _ from 'underscore'
import { VISUAL_TYPES, BUCKET_ROLES, PROPERTY_TYPES, QUERY_TYPE, PROPERTY_GROUP_TYPES } from '../api/constant'
export function makeMenuActions (visualType, property, parentProperty, callback, currentValue, queryType) {
  const {role, type: propertyType} = property
  const groupType = parentProperty ? parentProperty.groupType : property.groupType
  const options = (function () {
    if (groupType === PROPERTY_GROUP_TYPES.LEVEL && !parentProperty) {
      return {
        'xszt': {
          name: 'xszt',
          priority: 100,
          items: [
            [0, '隐藏', Boolean]
          ]
        }
      }
    }

    const options = {
      'pxlx': {
        name: 'pxlx',
        priority: 10,
        items: [
          [1, '升序'],
          [2, '降序']
        ]
      }
    }

    if (role === BUCKET_ROLES.ROW || role === BUCKET_ROLES.COLUMN) {
      if (propertyType === PROPERTY_TYPES.DATE) {
        options['rqlx'] = {
          name: 'rqlx',
          priority: 30,
          items: [
            [1, '年'],
            // [2, '月'],
            // [3, '日'],
            [4, '年月'],
            [5, '年月日']
          ]
        }
      }
      if (role === BUCKET_ROLES.ROW) {
        options['xszt'] = {
          name: 'xszt',
          priority: 40,
          items: [
            [0, '隐藏', Boolean]
          ]
        }
      }
    }

    if (role === BUCKET_ROLES.VALUE) {
      switch (propertyType) {
        case PROPERTY_TYPES.NUMBER:
          options['jh'] = {
            name: 'jh',
            priority: 20,
            items: [
              visualType === VISUAL_TYPES.TABLE ? [0, '无'] : null,
              [1, '求和'],
              [2, '最小值'],
              [3, '最大值'],
              [4, '平均值'],
              // [5, '第一条'],
              // [6, '最后一条'],
              [20, '计数'],
              [21, '去重计数']
            ]
          }
          options['xszt'] = {
            name: 'xszt',
            priority: 40,
            items: [
              [0, '隐藏', Boolean]
            ]
          }
          break
        case PROPERTY_TYPES.DATE:
          options['jh'] = {
            name: 'jh',
            priority: 20,
            items: [
              visualType === VISUAL_TYPES.TABLE ? [0, '无'] : null,
              [20, '计数'],
              [21, '去重计数']
            ]
          }
          if (visualType === VISUAL_TYPES.TABLE) {
            options['rqlx'] = {
              name: 'rqlx',
              priority: 30,
              items: [
                [1, '年'],
                // [2, '月'],
                // [3, '日'],
                [4, '年月'],
                [5, '年月日']
              ]
            }
          }
          break
        default:
          options['jh'] = {
            name: 'jh',
            priority: 20,
            items: [
              visualType === VISUAL_TYPES.TABLE ? [0, '无'] : null,
              [20, '计数'],
              [21, '去重计数']
            ]
          }
          options['xszt'] = {
            name: 'xszt',
            priority: 40,
            items: [
              [0, '隐藏', Boolean]
            ]
          }
          break
      }
    }
    return options
  })()

  if (queryType !== QUERY_TYPE.JH) {
    delete options['jh']
  }

  if (groupType === PROPERTY_GROUP_TYPES.LEVEL && parentProperty || (visualType !== VISUAL_TYPES.TABLE && visualType !== VISUAL_TYPES.MATRIX)) {
    delete options['xszt']
  }

  if (visualType === VISUAL_TYPES.MATRIX && role !== BUCKET_ROLES.ROW) {
    delete options['xszt']
  }

  const actions = []
  _.values(options).sort((a, b) => {
    return a.priority - b.priority
  }).forEach(option => {
    if (!Array.isArray(option.items)) {
      return
    }

    const action = option.action ? option.action : option.name
    const items = []

    option.items.forEach(item => {
      if (!item) {
        return
      }
      const [value, name, type] = item
      const selected = value === currentValue[action]
      items.push({
        name,
        props: {
          selected
        },
        on: {
          click () {
            let v = value
            if (type === Boolean) {
              v = value ? 1 : 0
              if (selected) {
                v = v ? 0 : 1
              }
            }
            callback(action, v)
          }
        }
      })
    })

    actions.push({
      action: action,
      name: options.name,
      items
    })
  })
  return actions
}
