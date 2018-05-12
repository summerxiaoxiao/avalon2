import { PROPERTY_GROUP_TYPES } from '../api/constant'

export function getFirstFieldProperty (fieldProperties) {
  const roles = Object.keys(fieldProperties)
  if (!roles.length) {
    return
  }
  const role = roles[0]
  if (!fieldProperties[role] || !fieldProperties[role].length) {
    return
  }
  const property = fieldProperties[role][0]
  if (property.groupType === PROPERTY_GROUP_TYPES.LEVEL || property.groupType === PROPERTY_GROUP_TYPES.GROUP) {
    return property.children ? property.children[0] : null
  }
  return property
}
