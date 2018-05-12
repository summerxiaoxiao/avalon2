<template>
  <div class="exploration-canvas" :class="{'exploration-canvas-to-bottom': isPopOut, 'pop-out': isPopOut, 'has-spotlight': !!spotlightId}" :style="canvasStyle" ref="explorationCanvas" @click="deselectVisualContainer">
    <div class="display-area" :class="displayAreaClass" :style="getDisplayAreaStyle()" id="displayArea">
      <div class="visual-background-container" :style="backgroundStyle"></div>
      <div class="visual-container-host">
        <dot-grid v-if="isShowGrid || isAdjustGrid" v-show="isShowGrid" :uiScale="uiScale" :canvasWidth="this.width" :canvasHeight="this.height" ref="dotGrid"></dot-grid>
        <visual-container
          v-for="item in visualContainers"
          v-bind="item"
          :editable="editable"
          :key="item.oldId ? item.oldId : item.id"
          :selected="item.id === selectedVisualContainerId"
          :scale="scale"
          :canvasWidth="size ? size.width : null"
          :canvasHeight="size ? size.height : null"
          :spotlight = "spotlightId === item.id"
          :popOut = "$store.getters['report/popOutId'] === item.id"
          @click.native="selectVisualContainer($event, item.id)"
          @select="selectVisualContainer"
          @spotlight="spotlightVisualContainer"
          @move="moveVisualContainer"
          @resize="resizeVisualContainer"
          @remove="removeVisualContainer"
          @popOut="handlePopOut"
        >
        </visual-container>
      </div>
    </div> <!-- /.exploration-canvas -->
  </div>
</template>

