<template>
  <div :style="style" class="visual-container transform-element unselectable" :class="{selected: selected, 'pop-out': isPopOut, 'spotlight': spotlight, 'hide-border': !editable, 'read-mode': !editable}">
    <div class="visual-container-border"></div>
    <div class="visual-container-header">
      <div class="vc-header">
        <loader v-show="loading"></loader>
        <div class="drag-grip" v-if="editable"> <i class="iconfont yg-a"></i></div>
        <div class="options-menu flex">
          <button v-if="isDataVisualType" @click="togglePopOut()" type="button" class="item-fill" :title="isPopOut ? '退出全屏': '全屏'"><span class="sr-only">{{ isPopOut ? '退出全屏': '全屏'}}</span><i class="iconfont" :class="isPopOut ? 'yg-tuichuquanping' : 'yg-quanping'"></i> </button>
          <button type="button" ref="moreMenu" @click.capture="showMenu" class="item-fill" title="更多选项"><span class="sr-only">更多选项</span> <i class="iconfont yg-caidan"></i></button>
        </div>
      </div>
    </div>
    <div class="vc-body" :style="bodyStyle">
      <div class="visual-title pre-text-with-ellipsis" v-if="visualTitle" :title="visualTitle" :style="visualTitleStyle" ref="visualTitle">{{ visualTitle }}</div>
      <div class="vc-error" v-if="error">{{error}}</div>
      <div class="watermark" v-html="watermark" v-if="isShowWatermark"></div>
      <component v-else
                 ref="visual"
                 :class="visualClass"
                 :style="visualStyle"
                 :is="visualView"
                 :id="id"
                 :format="format"
                 :type="type"
                 :appending="appending"
                 :editable="editable"
                 :defaultFormat="defaultFormat"
                 :config="config"
                 :data="data"
                 :width="visualSize.width"
                 :height="visualSize.height"
                 @fetchData="fetchData"
                 @sortData="sortData"
                 @linkage="linkage">
      </component>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import _ from 'underscore'
  import tinycolor from 'tinycolor2'
  import { Message } from 'element-ui'

  import watermarkData from './visual/watermark'

  import 'jquery-ui/ui/widgets/resizable'
  import 'jquery-ui/ui/widgets/draggable'

  import ETable from './visual/ETable'
  import Textbox from './visual/Textbox'
  import BaseShape from './visual/BasicShape'
  import Slicer from './visual/Slicer'

  import ContextMenu from '../../common/contextMenu'
  import Loader from '../common/Loader.vue'
  import { getFormatValue, getVisualTitleProperties, getVisualTitleStyle, isDataVisualType } from '../../api/common'
  import {
    FORMAT_TYPES,
    QUERY_TYPE,
    VISUAL_TYPES
  } from '../../api/constant'
  import { toBoolean } from '../../common/utils'
  import DataBigConfirm from './modals/DataBigConfirm.vue'
  import DataTimeoutConfirm from './modals/DataTimeoutConfirm.vue'
  import DataAbort from './modals/DataAbort.vue'
  import ExportConfirm from './modals/ExportConfirm.vue'
  import { createNotification } from '../../api/data'

  const VC_HEADER_HEIGHT = 27

  export default {
    name: 'visual-container',
    components: {
      Loader,
      ETable: ETable,
      Textbox: Textbox,
      BaseShape: BaseShape,
      Slicer: Slicer
    },
    props: {
      editable: Boolean,
      spotlight: Boolean,
      popOut: Boolean,
      cards: {},
      format: Object,
      id: [Number, String],
      sectionId: String,
      visibility: Boolean,
      datasetId: [Number, String],
      type: [String, Number],
      data: [Object, Array],
      config: Object,
      width: Number,
      height: Number,
      appending: Boolean,
      x: Number,
      y: Number,
      z: Number,
      scale: Number,
      selected: Boolean,
      canvasWidth: Number,
      canvasHeight: Number
    },

    data () {
      return {
        error: null,
        isPopOut: this.popOut,
        loading: false,
        isDataVisualType: isDataVisualType(this.type)
      }
    },

    created () {
      if (!this.isShowWatermark && this.isDataVisualType && !this.data) {
        this.fetchData()
      }
    },

    mounted () {
      const $el = $(this.$el)
      const $containment = $el.closest('.display-area')
      const resizeThrottle = _.throttle((size) => {
        this.visualResize({
          width: size.width,
          height: size.height - VC_HEADER_HEIGHT
        }, false)
      }, 20, {
        leading: true,
        trailing: false
      })

      $el.on('resize', (event) => {
        event.stopPropagation()
      })

      $el.resizable({
        containment: $containment,
        disabled: !this.editable,
        classes: {},
        zIndex: 2,
        handles: 'all',
        minHeight: 50,
        minWidth: 200,
        resize: (event, ui) => {
          resizeThrottle(ui.size)
        },
        start: () => {
          const grid = this.adJustGrid(this.x * this.scale, this.y * this.scale)
          if (!_.isEqual(grid, $el.resizable('option', 'grid'))) {
            $el.resizable('option', 'grid', grid)
          }
          this.$refs['visual'] && this.$refs['visual'].$emit('startResize')
        },
        stop: (event, ui) => {
          this.$emit('resize', {
            id: this.id,
            x: Math.round(ui.position.left / this.scale),
            y: Math.round(ui.position.top / this.scale),
            width: Math.round(ui.size.width / this.scale),
            height: Math.round(ui.size.height / this.scale)
          })
          this.$refs['visual'] && this.$refs['visual'].$emit('endResize')
        }
      }).draggable({
        disabled: !this.editable,
        containment: $containment,
        drag: (event, ui) => {
        },
        start: (event) => {
          const grid = this.adJustGrid(this.x * this.scale, this.y * this.scale)
          if (!_.isEqual(grid, $el.draggable('option', 'grid'))) {
            $el.draggable('option', 'grid', grid)
          }
          if (!this.selected) {
            this.$emit('select', event, this.id)
          }
          if (this.$refs['visual']) {
            this.$nextTick(() => {
              this.$refs['visual'].$emit('startMove')
            })
          }
        },
        stop: (event, ui) => {
          this.$emit('move', {
            id: this.id,
            x: Math.round(ui.position.left / this.scale),
            y: Math.round(ui.position.top / this.scale)
          })
          this.$refs['visual'] && this.$refs['visual'].$emit('endMove')
        }
      })
    },

    beforeDestroy () {
      $(this.$el)
        .resizable({disabled: true})
        .resizable('destroy')
        .draggable({disabled: true})
        .draggable('destroy')
    },

    computed: {
      defaultFormat () {
        const format = {}
        const values = this.$store.state.report.formatDefaultValues[this.type] || {}
        Object.keys(values).forEach(cardName => {
          format[cardName] = format[cardName] || {}
          Object.keys(values[cardName]).forEach(sliceName => {
            format[cardName][sliceName] = values[cardName][sliceName]['value']
          })
        })
        return format
      },

      isShowWatermark () {
        return isDataVisualType(this.type) ? _.isEmpty(this.config.fieldProperties) : false
      },

      visualTitle () {
        if (FORMAT_TYPES.TITLE_CARD in this.format) {
          const card = this.format[FORMAT_TYPES.TITLE_CARD] || {}
          const title = card[FORMAT_TYPES.TITLE]
          if (toBoolean(title)) {
            return card[FORMAT_TYPES.TITLE_TEXT] || ''
          }
        }
        return ''
      },

      visualTitleProperties () {
        return getVisualTitleProperties(this.format)
      },

      visualTitleStyle () {
        return getVisualTitleStyle(this.visualTitleProperties)
      },

      visualClass () {
        const type = VISUAL_TYPES[this.type]
        return ['visual', `visual-${type}`]
      },

      visualView () {
        switch (this.type) {
          case VISUAL_TYPES.MATRIX:
          case VISUAL_TYPES.TABLE:
            return 'ETable'
          case VISUAL_TYPES.TEXTBOX:
            return 'Textbox'
          case VISUAL_TYPES.IMAGEBOX:
            return 'Imagebox'
          case VISUAL_TYPES.BASE_SHAPE:
            return 'BaseShape'
          case VISUAL_TYPES.SLICER:
            return 'Slicer'
          default:
            return 'ETable'
        }
      },

      visualStyle () {
        let titleHeight = 0
        let properties = this.visualTitleProperties
        if (properties['height']) {
          titleHeight = properties['height']
        }
        return {
          height: this.visualTitle ? this.visualSize.height - titleHeight : this.visualSize.height
        }
      },

      style () {
        if (this.isPopOut) {
          return {
            width: this.canvasWidth + 'px',
            height: this.canvasHeight + 'px',
            top: 0,
            left: 0
          }
        } else {
          return {
            width: Math.round(this.width * this.scale) + 'px',
            height: Math.round(this.height * this.scale) + 'px',
            'z-index': this.z,
            top: Math.round(this.y * this.scale) + 'px',
            left: Math.round(this.x * this.scale) + 'px'
          }
        }
      },

      bodyStyle () {
        const style = {}
        if (FORMAT_TYPES.BACKGROUND_CARD in this.format) {
          const card = this.format[FORMAT_TYPES.BACKGROUND_CARD] || {}
          const background = card[FORMAT_TYPES.BACKGROUND]

          if (toBoolean(background)) {
            const backgroundColor = card[FORMAT_TYPES.BACKGROUND_COLOR]
            const transparency = card[FORMAT_TYPES.BACKGROUND_TRANSPARENCY]

            if (backgroundColor) {
              let color
              color = tinycolor(backgroundColor)
              if (color.isValid()) {
                if ($.isNumeric(transparency)) {
                  color.setAlpha(((100 - transparency) / 100).toFixed(2))
                }
                style['background-color'] = color.toRgbString()
              }
            }
          }
        }
        if (FORMAT_TYPES.BORDER_CARD in this.format) {
          const card = this.format[FORMAT_TYPES.BORDER_CARD] || {}
          const border = card[FORMAT_TYPES.BORDER]

          if (toBoolean(border)) {
            const borderWidth = card[FORMAT_TYPES.BORDER_WIDTH]
            const borderColor = card[FORMAT_TYPES.BORDER_COLOR]
            if (borderWidth && $.isNumeric(borderWidth) && borderWidth > 0 && borderColor && tinycolor(borderColor).isValid()) {
              style['border'] = `${borderWidth}px solid ${borderColor}`
            }
          }
        }

        /*
        if (!this.isPopOut && this.scale !== 1) {
          Object.assign(style, {
            width: this.width + 'px',
            height: (this.height - VC_HEADER_HEIGHT) + 'px',
            transform: 'scale(' + ((this.height * this.scale - VC_HEADER_HEIGHT) / (this.height - VC_HEADER_HEIGHT)) + ')'
          })
        }
        */

        return style
      },

      visualSize () {
        let {width, height} = this
        if (this.isPopOut) {
          width = this.canvasWidth
          height = this.canvasHeight - VC_HEADER_HEIGHT
        } else {
          width = Math.round(this.width * this.scale)
          height = Math.round(this.height * this.scale) - VC_HEADER_HEIGHT
        }
        return {width, height}
      },

      bodySize (size) {
        const {width, height} = size
        const bodyWidth = width / this.scale
        const bodyHeight = height / this.scale - VC_HEADER_HEIGHT
        $(this.$el).find('.vc-body').css({
          width: bodyWidth + 'px',
          height: bodyHeight + 'px',
          transform: 'scale(' + (height - VC_HEADER_HEIGHT) / (bodyHeight - VC_HEADER_HEIGHT) + ')'
        })
      },

      watermark () {
        if (watermarkData[this.type]) {
          return watermarkData[this.type]
        }
      }
    },

    methods: {
      isAdjustGrid (x, y) {
        if (this.$parent.$refs['dotGrid']) {
          const dotGrid = this.$parent.$refs['dotGrid']
          const preX = dotGrid.layoutX.unitLength / dotGrid.layoutX.unitDivisions
          const preY = dotGrid.layoutY.unitLength / dotGrid.layoutY.unitDivisions
          let grid = [Math.round(preX), Math.round(preY)]
          return x % grid[0] === 0 && y % grid[0] === 0
        }
        return true
      },
      adJustGrid (x, y) {
        let grid = false
        if (this.$parent.isAdjustGrid && this.$parent.$refs['dotGrid']) {
          const dotGrid = this.$parent.$refs['dotGrid']
          const preX = dotGrid.layoutX.unitLength / dotGrid.layoutX.unitDivisions
          const preY = dotGrid.layoutY.unitLength / dotGrid.layoutY.unitDivisions
          grid = [preX, preY]
          if (y < 27) {
            grid[1] = 1
          }
          /*
          if (x % grid[0] !== 0) {
            grid[0] = Math.ceil(x / grid[0]) * grid[0] - x
          }
          if (y < 27) {
            if ((27 - y) % grid[1] !== 0) {
              grid[1] = Math.ceil((27 - y) / grid[1]) * grid[1] - y
            }
          } else {
            if (y % grid[1] !== 0) {
              grid[1] = Math.ceil(y / grid[1]) * grid[1] - y
            }
          }
          */
        }
        return grid
      },

      toggleResize (disabled) {
        $(this.$el).resizable({disabled: !!disabled})
      },

      toggleDrag (disabled) {
        $(this.$el).draggable({disabled: !!disabled})
      },

      togglePopOut () {
        this.isPopOut = !this.isPopOut
      },

      visualResize (size) {
        if (!size) {
          size = this.visualSize
        }
        if (this.$refs['visual'] && this.visualTitle) {
          $(this.$refs['visual'].$el).css('height', this.visualStyle.height)
        }
        if (this.$refs['visual'] && this.$refs['visual'].resize) {
          this.$refs['visual'].resize(size)
        }
      },

      showMenu (event) {
        event.stopPropagation()
        let contextMenu
        let options = []
        if (this.isDataVisualType && this.data) {
          options.push({
            name: '导出数据',
            props: {
              'icon': 'yg-daochushuju'
            },
            on: {
              click: () => {
                this.$vuedals.open({
                  name: 'exportConfirm',
                  title: '提示',
                  props: {
                    onConfirm: () => {
                      const notification = createNotification({
                        title: '正在导出数据',
                        type: 3,
                        message: '在我们导出数据时，您仍可以执行其他操作。',
                        delay: 0
                      })
                      this.$store.commit('report/notify', notification)
                      this.$store.dispatch('report/exportTableData', {id: this.id}).then(() => {
                        this.$store.commit('report/dismissNotification', {id: notification.id})
                      }, (e) => {
                        this.$store.commit('report/dismissNotification', {id: notification.id})
                        console.error(e)
                        Message.error('导出数据失败')
                      })
                      this.$vuedals.close()
                    }
                  },
                  component: ExportConfirm
                })
                contextMenu.hide()
              }
            }
          })
        }
        if (this.editable) {
          options.push({
            name: '删除',
            props: {
              'icon': 'yg-shanchu'
            },
            on: {
              click: () => {
                this.$emit('remove', this.id)
                contextMenu.hide()
              }
            }
          })
        }
        options = options.concat([
          {
            name: '聚焦',
            props: {
              'icon': 'yg-jujiao',
              selected: this.spotlight
            },
            on: {
              click: () => {
                this.$emit('spotlight', this.spotlight ? null : this.id)
                if (this.isPopOut === true) {
                  this.togglePopOut()
                }
                contextMenu.hide()
              }
            }
          }
        ])
        if (this.$refs['visual'] && this.$refs['visual'].menuOptions) {
          options = this.$refs['visual'].menuOptions(options, this)
        }
        contextMenu = new ContextMenu(options)
        contextMenu.show(event, 'element')
      },

      fetchData (params = {}) {
        if (this.isDataVisualType) {
          this.fetchTableData(params)
        }
      },

      fetchTableData (params = {}) {
        if (_.isObject(params.sxzCc)) {
          const levelRowValue = getFormatValue(this.format, FORMAT_TYPES.LEVEL, FORMAT_TYPES.LEVEL_ROW)
          this.$store.commit('report/setVisualContainerPropertyFormat', {
            id: this.id,
            cardName: FORMAT_TYPES.LEVEL,
            sliceValues: {
              [FORMAT_TYPES.LEVEL_ROW]: Object.assign({}, levelRowValue || {}, params.sxzCc)
            }
          })
        }

        if (!_.isUndefined(params.lcc)) {
          this.$store.commit('report/setVisualContainerPropertyFormat', {
            id: this.id,
            cardName: FORMAT_TYPES.LEVEL,
            sliceValues: {
              [FORMAT_TYPES.LEVEL_COLUMN]: params.lcc
            }
          })
        }

        this.error = null
        if (_.isEmpty(this.config.fieldProperties)) {
          if (this.data) {
            this.$store.commit('report/updateVisualContainerData', {id: this.id, data: null})
          }
        } else {
          this.loading = true
          this.$store.dispatch('report/fetchTableData', {id: this.id, params}).then(resp => {
            this.loading = false

            if (!resp) {
              return
            }

            if (resp.tablebasicInfo) {
              if (!_.isUndefined(resp.tablebasicInfo.scrollId) && resp.tablebasicInfo.scrollId !== null) {
                this.queryParams = {
                  scrollId: resp.tablebasicInfo.scrollId
                }
              }
              if ([QUERY_TYPE.NORMAL, QUERY_TYPE.JH].indexOf(resp.tablebasicInfo.qureyType) !== -1) {
                const queryType = parseInt(resp.tablebasicInfo.qureyType) || 1
                if (queryType !== this.queryType) {
                  this.$store.commit('report/setVisualContainerPropertyFormat', {
                    id: this.id,
                    cardName: FORMAT_TYPES.EXTEND,
                    sliceValues: {
                      [FORMAT_TYPES.EXTEND_QUERY_MODE]: queryType
                    }
                  })
                }
              }
            }

            if (resp.checkQueryResult) {
              const checkCode = resp.checkQueryResult.checkCode
              switch (checkCode) {
                case 1:
                  this.$vuedals.open({
                    name: 'dataBigConfirm',
                    title: '提示',
                    props: {
                      onConfirm: () => {
                        params = params || {}
                        params.isForce = true
                        this.fetchData(params)
                        this.$vuedals.close()
                      }
                    },
                    component: DataBigConfirm
                  })
                  break
                case 2:
                  this.$vuedals.open({
                    name: 'dataAbortConfirm',
                    title: '提示',
                    component: DataAbort
                  })
                  break
                case 3:
                  this.$vuedals.open({
                    name: 'dataTimeoutConfirm',
                    title: '提示',
                    props: {
                      onConfirm: () => {
                        this.fetchData()
                        this.$vuedals.close()
                      }
                    },
                    component: DataTimeoutConfirm
                  })
                  break
                case 4:
                  Message.warning('聚合数据量过大，转换中止，请过滤后再试！')
                  break
                case 5:
                  Message.warning('聚合数据量过大，自动转换为查询模式')
                  break
                case 20:
                  Message.warning('行数过多，请求中断')
                  break
                case 21:
                  Message.warning('列数过多，请求中断')
                  break
                case 22:
                  Message.warning('行列数过多，请求中断')
                  break
              }
            }
          }).catch(() => {
            this.error = '获取数据失败'
            this.loading = false
          })
        }
      },

      sortData (params) {
        this.$store.commit('report/actionFieldProperty', {
          visualContainerId: this.id,
          propertyId: params.sxmc,
          action: 'pxlx',
          value: params.pxlx
        })
      },

      linkage (isStart, data) {
        if (isStart) {
          this.$store.commit('report/startLinkage', {
            data
          })
        } else {
          this.$store.commit('report/stopLinkage', {
            data
          })
        }
      },

      getFormatChanged (format, oldFormat) {
        if (!oldFormat) {
          return format
        }
        const changed = {}
        for (const cardName in format) {
          if (!format.hasOwnProperty(cardName)) {
            break
          }
          if (!oldFormat[cardName]) {
            changed[cardName] = format[cardName]
          } else {
            const slices = format[cardName]
            const oldSlices = oldFormat[cardName]
            for (const sliceName in slices) {
              if (!slices.hasOwnProperty(sliceName)) {
                break
              }
              if (!_.isEqual(slices[sliceName], oldSlices[sliceName])) {
                changed[cardName] = changed[cardName] || {}
                changed[cardName][sliceName] = slices[sliceName]
              }
            }
          }
        }
        return changed
      }
    },
    watch: {
      id (id) {
        if (id !== this.$store.getters['report/popOutId']) {
          this.isPopOut = false
          this.$emit('spotlight', null)
        }
      },
      editable (editable) {
        this.toggleResize(!editable)
        this.toggleDrag(!editable)
      },
      'config.needsUpdate' (needsUpdate) {
        if (needsUpdate === true) {
          this.fetchData()
        }
      },
      format (format, oldFormat) {
        const changed = this.getFormatChanged(format, oldFormat)
        if (FORMAT_TYPES.GENERAL in changed) {
          if (_.some([
            FORMAT_TYPES.GENERAL_WIDTH,
            FORMAT_TYPES.GENERAL_HEIGHT
          ], function (key) {
            return key in changed[FORMAT_TYPES.GENERAL]
          })) {
            this.$nextTick(() => {
              this.visualResize()
            })
          }
          if (_.keys(changed).length === 1) {
            const generalKeys = [FORMAT_TYPES.GENERAL_X, FORMAT_TYPES.GENERAL_Y, FORMAT_TYPES.GENERAL_HEIGHT, FORMAT_TYPES.GENERAL_WIDTH]
            const general = _.keys(changed[FORMAT_TYPES.GENERAL])
            if (_.every(general, key => generalKeys.indexOf(key) !== -1)) {
              return
            }
          }
        }
        if (this.$refs['visual'] && this.$refs['visual'].doFormat && !_.isEmpty(changed)) {
          this.$refs['visual'].doFormat(changed)
        }
      },
      'visualTitleStyle.height' () {
        this.visualResize()
      },
      isPopOut () {
        this.visualResize()
        if (this.isPopOut === true && this.spotlight) {
          this.$emit('spotlight', null)
        }
        this.$emit('popOut', this.isPopOut, this.id)
        this.$nextTick(() => {
          if (!this.editable) {
            return
          }
          this.toggleResize(this.isPopOut)
          this.toggleDrag(this.isPopOut)
        })
      },
      scale () {
        this.visualResize()
      },
      canvasWidth () {
        this.visualResize()
      },
      canvasHeight () {
        this.visualResize()
      }
    }
  }
</script>
