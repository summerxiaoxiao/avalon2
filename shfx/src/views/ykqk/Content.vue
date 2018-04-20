<template>
     <div class="h-box-column ykqk-content-box" v-if="isBarFinish">
       <div class="ykqk-content-box__data-title">
         <span>项目用款情况查询</span>
         <span class="exportBtn" @click.stop="exportData">导出</span>
       </div>
       <div class="h-flex2 ykqk-table-box" ref="mytable">
         <div class="ykqk-table-box__data-title">
           <span>项目大类预算执行</span>
           <span class="ykqk-table-box__data-jldw">单位：元</span>
         </div>
         <!--<div class="ykqk-table-box__table" id="content-table" ref="content_table">-->
         <!--</div>-->
         <h-ztables class="ykqk-table-box__table" v-if="isFinish"
                    ref="xmdlTable"
                    :bbmc="ztableConfig.bbmc"
                    :bbmc2="ztableConfig.bbmc2"
                    :queryParams="ztableConfig.queryParams"
                    :queryParams2="ztableConfig.queryParams2"
                    :onClick="ztableConfig.onClick"
                    :cellCallback="ztableConfig.cellCallback"
                    :unionKeys="ztableConfig.unionKeys"></h-ztables>
       </div>
       <div class="h-flex2 ykqk-chart-box">
         <div class="h-flex2 ykqk-chart-box__data-container">
           <div class="ykqk-chart-box__data-header">
             <div class="ykqk-chart-box__data-title">
             <span>项目大类申请类型分析</span>
             </div>
             <div class="ykqk-chart-box__data-jldw">
               单位：元
             </div>
             <div class="selector">
               项目大类：
               <select class="ykqk-chart-box__data-select" name="xmdl"  @change="onChange($event)" v-model="selectXmdl">
                 <option v-for="item in xmdllist" :value="item.xmid">{{item.name}}</option>
               </select>
             </div>
           </div>
           <div class="h-flex2 ykqk-chart-box__chart-area" ref="chartArea">
             <div class="ykqk-chart-box__chart-model" ref="chart"
                  :style="{'padding-right': chartPadding + 'px'}"></div>
           </div>
         </div>
       </div>
     </div>
