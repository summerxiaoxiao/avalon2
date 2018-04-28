<template>
  <div  class="h-content-main">
  <div class="h-box-row h-content-box">
    <div  class="zyyszb-box-left">
      <jyzb title="经营考核指标"></jyzb>
    </div>
    <div  class="zyyszb-box-right">
      <div  class="h-box-column zyyszb-box-cwzb">
        <h-iframe-table ref="cwzb" title="财务指标" id="cwzb-iframe"
                        :bbmc="bbmc"
                        :queryCondition="tableQueryCondition"
                        class="zyyszb-box-cwzb-table"
                        titleClass="zyyszb-box-item-title"
        ></h-iframe-table>
      </div>
    <div class="h-box-column zyyszb-box-kkfy">
      <fgs-zb></fgs-zb>
    </div>
    </div>
  </div>
  </div>
</template>
<script>
  import '@/assets/scss/modules/zyyszb01.scss'
  import bbconst from '@/config/constant'
  import Vuex from 'vuex'
  import Jyzb from '../zbkb/zyyszb01/Jyzb.vue'
  import FgsZb from '../zbkb/zyyszb01/fgs.vue'
  import QtFgsZb from '../zbkb/zyyszb01/qtfgs.vue'
  import HIframeTable from '@/components/common/Iframetable.vue'
  export default {
    name: 'test-app-content',
    components: {
      Jyzb,
      HIframeTable,
      FgsZb,
      QtFgsZb
    },
    data () {
      return {
        bbmc: bbconst.bgmc_xmdl,
        tableQueryCondition: {
          tjqj: '201612'
        },
        isFinish: false,
        showFgs: true,
        currentView: 'fgs-zb',
        chartSeries: {}
      }
    },
    computed: {
      ...Vuex.mapState({
        'dwdm': state => state.ykqk.dwdm,
        'date': state => state.ykqk.date,
        'dwlist': state => state.ykqk.dwlist,
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
<style scoped="">
  .zyyszb-main-right{
    border:1px solid red;
  }
  .zyyszb-cwzb{
    height: 20%;
  }
  .zyyszb-cwzb-flex {
    margin-top: 15px;
    background:#1c3147;
  }
</style>
