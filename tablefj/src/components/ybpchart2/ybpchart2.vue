<template>
  <div class="h-ybpchart2-panel">

  </div>
</template>
<script>
  import * as d3 from 'd3'
  let _styles = {
    activeColor: '#059173',
    colors: null,
    mainColor: null,
    bgFill: '#192734',
    fontFill: '#bbd1ec',
    outerAngleBorderColor: '#f3cf25', // 外圆外边框弧度颜色
    outerBorder: '6px', // 外圆外边框
    outerBorderColor: '#275072', // 外圆边框颜色
    innerAngleBorderColor: '#00958d', // 内圆边框弧度颜色
    innerBorder: '8px'
  }
  export default {
    name: 'ybpchart2',
    props: {
      data: Array,
      styles: {
        type: Object,
        default: function () {
          return _styles
        }
      },
      innerScale: { // 内圆放大缩小
        type: Number,
        default: 2.2
      }
    },
    data () {
      return {
        innerData: {}, // 内圆的数据 {name: 1 , value: 2}
        width: 0,
        height: 0,
        fontSize: 10,
        svg: null,
        drawData: [], // 数据坐标
        innerRadius: 0, // 内圆半么
        radius: 0, // 外圆半径
        outerArc: null, // 外圆弧生成器
        outerAngleArc: null, // 外圆圆弧的生成器（生成弧度边框）
        innerArc: null, // 内圆弧生成器
        innerAngleArc: null, // 内圆圆弧的生成器（生成弧度边框）
        attrTranslate: null // 定位圆的位置
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.load()
        this.$store.commit('setSvgs', this.load)
      })
      // d3.select(window).on('resize.h-ybpchart2-panel', this.load)
    },
    methods: {
      load () {
          // init
        this.svgDiv = d3.select('.h-ybpchart2-panel')
        this.width = this.svgDiv._groups[0][0].clientWidth
        this.height = this.svgDiv._groups[0][0].clientHeight * 2 // 让半圆的半径为div的高度

        this.pieHeight = this.width < this.height ? this.width : this.height
        // 初始化一个svg元素
        this.svgContainer = this.svgDiv.html('')
          .append('svg')
          .attr('width', '100%')
          .attr('height', this.height)

        this.svg = this.svgContainer.append('g')
        // 准备一个布局，此布局可根据原始数据计算出一段弧的开始和结束角度
        // 画半圆
        let pie = d3.pie().value(d => 10) // d.y) // 平均分配扇形区域
          .startAngle(-0.5 * Math.PI) // 0度半圆形
          .endAngle(0.5 * Math.PI) // 180度

        // 最后一个data,为内圆的data
        this.listData = this.data.slice(0, this.data.length - 1) // 大圆数据
        this.innerData = this.data.slice(this.data.length - 1) // 内圆数据

        this.drawData = pie(this.listData) // 将原始数据经过布局转换

        // 根据画布大小算一个合适的半径吧
        // this.radius = Math.min(this.width, this.height) * 0.99 / 2
        this.radius = this.pieHeight * 0.98 / 2
        this.innerRadius = this.radius / this.innerScale
        // 准备一个弧生成器，用于根据角度生产弧路径
        this.outerArc = d3.arc().innerRadius(this.innerRadius).outerRadius(this.radius) // 外圆生成器
        this.outerAngleArc = d3.arc().innerRadius(this.radius).outerRadius(this.radius) // 外圆圆弧生成器

        var startAngle = this.drawData[0].startAngle // 起点
        var endAngle = this.drawData[this.drawData.length - 1].endAngle // 终点
        this.innerArc = d3.arc() // 内圆生成器
          .startAngle(startAngle)
          .endAngle(endAngle)
          .innerRadius(0)
          .outerRadius(this.innerRadius)

        this.innerAngleArc = d3.arc()  // 内圆圆弧边框生成器
          .innerRadius(this.innerRadius)
          .outerRadius(this.innerRadius)

        // 计算字体大小
        this.fontSize = this.pieHeight / 2 * 0.045

        this.lineHeight = (this.fontSize + 8) / 2

        this.attrTranslate = 'translate(' + (this.width / 2) + ', ' + (this.height / 2) + ')' // 定位圆的位置

        this.renderOuterPie() // 画外圆
        this.renderInnerPie() // 画内圆
      },
      renderOuterPie () {
        let _self = this
          // 画外边框
        this.svg.append('g').selectAll('path')
          .data(this.drawData)
          .enter()
          .append('path')
          .style('fill', 'transparent')
          .style('stroke', _self.styles.outerAngleBorderColor)
          .style('stroke-width', _self.styles.outerBorder)
          .attr('d', d => _self.outerAngleArc(d)) // 外圆弧生成器
          .attr('transform', _self.attrTranslate)
          // 画外圆
        let allPathPanel = _self.svg.append('g')
          .attr('transform', _self.attrTranslate)
        let pathPanel = allPathPanel
          .selectAll('path')
          .data(this.drawData)
          .enter()
          .append('path')
          .attr('class', 'h-svg-outCricle-path')
          .attr('fill', function (d) {
            // let c = this.styles.colors && this.styles.colors[d.index] ? this.styles.colors[d.index] || this.styles.bgFill
            return _self.styles.bgFill
          })
          .style('stroke', _self.styles.outerBorderColor) // 外圆内边框
          .attr('d', d => _self.outerArc(d)) // 调用弧生成器得到路径
          // 设置label
        let textPanel = _self.svg.append('g')
          .attr('transform', _self.attrTranslate)
          .selectAll('text')
          .data(_self.drawData)
          .enter()

        let texts = textPanel.append('text')
          .attr('class', 'h-svg-text')
          .attr('transform', function (d) { // 将文字平移到外圆的中心
            var point = _self.outerArc.centroid(d)
            point[1] = point[1] - _self.lineHeight
            return 'translate(' + point + ')'
          })
          .attr('text-anchor', 'middle')
          .style('fill', function (d) {
            if (d.data.selected) return _self.styles.activeColor
            else return _self.styles.fontFill
          })        // 颜色
          .attr('data-fill', _self.styles.fontFill)
          .style('font-size', _self.fontSize + 'px')// 字体大小
          .text(function (d) { // 显示百分比
            return d.data.name
          })

        let texts2 = textPanel.append('text')
          .attr('class', 'h-svg-value')
          .attr('transform', function (d) { // 将文字平移到弧的中心
            var point = _self.outerArc.centroid(d)
            point[1] = point[1] + _self.lineHeight
            return 'translate(' + point + ')'
          })
          .attr('text-anchor', 'middle')
          .style('fill', function (d) {
            if (d.data.selected) return _self.styles.activeColor
            else return _self.styles.fontFill
          })
          .attr('data-fill', _self.styles.fontFill)
          .style('font-size', _self.fontSize + 'px')// 字体大小
          .text(function (d) { // 显示百分比
            return d.data.value
          })

        pathPanel.on('click', this.onClick)
        texts.on('click', this.onClick)
        texts2.on('click', this.onClick)

        pathPanel.on('mouseover', this.onMouseOver)
        texts.on('mouseover', this.onMouseOver)
        texts2.on('mouseover', this.onMouseOver)

        pathPanel.on('mouseout', this.onMouseOut)
        texts.on('mouseout', this.onMouseOut)
        texts2.on('mouseout', this.onMouseOut)
      },
      renderInnerPie () {
        let _self = this
        // 画内圆外边框
        this.svg.append('g')
          .selectAll('path')
          .data(this.drawData)
          .enter()
          .append('path')
          .style('fill', 'transparent')
          .style('stroke', _self.styles.innerAngleBorderColor)
          .style('stroke-width', _self.styles.innerBorder)
          .attr('d', d => _self.innerAngleArc(d))
          .attr('transform', _self.attrTranslate)

        // 画内圆
        let circle = this.svg.append('g')
          .selectAll('path')
          .data(_self.innerData)
          .enter().append('path')
          .attr('class', 'h-svg-outCricle-path') // 添加路径
          .attr('fill', function (d) {
            // let c = this.styles.mainColor || this.styles.bgFill
            return _self.styles.bgFill
          })
          .attr('d', d => _self.innerArc(d))
          .attr('transform', _self.attrTranslate)
        // 设置label
        var textPanel = this.svg.append('g')
          .attr('transform', _self.attrTranslate)
          .selectAll('text')
          .data([_self.innerData])
          .enter()
        // 3.6设置label
        let text1 = textPanel.append('text')         // 添加文本
          .attr('class', 'h-svg-main-text')
          .attr('text-anchor', 'middle')// 文字角度
          .text(_self.innerData[0].name)                 // 文字内容
          .style('font-size', _self.fontSize + 'px')// 字体大小
          .style('fill', _self.styles.fontFill)        // 颜色
          .attr('data-fill', _self.styles.fontFill)
          .attr('transform', function (d) { // 将文字平移到内圆的中心
            var point = _self.innerArc.centroid(d)
            point[1] = point[1] - _self.lineHeight
            return 'translate(' + point + ')'
          })

        let text2 = textPanel.append('text')         // 添加文本
          .attr('class', 'h-svg-main-value')
          .attr('text-anchor', 'middle')// 文字角度
          .text(_self.innerData[0].value)                 // 文字内容
          .style('font-size', _self.fontSize + 'px')// 字体大小
          .style('fill', _self.styles.fontFill)        // 颜色
          .attr('data-fill', _self.styles.fontFill)
          .attr('transform', function (d) { // 将文字平移到内圆的中心
            var point = _self.innerArc.centroid(d)
            point[1] = point[1] + _self.lineHeight
            return 'translate(' + point + ')'
          })

        circle.on('click', this.onClick)
        text1.on('click', this.onClick)
        text2.on('click', this.onClick)

        circle.on('mouseover', this.onMouseOver)
        text1.on('mouseover', this.onMouseOver)
        text2.on('mouseover', this.onMouseOver)

        circle.on('mouseout', this.onMouseOut)
        text1.on('mouseout', this.onMouseOut)
        text2.on('mouseout', this.onMouseOut)
      },
      onClick (data) {
        let d = null
        if (!data) {
          d = null
        } else if (data.index === 0 || data.index) {
          d = data.data
          this.active(data, 1)
        } else { // main
          d = this.innerData[0]
          this.active(data, 2)
        }
        this.$emit('on-click', d)
      },
      onMouseOver (data) {
        if (!data) return
        this.active(data)
      },
      onMouseOut (data) {
        if (!data) return
        if (data.index === 0 || data.index) {
          let t1 = d3.selectAll('.h-svg-text')._groups[0][data.index]
          let t2 = d3.selectAll('.h-svg-value')._groups[0][data.index]
          var color = d3.select(t1).attr('data-fill')
          var isClick = d3.select(t1).attr('data-click')
          if (!isClick) {
            d3.select(t1).style('fill', color)
            d3.select(t2).style('fill', color)
          }
        } else {
          let main = d3.selectAll('.h-svg-main-text')._groups[0][0]
          let mainVal = d3.selectAll('.h-svg-main-value')._groups[0][0]
          var color2 = d3.select(main).attr('data-fill')
          var isClick2 = d3.select(main).attr('data-click')
          if (!isClick2) {
            d3.select(main).style('fill', color2)
            d3.select(mainVal).style('fill', color2)
          }
        }
      },
      active (data, isClearAll) {
        if (isClearAll) { // 清除选中状态
          if (isClearAll === 1) {
            this.clearAll(d3.selectAll('.h-svg-text')._groups[0], data.index)
            this.clearAll(d3.selectAll('.h-svg-value')._groups[0], data.index)
            this.clearAll(d3.selectAll('.h-svg-main-text')._groups[0], 2)
            this.clearAll(d3.selectAll('.h-svg-main-value')._groups[0], 2)
          } else if (isClearAll === 2) {
            this.clearAll(d3.selectAll('.h-svg-text')._groups[0], -1)
            this.clearAll(d3.selectAll('.h-svg-value')._groups[0], -1)
            this.clearAll(d3.selectAll('.h-svg-main-text')._groups[0], 0)
            this.clearAll(d3.selectAll('.h-svg-main-value')._groups[0], 0)
          }
        }
        if (data.index === 0 || data.index) {
          let circlePath = d3.selectAll('.h-svg-outCricle-path')._groups[0][data.index]
          d3.select(circlePath).style('cursor', 'pointer')

          let t1 = d3.selectAll('.h-svg-text')._groups[0][data.index]
          let t2 = d3.selectAll('.h-svg-value')._groups[0][data.index]

          d3.select(t1).style('cursor', 'pointer').style('fill', '#059173')
          d3.select(t2).style('cursor', 'pointer').style('fill', '#059173')
        } else {
          let main = d3.selectAll('.h-svg-main-text')._groups[0][0]
          let mainVal = d3.selectAll('.h-svg-main-value')._groups[0][0]
          d3.select(main).style('cursor', 'pointer').style('fill', '#059173')
          d3.select(mainVal).style('cursor', 'pointer').style('fill', '#059173')
        }
      },
      clearAll (arr, index) {
        for (var i = 0; i < arr.length; i++) {
          if (index === i) {
            d3.select(arr[i]).attr('data-click', 1)
            d3.select(arr[i]).style('fill', '#059173')
          } else {
            d3.select(arr[i]).attr('data-click', null)
            d3.select(arr[i]).style('fill', d3.select(arr[i]).attr('data-fill'))
          }
        }
      }
    }
  }
</script>
<style lang="scss">
  .h-ybpchart2-panel{
    position:relative;
    padding-top: 5px;
    left: 0px;
    top: 0px;
    min-height: 200px;
    width:100%;
    height:100%;
    display: flex;
    flex:1 0 auto;
    flex-flow:column
  }
</style>
