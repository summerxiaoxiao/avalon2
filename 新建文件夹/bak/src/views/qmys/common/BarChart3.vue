<template>
  <div class="d-flex flex-column h-flex0-auto h-barchart3-box" >
    <div class="d-flex flex-row h-barchart3-box-top">
      <span class="h-label h-label-active" @click.stop="activeLabel($event,'电量')">电量</span>
      <span class="h-label" @click.stop="activeLabel($event,'平均输配电价')">平均输配电价(不含税)</span>
      <span class="h-label" @click.stop="activeLabel($event,'输配电成本')">输配电成本</span>
      <span class="h-label" @click.stop="activeLabel($event,'财会队伍建设')">财会队伍建设</span>
    </div>
    <div class="d-flex flex-row h-barchart3-box-content">
      <div class="flex-column h-barchart h-flex-auto h-flex2"  >
        <div class="flex-column h-flex-auto h-barchart-item" ref="mybar"></div>
        <div class="d-flex flex-row h-barchart-filter">
        <span class="flex-column selector">
          <h-filter-select :data="filterData" width="130"></h-filter-select>
        </span>
          <span class="flex-column selector">
          <h-filter-select :data="filterData2" width="90"></h-filter-select>
        </span>
        </div>
        <div class="d-flex flex-row h-barchart-big">
          <h-split-line color="#7ba5de" borderWidth="0.5" height="18"></h-split-line>
          <div class="flex-column h-barchart-big-item"><i class="iconfont icon-fangdajing"></i></div>
        </div>
      </div>
      <div class="d-flex flex-column h-barchart-right-box h-flex-auto h-flex1">
        <div class="d-flex flex-row h-barchart-right-top justify-content-between">
          <div class="d-flex flex-row">
            <div class="flex-column active-label h-barchart-right-top-label" @click.stop="activeZbxx($event)">指标信息</div>
            <div class="flex-column h-barchart-right-top-label" @click.stop="activeZbxx($event)">结构分析</div>
          </div>
          <div class="flex-column">单位：元/千千瓦时</div>
        </div>
        <component :is="zbxxview"
                   ref="mycom"></component>
      </div>
    </div>

  </div>