<script>
  import $ from 'jquery'
  import tinycolor from 'tinycolor2'
  import resizeSensor from '@/../lib/resizeSensor'

  import VisualContainer from './VisualContainer.vue'
  import { FORMAT_TYPES } from '../../api/constant'
  import DotGrid from './DotGrid.vue'

  let resizeId = 0
  const CANVAS_PADDING = 8

  export default {
    name: 'exploration-canvas',

    components: {
      DotGrid,
      VisualContainer},

    props: {
      isPopOut: Boolean,
      editable: Boolean,
      section: Object
    },

    data () {
      let {width, height, viewMode} = this.section
      if (this.isPopOut) {
        viewMode = null
      }
      return {
        spotlightId: null,
        width,
        height,
        viewMode,
        scale: 1.0,
        displayAreaClass: ['fit-to-screen'],
        canvasStyle: {},
        size: null
      }
    },

    mounted () {
      this.resizeSensorId = 'exploration_canvas_' + resizeId++
      resizeSensor.create(this.$refs['explorationCanvas'], this.resizeSensorId, (size) => {
        this.size = size
        this.resize(size)
      })

      this.size = {
        width: $(this.$refs['explorationCanvas']).outerWidth(),
        height: $(this.$refs['explorationCanvas']).outerHeight()
      }
      this.resize(this.size)

      document.addEventListener('keyup', this.handleDelete)
    },

    beforeDestroy () {
      if (this.resizeSensorId) {
        resizeSensor.destroy(this.resizeSensorId)
      }
      document.removeEventListener('keyup', this.handleDelete)
    },

    computed: {
      isShowGrid () {
        return this.$store.getters['report/isShowGrid']
      },
      isAdjustGrid () {
        return this.$store.getters['report/isAdjustGrid']
      },
      uiScale () {
        if (!this.size) {
          return {x: 1.0, y: 1.0}
        } else if (this.viewMode === null) {
          return {
            x: (this.width - CANVAS_PADDING * 2) / this.section.width,
            y: this.height / this.section.height
          }
        } else {
          return {
            x: this.scale,
            y: this.scale
          }
        }
      },

      selectedVisualContainerId () {
        return this.$store.state.report.currentVisualContainerId
      },

      visualContainers () {
        return this.$store.getters['report/currentVisualContainers'].filter(d => d.visibility)
      },

      backgroundStyle () {
        const currentSection = this.$store.getters['report/currentSection']
        if (!currentSection) {
          return {}
        }
        const format = currentSection.format || {}
        const style = {}
        if (FORMAT_TYPES.BACKGROUND in format) {
          const card = format[FORMAT_TYPES.BACKGROUND] || {}
          const backgroundColor = card[FORMAT_TYPES.BACKGROUND_COLOR]
          const transparency = card[FORMAT_TYPES.BACKGROUND_TRANSPARENCY]

          let color = tinycolor(backgroundColor)
          if (color.isValid()) {
            if ($.isNumeric(transparency)) {
              color.setAlpha(((100 - transparency) / 100).toFixed(2))
            }
          } else {
            color = tinycolor('#ffffff')
          }

          style['background-color'] = color.toRgbString()
        }
        return style
      }
    },

    methods: {
      handleDelete (event) {
        if (event.keyCode === 46 && this.selectedVisualContainerId) {
          this.removeVisualContainer(this.selectedVisualContainerId)
        }
      },

      removeVisualContainer (id) {
        if (id === this.selectedVisualContainerId) {
          if (this.isPopOut === true) {
            this.handlePopOut(false)
          }
        }
        this.spotlightId = null
        this.$store.commit('report/removeVisualContainer', id)
      },

      moveVisualContainer ({id, x, y}) {
        if (id !== this.spotlightId) {
          this.spotlightId = null
        }
        this.$store.commit('report/setVisualContainerPropertyFormat', {
          id,
          cardName: FORMAT_TYPES.GENERAL,
          sliceValues: {
            [FORMAT_TYPES.GENERAL_X]: Math.round(x),
            [FORMAT_TYPES.GENERAL_Y]: Math.round(y)
          }
        })
      },

      spotlightVisualContainer (id) {
        this.spotlightId = id
      },

      resizeVisualContainer ({id, x, y, width, height}) {
        if (id !== this.spotlightId) {
          this.spotlightId = null
        }
        this.$store.commit('report/setVisualContainerPropertyFormat', {
          id,
          cardName: FORMAT_TYPES.GENERAL,
          sliceValues: {
            [FORMAT_TYPES.GENERAL_X]: Math.round(x),
            [FORMAT_TYPES.GENERAL_Y]: Math.round(y),
            [FORMAT_TYPES.GENERAL_WIDTH]: Math.round(width),
            [FORMAT_TYPES.GENERAL_HEIGHT]: Math.round(height)
          }
        })
      },

      selectVisualContainer (event, id) {
        if (id !== this.spotlightId) {
          this.spotlightId = null
        }
        event.stopPropagation()
        if (this.selectedVisualContainerId !== id) {
          this.$store.commit('report/selectVisualContainer', id)
        }
      },

      deselectVisualContainer () {
        this.spotlightId = null

        if (!this.selectedVisualContainerId) {
          return
        }
        if (!this.isPopOut) {
          this.$store.commit('report/selectVisualContainer', null)
        }
      },

      resize (size) {
        const offset = CANVAS_PADDING * 2
        const {width: sectionWidth, height: sectionHeight} = this.section

        if (this.viewMode === 1) { // 适应宽度
          this.width = size.width - offset
          this.scale = this.width / sectionWidth
          this.height = sectionHeight * this.scale
        } else if (this.viewMode === 2) { // 实际大小
          this.width = sectionWidth
          this.height = sectionHeight
          this.scale = 1
        } else if (this.viewMode === null) { // 适应屏幕
          this.width = size.width
          this.height = size.height
          this.scale = 1
        } else { // 适应页面
          const xScale = size.width / sectionWidth
          const yScale = size.height / sectionHeight

          if (xScale < yScale) {
            this.width = size.width
            this.height = sectionHeight * xScale
            this.scale = xScale
          } else {
            this.width = sectionWidth * yScale
            this.height = size.height
            this.scale = yScale
          }
        }

        this.displayAreaClass = this.getDisplayAreaClass(this.viewMode, size)
        this.canvasStyle = this.getCanvasStyle(size)
      },

      getDisplayAreaClass (viewMode, size) {
        const classMap = {
          0: 'fit-to-page',
          1: 'fit-to-width-centered'
        }

        // 2 实际大小
        if (viewMode !== 2) {
          if (this.height > size.height) {
            return ['fit-to-width-origin']
          }
          return [classMap[viewMode] || 'fit-to-screen']
        } else {
          if (this.width < size.width && this.height < size.height) {
            return ['actual-size-align-center', 'actual-size-align-middle', 'actual-size-centered']
          } else if (this.width < size.width) {
            return ['actual-size-align-center', 'actual-size-align-top', 'actual-size-origin']
          } else if (this.height < size.height) {
            return ['actual-size-align-left', 'actual-size-align-middle', 'actual-size-origin']
          } else {
            return ['actual-size-align-left', 'actual-size-align-top', 'actual-size-origin']
          }
        }
      },

      getCanvasStyle (size) {
        const offset = CANVAS_PADDING
        if (this.width > (size.width - offset) && this.height > size.height) {
          return {
            'transform': 'scale(1)',
            'overflow-x': 'auto',
            'overflow-y': 'auto'
          }
        } else if (this.height > size.height) {
          return {
            'transform': 'scale(1)',
            'overflow-x': 'hidden',
            'overflow-y': 'auto'
          }
        } else if (this.width > (size.width - offset)) {
          return {
            'transform': 'scale(1)',
            'overflow-x': 'auto',
            'overflow-y': 'hidden'
          }
        } else {
          return {
            'transform': 'scale(1)',
            'overflow': 'hidden'
          }
        }
      },

      getDisplayAreaStyle () {
        const {width, height} = this
        const style = {
          width: width + 'px',
          height: height + 'px'
        }

        if (this.displayAreaClass.indexOf('fit-to-screen') !== -1) {
          return {}
        }

        if (
          this.displayAreaClass.indexOf('fit-to-page') !== -1 ||
          this.displayAreaClass.indexOf('fit-to-width-centered') !== -1
        ) {
          style['margin-left'] = -width / 2 + 'px'
          style['margin-top'] = -height / 2 + 'px'
        }

        if (this.displayAreaClass.indexOf('actual-size-align-center') !== -1) {
          style['margin-left'] = -width / 2 + 'px'
        }

        if (this.displayAreaClass.indexOf('actual-size-align-middle') !== -1) {
          style['margin-top'] = -height / 2 + 'px'
        }

        return style
      },

      handlePopOut (popOut, id) {
        if (popOut) {
          this.viewMode = null
        } else {
          this.viewMode = this.section.viewMode
        }
        this.$store.commit('report/visualContainerPopOut', {popOut, id})
      }
    },

    watch: {
      'section.id' () {
        this.spotlightId = null
      },
      'section.width' () {
        if (this.size) {
          this.resize(this.size)
        }
      },
      'section.height' () {
        if (this.size) {
          this.resize(this.size)
        }
      },
      'section.viewMode' (viewMode) {
        this.viewMode = viewMode
        if (this.size) {
          this.resize(this.size)
        }
      }
    }
  }
</script>
