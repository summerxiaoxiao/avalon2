import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui/ui/widgets/droppable'

import { IntervalPromise } from '../../common/deferredPromise'
import dragDataService from '../../common/dragDataService'

export default {
  props: {
    moveItemHandler: Function
  },
  mounted () {
    this.dragdrop()
  },
  beforeDestroy () {
    this.dragdropDestroy()
  },
  methods: {
    dragdropDestroy () {
      $(this.$el).draggable({disabled: true}).draggable('destroy')
      $(this.$el).droppable({disabled: true}).droppable('destroy')
    },
    toggleDragdrop (disabled) {
      $(this.$el).draggable({disabled: !!disabled}).droppable({disabled: !!disabled})
    },
    dragdrop () {
      if (this.renaming || this.appending) {
        return
      }

      $(this.$el).draggable({
        helper: () => {
          return $(`<div class="data-drag-item data-drag-item--${this.typeName}">${this.name}</div>`)
        },

        cursorAt: {
          top: 0,
          left: -10
        },

        drag: (event, ui) => {
          if (this.intervalPromise) {
            this.intervalPromise.cancel()
            this.intervalPromise = undefined
          }
          const dragHandler = $(this.$el).data['DragScrollHandler']
          if (dragHandler) {
            this.intervalPromise = new IntervalPromise(dragHandler, 50)
            this.intervalPromise.catch(() => {})
          }
        },

        stop: (event, ui) => {
          if (this.intervalPromise) {
            this.intervalPromise.cancel()
            this.intervalPromise = undefined
          }
        },

        start: (event, ui) => {
          dragDataService.setDragElement($(this.$el))
          $(this.$el).data('context', {
            id: this.id,
            parentId: this.parentId,
            type: this.type
          })
        },
        scroll: false,
        appendTo: document.body
      })
      $(this.$el).droppable({
        accept: '.data-table__row',
        tolerance: 'pointer',
        drop: (event, ui) => {
          const {draggable} = ui
          const context = draggable.data('context')
          if (!context) {
            return
          }
          if (context.id === this.id || (this.type === '1' && this.type === this.type)) {
            return
          }
          this.moveItemHandler({id: context.id, parentId: this.id, type: context.type})
        }
      })
    }
  }
}