</template>
<script>
  // 盈利能力、偿债能力，营运能力、发展能力
  import echarts from 'echarts'
  import $ from 'jquery'
  import _ from 'lodash'
  import HFilterSelect from './FilterSelect'
  import HSplitLine from './Split'
  import HZbxx from '@/views/qmys/driver/sheng/fznlzbxx'
  import HSdj from '@/views/qmys/driver/sheng/fznlsdj'
  import HSdl from '@/views/qmys/driver/sheng/fznlsdl'
  import HSpd from '@/views/qmys/driver/sheng/fznlspd'
  import HDwjs from '@/views/qmys/driver/sheng/fznldwjs'
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
      itemGap: 60,
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
        splitNumber: 8,
        name: '111',
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

      }],
    series: []
  }
  let yAxisRight = {
    type: 'value',
    splitNumber: 4,
    position: 'right', // y轴刻度线的显示在右边
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
  }
  let mstyles = {
    fontsize: 16,
    color: '#c2d3e2',
    legendColor: '#fff',
    legendFontsize: 14,
    lengendPadding: [0, 80, 0, 0],
    gridColor: '#00427a',
    gridArea: {
      show: false,
      areaStyle: {       // 属性areaStyle（详见areaStyle）控制区域样式
        color: ['#007be6', '#0068c6', '#004c9d', '#003880']
      }
    }
  }
  export default {
    name: 'barchart-app',
    components: {
      HFilterSelect,
      HSplitLine,
      HZbxx,
      HSdj,
      HSdl,
      HSpd,
      HDwjs
    },
    props: {
      id: String,
      title: String,
      filterData: Array,
      filterData2: Array,
      jldw: String, // 计量单位 % ， 次
      yMin: [String, Number],
      yMax: [String, Number],
      splitNumber: {
        type: [String, Number],
        default: function () {
          return 7
        }
      },
      yInverse: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      isDoubleY: { // 是否显示双Y轴
        type: [Number, String, Boolean],
        default: function () {
          return false
        }
      },
      options: {
        type: Object,
        default: function () {
          return moptions
        }
      },
      styles: {
        type: Object,
        default: function () {
          return mstyles
        }
      },
      data: { // 每个lengend对应的data
        type: [Object, Array],
        required: true
      },
      categoryNames: { // ['201201', '201202', '201203']
        type: Array,
        required: true
      },
      lengendPadding: Array, // lengend 的间距 [0, 20, 10, 30]
      lengendTypes: Array, // 图例类型 ['bar', 'line']
      lengendNames: Array, // ['本年累计', '累计同比']
      lengendColor: Array // ['#fff', '#980734']
    },
    data () {
      return {
        zbxxview: 'h-zbxx',
        opts: {},
        styleMap: {},
        lengendData: [] // lengend 的字体样式
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.load()
      })
    },
    watch: {
      data () {
        this.load()
      }
    },
    methods: {
      load () {
        this.opts = _.merge(moptions, this.options)
        if (this.isDoubleY) { // 双Y轴
          this.opts.yAxis.push(yAxisRight)
        } else {
          this.opts.yAxis[0].inverse = this.yInverse
          if (this.yMin || this.yMin === 0) {
            this.opts.yAxis[0].min = this.yMin
          }
          if (this.yMax || this.yMax === 0) {
            this.opts.yAxis[0].max = this.yMax
          }
          if (this.splitNumber) {
            this.opts.yAxis[0].splitNumber = this.splitNumber
          }
        }
        if (this.jldw) {
          this.opts.yAxis[0].name = this.jldw
        }
        this.styleMap = _.merge(mstyles, this.styles)
        this.setDefaultData()
        this.renderChart()
      },
      activeLabel (event, label) {
        $(event.target).siblings().removeClass('h-label-active')
        $(event.target).addClass('h-label-active')
        var name = label || $(event.target).text()
        this.zbxxview = name === '指标信息' ? 'h-zbxx' : this.zbxxview
        this.zbxxview = name === '结构分析' ? 'h-sdj' : this.zbxxview
        this.zbxxview = name === '电量' ? 'h-sdl' : this.zbxxview
        this.zbxxview = name === '平均输配电价' ? 'h-sdj' : this.zbxxview
        this.zbxxview = name === '输配电成本' ? 'h-spd' : this.zbxxview
        this.zbxxview = name === '财会队伍建设' ? 'h-dwjs' : this.zbxxview
      },
      activeZbxx (event, label) {
        $(event.target).siblings().removeClass('active-label')
        $(event.target).addClass('active-label')
        var name = label || $(event.target).text()
        this.zbxxview = name === '指标信息' ? 'h-zbxx' : this.zbxxview
        this.zbxxview = name === '结构分析' ? 'h-sdj' : this.zbxxview
        this.zbxxview = name === '财会队伍建设' ? 'h-dwjs' : this.zbxxview
      },
      setDefaultData () {
        var lengendData = []
        var seriesData = []
        var colorData = this.lengendColor
        var lengendNames = this.lengendNames
        var lengendTypes = this.lengendTypes
        var fontsize = this.styleMap.fontsize

        for (var i = 0; i < lengendNames.length; i++) {
          var sitem = {}
          var color = colorData[i]
          var data = this.data[lengendNames[i]] || this.data[i]

          var item = {
            name: lengendNames[i],
            textStyle: {
              fontSize: this.styleMap.legendFontsize || fontsize,
              color: this.styleMap.legendColor || color
            }
          }
          if (lengendTypes[i] === 'bar') {
            item.icon = 'stack'
            sitem = {
              name: lengendNames[i],
              type: lengendTypes[i] || 'bar',
              yAxisIndex: 0,
              barWidth: 30,
              itemStyle: {
                normal: {
                  color: color
                }
              },
              data: data
            }
          } else if (lengendTypes[i] === 'line') {
            sitem = {
              name: lengendNames[i],
              type: 'line',
              yAxisIndex: 0,
              showSymbol: false, // 默认不显示圆点
              itemStyle: {
                normal: {
                  color: color, // 折线点的颜色
                  lineStyle: {
                    color: color // 折线条颜色
                  }
                }
              },
              data: data
            }
          } else { // 默认显示bar
            item.icon = 'stack'
            sitem = {
              name: lengendNames[i],
              type: lengendTypes[i] || 'bar',
              yAxisIndex: 0,
              barWidth: 30,
              itemStyle: {
                normal: {
                  color: color
                }
              },
              data: data
            }
          }
          lengendData.push(item) // lengend 的字体样式
          seriesData.push(sitem) // series 的数据
        };
        this.lengendData = lengendData
        this.seriesData = seriesData
      },
      renderChart () {
        var self = this
        if (!this.chart) {
          var mychart = echarts.init(this.$refs.mybar)
          this.chart = mychart
        }
        var categoryNames = self.categoryNames
        var fontsize = this.styleMap.fontsize
        var color = this.styleMap.color

        var grid = { // 设置图形位置
          y: '0%',
          width: '100%',
          height: '70%',
          top: '12%',
          left: '3%',
          right: '3%',
          bottom: '10%'
          // color: '#34678f'
        }
        this.options.grid = _.merge(grid, this.options.grid)
        let lengenPadd = _.isArray(this.styleMap.lengendPadding) ? this.styleMap.lengendPadding : [this.styleMap.lengendPadding || 0, 80, 0, 0]
        let gridLineColor = this.styleMap.gridColor// 网格线颜色
        let gridArea = this.styleMap.gridArea

        let textStyle = {
          color: color,
          fontSize: fontsize
        }

        this.opts.legend.padding = lengenPadd
        this.opts.legend.data = self.lengendData
        this.opts.legend.textStyle.color = this.styleMap.legendColor
        this.opts.legend.textStyle.fontSize = this.styleMap.legendFontsize
        if (this.opts.xAxis[0]) {
          this.opts.xAxis[0].data = categoryNames
          this.opts.xAxis[0].axisLabel.textStyle = textStyle
        }
        if (this.opts.yAxis.length >= 1) {
          this.opts.yAxis[0].axisLabel.textStyle = textStyle
          this.opts.yAxis[0].splitLine.lineStyle.color = gridLineColor
          this.opts.yAxis[0].splitArea = gridArea
        }
        if (this.isDoubleY && this.opts.yAxis.length >= 2) {
          this.opts.yAxis[1].axisLabel.textStyle = textStyle
        }
        this.opts.series = self.seriesData
        // this.opts.yAxis = this.opts.yAxis[0]
        // console.log(this.opts)
        // 配置图表设置并读取
        this.chart.setOption(this.opts)
      }
    }
  }
