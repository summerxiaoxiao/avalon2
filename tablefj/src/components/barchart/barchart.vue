<template>
  <div class="d-flex h-box-column h-flex-auto h-barchart-box" >
    <div class="h-barchart__title" v-show="title" :class="styleMap.titleClass">{{title}}</div>
    <div class="h-box-row h-barchart h-flex-auto"  ref="mybar"></div>
  </div>

</template>
<script>
  import echarts from 'echarts'
  import _ from 'lodash'
  let colorData = {
    '本年累计数': '#2482c3',
    '上年同期累计数': '#03b992',
    '完成率': '#f3d063',
    '累计同比': '#ec813a'
  }
  let styleObj = {
    fontSize: 15,
    color: '#fff',
    titleClass: '',
    gridColor: '#88a1b3', // 网格线颜色
    gridArea: {
      show: false,
      areaStyle: {       // 网格区域背景色 属性areaStyle（详见areaStyle）控制区域样式
        color: ['rgba(24,46,65,0.8)']
      }
    }
  }
  let moptions = {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      x: 'right',
      y: 'top',
      orient: 'horizontal',
      padding: [],    // [5, 10, 15, 20]
      itemGap: 40,
      data: [],
      textStyle: {
        // color: color
      }
    },
    grid: {}, // 设置图形位置
    xAxis: [{
      type: 'category',
      boundaryGap: true, // 这里表示是否补齐空白
      data: [],
      axisLabel: {
        textStyle: {
          // color: color,
          // fontSize: fontsize
        }
      },
      splitLine: {
        show: false
      },
      axisTick: { // 刻度
        show: false
      },
      axisLine: {
        show: false,
        lineStyle: {
          // color: '#34678f'
          color: '#c9ddee'
        }
      }

    }],
    yAxis: [
      {
        type: 'value',
        splitNumber: 4,
        position: 'left', // y轴刻度线的显示在左边
        axisLabel: {
          textStyle: {
            // color: color,
            // fontSize: fontsize
          }
        },
        axisTick: { // 刻度
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: { // 隐藏网格线
          show: true,
          lineStyle: { // 网格线颜色
            // color: '#34678f',
            // color: gridLineColor,
            width: 1
          }
        }
        // splitArea: gridArea

      },
      {
        type: 'value',
        splitNumber: 4,
        position: 'right', // y轴刻度线的显示在左边
        axisLabel: {
          formatter: '{value}%',
          textStyle: {
            // color: color,
            // fontSize: fontsize
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            // color: gridLineColor
          }
        },
        splitLine: { // 隐藏网格线
          show: false
        },
        axisTick: { // 隐藏刻度线
          show: false
        }
      }],
    series: []
  }
  export default {
    name: 'main-chart-bar',
    props: {
      id: String,
      title: String,
      styleMap: {
        type: Object,
        default: function () {
          return styleObj
        }
      },
      data: {
        type: Object,
        required: true
      },
      categoryNames: {
        type: Array,
        required: true
      },
      options: {
        type: Object,
        default: function () {
          return moptions
        }
      },
      lengendPadding: {
        type: [Number, String, Array],
        default: function () {
          return 20
        }
      },
      lengendColor: {
        type: Object,
        default: function () {
          return colorData
        }
      }
    },
    data () {
      return {
        styles: {},
        opts: {},
        lengendNames: [],
        lengendData: [],
        seriesData: [] // ['本年累计数', '上年同期累计数','完成率','累计同比']
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.load()
      })
    },
    watch: {
      categoryNames () {
        this.load()
      },
      data () {
        this.load()
      }
    },
    methods: {
      load () {
        this.styles = _.merge(styleObj, this.styleMap)
        this.opts = _.merge(moptions, this.options)
        this.setDefaultData()
        this.renderChart()
      },
      setDefaultData () {
        var lengendData = []
        var seriesData = []
        var lengendNames = []
        var colorData = this.lengendColor
        var fontsize = this.styles.fontSize
        for (var key in this.data) {
          lengendNames.push(key)
          var item = {
            name: key,
            textStyle: {
              fontSize: fontsize
            }
          }
          var sitem = {}
          var color = colorData[key]
          if (this.data[key].type === 'bar') {
            item.icon = 'stack'
            sitem = {
              name: key,
              type: this.data[key].type || 'bar',
              // type: 'line',
              yAxisIndex: 0,
              barWidth: 30,
              itemStyle: {
                normal: {
                  color: color
                }
              },
              data: this.data[key].data
            }
          } else if (this.data[key].type === 'line') {
            sitem = {
              name: key,
              type: 'line',
              yAxisIndex: 1,
              showSymbol: false, // 默认不显示圆点
              itemStyle: {
                normal: {
                  color: color, // 折线点的颜色
                  lineStyle: {
                    color: color // 折线条颜色
                  }
                }
              },
              data: this.data[key].data
            }
          } else { // 默认显示bar
            item.icon = 'stack'
            sitem = {
              name: key,
              type: this.data[key].type || 'bar',
              yAxisIndex: 0,
              barWidth: 30,
              itemStyle: {
                normal: {
                  color: color
                }
              },
              data: this.data[key].data
            }
          }
          lengendData.push(item)
          seriesData.push(sitem)
        };
        this.lengendData = lengendData
        this.seriesData = seriesData
        this.lengendNames = lengendNames
      },
      renderChart () {
        var self = this
        if (!this.chart) {
          var mychart = echarts.init(this.$refs.mybar)
          this.chart = mychart
        }
        var categoryNames = self.categoryNames
        var fontsize = this.styles.fontSize
        var color = this.styles.color

        var grid = { // 设置图形位置
          y: '0%',
          width: '75%',
          height: '62%',
          top: '20%',
          left: '12%',
          right: '6%',
          bottom: '10%'
          // color: '#34678f'
        }
        this.options.grid = _.merge(grid, this.options.grid)
        let lengenPadd = _.isArray(this.lengendPadding) ? this.lengendPadding : [this.lengendPadding, 120, 0, 0]
        let gridLineColor = this.styles.gridColor// 网格线颜色
        let gridArea = this.styles.gridArea

        let textStyle = {
          color: color,
          fontsize: fontsize
        }

        this.opts.legend.padding = lengenPadd
        this.opts.legend.data = self.lengendData
        this.opts.legend.textStyle.color = color
        this.opts.xAxis[0].data = categoryNames
        this.opts.xAxis[0].axisLabel.textStyle = textStyle
        this.opts.yAxis[0].axisLabel.textStyle = textStyle
        this.opts.yAxis[0].splitLine.lineStyle.color = gridLineColor
        this.opts.yAxis[0].splitArea = gridArea
        this.opts.yAxis[1].axisLabel.textStyle = textStyle
        this.opts.series = self.seriesData

        // var option = {
        // legend: {
          // /*data: [{
          //     name:lengendNames[0],
          //     textStyle:{
          //         fontSize:15,
          //     },
          //     icon:'stack'
          // },{
          //     name: lengendNames[1],
          //     textStyle:{
          //         fontSize:15,
          //     },
          //     icon:'stack'
          // },{
          //     name: lengendNames[2],
          //     textStyle:{
          //         fontSize:15
          //     },
          //     icon:''
          // },{
          //     name: lengendNames[3],
          //     textStyle:{
          //         fontSize:15
          //     },
          // }],*/
        // }
          // /*series: [ {
          //     name: lengendNames[0],
          //     type: 'bar',
          //     yAxisIndex: 0,
          //     barWidth:30,
          //     itemStyle: {
          //         normal: {
          //             color:'#2482c3'
          //
          //         }
          //     },
          //     data: data1
          // }, {
          //     name: lengendNames[1],
          //     type: 'bar',
          //     yAxisIndex: 0,
          //     barWidth:30,
          //     itemStyle: {
          //         normal: {
          //             color:'#03b992'
          //
          //         }
          //     },
          //     data: data2
          // }, {
          //     name: lengendNames[2],
          //     type: 'line',
          //     // yAxis: 0,
          //     yAxisIndex: 1,
          //     //smooth: true,
          //     showSymbol: false, //默认不显示圆点
          //     itemStyle: {
          //         normal: {
          //             color:'#f3d063', //折线点的颜色
          //             lineStyle:{
          //                 color:'#f3d063' //折线条颜色
          //             }
          //         }
          //     },
          //     data: data3
          // }, {
          //     name: lengendNames[3],
          //     type: 'line',
          //     // yAxis: 0,
          //     yAxisIndex: 1,
          //     //smooth: true,
          //     showSymbol: false, //默认不显示圆点
          //     itemStyle: {
          //         normal: {
          //             color:'#ec813a', //折线点的颜色
          //             lineStyle:{
          //                 color:'#ec813a' //折线条颜色
          //             }
          //         }
          //     },
          //     data: data4
          // }]*/
        // }
        // 配置图表设置并读取
        this.chart.setOption(this.opts)
      }
    }

  }
</script>
<style lang="scss">
  .h-barchart-box{
    width: 100%;
    height: 100%;
  }
  .h-barchart{
    height: 100%;
    width: 100%;
  }
  .h-barchart__title{
    text-align: -webkit-center;
    text-align: left;
    position: absolute;
  }
</style>
