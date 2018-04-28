import Tablechart from './tablechart.vue'
Tablechart.install = function (Vue, options = {}) {
  var prefix = options.prefix || 'h'
  Vue.component(prefix + Tablechart.name, Tablechart)
}
export default Tablechart
/* <h-tablechart v-if="isFinish"  class="zyyszb-kkfy-item h-flex-auto"
title="三项费用合计(万元)"
:tableRows="rows"
:chartSeries="chartSeries"
:chartData="chartData"
:legendData="legendData"
  ></h-tablechart> */
