<template>
  <div class="echart" :style="{width: width, height: height}">
    <slot></slot>
    <div ref="echart" :style="{width: width, height: height}" :data-responsive="responsive"></div>
  </div>
</template>
<script>
  import EChart from 'echarts'
  import _ from 'underscore'
  import theme from '@/views/echart.theme.json'
  EChart.registerTheme('yg', theme)

  export default {
    name: 'e-chart',
    props: {
      options: {
        type: Object,
        default: function () {
          return {
            series: []
          }
        }
      },
      responsive: {
        type: Boolean,
        'default': true
      },
      width: [Number, String],
      height: [Number, String]
    },
    mounted () {
      this.$nextTick(() => {
      })
      this.echart = EChart.init(this.$refs['echart'], 'yg')
      this.echart.setOption(this.options)
      this._autoResize = _.debounce(() => this.autoResize(), 10, true)
      if (this.responsive) {
        this.autoResize()
        window.addEventListener('resize', this._autoResize)
      }
    },
    beforeDestroy () {
      this.echart.dispose()
      if (this.responsive) {
        window.removeEventListener('resize', this._autoResize)
      }
    },
    methods: {
      autoResize () {
        let width = this.$el.clientWidth
        let height = this.$el.clientHeight ? this.$el.clientHeight : (this.height ? this.height : width)
        var vheight = getHeight(this.$el) // this.$parent.$el.querySelector('.driver-bg').clientHeight
        height = height > vheight ? vheight : height
        this.echart.resize({width, height, silent: true})
        function getHeight (node) {
          if (node.clientHeight && node.clientHeight > 100) {
            return node.clientHeight
          }
          return getHeight(node.parentNode)
        }
      }
    },
    watch: {
      responsive (responsive) {
        if (responsive) {
          this.autoResize()
          window.addEventListener('resize', this._autoResize)
        } else {
          window.removeEventListener('resize', this._autoResize)
        }
      },
      options (options) {
        this.$nextTick(() => {
          this.echart.clear()
          this.echart.setOption(options)
        })
      },
      width () {
        if (this.responsive) {
          this.autoResize()
        } else {
          this.echart.resize()
        }
      },
      height () {
        if (this.responsive) {
          this.autoResize()
        } else {
          this.echart.resize()
        }
      }
    }
  }
</script>
