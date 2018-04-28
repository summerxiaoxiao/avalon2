import Ybpchart from './ybpchart.vue'
Ybpchart.install = function (Vue, options = {}) {
  var prefix = options.prefix || 'h'
  Vue.component(prefix + Ybpchart.name, Ybpchart)
}
export default Ybpchart

/**
 * <h-ybpchart value="20" targetValue="50"> </h-ybpchart>
 */
