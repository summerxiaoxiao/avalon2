<template>
  <div  class="h-content-main">
    <div class="h-content-box">
      <div  class="zyyszb-box-left">
        <jyzb title="经营考核指标"></jyzb>
      </div>
      <div  class="zyyszb-box-right">
        <div  class="zyyszb-box-cwzb h-box-column  h-flex-auto">
          <h-iframe-table ref="cwzb" title="财务指标" resizeFixed=true id="cwzb-iframe"
                          topFixed="false"
                          :bbmc="tableConfig.bbmc"
                          :queryCondition="tableConfig.tableQueryCondition"
                          :cellCallback="tableConfig.cellCallback"
                          class="zyyszb-box-cwzb-table"
                          titleClass="zyyszb-box-item-title"
          ></h-iframe-table>
         <!-- <Progress :percent="50" :status="success" :stroke-width="20 " class="h-progress">
            <span class="h-progress-text">50%</span>
          </Progress>-->
        </div>
        <component :is="currentView" ></component>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import bbconst from '@/config/constant'
  import Vuex from 'vuex'
  import Jyzb from './Jyzb.vue'
  import FgsZb from './fgs.vue'
  import QtFgsZb from './qtfgs.vue'
  import HIframeTable from '@/components/common/Iframetable.vue'
  export default {
    name: 'zyyszb01-app-content',
    components: {
      Jyzb,
      HIframeTable,
      FgsZb,
      QtFgsZb
    },
    prop: {
      dwxzName: String,
      orgId: String,
      yearmonth: String
    },
    data () {
      return {
        tableConfig: {
          bbmc: bbconst.bgmc_xmdl,
          tableQueryCondition: {
            month_id: '201612'
          },
          cellCallback: function (cell, cellData, rowData, rowIndex, colIndex, colMap, $obj) {
            if (colIndex === 1) {
              $(cell).css('color', 'red')
            }
          }
        },
        isFinish: false,
        showFgs: true,
        currentView: 'fgs-zb',
        chartSeries: {}
      }
    },
    computed: {
      ...Vuex.mapState({
        'dwdm': state => state.app.dwdm,
        'date': state => state.app.date,
        'dwlist': state => state.app.dwlist,
        'tableRows1': state => state.zyyszb01.tableList,
        'chartData': state => state.zyyszb01.chartData,
        'legendData': state => state.zyyszb01.legendData
      })
    },
    mounted () {
    },
    methods: {
      reload () {
        this.showFgs = !this.showFgs
        this.$refs.cwzb.reload()
        if (this.showFgs) {
          this.currentView = 'fgs-zb'
          this.$refs.fgs.reload()
        } else {
          this.currentView = 'qt-fgs-zb'
          this.$refs.qtfgs.reload()
        }
      }
    }
  }
</script>
