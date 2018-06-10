<template>
  <div class="d-flex h-box-column h-flex-auto h-barchart-box" >
      <div class="h-barchart__title" v-show="title">{{title}}</div>
    <div class="d-flex flex-row h-barchart h-flex-auto"  ref="mybar"></div>
  </div>

</template>
<script>
  import $ from 'jquery'
  let colorData = {
    '本年累计数': '#2482c3',
    '上年同期累计数': '#03b992',
    '完成率': '#f3d063',
    '累计同比': '#ec813a'
  }
  export default {
    name: 'main-chart-bar',
    props: {
      id: String,
      title: String,
      data: {
        type: Object,
        required: true
      },
      categoryNames: {
        type: Array,
        required: true
      },
      options: {
        type: Object
      },
      lengendPadding: {
        type: [Number, String],
        default: function () {
          return 20
        }
      },
      colorMap: {
        type: Object,
        default: function () {
          return colorData
        }
      }
    },
    data () {
      return {
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
        this.setDefaultData()
        this.renderChart()
      },
      setDefaultData () {
        var lengendData = []
        var seriesData = []
        var lengendNames = []
        var colorData = this.colorMap
        var lineColor = Object.keys(this.data).length <= 3 ? '#f3d063' : null
        for (var key in this.data) {
          lengendNames.push(key)
          var item = {
            name: key,
            textStyle: {
              fontSize: 15
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
            color = lineColor || color
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
        var $dom = $(this.$refs.mybar)
        var mychart = this.$echarts.init($dom.get(0))
        this.chart = mychart
        var categoryNames = self.categoryNames

        var grid = { // 设置图形位置
          y: '10%',
          width: '100%',
          height: '62%',
          top: '20%',
          left: '0%',
          right: '0%',
          bottom: '10%',
          color: '#34678f'
        }
        var defaultGrid = grid

        if (this.options) {
          if (self.options.grid) {
            grid = $.extend({}, defaultGrid, self.options.grid)
          }
        }

        var option = {
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
            padding: [this.lengendPadding, 120, 0, 0],    // [5, 10, 15, 20]
            itemGap: 40,
            data: self.lengendData,
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
            textStyle: {
              color: '#fff'
            }
          },
          grid: grid, // 设置图形位置
          xAxis: [{
            type: 'category',
            boundaryGap: true, // 这里表示是否补齐空白
            data: categoryNames,
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 15
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
                color: '#34678f'
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
                  color: '#fff',
                  fontSize: 15
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
                  color: '#34678f',
                  width: 1
                }
              },
              splitArea: {           // 分隔区域
                show: true,       // 默认不显示，属性show控制显示与否
                areaStyle: {       // 属性areaStyle（详见areaStyle）控制区域样式
                  color: ['rgba(24,46,65,0.8)']
                }
              }

            },
            {
              type: 'value',
              splitNumber: 4,
              position: 'right', // y轴刻度线的显示在左边
              axisLabel: {
                formatter: '{value}%',
                textStyle: {
                  color: '#fff',
                  fontSize: 15
                }
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#34678f'
                }
              },
              splitLine: { // 隐藏网格线
                show: false
              },
              axisTick: { // 隐藏刻度线
                show: false
              }
            }],
          series: self.seriesData
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
        }
        // 配置图表设置并读取
        mychart.setOption(option)
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
    align-items: center;
    justify-content: center;
  }
  .h-barchart__title{
    color: #fff;
    font-size: 18px;
    height: 40px;
    line-height: 40px;
    text-align: -webkit-center;
    text-align: left;
    padding: 0px 10px 0px 10px;
    position: absolute;
  }
</style>
