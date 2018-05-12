<template>
  <div @mousedown.stop="empty">
     <div ref="editor" class="textbox" :style="style"></div>
  </div>
</template>
<script>
  import 'quill/dist/quill.core.css'
  import {
    createEditor,
    convertDeltaToParagraphs,
    convertParagraphsToOps, convertParagraphsToHtml
  } from './textbox/editor'
  import Overlay from '../../../common/overlay'
  import $ from 'jquery'
  import _ from 'underscore'

  import Visual from './Visual.vue'
  import { FORMAT_TYPES } from '../../../api/constant'
  import { defaultFont, defaultSize } from '../../../common/colorFont'

  let Quill
  function getQuill () {
    if (!Quill) {
      Quill = import('quill')
    }
    return Quill
  }

  export default {
    name: 'textbox',
    mixins: [Visual],
    created () {
      if (this.editable) {
        getQuill()
      }
      const format = this.format || {}
      if (FORMAT_TYPES.TEXT in format) {
        if (FORMAT_TYPES.TEXT_VALUE in format[FORMAT_TYPES.TEXT]) {
          try {
            this.paragraphs = JSON.parse(format[FORMAT_TYPES.TEXT][FORMAT_TYPES.TEXT_VALUE])
          } catch (e) {
          }
        }
      }

      this.$on('startMove', this.toolbarHide)
      this.$on('startResize', this.toolbarHide)
      this.$on('endMove', this.updateToolbarPosition)
      this.$on('endResize', this.updateToolbarPosition)
    },
    updated () {
      this.updateToolbarPosition()
    },
    mounted () {
      if (this.editable) {
        this.initEditor()
      } else if (this.paragraphs) {
        $(this.$refs['editor']).html(convertParagraphsToHtml(this.paragraphs))
      }
    },
    beforeDestroy () {
      this.$off('startMove')
      this.$off('startResize')
      this.$off('endMove')
      this.$off('endResize')
      if (this.toolbar) {
        this.toolbar.destroy()
      }
    },
    computed: {
      style () {
        return {
          'font-family': defaultFont,
          'font-size': defaultSize + 'px'
        }
      }
    },
    methods: {
      empty () {},
      resize () {
        if (this.quill && this.quill.hasFocus()) {
          this.updateToolbarPosition()
        }
      },
      editorFocus () {
        this.quill && this.quill.focus()
        this.updateToolbarPosition()
      },
      toolbarHide () {
        this.toolbar && this.toolbar.deactive()
      },
      updateToolbarPosition () {
        this.toolbar && this.toolbar.active().update()
      },
      initEditor (enabled = true) {
        getQuill().then((Quill) => {
          const toolbarContainer = document.createElement('div')
          this.toolbar = new Overlay(this.$parent.$el, toolbarContainer, {placement: 'top-start'})
          this.quill = createEditor(Quill, this.$refs['editor'], toolbarContainer)
          this.quill.enable(enabled)

          if (Array.isArray(this.paragraphs)) {
            this.quill.setContents(convertParagraphsToOps(this.paragraphs))
          }

          if (this.$parent.selected) {
            this.editorFocus()
          }

          this.quill.on('text-change', _.debounce(() => {
            const contents = this.quill.getContents()
            const paragraphs = convertDeltaToParagraphs(contents)
            this.$store.commit('report/setVisualContainerPropertyFormat', {
              id: this.$parent.id,
              cardName: FORMAT_TYPES.TEXT,
              sliceValues: {
                [FORMAT_TYPES.TEXT_VALUE]: JSON.stringify(paragraphs)
              }
            })
          }, 600))
        })
      }
    },
    watch: {
      '$parent.selected' (selected) {
        if (selected && this.editable) {
          this.editorFocus()
        } else {
          this.toolbarHide()
        }
      },
      editable (editable) {
        if (!editable) {
          this.quill && this.quill.enable(false)
          $(this.$refs['editor']).html(this.paragraphs ? convertParagraphsToHtml(this.paragraphs) : '')
          this.toolbarHide()
        } else {
          this.initEditor()
        }
      }
    }
  }
</script>
