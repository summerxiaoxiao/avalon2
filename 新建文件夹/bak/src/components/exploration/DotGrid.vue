<template>
  <div class="dot-grid">
    <div class="dot-container">
      <div class="hide-edge-dots">
        <div class="background" :style="backgroundStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import _ from 'underscore'

  const DOT_COLOR = '#333'
  const CANVAS_LAYOUT = {
    unitLength: 8 * 12,
    unitDivisions: 12
  }
  const ALLOWED_UNIT_DIVISIONS = [12, 6, 4, 3, 2, 1]
  const MINIMUM_UNIT_DIVISIONS_LENGTH = 8

  export default {
    name: 'dot-grid',
    props: {
      uiScale: Object,
      canvasWidth: Number,
      canvasHeight: Number
    },
    computed: {
      layoutX () {
        return this.getLayoutForScreen(this.uiScale.x * this.canvasWidth, this.canvasWidth)
      },
      layoutY () {
        return this.getLayoutForScreen(this.uiScale.y * this.canvasHeight, this.canvasHeight)
      },
      backgroundStyle () {
        const canvas = this.drawGridUnit(this.layoutX, this.layoutY)
        return {
          'background-image': 'url(' + canvas.toDataURL('image/png') + ')'
        }
      }
    },
    methods: {
      drawGridUnit (layoutX, layoutY) {
        const canvas = $('<canvas></canvas>').attr({
          width: layoutX.unitLength,
          height: layoutY.unitLength
        }).get(0)

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = DOT_COLOR
        for (let i = 0; i < layoutX.unitDivisions; ++i) {
          const x = Math.round(i * layoutX.unitLength / layoutX.unitDivisions)
          ctx.fillRect(x, 0, 1, 1)
        }
        for (let i = 0; i < layoutY.unitDivisions; ++i) {
          const y = Math.round(i * layoutY.unitLength / layoutY.unitDivisions)
          ctx.fillRect(0, y, 1, 1)
        }
        return canvas
      },

      getLayoutForScreen (screenLength, canvasLength) {
        let unitLength = screenLength / (canvasLength / CANVAS_LAYOUT.unitLength)
        unitLength = Math.floor(unitLength)
        const unitDivisions = _.find(ALLOWED_UNIT_DIVISIONS, d => {
          return d === 1 || (unitLength / d) >= MINIMUM_UNIT_DIVISIONS_LENGTH
        })
        return {
          unitLength,
          unitDivisions
        }
      },

      adjustScaleForGrid (scale, canvasSize) {
        return {
          x: this.adjustOneScaleForGrid(scale.x, canvasSize.width),
          y: this.adjustOneScaleForGrid(scale.y, canvasSize.height)
        }
      },

      adjustOneScaleForGrid (scale, canvasLength) {
        const layout = this.getLayoutForScreen(scale * canvasLength, canvasLength)
        const newScale = layout.unitLength / CANVAS_LAYOUT.unitLength
        const newLayout = this.getLayoutForScreen(newScale * canvasLength, canvasLength)
        return newLayout.unitLength / CANVAS_LAYOUT.unitLength
      }
    }
  }
</script>
