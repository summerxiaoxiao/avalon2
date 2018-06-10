<template>
<div class="d-flex flex-column h-flex-auto h-chartpie-box">
  <div class="flex-column h-chartpie-title" :class="styleMap.titleClass">{{title}}</div>
  <div class="d-flex flex-row h-chartpie-main">
      <div class="d-flex flex-column h-flex1 h-chartpie-left">
        <div class="flex-column h-flex-auto h-chartpie-pie " ref="echart" :data-responsive="responsive"></div>
      </div>
      <div class="d-flex flex-column h-flex2" :class="'h-chartpie-right-'+layout" v-show="showLabel">
        <div class="d-flex h-chartpie-row" :class="'flex-' + layout" :style="{height:rowHeight}">
          <div class="flex-column h-chartpie-row-title" :class="{'h-chartpie-title-row': layout==='row' }">{{mainData.name}}</div>
          <div class="d-flex flex-row h-chartpie-row-item" :class="{'h-flex2': layout==='row'}">
            <div class="flex-column h-flex1">
              <div class="h-chartpie-row__value" :class="'__value-'+layout">{{mainData.yss}}</div>
              <div class="h-chartpie-row__label">预算</div>
            </div>
            <div class="flex-column h-flex1">
              <div class="h-chartpie-row__value" :class="'__value-'+layout">{{mainData.hss}}</div>
              <div class="h-chartpie-row__label" :class="'__value-'+layout">核算</div>
            </div>
            <div class="flex-column h-flex1">
              <div class="h-chartpie-row__value" :class="'__value-'+layout">{{mainData.wcl}}</div>
              <div class="h-chartpie-row__label">完成率</div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-column" :class="'h-chartpie-split-'+layout">
          <div class="h-chartpie-line" ></div>
        </div>
        <div class="d-flex h-chartpie-row" :class="'flex-' + layout" :style="{height:rowHeight}" v-if="isClick">
          <div class="flex-column h-chartpie-row-title" :class="{'h-chartpie-title-row': layout==='row' }">{{selectedData.name}}</div>
          <div class="d-flex flex-row h-chartpie-row-item" :class="{'h-flex2': layout==='row'}">
            <div class="flex-column h-flex1">
              <div class="h-chartpie-row__value" :class="'__value-'+layout">{{selectedData.value}}</div>
              <div class="h-chartpie-row__label">预算</div>
            </div>
            <div class="flex-column h-flex1">
              <div class="h-chartpie-row__value" :class="'__value-'+layout">{{selectedData.value}}</div>
              <div class="h-chartpie-row__label">核算</div>
            </div>
            <div class="flex-column h-flex1">
              <div class="h-chartpie-row__value" :class="'__value-'+layout">{{selectedData.value}}</div>
              <div class="h-chartpie-row__label">完成率</div>
            </div>
          </div>
        </div>

      </div>
  </div>
