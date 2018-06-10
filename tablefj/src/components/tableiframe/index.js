import Tableiframe from './tableiframe.vue'
Tableiframe.install = function (Vue, options = {}) {
  var prefix = options.prefix || 'h'
  Vue.component(prefix + Tableiframe.name, Tableiframe)
}
export default Tableiframe

/*
<h-tableiframe ref="cwzb"  id="cwzb-iframe"
 :topFixed="false"
 :bbmc="tableConfig.bbmc"
 :queryCondition="tableConfig.tableQueryCondition"
 :cellCallback="tableConfig.cellCallback"
 class="zyyszb-box-cwzb-table"
 titleClass="zyyszb-box-item-title"
 ></h-tableiframe>
 */
