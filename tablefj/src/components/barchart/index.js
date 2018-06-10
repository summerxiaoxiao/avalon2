import Barchart from './barchart.vue'
Barchart.install = function (Vue, options = {}) {
  var prefix = options.prefix || 'h'
  Vue.component(prefix + Barchart.name, Barchart)
}
export default Barchart

/*

 */