</script>
<style lang="scss">
  .h-barchart3-box{
    width: 100%;
    height: 100%;
    position: relative;
    align-items: center;
    justify-content: center;


    .h-barchart3-box-top{
      width: 100%;
      height: 60px;
      line-height: 60px;
      align-items: center;

    }
    .h-barchart3-box-content{
      width: 100%;
      height: 100%;
    }

    .h-barchart{
      height: 100%;
      width: 50%;
      position: relative;
      align-items: center;
      justify-content: center;
      .h-barchart-item{
        height: 100%;
        width: 100%;
        position: relative;
        align-items: center;
        justify-content: center;
      }
    }
    .h-barchart__title{
      text-align: -webkit-center;
      text-align: left;
      position: absolute;
    }
    .h-barchart-big{
      position: absolute;
      right: 10px;
      top: -10px;
      align-items: center;
      justify-content: center;
      .h-barchart-big-item{
        i{
          font-size: 20px;
          color: #97b2d8;
        }
      }
    }


    .h-barchart-filter{
      position: absolute;
      top: 0px;
      left: 10px;
    }

    .h-barchart-right-box{
      height: 100%;
      max-width: 32%;
      min-height: 300px;
      justify-content: center;
      padding: 0 0 50px 30px;

      .h-barchart-right-top{
        line-height: 30px;
      }
      .h-barchart-right-top-label{
        width: 100px;
        text-align: center;
        &:hover{
          background: #002f56;
          cursor: pointer;
        }
      }
      .active-label{
        background: #002f56;
      }
    }

    .h-label{
      min-width: 120px;
      height: 24px;
      text-align: center;
      line-height: 22px;
      border-radius: 24px;
      vertical-align: middle;
      background-color: #003361;
      position: relative;
      cursor: pointer;
      user-select: none;
      transition: all .2s ease-in-out;
      margin-left: 10px;
      padding: 0px 20px;
      &:hover{
        background-color: #012948;
      }
    }
    .h-label-active{
      background-color: #012948;
    }
  }

</style>
