<template>
  <div class="h-tablechart h-box-column" :style="{height: height}">
    <div class="h-tablechart-item-title" v-if="title">{{title}}</div>
    <div class="h-tablechart-item h-box-row">
      <div class="h-tablechart-item-list h-flex2">
        <div class="h-tablechart-item-table" >
          <h-treetable caption="" :columns="tableColumns" :rows="tableRows"
                        display="none" borderbottom></h-treetable>
        </div>
      </div>
      <div class="h-tablechart-item-chart h-flex1" >
        <div class="chart" style="width:100%;height:100%;margin:0 auto;" ref="mychart" ></div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Vue from 'vue'
  const chartOpts = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      show: false,
      orient: 'vertical',
      left: 'right'
    },
    grid: {
      top: '0%',
      bottom: '0%',
      left: '40%',
      containLabel: true
    },
    series: {
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
    },
    props: {
      title: String,
      height: String,
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
      chartData: Array,
      legendData: Array,
      chartSeries: {
        type: [Object, Array],
        default: function () {
          return null
        }
      },
      chartOption: {
        type: Object,
        default: function () {
          return chartOpts
        }
      }
    },
    data () {
      return {
        allColors: this.colors,
        currentRow: {},
        mcolors: JSON.parse(JSON.stringify(this.colors))
      }
    },
    watch: {
      mcolors () {
        this.chart.dispatchAction({
          type: 'legendToggleSelect',
          // 图例名称
          name: this.currentRow.name
        })
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.loadTable()
      })
    },
    methods: {
      loadTable () {
        this.renderChart()
      },
      renderChart () {
        var chartsDom = $(this.$refs.mychart).get(0)
        this.chart = this.$echarts.init(chartsDom)
        if (this.chartSeries) {
          this.chartOption.series = JSON.parse(JSON.stringify(this.chartSeries))
        }
        this.chartOption.legend.data = this.legendData
        this.chartOption.color = this.colors
        this.chart.setOption(this.chartOption)
        window.onresize = function () {
          this.chart.resize()
        }
      }
    }
  }
</script>
<style>
  .h-tablechart {
    height: 50%;
    min-height: 400px;
    padding: 15px;
    border: 1px solid #406683;
    margin-top: 15px;
    background: #1c3147;
    border: 1px solid #406683;
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
  .h-tablechart .h-tablechart-item .h-tablechart-item-list {

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