</div>
</template>
<script>
  import $ from 'jquery'
  import _ from 'lodash'
  import EChart from 'echarts'
  import theme from '@/views/echart.theme.json'
  EChart.registerTheme('yg', theme)
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
      // selectedMode: 'single',
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
  export default {
    name: 'chartpie02',
    props: {
      title: String,
      chartData: Array,
      mainData: Object,
      legendData: Array,
      layout: {// 排版 column： 列 row：行
        type: [String],
        default: function () {
          return 'column'
        }
      },
      rowHeight: {
        type: [String],
        default: function () {
          return '40%'
        }
      },
      showLabel: {
        type: [String, Boolean],
        default: function () {
          return false
        }
      },
      styleMap: {
        type: Object
      },
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
      },
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
          return defaultColors
        }
      },
      responsive: {
        type: Boolean,
        'default': true
      }
    },
    data () {
      return {
        data: [],
        selectedData: {},
        mcolors: [],
        isClick: this.showLabel
      }
    },
    watch: {
      title () {
        this.load()
      }
    },
    beforeDestroy () {
      this.echart.dispose()
      if (this.responsive) {
        window.removeEventListener('resize', this._autoResize)
      }
    },
    mounted () {
      this.echart = EChart.init(this.$refs['echart'], 'yg')
      this.echart.setOption(this.options)
      this._autoResize = _.debounce(() => this.autoResize(), 10, true)
      if (this.responsive) {
        this.autoResize()
        window.addEventListener('resize', this._autoResize)
      }
      this.$nextTick(function () {
        if (this.showLabel) {
          this.selectedData = this.chartData[0]
        }
        this.mcolors = this.colors
        this.load()
      })
    },
    computed: {
      options () {
        var options = _.clone(this.chartOption)
        if (this.chartSeries) {
          options.series = [JSON.parse(JSON.stringify(this.chartSeries))]
          this.data = JSON.parse(JSON.stringify(this.chartSeries)).data
        }
        options.legend.data = this.legendData
        options.color = this.mcolors
        return options
      }
    },
    methods: {
      autoResize () {
        let width = this.$el.clientWidth
        let height = this.$el.clientHeight ? this.$el.clientHeight : (this.height ? this.height : width)
        var vheight = getHeight(this.$el) // this.$parent.$el.querySelector('.driver-bg').clientHeight
        // this.$el.parentNode.parentNode.clientHeight
        height = height > vheight ? vheight : height
        this.echart.resize({width, height, silent: true})
        function getHeight (node) {
          if (node.clientHeight) {
            return node.clientHeight
          }
          return getHeight(node.parentNode)
        }
      },
      load () {
        if (!this.showLabel) {
          this.bindEvent()
        }
      },
      renderChart () {
        if (this.chartSeries) {
          this.chartOption.series = [JSON.parse(JSON.stringify(this.chartSeries))]
          this.data = JSON.parse(JSON.stringify(this.chartSeries)).data
        }
        this.chartOption.legend.data = this.legendData
        this.chartOption.color = this.mcolors
        this.chart.setOption(this.chartOption)
      },
      bindEvent () {
        let _self = this
        let chart = this.echart
        chart.off('click')
        chart.on('click', function (param) { // 饼图点击事件
          _self.onClick(param, _self.chart, _self)
        })

        chart.off('mouseover')
        chart.on('mouseover', function (param) {
          _self.onMouseOver(param, _self.chart, _self)
        })
        chart.off('mouseout')
        chart.on('mouseout', function (param) {
          _self.onMouseOut(param, _self.chart, _self)
        })

        $(document).off('click').on('click', function (e) {
          _self.onDocument(_self, _self.chart)
        })
      },
      onClick (param, chart, _this) {
        let colors = _this.colors
        let option = _.cloneDeep(_this.chartOption)
        if (param.data && param.data.value) {
          var obj = param.data.mapValue || {}
          obj.name = param.data.name
          obj.value = param.data.value
          var cc = []
          _this.isDocument = false
          _this.isClick = true
          if (_this.dataIndex === param.dataIndex) { //   点击的当前，还原颜色
            cc = colors
            obj = {all: true}
            _this.selectedId = -1
            _this.dataIndex = -1
          } else {
            _this.dataIndex = param.dataIndex
            _this.selectedId = param.data.name
            _.filter(colors, function (item, i) {
              var c = item
              if (i !== param.dataIndex) {
                c = '#d1d9df'
              }
              cc.push(c)
            })
          }
          option.color = cc
          chart.setOption(option, true)
          // 渲染label
          this.selectedData = obj
        }
      },
      onMouseOut (param, chart, _this) {
        var cc = []
        if (!_this.isClick) { // 没有点击时还原所有颜色
          cc = _this.mcolors
        } else { // 只显示被点击的颜色
          _.filter(_this.mcolors, function (item, i) {
            var c = item
            if (i !== _this.dataIndex) {
              c = '#d1d9df'
            }
            cc.push(c)
          })
        }
        let option = _.cloneDeep(_this.chartOption)
        option.color = cc
        chart.setOption(option, true)
      },
      onMouseOver (param, chart, _this) {
        let option = _.cloneDeep(_this.chartOption)
        var cc = []
        _.filter(_this.mcolors, function (item, i) {
          var c = item
          if (i !== param.dataIndex && i !== _this.dataIndex) { // 当前区域 和 已点击的区域有颜色，其他区域为灰色
            c = '#d1d9df'
          }
          cc.push(c)
        })
        option.color = cc
        chart.setOption(option, true)
      },
      onDocument (_this, chart) {
        if (_this.isDocument) { // 点击空白区域，还原饼图颜色
          _this.isClick = false
          _this.dataIndex = -1
          _this.selectedId = -1
          let option = _.cloneDeep(_this.chartOption)
          option.color = _this.mcolors
          chart.setOption(option, true)
          // _this.renderPieLabel2({all: true})
        }
        _this.isDocument = true
      }
    }
  }
</script>
<style lang="scss">
  .h-chartpie-box,
  .h-chartpie-pie{
    width: 100%;
    height: 100%;

  }
  .h-chartpie-title{
      position: absolute;
  }
  .h-chartpie-main{
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    .h-chartpie-right-row{
      height: 100%;
      align-items: center;
      justify-content: center;
    }
    .h-chartpie-right-column{
      height: 100%;
    }
    .h-chartpie-left{
      height: 100%;
      width: 25%;
      align-items: center;
      justify-content: center;
    }

    .h-chartpie-row-item{
      align-items: center;
      justify-content: center;
    }

    .h-chartpie-row{
      height: 40%;
      width: 100%;
      justify-content: center;
      &.flex-row{
        align-items: center;
      }

      .h-chartpie-row-title{
        line-height: 40px;

      }
      .h-chartpie-title-column{
        padding-left: 20px;
        color: #6d93c0;
      }
      .h-chartpie-title-row{
        width: 18%;
        color: #9eb7cd;
        flex: 1 0 auto;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .h-chartpie-row-item{
        line-height: 25px;
        text-align: center;
        .h-chartpie-row__value{
          color: #5a8bc8;
        }
        .h-chartpie-row__label{
          color: #9eb7cd;
        }
        .__value-row{
          color: #9eb7cd;
        }
      }
    }

    .h-chartpie-split-column{
      width: 100%;
      padding-top: 10px;
      align-items: center;
      justify-content: center;
      .h-chartpie-line{
        width: 90%;
        height: 1px;
        background: #1c405e;
      }
    }
    .h-chartpie-split-row{
      width: 100%;
      padding: 10px 0px;
      align-items: center;
      justify-content: center;
      .h-chartpie-line{
        width: 100%;
        height: 1px;
        background: #1c405e;
      }
    }
  }
</style>
