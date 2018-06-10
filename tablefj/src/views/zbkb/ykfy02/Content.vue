<template>
  <div class="h-content-box h-ykfy02" >
    <div class="d-flex flex-column h-box-auto">
    <div class="d-flex flex-row h-flex0-auto" style="height: 40%;">
      <div class="flex-column h-flex-auto h-flex1 h-ykfy-top__left" style="height: 100%;max-width: 50%;">
        <h-chart-pie title="十四项严控指标分析(万元)" v-if="isFinish"
                     :styleMap="config.mstyle"
                     :chartSeries="config.chartSeries"
                     :chartData="chartData"
                     :legendData="legendData"
                     :mainData="config.mainData" ></h-chart-pie>
      </div>
      <div class="flex-column h-flex-auto h-flex1 h-ykfy-top__right" style="height: 100%;max-width: 50%;">
        <h-barchart title="十四项严控费用合计趋势分析"
                    :lengendPadding="config.lengendPadding"
                    :styleMap="config.mstyle"
                    :lengendColor="config.lengendColor"
                    :categoryNames="config.categoryNames"
                    :data="config.barData"></h-barchart>
      </div>
    </div>
    <div class="flex-column h-flex0-auto h-ykfy-table" style="height: 60%;">
      <div class="d-flex flex-column h-flex0-auto h-ykfy-tablebox">
        <div class="flex-column h-ykfy__title">公务用车使用费</div>
        <h-tableiframe ref="cwzb"  id="cwzb-iframe"
                       :topFixed="false"
                       :bbmc="tableConfig.bbmc"
                       :queryCondition="tableConfig.tableQueryCondition"
                       :cellCallback="tableConfig.cellCallback"
                       class="zyyszb-box-cwzb-table"
                       titleClass="zyyszb-box-item-title"
        ></h-tableiframe>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
  import Vuex from 'vuex'
  import '@/assets/scss/modules/ykfy02.scss'
  import bbconst from '@/config/constant'
  import HChartBar from '@/views/common/MainChartBar'
  import HChartPie from '@/views/common/ChartPie02'
  let myconfig = {
    mstyle: {
      fontSize: 12,
      color: '#88a1b3',
      titleClass: 'h-ykfy__title'
    },
    lengendColor: {
      '十四项严控费用合计': '#fe797d',
      '累计同比': '#51b08b'
    },
    lengendPadding: [15, 55, 0, 0],
    categoryNames: ['2016年10月', '2016年11月', '2016年12月',
      '2017年01月', '2017年02月', '2017年03月'],
    barData: {
      '十四项严控费用合计': {
        type: 'bar',
        data: [1320, 1132, 6500, 2300, 1400, 5020]
      },
      '累计同比': {
        type: 'line',
        data: [110, 520, 210, 313, 424, 314]
      }
    },
    mainData: {
      'name': '总体', 'yss': 1234.25, 'hss': '2356.12', 'wcl': '20%'
    }
  }
  export default {
    name: 'ykqy02-content-app',
    components: {
      HChartBar,
      HChartPie
    },
    computed: {
      ...Vuex.mapState({
        'date': state => state.app.dateZW,
        'chartData': state => state.zyyszb01.chartData,
        'legendData': state => state.zyyszb01.legendData
      })
    },
    data () {
      return {
        isFinish: false,
        tableConfig: {
          bbmc: bbconst.bgmc_xmdl,
          tableQueryCondition: {
            month_id: '201612'
          },
          cellCallback: function (cell, cellData, rowData, rowIndex, colIndex, colMap, $obj) {
          }
        },
        config: {
          categoryNames: [],
          barData: {},
          chartSeries: {}
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.config = myconfig
        this.load()
      })
    },
    methods: {
      load () {
        return this.$store.dispatch('zyyszb01/loadList').then(() => {
          this.isFinish = true
          this.config.chartSeries = {
            type: 'pie',
            name: '',
            radius: ['0%', '70%'], // 内圈半径，外圈半径
            center: ['50%', '50%'], //  饼状图位置，第一个参数是左右，第二个是上下。
            label: {
              normal: {
                formatter: '{b}:{c} ({d}%)',
                position: 'inner',
                show: false
              }
            },
            data: this.chartData
          }
        })
      }
    }
  }
</script>
