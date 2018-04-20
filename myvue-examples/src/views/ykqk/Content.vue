<template>
  <div class="content-main">
    <div class="container-fluid">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg col-md col-xs">
              <span class="data-title">项目用款情况查询</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg col-md col-xs">
              <div class="data-table-title">
                <span>项目大类预算执行</span>
                <span class="jldw">单位：元</span>
              </div>
              <div class="table-area" id="content-table">
                <iframe id="content-iframe" src=""></iframe>
              </div>
            </div>
          </div>
        </div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg col-md col-xs">
            <div class="data-chart-container">
            <div class="data-chart-header">
              <div class="data-chart-title">项目大类申请类型分析</div>
              <div class="data-chart-dw">
                单位：元
              </div>
              <div class="data-chart-select selector">
                项目大类：
                <select name="xmdl" @change="onChange($event)" v-model="selectXmdl">
                  <option v-for="item in xmdllist" :value="item.xmbm">{{item.name}}</option>
                </select>
              </div>
            </div>
            <div class="chart-area" ref="chartArea">
              <div class="chart-model" ref="chart"
                   :style="{height: getChartHeight + 'px', width: getChartWidth + 'px',
                   'padding-right': chartPadding + 'px'}"></div>
            </div>
            </div>
          </div>

      </div>
    </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Vuex from 'vuex'
  import bbutils from '@/utils/bbutils'
  import bgmc from '@/config/constant'
  import Hdate from '@/components/common/Hdate.vue'
  export default {
    name: 'ykqk-app-content',
    components: {
      Hdate
    },
    props: {
      _time: Number | String
    },
    data () {
      return {
        chart: null,
        chartOption: {},
        isFinish: false,
        bbItem: {},
        chartHeight: 310,
        chartWidth: 0
      }
    },
    computed: {
      ...Vuex.mapState({
        'xmdllist': state => state.ykqk.xmdllist,
        'chartMap': state => state.ykqk.chartMap,
        'dwdm': state => state.ykqk.dwdm,
        'date': state => state.ykqk.date,
        'dwlist': state => state.ykqk.dwlist,
        'selectXmdl': state => state.ykqk.selectXmdl,
        'chartPadding': state => state.ykqk.chartPadding
      }),
      getChartHeight () {
        var hh = $('.data-chart-container').height() - 10
        return hh < 300 ? 310 : hh
      },
      getChartWidth () {
        var ww = $('.data-chart-container').width() - 10
        return ww <= 50 ? '100%' : ww
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.loadTable()
        this.loadChart()
      })
    },
    methods: {
      reload () {
        this.reloadTable()
        this.reloadChart()
      },
      reloadTable () {
        bbutils.refreshIframe(this.bbCondition)
      },
      reloadChart () {
        this.$store.dispatch('ykqk/loadContent').then(() => {
          this.isFinish = true
          var yData = [473.0, 414.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          var y2Data = [243.6, 225.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          var y3Data = [45.6, 25.9, 19.0, 26.4, 28.7, 70.7, 75.6, 82.2, 48.7, 18.8, 6.0, 2.3]
          this.chartOption.series[0].data = yData
          this.chartOption.series[1].data = y2Data
          this.chartOption.series[2].data = y3Data
          this.chart.setOption(this.chartOption)
        })
      },
      loadTable () {
        let vm = this
        return this.$store.dispatch('ykqk/loadBar').then(() => {
          bbutils.loadBBItemByBbmc(bgmc.bgmc_xmdl).then((bbItem) => {
            this.bbItem = bbItem
            this.tableDom = document.querySelector('#content-iframe')
            this.bbCondition = {
              tableCondition: bbutils.transferCondition({
                qureyType: bbItem['bglx'],
                tbid: bbItem['tbid'],
                tjqj: '201612'
              }),
              iframeAddr: bbItem['serverip'],
              iframeContainer: this.tableDom,
              id: 'receiver'
            }
            bbutils.buildIframe(this.bbCondition)
            window.onmessage = function (event) {
              if (event.origin === vm.bbItem.serverip) {
                var colItem = JSON.parse(event.data)
                if (colItem['headerName'] === '资产分类名称') {
                  vm.$emit('on-detail', colItem.rowData.zcfl)
                }
              }
            }
          })
        })
      },
      loadChart () {
        this.$store.dispatch('ykqk/loadContent').then(() => {
          this.isFinish = true
          var lengendData = ['物资计划申请数', '工程计划申请数', '本月总完成率']
          var xData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          var yData = [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          var y2Data = [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          var y3Data = [12.6, 25.9, 9.0, 26.4, 28.7, 70.7, 75.6, 82.2, 48.7, 18.8, 6.0, 2.3]
          this.renderChart(lengendData, xData, yData, y2Data, y3Data)
        })
      },
      renderChart (lengendData, xData, yData, y2Data, y3Data) {
        let $dom = $(this.$refs.chart)
        console.log($dom)
        console.log($dom.height())
        let chart = this.$echarts.init($dom[0])
        this.chart = chart
        let option = {
          tooltip: {
            trigger: 'axis',
            position: function (p) {   //  其中p为当前鼠标的位置, p[0]左右，p[1]上下
              return [p[0] - 60, p[1] - 120]
            }
          },
          legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'bottom',
            data: lengendData
          },
          grid: {
            top: '35%',
            left: '1%',
            right: '0%',
            bottom: '11%',
            containLabel: true
          },
          toolbox: {
            show: true,
            x: 'right',
            y: '10',
            feature: {
              dataView: {show: false, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: false}
            }
          },
          xAxis: [
            {
              type: 'category',
              data: xData,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
//              name: '申请数',
              min: 0,
              max: 500,
//              interval: 100, //  刻度
              splitNumber: 4,
              axisLabel: {
                formatter: '{value} '
              }
            },
            {
              type: 'value',
//              name: '完成率',
              min: 0,
              max: 500,
              splitNumber: 4,
//              interval: 20, //  刻度
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [
            {
              name: '物资计划申请数',
              type: 'bar',
              barWidth: '20',
              color: ['#4cc9e4'],
              data: yData
            },
            {
              name: '工程计划申请数',
              type: 'bar',
              barWidth: '20',
              color: ['#5ac876'],
              data: y2Data
            },
            {
              name: '本月总完成率',
              type: 'line',
              yAxisIndex: 1,
              color: ['#c74542'],
//              symbol: 'star', // 拐点样式
              symbolSize: 8, // 拐点大小
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 1,
                    color: '#c74542'
                  }
                }
              },
              data: y3Data
            }
          ]
        }
        this.chartOption = option
        this.chart.setOption(option)
        var vm = this
        window.onresize = function () {
          vm.$store.commit('ykqk/setChartPadding')
          chart.resize()
        }
      },
      onChange (event) {
        var v = $(event.target).find('option:selected').val()
        console.log(v)
        this.$store.commit('ykqk/setSelectXmdl', v)
        this.chartOption.series[0].data = [12.0, 14.9, 77.0, 523.2, 25.6, 476.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        this.chart && this.chart.setOption(this.chartOption)
      }
    }
  }
</script>
