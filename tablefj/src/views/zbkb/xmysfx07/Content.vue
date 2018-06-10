<template>
  <div class="h-content-box h-xmysfx07" >
    <div class="d-flex flex-column h-box-auto">
      <div class="d-flex flex-row h-flex0-auto h-xmysfx-top" style="height: 40%;">
        <div class="flex-column h-flex-auto h-flex1 h-xmysfx-top__left">
          <div class="flex-column">资本性项目核算数</div>
          <div  class="h_xmysfx-left_chart">
            <h-ybpchart2 :data="config.outerData" class="d-flex flex-column h_xmysfx_chart"
                         @on-click="activeLeft"></h-ybpchart2>
          </div>
        </div>
        <div class="flex-column h-flex-auto h-flex1 h-xmysfx-top__right" style="height: 100%;max-width: 50%;">
          <div class="flex-column h-flex-auto h-xmysfx__right_box">
            <h-chart-pie :title="config.title" v-if="isFinish"
                         :styleMap="config.mstyle"
                         :chartSeries="config.chartSeries"
                         :chartData="config.chartData"
                         :legendData="config.legendData"
                         :mainData="config.mainData"
                         :colors="config.lengendColor"
                         layout="row"
                         rowHeight="30%"
                         showLabel="true"
                         ></h-chart-pie>
          </div>
        </div>
      </div>
      <div class="flex-column h-flex0-auto h-xmysfx-table" style="height: 60%;">
        <div class="d-flex flex-column h-flex0-auto h-xmysfx-tablebox">
          <div class="flex-column h-xmysfx__title">公务用车使用费</div>
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
  import '@/assets/scss/modules/xmysfx07.scss'
  import bbconst from '@/config/constant'
  import HChartBar from '@/views/common/MainChartBar'
  import HChartPie from '@/views/common/ChartPie02'
  export default {
    name: 'ykqy02-content-app',
    components: {
      HChartBar,
      HChartPie
    },
    computed: {
      ...Vuex.mapState({
        'date': state => state.app.dateZW
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
          title: '基本建设投资',
          outerData: [
            {'name': '基本建设投资', 'value': 12345.67, 'selected': true},
            {'name': '技改', 'value': 5743.67},
            {'name': '信息化投入', 'value': 45743.3},
            {'name': '营销专业投入', 'value': 1843.56},
            {'name': '固定资产零购', 'value': 2743.56},
            {'name': '研发支出', 'value': 986.36},
            {'name': '总体', 'value': '42345.67'}
          ],
          mstyle: {
            fontSize: 12,
            color: '#88a1b3',
            titleClass: 'h-ykfy__title'
          },
          lengendColor: ['#ee8484', '#bfbfbf', '#a6a6a6'],
          legendData: ['预算', '核算', '完成率'],
          chartData: [
            {'title': '基本建设投资', 'name': '预算', 'value': 12345.67},
            {'title': '基本建设投资', 'name': '核算', 'value': 12345.67},
            {'title': '基本建设投资', 'name': '完成率', 'value': 12345.67}
          ],
          mainData: {
            'name': '基本建设投资', 'yss': 1234.23, 'hss': 5623.12, 'wcl': '30%'
          }
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.load()
      })
    },
    methods: {
      load () {
        this.isFinish = true
        this.config.chartSeries = {
          type: 'pie',
          name: '',
          radius: ['35%', '50%'], // 内圈半径，外圈半径
          center: ['50%', '50%'], //  饼状图位置，第一个参数是左右，第二个是上下。
          avoidLabelOverlap: true,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'center',
                formatter: function (params) {
                  console.log(params)
                  if (params.name === '完成率') {
                    return 100 - params.value + '%'
                  } else { return '' }
                },
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold',
                  baseline: 'top'
                }
              },
              labelLine: {
                show: false
              }
            }
          },
          data: this.config.chartData
        }
      },
      activeLeft (data) {
        this.config.title = data.name
        this.config.mainData.name = data.name
      }
    }
  }
</script>
