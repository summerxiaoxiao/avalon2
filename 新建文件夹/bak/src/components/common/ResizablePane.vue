<template>
  <div :style="{width: expanded ? currentWidth : collapsedWidth}">
    <slot></slot>
    <div v-show="expanded" class="pane-splitter" ref="splitter" @mousedown="mouseDownHandler"></div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'resizable-pane',
  props: {
    collapsedWidth: Number,
    defaultWidth: Number,
    minWidth: Number,
    maxWidth: Number,
    containerId: String,
    sibling: String,
    paneSide: String,
    expanded: Boolean
  },

  data () {
    return {
      currentWidth: undefined
    }
  },

  mounted () {
    this.resizeExpandedChanged(this.expanded)
  },

  methods: {
    resizeExpandedChanged (value) {
      if (value) {
        const $splitter = $(this.$refs['splitter'])
        const $containerElement = $(document).find('#' + this.containerId)
        const targetWidth = this.currentWidth === undefined ? this.defaultWidth : this.currentWidth
        this.containerWidth = $containerElement.width()
        if (this.containerWidth > 0 && this.sibling) {
          const $siblingElement = $containerElement.find('.' + this.sibling)
          if ($siblingElement.length === 1) {
            this.siblingPaneWidth = $siblingElement.width()
            const availableSpace = this.containerWidth - this.siblingPaneWidth

            if (availableSpace < targetWidth) {
              const siblingWidth = this.containerWidth - $splitter.width()
              if (siblingWidth > 0) {
                $siblingElement.css('width', siblingWidth + 'px')
              }
            }
          }
        }
        this.currentWidth = targetWidth
      }
    },

    mouseUpHandler (event) {
      if (this.isDragging) {
        event.preventDefault()
        this.isDragging = false
        $(document).off('mousemove', this.mouseMoveHandler)
        $(document).off('mouseup', this.mouseUpHandler)
      }
    },

    mouseMoveHandler (event) {
      if (!this.isDragging) {
        return
      }

      const $splitter = $(this.$refs['splitter'])
      let paneMaxWidth = this.containerWidth

      if (this.siblingPaneWidth) {
        paneMaxWidth = this.containerWidth - this.siblingPaneWidth - $splitter.width()
      }
      if (this.maxWidth) {
        paneMaxWidth = Math.min(this.maxWidth, paneMaxWidth)
      }

      let paneWidth
      if (this.paneSide === 'left') {
        paneWidth = event.clientX - this.currentPaneRight
      } else {
        paneWidth = this.currentPaneRight - event.clientX
      }

      if (paneWidth > paneMaxWidth) {
        paneWidth = paneMaxWidth
      }
      if (paneWidth < this.minWidth) {
        paneWidth = this.minWidth
      }
      $(this.$el).width(paneWidth)
      this.currentWidth = paneWidth
    },

    mouseDownHandler (event) {
      event.preventDefault()
      const $containerElement = $(document).find('#' + this.containerId)
      const $el = $(this.$el)
      this.containerWidth = $containerElement.width()
      this.currentPaneRight = $el.offset().left + (this.paneSide !== 'left' ? $el.width() : 0)
      if (this.sibling) {
        const $siblingElement = $containerElement.find('.' + this.sibling)
        if ($siblingElement.length === 1) {
          this.siblingPaneWidth = $siblingElement.width()
        } else {
          this.siblingPaneWidth = undefined
        }
      }

      this.isDragging = true

      $(document).on('mouseup', this.mouseUpHandler)
      $(document).on('mousemove', this.mouseMoveHandler)
    }
  },

  watch: {
    expanded (value) {
      this.resizeExpandedChanged(value)
    }
  }
}
</script>
