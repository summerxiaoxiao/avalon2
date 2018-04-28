<template>
  <div class='h-ybpchart-panel' ref="h_ybppanel">
    <img class="h-ybpchart-zhizhen" :src="zhizhenImg"
         style="display:block;"
         :style="{transform: 'rotate('+(degree)+'deg)'}">
  </div>
  <!--<div id='panel'></div>-->
</template>
<script>
  import * as d3 from 'd3'
  import _ from 'lodash'
  import zhizhenImage from '@/assets/images/mycommon/zhizhen2.png'
  const zhizhenRotate = { // 指针旋转的起始值， 顺时针旋转 ， 从左往右
    start: 0,
    end: 180
  }
  // 1.定义data数据，实现组件的可定制化
  var mconfig = {
    size: 168,             // panel的大小
    label: '完成率',       // panel的名称
    min: 0,                // 量程的最小值
    max: 180,              // 量程的最大值
    majorTicks: 11,         // 主刻度的个数
    minorTicks: 1,         // 次刻度的个数
    circleFillColor: '#4f7592',  // 大圆的fill color
    circleFillColor2: '#25e0be', // 第二个圆fill color
    circleFillColor3: '#1c3147' // 第三个圆fill color
  }             // panel显示的值
  export default {
    name: 'ybpchart',
    props: {
      val: {
        type: [Number, String],
        default: function () {
          return 220
        }
      },
      targetValue: {
        type: [Number, String],
        default: function () {
          return 240
        }
      },
      option: {
        type: Object,
        default: function () {
          return mconfig
        }
      }
    },
    data () {
      let cconfig = _.cloneDeep(this.option)
      return {
        config: cconfig,
        zhizhenImg: zhizhenImage,
        degree: cconfig.degree
      }
    },
    mounted () {
      this.panel = this.$refs.h_ybppanel
      this.panel.style.width = this.config.size + 'px'
      this.panel.style.height = this.config.size + 'px'
      // 计算阴影覆盖的角度
      this.calcDegree()
      this.render()
    },
    methods: {
      valueToPoint (value, config, factor) {
        let {cx, cy, radius, range, min, max} = config
        var degree = (value / range * max - (min / range * max + 360)) * Math.PI / 180
        return {
          x: cx - radius * factor * Math.cos(degree),
          y: cy - radius * factor * Math.sin(degree)
        }
      },
      calcDegree () { // 计算角度
        var targetVals = parseFloat(this.targetValue)
        var currentVals = parseFloat(this.val)
        if (currentVals >= targetVals) {
          targetVals = currentVals
        }
        if (targetVals !== 0) {
          var degree = (zhizhenRotate.end * currentVals) / targetVals
          this.degree = degree
        } else {
          this.degree = zhizhenRotate.end
        }
        this.config.degree = this.degree
      },
      render () { // 3. render函数
        let {
          size, cx, cy, radius, degree,
          range, min, max, minorTicks, majorTicks
        } = this.setConfig()

        // 3.2 添加svg
        let svg = d3.select(this.panel).append('svg:svg')
          .attr('class', 'h-ybpchart-svg')      // 添加类名h-ybpchart-svg
          .attr('width', size)         // 设置svg宽度
          .attr('height', size)       // 设置svg高度

        // 剪切为半圆
        this.clipCircle(svg, {size: size})

        let panel = svg.append('g')

        // 画圆
        this.renderCircle(panel)

        // 画刻度线
        this.renderKdLine(panel, {
          cx: cx,
          cy: cy,
          radius: radius,
          range: range,
          min: min,
          max: max,
          minorTicks: minorTicks,
          majorTicks: majorTicks
        })

        // 画遮罩弧度
        this.renderRadius(panel, {
          cx: cx,
          cy: cy,
          radius: radius,
          degree: degree // 旋转角度
        })
        // 画指针标记线
        this.renderMarkLine(panel, {
          cx: cx,
          cy: cy,
          radius: radius,
          degree: degree
        })
        // 画文本label
        this.renderLabelCircle(panel)
      },
      clipCircle (svg, config) { // 剪切为半圆
        // 剪切为半圆
        let {size} = config
        let clipId = 'circleClip'
        let clip = svg.append('defs').append('clipPath').attr('id', clipId)
        clip.append('svg:rect').attr('x', 0).attr('y', 0).attr('width', size).attr('height', size / 2 + 3)
        svg.style('clip-path', 'url(#' + clipId + ')')
      },
      renderCircle (panel) { // 画圆
        let {cx, cy, radius, circleFillColor, circleFillColor2} = this.setConfig()
        // 3.3画外圆
        panel.append('svg:circle')        // 添加circle，圆
          .attr('cx', cx)            // 设置circle的坐标
          .attr('cy', cy)
          .attr('r', radius)         // 设置circle的半径
          .style('fill', circleFillColor)     // 设置circle的填充颜色
          .style('stroke', '#000')   // 设置circle的轮廓颜色
          .style('stroke-width', '0px')// 设置circle的轮廓宽度

        // 3.4画内圆
        panel.append('svg:circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 0.9 * radius)    //  半径不一样
          .style('stroke', '#1c3147')
          .style('stroke-width', '7px')

        //  3.4-2 画内圆2 第二个内圆, 绿色
        panel.append('svg:circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 0.8 * radius)    //  半径不一样
          .style('fill', '#1c3147')
          .style('stroke', circleFillColor2)
          .style('stroke-width', '10px')
      },
      renderKdLine (panel, kdConfig) { // 画刻度线
        let {range, min, max, minorTicks, majorTicks} = kdConfig
        let majorDelta = range / (majorTicks - 1)   // 大刻度之间的距离
        for (let major = min; major <= max; major += majorDelta) {
          // 循环每个大刻度
          let minorDelta = majorDelta / (minorTicks - 1)   // 小刻度之间的距离
          // 循环每个小刻度
          for (let minor = major + minorDelta; minor < Math.min(major + majorDelta, max) + 1; minor += minorDelta) {
            let point1 = this.valueToPoint(minor, kdConfig, 0.60) // 调整刻度坐标位置
            let point2 = this.valueToPoint(minor, kdConfig, 0.65)
            // 获取小刻度线的（x1,y1）(x2,y2)位置
            // 添加小刻度线
            panel.append('svg:line')
              .attr('x1', point1.x) // 小刻度线的两点坐标
              .attr('y1', point1.y)
              .attr('x2', point2.x)
              .attr('y2', point2.y)
              .style('stroke', '#f1f3f5')// 小刻度线颜色
              .style('stroke-width', '2px')// 小刻度的宽度
              .style('fill-opacity', 0.8)  // 填充的透明度
          }
          //  获取大刻度线的（x1,y1）(x2,y2)位置
          let point3 = this.valueToPoint(major, kdConfig, 0.60)
          let point4 = this.valueToPoint(major, kdConfig, 0.65)
          //  添加大刻度线
          panel.append('svg:line')
            .attr('x1', point3.x)
            .attr('y1', point3.y)
            .attr('x2', point4.x)
            .attr('y2', point4.y)
            .style('stroke', '#f1f3f5')
            .style('stroke-width', '2px')
            .style('fill-opacity', 0.8)  // 填充的透明度
        } // for end
      },
      renderRadius (panel, config) {
        let {radius, cx, cy, degree} = config
        // 3.5画遮罩弧度，颜色区域 角度遮罩
        var startAngle = Math.PI / 2 - 0.02  // 这里 -0.02 是为了让起点弧度不留白
        var endAngle = degree * Math.PI / 180 + Math.PI / 2
        panel.append('svg:path')             // 添加路径
          .style('fill', '#38bb96')
          .style('fill-opacity', 0.95)  // 填充的透明度
          .style('stroke', '#f1f3f5')
          .style('stroke-width', '0px')
          .attr('d', d3.arc()  // 添加圆弧
            .startAngle(startAngle)
            .endAngle(endAngle)
            .innerRadius(0.74 * radius)  // 内圈半径
            .outerRadius(0.87 * radius))  // 外圈半径
          .attr('transform', function () { // 移动+旋转
            return 'translate(' + cx + ', ' + cy + ') rotate(180)'
          })
      },
      /***
       *画指针线标记线
       *
       */
      renderMarkLine (panel, config) {
        let {cx, cy, radius, degree} = config
        var g = panel.append('g')
          .attr('transform', function () { // 移动+旋转
            return 'translate(' + cx + ', ' + cy + ') rotate(-90)' // 旋转到0度
          })
        // 指针
        g.append('line')
          .attr('class', 'gauge-tick')
          .attr('x1', 0)
          .attr('y1', -0.74 * radius)
          .attr('x2', 0)
          .attr('y2', -(0.87 * radius - 1))  //  定义line位置，默
          .style('stroke', '#f1f3f5')
          .style('stroke-width', '2px')
          .attr('transform', function () { //  移动+旋转
            return 'rotate(' + degree + ')'  // 旋转到指定角度
          })
      },
      /**
       * 画文本和文本所有的圆
       * @param panel
       */
      renderLabelCircle (panel) {
        let {cx, cy, radius, size, label} = this.setConfig()
        // 3.4-3 画label所在的圆 ，内圆3 第三个内圆
        panel.append('svg:circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 0.52 * radius)    //  半径不一样
          .style('fill', '#1f3344')
          .style('stroke-width', '0px')
          .style('fill-opacity', 1)  // 填充的透明度

        // 3.6设置label
        let fontSize = Math.round(size / 9) // 字体大小
        // let fontSize = this.fontSize
        panel.append('svg:text')         // 添加文本
          .attr('x', cx)              // 文本位置
          .attr('y', cy - 8) // cy / 2 + fontSize / 2
          .attr('text-anchor', 'middle')// 文字角度
          .text(label)                 // 文字内容
          .style('font-size', fontSize + 'px')// 字体大小
          .style('fill', '#354b5b')        // 颜色
          .style('stroke-width', '0px')
      },
      // 2.处理数据函数setConfig()
      setConfig () {
        var config = this.config
        return {
          degree: config.degree,
          size: config.size,
          cx: config.size / 2,                 // 圆心的x坐标
          cy: config.size / 2,                 // 圆心的y坐标
          label: config.label,
          max: config.max,
          min: config.min,
          range: config.max - config.min,      // 量程
          radius: config.size * 0.97 / 2,      // 半径（稍许留白）
          minorTicks: config.minorTicks,
          majorTicks: config.majorTicks,
          circleFillColor: config.circleFillColor,
          circleFillColor2: config.circleFillColor2,
          circleFillColor3: config.circleFillColor3
        }
      }
    }

  }
</script>

<style>

  .h-ybpchart-panel {
    background:transparent;
    position: relative;
  }
  .h-ybpchart-mask {
    position: absolute;
    bottom: 0px;
    background: #1c3147;
    height: 100%;
    width: 100%;
    padding: 0px 88px;
    clip: rect(77px, 160px, 160px, 0px);
    display: block;
  }
  .h-ybpchart-zhizhen{
    position: absolute;
    top: 49.5%;
    width: 40%;
    margin-left: 15.5%;
    margin-top: -3.5%;
    transform-origin: 90% center;
    transition: transform 0.25s ease-out;
    z-index: 5;
  }
</style>
<!--
demo示例：
<h-ybpchart :val="item.hss" :targetValue="item.yss"></h-ybpchart>
-->
