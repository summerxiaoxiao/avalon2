import Treetable from './treetable'
import Tablechart from './tablechart'
import Ybpchart from './ybpchart'
const componentPrefix = 'h'

const components = {
  Treetable, // 树型表格
  Tablechart,
  Ybpchart
}
const install = function (Vue, options = {}) {
  var prefix = options.prefix || componentPrefix
  Object.keys(components).forEach(key => {
    Vue.component(prefix + key, components[key])
  })
}
// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
let componentArray = {}

Object.keys(components).forEach(key => {
  componentArray[componentPrefix + key] = components[key]
})
export default {
  install,
  ...componentArray
}
