import _ from 'underscore'

export const defaultColor = '#000000'
export const defaultBackground = '#ffffff'
export const defaultFont = '宋体, SimSun'
export const defaultSize = 12

const baseThemeColor = [
  '#ffffff',
  '#000000',
  '#e7e6e6',
  '#455469',
  '#5e9cd3',
  '#eb7d3c',
  '#a5a5a5',
  '#fdbf2d',
  '#4674c1',
  '#72ac4d'
]

const fontKeyMap = {
  'simsun': '宋体',
  'yahei': '微软雅黑',
  'simkai': '楷体',
  'simhei': '黑体',
  'simli': '隶书'
}
const baseFonts = {
  'simsun': '宋体, SimSun',
  'yahei': '微软雅黑, "Microsoft YaHei"',
  'simkai': '楷体, 楷体_GB2312, SimKai',
  'simhei': '黑体, SimHei',
  'simli': '隶书, SimLi',
  'Andale Mono': '"andale mono"',
  'Arial': 'arial, helvetica, sans-serif',
  'Arial Black': '"arial black", "avant garde"',
  'Comic Sans Ms': '"comic sans ms"',
  'Impact': 'impact, chicago',
  'Times New Roman': '"times new roman"'
}

const LightnessBlackFactors = [0.6, 0.4, 0.2, 0.1, 0]
const LightnessWhiteFactors = [-0.1, -0.2, -0.3, -0.5, -0.6]
const SaturationFactors = [0.6, 0.4, 0.2, -0.25, -0.5]

function getShadePctSequence (color) {
  if (isWhiteHexColor(color)) {
    return LightnessWhiteFactors
  }
  if (isBlackHexColor(color)) {
    return LightnessBlackFactors
  }
  return SaturationFactors
}

function isWhiteHexColor (color) {
  color = color.toUpperCase()
  return color === '#FFFFFF' || color === '#FFF'
}

function isBlackHexColor (color) {
  color = color.toUpperCase()
  return color === '#000000' || color === '#000'
}

function shadeColor (color, percent) {
  const hexNum = parseInt(color.slice(1), 16)
  const t = percent < 0 ? 0 : 255
  const p = percent < 0 ? percent * -1 : percent
  const R = hexNum >> 16
  const G = hexNum >> 8 & 0x00FF
  const B = hexNum & 0x0000FF
  return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1)
}

export const fontOptions = []
export const themes = []

const recentColors = []

export function addRecentColors (color) {
  if (recentColors.indexOf(color) === -1) {
    recentColors.unshift(color)
    recentColors.length = 10
  }
  return recentColors.slice()
}

export function getRecentColors () {
  return recentColors.slice()
}

baseThemeColor.forEach((color, i) => {
  const shadeSequence = getShadePctSequence(color)
  const shadeLength = shadeSequence.length

  const theme = themes[i] = {
    parentColor: color,
    children: new Array(shadeLength)
  }

  for (let j = 0; j < shadeLength; j++) {
    theme.children[j] = shadeColor(color, shadeSequence[j])
  }
})

Object.keys(baseFonts).forEach(key => {
  fontOptions.push({
    value: _.escape(baseFonts[key]),
    displayName: fontKeyMap[key] || key
  })
})
