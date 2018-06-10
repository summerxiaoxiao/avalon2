import Ybpchart2 from './ybpchart2.vue'
Ybpchart2.install = function (Vue, options = {}) {
  var prefix = options.prefix || 'h'
  Vue.component(prefix + Ybpchart2.name, Ybpchart2)
}
export default Ybpchart2

/**
 *  <h-ybpchart2 :data="config.outerData" style="height:100%;width:100%;"></h-ybpchart2>
 */
