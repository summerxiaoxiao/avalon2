import Treetable from './treetable.vue'
Treetable.install = function (Vue, options = {}) {
  var prefix = options.prefix || 'h'
  Vue.component(prefix + Treetable.name, Treetable)
}
export default Treetable
