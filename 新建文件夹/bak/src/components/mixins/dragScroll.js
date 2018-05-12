import $ from 'jquery'
import 'jquery-ui/ui/widgets/droppable'
import dragDataService from '../../common/dragDataService'

const scrollDistance = 10

export default {
  mounted () {
    $(this.$el).droppable({
      over: (event, ui) => {
        ui.draggable.data['DragScrollHandler'] = () => {
          const dragElement = dragDataService.getDragElement()
          const {left, top} = ui.helper.offset()
          onDragOver(dragElement, this.$el, left, top)
        }
      },
      out (event, ui) {
        ui.draggable.removeData('DragScrollHandler')
      },
      drop (event, ui) {
        ui.draggable.removeData('DragScrollHandler')
      }
    })
  },
  beforeDestroy () {
    $(this.$el).droppable({disabled: true}).droppable('destroy')
  }
}

function onDragOver (sourceElement, targetElement, mouseOffsetX, mouseOffsetY) {
  const $sourceElement = $(sourceElement)
  const $targetElement = $(targetElement)
  if ($sourceElement.length > 0 && $targetElement.length > 0) {
    const targetOffset = $targetElement.offset()
    const sourceWidth = $sourceElement.width()
    const sourceHeight = $sourceElement.height()
    const targetWidth = $targetElement.width()
    const targetHeight = $targetElement.height()

    if (isVerticalScrollable($targetElement)) {
      if (mouseOffsetY - sourceHeight / 2 < targetOffset.top) {
        scrollToTop($targetElement, scrollDistance * -1)
      } else if (mouseOffsetY + sourceHeight / 2 > targetOffset.top + targetHeight) {
        scrollToTop($targetElement, scrollDistance)
      }
    }
    if (isHorizontalScrollable($targetElement)) {
      if (mouseOffsetX - sourceWidth / 2 < targetOffset.left) {
        scrollToLeft($targetElement, scrollDistance * -1)
      } else if (mouseOffsetX + sourceWidth / 2 > targetOffset.left + targetWidth) {
        scrollToLeft($targetElement, scrollDistance)
      }
    }
  }
}

function scrollToLeft ($element, distance) {
  $element.stop(true, true).animate({scrollLeft: $element.scrollLeft() + distance}, 100)
}

function scrollToTop ($element, distance) {
  $element.stop(true, true).animate({scrollTop: $element.scrollTop() + distance}, 100)
}

function isVerticalScrollable ($element) {
  return $element[0].scrollHeight > $element.height()
}

function isHorizontalScrollable (element) {
  return element[0].scrollWidth > element.width()
}
