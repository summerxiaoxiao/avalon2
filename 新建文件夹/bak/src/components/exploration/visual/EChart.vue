<script>
  import _ from 'underscore'
  import Visual from './Visual.vue'
  import echarts from 'echarts'
  import {option, lineOption, pieOption} from '../../../store/example-data'
  import { VISUAL_TYPES } from '../../../api/constant'

  export default {
    name: 'EChart',
    mixins: [Visual],

    mounted () {
      echarts.registerAction('legendSelect', 'legendselected', () => {
        console.log('gg')
      })
      this.chart = echarts.init(this.$el)
      if (this.type === VISUAL_TYPES.LINE) {
        this.chart.setOption(lineOption)
      } else if (this.type === VISUAL_TYPES.PIE) {
        this.chart.setOption(pieOption)
      } else {
        this.chart.setOption(option)
      }
      this.chart.on('click', (params) => {
        console.log(params)
        if (params.componentType === 'series') {
          this.selectItem(params.seriesIndex, params.dataIndex, params.seriesType)
        }
        params.event.event.stopPropagation()
      })
      this.$el.addEventListener('click', this.deselectItem)
    },

    beforeDestroy () {
      this.chart && this.chart.dispose()
    },

    methods: {
      selectItem (seriesIndex, dataIndex, seriesType) {
        const series = this.chart.getOption()['series']
        let deselect = false
        if (
          (seriesType === 'line' &&
            _.isEqual(this.itemSelected, seriesIndex)) ||
          (_.isEqual(this.itemSelected, [seriesIndex, dataIndex]))
        ) {
          deselect = true
          this.itemSelected = null
        }
        series.forEach((seriesItem, _seriesIndex) => {
          if (seriesType === 'line') {
            if (deselect) {
              seriesItem.lineStyle.normal.opacity = 1
            } else {
              seriesItem.itemStyle = seriesItem.itemStyle || {}
              seriesItem.itemStyle.normal = seriesItem.itemStyle.normal || {}
              if (_seriesIndex === seriesIndex) {
                this.itemSelected = seriesIndex
                seriesItem.lineStyle.normal.opacity = 1
                seriesItem.itemStyle.normal.opacity = 1
              } else {
                seriesItem.lineStyle.normal.opacity = 0.2
                seriesItem.itemStyle.normal.opacity = 0.2
              }
            }
          } else {
            seriesItem.data = seriesItem.data.map((item, index) => {
              if (typeof item !== 'object') {
                item = {
                  value: item
                }
              }
              item.itemStyle = item.itemStyle || {}
              item.itemStyle.normal = item.itemStyle.normal || {}
              if (deselect) {
                item.itemStyle.normal.opacity = 1
              } else {
                if (seriesIndex === _seriesIndex && index === dataIndex) {
                  this.itemSelected = [seriesIndex, dataIndex]
                  item.itemStyle.normal.opacity = 1
                } else {
                  item.itemStyle.normal.opacity = 0.5
                }
              }
              return item
            })
          }
        })
        this.chart.setOption({
          series
        })
      },
      deselectItem () {
        if (!this.itemSelected) {
          return
        }

        this.itemSelected = null
        const series = this.chart.getOption()['series']
        series.forEach((seriesItem) => {
          if (seriesItem.type === 'line') {
            seriesItem.itemStyle = seriesItem.itemStyle || {}
            seriesItem.itemStyle.normal = seriesItem.itemStyle.normal || {}
            seriesItem.lineStyle.normal.opacity = 1
            seriesItem.itemStyle.normal.opacity = 1
          } else {
            series.data = seriesItem.data.map(item => {
              if (typeof item !== 'object') {
                item = {
                  value: item
                }
              }
              item.itemStyle = item.itemStyle || {}
              item.itemStyle.normal = item.itemStyle.normal || {}
              item.itemStyle.normal.opacity = 1
              return item
            })
          }
        })
        this.chart.setOption({
          series
        })
      },
      resize (size) {
        this.chart.resize({
          width: size.width,
          height: size.height - this.getVisualTitleHeight()
        })
      }
    },
    render (h) {
      return h('div')
    }
  }
</script>
