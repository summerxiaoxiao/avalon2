import _ from 'underscore'
import $ from 'jquery'
import Vue from 'vue'
import tinycolor from 'tinycolor2'

import { FORMAT_TYPES, VISUAL_TYPES } from './api/constant'
import { toBoolean } from './common/utils'

import ETable from './components/exploration/visual/ETable.vue'
import BaseShape from './components/exploration/visual/BasicShape.vue'
import { getVisualTitleProperties, getVisualTitleStyle } from './api/common'

function pxToNumber (px) {
  const match = /(\d+)(px|em|rem)?$/.exec(px)
  return match ? match[1] : 0
}

export function createVisual (container, {type = null, data = null, format = {}, defaultFormat = {}} = {}) {
  const $container = $(container)

  const width = $container.width()
  const height = $container.height()

  return new Vue({
    data: {
      type,
      data,
      width,
      height,
      format,
      defaultFormat
    },
    computed: {
      style () {
        const style = {
          width: this.width + 'px',
          height: this.height + 'px'
        }
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
        return style
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
      }
    },

    created () {
      this.resize = _.throttle(this.resize, 20)
    },

    mounted () {
      window.addEventListener('resize', this.resize)
    },

    beforeDestroy () {
      window.removeEventListener('resize', this.resize)
    },

    methods: {
      resize () {
        this.width = $container.width()
        this.height = $container.height()
        if (this.$refs['visual'] && this.$refs['visual'].resize) {
          this.$refs['visual'].resize({
            width: this.width,
            height: this.height
          })
        }
      },

      getVisualTitleHeight () {
        let visualTitleHeight = 0
        if (this.$refs['visualTitle']) {
          visualTitleHeight = $(this.$refs['visualTitle']).height()
        }
        return visualTitleHeight
      }
    },

    render: function (h) {
      const nodes = []
      if (this.visualTitle) {
        nodes.push(h('div', {
          style: this.visualTitleStyle,
          'class': 'visual-title pre-text-with-ellipsis',
          attrs: {
            title: this.visualTitle
          },
          ref: 'visualTitle'
        }, this.visualTitle))
      }

      const VisualView = (() => {
        switch (this.type) {
          case VISUAL_TYPES.MATRIX:
          case VISUAL_TYPES.TABLE:
            return ETable
          case VISUAL_TYPES.BASE_SHAPE:
            return BaseShape
        }
      })()

      if (VisualView) {
        const visualTitleHeight = this.visualTitleStyle.height ? pxToNumber(this.visualTitleStyle.height) : 0
        nodes.push(h(VisualView, {
          'class': this.visualClass,
          style: {
            position: 'relative',
            width: this.width + 'px',
            height: (this.height - visualTitleHeight) + 'px'
          },
          props: {
            width: this.width,
            height: this.height,
            format: this.format,
            defaultFormat: this.defaultFormat,
            type: this.type,
            data: this.data
          },
          on: {
            fetchData: (params) => {
              this.$emit('fetchData', params)
            },
            sortData: (params) => {
              this.$emit('sortData', params)
            },
            postMessage: (params) => {
              this.$emit('postMessage', params)
            }
          },
          ref: 'visual'
        }))
      }
      return h('div', {style: this.style}, nodes)
    }
  }).$mount($('<div />').appendTo($container)[0])
}

export {request} from './api/net'
