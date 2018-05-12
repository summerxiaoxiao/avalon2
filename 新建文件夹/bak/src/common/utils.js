export function toBoolean (value) {
  if (typeof value === 'string') {
    return value !== '0' && value !== ''
  } else {
    return !!value
  }
}

export function isNumeric (obj) {
  return !Array.isArray(obj) && obj - parseFloat(obj) >= 0
}

export function clampValue (value, min, max) {
  value = Math.min(value, max)
  value = Math.max(value, min)
  return value
}
