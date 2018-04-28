<template>
  <div class="landing-container h-container_zyyszb">
    <app-bar @on-refresh="onRefresh"></app-bar>
    <div class="h-content-main zyyszb-fxbb-container" >
      <div class="zyyszb-fxbb-box h-box-column h-flex-auto">
        <h-ztables class="zyyszb-table-box__table" v-if="isFinish"
                   ref="xmdlTable"
                   :bbmc="ztableConfig.bbmc"
                   :bbmc2="ztableConfig.bbmc2"
                   :queryParams="ztableConfig.queryParams"
                   :queryParams2="ztableConfig.queryParams2"
                   :onClick="ztableConfig.onClick"
                   :cellCallback="ztableConfig.cellCallback"
                   :unionKeys="ztableConfig.unionKeys"></h-ztables>
      </div>
    </div>
  </div>
</template>
<script>
  import '@/assets/scss/modules/zyyszb01.scss'
  import $ from 'jquery'
  import bbconst from '@/config/constant'
  import Vuex from 'vuex'
  import AppBar from '@/views/test/AppBar.vue'
  import hZtables from '@/components/common/zTables.vue'
  export default {
    name: 'test-app-content',
    components: {
      AppBar,
      hZtables
    },
    data () {
      return {
        isFinish: false,
        ztableConfig: {
          bbmc: bbconst.bgmc_xmdl,
          queryParams: {
            tjqj: '201612'
          }, // this.tableQueryCondition_xmdl,
          onClick: function (colData) {
          },
          cellCallback: function (cell, cellData, rowData, rowIndex, colIndex, colMap) {
            if (colIndex === 1) {
              $(cell).addClass('tdHover')
            }
          }
        }
      }
    },
    computed: {
      ...Vuex.mapState({
        'dwdm': state => state.ykqk.dwdm,
        'date': state => state.ykqk.date,
        'dwlist': state => state.ykqk.dwlist
      })
    },
    mounted () {
      this.$nextTick(function () {
        this.isFinish = true
      })
    },
    methods: {
      onRefresh () {
        this.$refs.xmdlTable.reload(this.ztableConfig)
      }
    }
  }
</script>
<style>
  .zyyszb-table-box__table{
    height: 100%;
  }
</style>
