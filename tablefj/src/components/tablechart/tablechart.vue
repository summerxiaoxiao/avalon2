<template>
  <div class="h-tablechart h-box-column" :style="{height: height}">
    <div class="h-tablechart-item-title" v-if="title">{{title}}</div>
    <div class="row">
      <div class="col-md-7">
        <div class="h-tablechart-item-table" >
          <h-treetable caption=""
                       :highlightIndex="highlightIndex"
                       :columns="tableColumns"
                       :rows="tableRows"
                       @tr-mouseover="handleMouseover"
                       display="none" borderbottom></h-treetable>
        </div>
      </div>
      <div class="col-md-5">
        <e-chart :options="options" v-if="isFinish" ref="echart"></e-chart>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import _ from 'lodash'
  import EChart from '../common/EChart.vue'
  const headerStyle = {
    'font-size': '16px',
    'font-weight': 400,
    'color': '#7ca5d0'
  }
  const columnStyle = {
    'color': '#b7cade',
    'font-size': '16px',
    'font-weight': 600,
    'white-space': 'nowrap',
    'overflow': 'hidden',
    'text-overflow': 'ellipsis',
    'text-align': 'center'
  }
  const grayColor = '#c3c1c1'
  //  #region table1 数据
  const getColumns = function (parentVm) {
    return [
      {
        key: 'id',
        label: 'id'
      },
      {
        key: 'parentId',
        label: 'pid'
      },
      {
        key: 'name',
        label: '',
        width: '30%',
        align: 'left',
        columnStyle: columnStyle,
        headerStyle: headerStyle,
        renderType: 'render',
        render: (h, params) => {
          const i = {
            render (h) {
              return h(
                'i',
                {
                  class: {
                    'h-treetable-circle': true
                  },
                  style: {
                    backgroundColor: parentVm.mcolors[params.index] || '#000'
                  },
                  on: {
                    click: () => {
                      if (parentVm.mcolors[params.index] && parentVm.mcolors[params.index] === grayColor) {
                        // 还原
                        Vue.set(parentVm.mcolors, params.index, parentVm.allColors[params.index])
                        Vue.set(parentVm.currentRow, 'name', params.row.name)
                      } else {
                        // 去除
                        Vue.set(parentVm.mcolors, params.index, '#c3c1c1')
                        Vue.set(parentVm.currentRow, 'name', params.row.name)
                      }
                    }
                  }
                }
              )
            }
          }
          return h('span', [h(i), params.row.name])
        }
      },
      {
        key: 'code',
        label: '预算',
        align: 'center',
        columnStyle: columnStyle,
        headerStyle: headerStyle,
        width: '20%'
      },
      {
        key: 'status',
        label: '核算',
        align: 'center',
        columnStyle: columnStyle,
        headerStyle: headerStyle,
        width: '20%'
      },
      {
        key: 'remark',
        label: '完成率',
        align: 'center',
        columnStyle: columnStyle,
        headerStyle: headerStyle,
        width: '30%'
      }
    ]
  }
  export default {
    name: 'Tablechart',
    components: {
      EChart
    },
    props: {
      title: String,
      height: String,
      level: [Number, String],
      colors: {
        type: Array,
        default: function () {
          let defaultColors = [
            '#f75559', '#fd6e41', '#f2954a',
            '#ffbb04', '#ffdd23', '#f7e385',
            '#d3f785', '#98e163', '#63e169',
            '#66e48f', '#5cdcc5', '#58c6e1',
            '#58b2e1', '#5b91e2', '#5b6ee2',
            '#9285f7', '#9566f4', '#d168f0',
            '#f553b6', '#9a9a9a']
          // me.colors1=['#f75559','#f2954a','#ffdd23','#d3f785','#63e169','#5cdcc5','#58b2e1','#5b6ee2','#9566f4','#f553b6'];
          return defaultColors
        }
      },
      tableColumns: {
        type: Array,
        default: function () {
          return getColumns(this)
        }
      },
      tableRows: Array,
      legendData: Array,
      legendFn: Function,
      seriesDataFn: Function,
      chartSeries: {
        type: [Object, Array],
        default: function () {
          return null
        }
      }
    },
    data () {
      return {
        highlightIndex: -1,
        isFinish: false,
        allColors: this.colors,
        currentRow: {},
        mcolors: JSON.parse(JSON.stringify(this.colors))
      }
    },
    computed: {
      legendDatas () {
        var data = this.legendData
        if (this.legendFn && this.tableRows) {
          data = []
          data = this.tableRows.map(row => {
            return this.legendFn(row)
          })
        }
        return data
      },
      options () {
        var option = {
          color: this.colors,
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            show: false,
            data: this.legendDatas,
            orient: 'vertical',
            left: 'right'
          },
          grid: {
            top: '0%',
            bottom: '0%',
            left: '40%',
            containLabel: true
          },
          series: this.seriesData
        }
        console.log('....chart', JSON.stringify(option))
        return option
      },
      seriesData () {
        let series1 = _.cloneDeep(this.chartSeries[0])
        let series2 = _.cloneDeep(this.chartSeries[1])
        let seriesData = []
        this.tableRows.map((row) => {
          var temp1 = this.seriesDataFn(row)
          if (row.parentId && !(_.isEmpty(row.parentId)) && this.level === '2') {
            this.isH = true
            series2 && series2.data.push(temp1)
          } else {
            series1 && series1.data.push(temp1)
          }
        })
        if (this.isH && series2) {
          // series1.radius = ['0', '50%']
          // series2.radius = ['58%', '70%']
          seriesData.push(series1)
          seriesData.push(series2)
        } else {
          // series1.radius = '70%'
          seriesData.push(series1)
        }
        return seriesData
      },
      series () {
        return {
          type: 'pie',
          name: '',
          radius: ['0%', '100%'],
          label: {
            normal: {
              formatter: '{b}:{c} ({d}%)',
              position: 'inner',
              show: false
            }
          },
          data: []
        }
      }
    },
    watch: {
      mcolors () {
        this.$refs.echart.echart.dispatchAction({
          type: 'legendToggleSelect',
          name: this.currentRow.name // 图例名称
        })
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.isFinish = true
      })
    },
    methods: {
      handleMouseover (row, index) {
        // this.highlightIndex = index
        // console.log('..', index)
      }
    }
  }
</script>
<style>
  .h-tablechart {
    height: 50%;
    width: 100%;
    min-height: 400px;
    /*padding: 15px;*/
    /*border: 1px solid #406683;*/
    /*margin-top: 15px;*/
    /*background: #1c3147;*/
    /*border: 1px solid #406683;*/
  }
  .h-tablechart .chart>div{
    margin: 0 auto!important;
  }
  .h-tablechart .h-tablechart-item-title{
    color:#fff;
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 15px;
  }
  .h-tablechart .h-tablechart-item{
    height: 100%;
    width: 100%;
  }

  .h-tablechart .h-tablechart-item .h-tablechart-item-chart {
    height: 100%;
    width: 20%;

  }
  .h-tablechart .h-tablechart-item .h-tablechart-item-table {
    height: calc(100% - 2em);
  }

  .h-tablechart .h-tablechart-item::-webkit-scrollbar-track-piece {
     background: 0 0;
   }
  .h-tablechart .h-tablechart-item ::-webkit-scrollbar-thumb {
     background: #3a72a8 !important;
     border-radius: 0;
   }
  .h-tablechart .h-tablechart-item ::-webkit-scrollbar {
     width: 1px !important;;
     height: 1px !important;;
     background-color: transparent;
   }
</style>