</template>
<script>
  import '@/assets/scss/modules/_ykqk.scss'
  import $ from 'jquery'
  import Vuex from 'vuex'
  import bbconst from '@/config/constant'
  // import bbutils from '@/utils/bbutils'
  import hZtables from '@/components/common/zTables.vue'

  export default {
    name: 'ykqk-app-content',
    components: {
      hZtables
    },
    props: {
      _time: Number | String
    },
    data () {
      let _self = this
      return {
        chart: null,
        chartOption: {},
        isFinish: false,
        bbItem: {},
        chartHeight: 310,
        chartWidth: 0,
        lengendData: ['物资申请计划数', '工程申请计划数', '本月总完成率'],
        ztableConfig: {
          bbmc: bbconst.bbmc_xmdl,
          bbmc2: bbconst.bbmc_xmdl02,
          queryParams: {}, // this.tableQueryCondition_xmdl,
          queryParams2: {}, // this.tableQueryCondition_xmdl02,
          unionKeys: ['project_class_id', 'organ_id'],
          onClick: function (colData) {
            if (colData['headerName'] === '项目大类名称') {
              _self.$emit('on-detail', colData.rowData[colData.field])
            }
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
        'isBarFinish': state => state.ykqk.isBarFinish,
        'xmdllist': state => state.ykqk.xmdllist,
        'chartMap': state => state.ykqk.chartMap,
        'selectXmdl': state => state.ykqk.selectXmdl,
        'chartPadding': state => state.ykqk.chartPadding,
        'tableQueryCondition': state => state.ykqk.tableQueryCondition,
        'tableQueryCondition_xmdl': state => state.ykqk.tableQueryCondition_xmdl,
        'tableQueryCondition_xmdl02': state => state.ykqk.tableQueryCondition_xmdl02,
        'tableQueryConditionLxfx': state => state.ykqk.tableQueryCondition_lxfx
      })
    },
    mounted () {
      this.$nextTick(function () {
        $(document.body).css('overflow', 'auto')
        $(document.body).data('overflow', 'auto')
        this.reloadChart()
        this.isFinish = true
        this.$set(this.ztableConfig, 'queryParams', this.tableQueryCondition_xmdl)
        this.$set(this.ztableConfig, 'queryParams2', this.tableQueryCondition_xmdl02)
      })
    },
    methods: {
      reload () {
        this.$set(this.ztableConfig, 'queryParams', this.tableQueryCondition_xmdl)
        this.$set(this.ztableConfig, 'queryParams2', this.tableQueryCondition_xmdl02)
        this.$refs.xmdlTable.reload(this.ztableConfig)
        this.reloadChart()
      },
      exportData () {
        this.$refs.xmdlTable.downloadLocal('项目大类预算执行')
      },
      reloadChart () {
        let _self = this
        _self.$store.dispatch('ykqk/loadXmdlSelect', {
          bbmc: bbconst.bbmc_xmdllxselect,
          params: _self.tableQueryCondition
        }).then(() => {
          _self.loadChartData()
        })
      },
      loadChartData () {
        let _self = this
        _self.$store.dispatch('ykqk/loadContentChart', {
          bbmc: bbconst.bbmc_xmlxfx,
          params: _self.tableQueryConditionLxfx // 单位ID，日期，项目大类ID，
        }).then(() => {
          _self.isFinish = true
          _self.renderChart(_self.lengendData, _self.chartMap.categorys, _self.chartMap.yData, _self.chartMap.y2Data, _self.chartMap.lineData)
        })
      },
      renderChart (lengendData, xData, yData, y2Data, y3Data) {
        let $dom = $(this.$refs.chart)
        this.chart && this.chart.dispose()
        let chart = this.$echarts.init($dom[0])
        this.chart = chart
        let option = {
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              var res = []
              res.push(params[0].name + '<br/>')
              for (var i = 0; i < params.length; i++) {
                var item = params[i]
                res.push(item.marker + item.seriesName + ': ' + item.value)
                res.push(item.seriesName.indexOf('完成率') > -1 ? '%' : '')
                res.push('<br/>')
              }
              return res.join('')
            },
            position: function (p) {   //  其中p为当前鼠标的位置, p[0]左右，p[1]上下
              return [p[0] - 120, p[1] - 120]
            }
          },
          legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'bottom',
            data: lengendData
          },
          grid: {
            top: '40%',
            left: '1%',
            right: '0%',
            bottom: '11%',
            containLabel: true
          },
          toolbox: {
            show: true,
            x: 'right',
            y: '-2',
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
              // name: '单位(元)',
              // nameGap: 10,
              min: 0,
              max: 100000000,
              // splitNumber: 4,
              interval: 25000000, //  刻度
              axisLabel: {
                formatter: '{value} '
              }
            },
            {
              type: 'value',
//              name: '完成率',
              min: 0,
              max: 100,
              // splitNumber: 4,
              interval: 25, //  刻度
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [
            {
              name: lengendData[0], // '物资计划申请数',
              type: 'bar',
              barWidth: '20',
              // barMinHeight: 10,
              color: ['#4cc9e4'],
              data: yData
            },
            {
              name: lengendData[1], //  '工程计划申请数',
              type: 'bar',
              barWidth: '20',
              // barMinHeight: 10,
              color: ['#5ac876'],
              data: y2Data
            },
            {
              name: lengendData[2], //  '本月总完成率',
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
        this.$store.commit('ykqk/setSelectXmdl', v)
        this.$store.commit('ykqk/setTableQueryCondition_lxfx')
        this.loadChartData()
      }
    }
  }
</script>
