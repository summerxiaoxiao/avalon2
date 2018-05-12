<template>
  <div class="d-flex flex-row align-items-center justify-content-center h-ybpchart" ref="mypie">
    <div ref="zhizhenDiv" class="h-chart-zhizhen d-flex flex-row align-items-center justify-content-center" >
      <img class="h-ybpchart-zhizhen"  ref="myzhizhen" :src="bg"/>
    </div>
    <div class="h-pie-label d-flex flex-row" ref="pieLabel" >
      <div class="flex-column h-pie__label_min">0%</div>
      <div class="flex-column h-pie__label_max">100%</div>
    </div>
  </div>
</template>
<script>
  // import $ from 'jquery'
  import * as d3 from 'd3'
  import _ from 'lodash'
  import zhizhen from '@/assets/images/qmys/zhizhen2.png'
  var config = {
    degree: 100,
    size: 160,             // panel的大小
    label: '0%',       // panel的名称
    min: 0,                // 量程的最小值
    max: 180,              // 量程的最大值
    majorTicks: 11,         // 主刻度的个数
    minorTicks: 0,        // 次刻度的个数
    colors: ['#29720f', '#3d627f', '#04e210']
  }
  export default {
    name: 'pie-chart-app',
    props: {
      colors: {
        type: Array,
        default: function () {
          return config.colors
        }
      },
      options: {
        type: Object,
        default: function () {
          return {
            degree: config.degree,
            value: config.value,
            size: config.size,
            cx: config.size / 2,                 // 圆心的x坐标
            cy: config.size / 2,                 // 圆心的y坐标
            radius: config.size * 0.97 / 2,      // 半径（稍许留白）
            kdradius: config.size * 0.97 / 2 * 0.85, // 刻度半径
            label: config.label,
            max: config.max,
            min: config.min,
            range: config.max - config.min,      // 量程
            minorTicks: config.minorTicks,
            majorTicks: config.majorTicks,
            kdcolor: '#fdffff'
          }
        }
      }
    },
    computed: {
      getBg () {
        return 'url(' + this.bg + ')'
      }
    },
    data () {
      var mm = _.clone(_.merge(this.options, config))
      mm.colors = this.colors
      return {
        bg: zhizhen,
        mconfig: mm,
        zhizhen: zhizhen
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.load()
      })
    },
    methods: {
      load () {
        // 3.1 获取数据
        let {degree} = this.mconfig

        // 指针旋转角度
        d3.select(this.$refs.myzhizhen).style('transform', 'rotate(' + degree + 'deg)')

        // 设置panel宽和高
        // d3.select('.h-ybpchart').style('width', size + 'px').style('height', size + 'px')
        this.svgDiv = d3.select(this.$refs.mypie)
        this.width = this.svgDiv._groups[0][0].clientWidth
        this.height = this.svgDiv._groups[0][0].clientHeight * 2 // 让半圆的半径为div的高度
        this.pieHeight = this.width < this.height ? this.width : this.height
        // 3.2 添加svg
        this.svg = d3.select(this.$refs.mypie).append('svg:svg')
          .attr('class', 'gauge')      // 添加类名gauge
          .attr('width', '100%')         // 设置svg宽度
          .attr('height', this.height)       // 设置svg高度
          .style('position', 'absolute')
          .style('top', '0px')
          .style('margin-left', this.width / 2 - this.pieHeight / 2)

        d3.select(this.$refs.pieLabel).style('width', this.width)
        d3.select(this.$refs.zhizhenDiv).style('transform', 'translate(-' + (this.mconfig.cx / 2 - 5) + 'px, 0px) scale(' + (this.mconfig.cx / 100) + ', ' + (this.mconfig.cx / 100) + ')')

        this.init()
        // 剪切为半圆
        this.clipCircle()

        this.panel = this.svg.append('g')
        // this.panel.attr('transform', 'translate(' + this.width / 2 + ',' + '0' + ')')
        // 画圆
        this.renderCircle()

        // 画刻度线
        this.renderKdLine()

        // 画遮罩弧度
        this.renderRadius()

        // 文本
        this.renderLabel()
      },
      init () {
        this.mconfig.size = this.pieHeight
        this.mconfig.cx = this.pieHeight / 2
        this.mconfig.cy = this.pieHeight / 2
        this.mconfig.radius = this.pieHeight / 2 * 0.97
        this.mconfig.kdradius = this.mconfig.radius * 0.85
      },
      renderLabel () {
        let panel = this.panel
        let {cx, cy, size, label} = this.mconfig
        // 3.6设置label
        let fontSize = Math.round(size / 9) // 字体大小
        panel.append('svg:text')         // 添加文本
          .attr('x', cx)              // 文本位置
          .attr('y', cy - 20) // cy / 2 + fontSize / 2
          .attr('text-anchor', 'middle')// 文字角度
          .text(label)                 // 文字内容
          .style('font-size', fontSize + 'px')// 字体大小
          .style('fill', '#fefeff')        // 颜色
          .style('stroke-width', '0px')
      },
      clipCircle () {
        let {size} = this.mconfig
        let clipId = 'circleClip'
        let clip = this.svg.append('defs').append('clipPath').attr('id', clipId)
        clip.append('svg:rect').attr('x', 0).attr('y', 0).attr('width', size).attr('height', size / 2 + 3)
        this.svg.style('clip-path', 'url(#' + clipId + ')')
      },
      renderCircle () {
        let {cx, cy, radius} = this.mconfig
        // 3.3画外圆
        this.panel.append('svg:circle')        // 添加circle，圆
          .attr('cx', cx)            // 设置circle的坐标
          .attr('cy', cy)
          .attr('r', radius)         // 设置circle的半径
          .style('fill', 'transparent')     // 设置circle的填充颜色transparent
          .style('stroke', this.mconfig.colors[0])   // 设置circle的轮廓颜色
          .style('stroke-width', '4px')// 设置circle的轮廓宽度

        //  3.4-2 画内圆2 第二个内圆, 绿色
        this.panel.append('svg:circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 0.85 * radius)    //  半径不一样,第二个圆半径
          .style('fill', 'transparent')
          .style('stroke', this.mconfig.colors[1])
          .style('stroke-width', '12px')
      },
      valueToPoint (value, config, factor) {
        let {cx, cy, radius, range, min, max} = config

        var degree = (value / range * max - (min / range * max + 360)) * Math.PI / 180

        return {
          x: cx - radius * factor * Math.cos(degree),
          y: cy - radius * factor * Math.sin(degree)
        }
      },
      renderKdLine (params) {
        let panel = this.panel
        let {range, kdradius, cx, cy, min, max, minorTicks, majorTicks, kdcolor} = this.mconfig
        var kdConfig = {
          cx: cx,
          cy: cy,
          radius: kdradius,
          range: range,
          min: min,
          max: max
        }
        let majorDelta = range / (majorTicks - 1)// 大刻度之间的距离
        for (let major = min; major <= max; major += majorDelta) {
          // 循环每个大刻度
          let minorDelta = majorDelta / minorTicks // 小刻度之间的距离
          for (let minor = major + minorDelta; minor < Math.min(major + majorDelta, max); minor += minorDelta) {      // 循环每个小刻度
            let point1 = this.valueToPoint(minor, kdConfig, 0.75)
            let point2 = this.valueToPoint(minor, kdConfig, 0.85) // 刻度线的长度
            // 获取小刻度线的（x1,y1）(x2,y2)位置
            // 添加小刻度线
            panel.append('svg:line')
              .attr('x1', point1.x) // 小刻度线的两点坐标
              .attr('y1', point1.y)
              .attr('x2', point2.x)
              .attr('y2', point2.y)
              .style('stroke', kdcolor)// 小刻度线颜色
              .style('stroke-width', '1px')// 小刻度的宽度
          }
          //  获取大刻度线的（x1,y1）(x2,y2)位置
          let point3 = this.valueToPoint(major, kdConfig, 0.80)
          let point4 = this.valueToPoint(major, kdConfig, 0.85)
          //  添加大刻度线
          panel.append('svg:line')
            .attr('x1', point3.x)
            .attr('y1', point3.y)
            .attr('x2', point4.x)
            .attr('y2', point4.y)
            .style('stroke', kdcolor)
            .style('stroke-width', '1px')
        }
      },
      renderRadius () {
        let panel = this.panel
        let {radius, cx, cy, degree} = this.mconfig
      // 3.5画遮罩弧度，颜色区域 角度遮罩
        var startAngle = Math.PI / 2 - 1.08  // 这里 -0.02 是为了让起点弧度不留白
        var endAngle = degree * Math.PI / 180 + Math.PI / 2
        panel.append('svg:path')             // 添加路径
          .style('fill', this.mconfig.colors[2])
          // .style('fill-opacity', 0.95)  // 填充的透明度
          .style('stroke-width', '2px')
          .attr('d', d3.arc()  // 添加圆弧
            .startAngle(startAngle)
            .endAngle(endAngle)
            .innerRadius(0.79 * radius)  // 内圈半径
            .outerRadius(0.93 * radius))  // 外圈半径
          .attr('transform', function () { // 移动+旋转
            return 'translate(' + cx + ', ' + cy + ') rotate(180)'
          })
      }

    }
  }
</script>
<style lang="scss">
  .h-ybpchart{
    position: relative;
    width:100%;
    height:100%;
  }
  .h-ybpchart-zhizhen{
    transform-origin: 90% center; /* 定义图片旋转中心点 */
    z-index: 5;
  }
  .h-chart-zhizhen{
    position: absolute;
    width:100%;
    top: 97%;
   // transform: translate(-35px, 0px) scale(0.8, 0.8);
  }
  .h-pie-label{
    font-size: 12px;
    color: #fdffff;
    width: 100%;
    position: absolute;
    bottom: -30%;
    /*padding: 0px 20px;*/
    justify-content: space-around;
  }
  .h-pie__label_max{
    transform: translate(15px,0px) scale(1, 1.7);
  }
  .h-pie__label_min{
    transform: translate(-2px,0px) scale(1, 1.7);
  }
</style>
