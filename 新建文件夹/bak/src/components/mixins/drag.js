import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'
import {IntervalPromise} from '../../common/deferredPromise'

const DragScrollRefresh = 50 // ms
const DraggingRootElementClass = 'draggable-root-dragging'
const MinDragDistance = 4 // px

import dragDataService from '../../common/dragDataService'

export default {
  props: {
    dragConfig: {
      type: Object,
      default () {
        return {}
      }
    },
    dragContext: Object
  },

  mounted () {
    let intervalPromise
    const dragOptions = {
      start: (event, ui) => {
        dragDataService.setDragElement($(this.$el))
        if (this.dragContext) {
          dragDataService.setDragContext(this.dragContext)
        } else {
          dragDataService.setDragContext(null)
        }
        $(this.$el).addClass(DraggingRootElementClass)
        ui.helper.css('width', $(this.$el).width())
      },

      drag: (event, ui) => {
        if (intervalPromise) {
          intervalPromise.cancel()
          intervalPromise = undefined
        }
        const dragHandler = $(this.$el).data['DragScrollHandler']
        if (dragHandler) {
          intervalPromise = new IntervalPromise(dragHandler, DragScrollRefresh)
          intervalPromise.catch(() => {})
        }
      },

      stop: (event, ui) => {
        if (intervalPromise) {
          intervalPromise.cancel()
          intervalPromise = undefined
        }
        $(this.$el).removeClass(DraggingRootElementClass)
      },

      helper: () => {
        return $(this.$el).clone().removeAttr('id')
      },
      scroll: false,
      appendTo: '.exploration-container',
      distance: MinDragDistance
    }
    if (this.dragConfig) {
      if ($.isNumeric(this.dragConfig.distance)) {
        dragOptions.distance = this.dragConfig.distance
      }
    }
    $(this.$el).draggable(dragOptions)
  },

  beforeDestroy () {
    $(this.$el).draggable({disabled: true}).draggable('destroy')
  },

  methods: {
    toggleDrag (disabled) {
      $(this.$el).draggable({disabled: !!disabled})
    }
  }
}
