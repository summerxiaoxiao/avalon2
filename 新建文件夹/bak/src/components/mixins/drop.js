import $ from 'jquery'
import 'jquery-ui/ui/widgets/droppable'
import { DROP_ACTION, DROP_POSITION } from '../../api/constant'

const DragoverClass = 'dragover'

const HighlightClasses = {
  Append: 'append',
  None: 'not-droppable',
  Prepend: 'prepend',
  Replace: 'dropover'
}

function isValidDropLocation (dragSource, validDrops) {
  if (!dragSource) {
    return true
  }
  return validDrops.indexOf($(dragSource).data('drag')) >= 0
}

function getDropPosition (event, $element) {
  $element = $($element)
  const height = $element.height()
  const topElement = $element.offset().top
  const mouseTop = event.pageY
  if (topElement + (height / 2) > mouseTop) {
    return DROP_POSITION.ABOVE
  } else {
    return DROP_POSITION.BELOW
  }
}

class Drop {
  constructor (vm) {
    this.vm = vm
    this.postoneCleanup = false
    this.highlightedItems = []
    this.mouseMove = this.mouseMove.bind(this)
    this.vm.$nextTick(() => {
      this._init()
    })
  }

  _init () {
    const vm = this.vm
    const validDrops = (vm.dropConfig.accept || '').split(/\s/)
    const $container = this._getContainer()

    $container.droppable({
      accept: (elem) => {
        return isValidDropLocation(elem, validDrops)
      },
      hoverClass: DragoverClass,
      greed: vm.dropConfig.greedy !== false,
      tolerance: 'pointer',
      activate: (event, ui) => {
        ui.draggable.data['DropEventHandled'] = false
        ui.draggable.data['DropTarget'] = undefined
      },
      drop: (event, ui) => {
        if (this.deferredPromise) {
          this.deferredPromise.cancel()
          this.deferredPromise = undefined
        }
        this.clearHighlighting()
        if (!vm.dropHandler) {
          return
        }
        if (vm.dropActionHandler) {
          const dropPosition = getDropPosition(event, $container)
          vm.dropActionHandler(dropPosition, vm.dropContext).then(dropAction => {
            if (dropAction !== 0) {
              vm.dropHandler(event, ui, dropAction, vm.dropContext)
            }
          }).finally(() => {
            ui.helper.off('mousemove', this.mouseMove)
          })
        } else {
          vm.dropHandler(event, ui, undefined, vm.dropContext)
        }
      },
      over: (event, ui) => {
        this.clearHighlighting()
        if (vm.dropActionHandler) {
          this.postoneCleanup = true
          this.mouseMove(event)
          ui.helper.on('mousemove', this.mouseMove)
        }
      },
      out: (event, ui) => {
        if (vm.dropActionHandler) {
          if (this.deferredPromise) {
            this.deferredPromise.cancel()
            this.postoneCleanup = false
            this.deferredPromise = undefined
          }
          ui.helper.off('mousemove', this.mouseMove)
          if (!this.postoneCleanup) {
            this.clearHighlighting()
          }
        }
      }
    })
  }

  _getContainer () {
    return this.vm.dropContainerId ? $('#', this.vm.dropCotainerId) : $(this.vm.$el)
  }

  destroy () {
    this._getContainer().droppable({disabled: true}).droppable('destroy')
  }

  mouseMove (event) {
    const vm = this.vm
    const $container = this._getContainer()
    const dropPosition = getDropPosition(event, $container)
    const $prev = $container.prev()
    const $next = $container.next()

    if (vm.dropActionHandler) {
      if (this.deferredPromise) {
        this.deferredPromise.cancel()
      }
      this.deferredPromise = vm.dropActionHandler(dropPosition, vm.dropContext)

      this.deferredPromise.then((dropAction) => {
        if (!this.deferredPromise) {
          return
        }
        switch (dropAction) {
          case DROP_ACTION.NONE:
            if (!$container.hasClass(HighlightClasses.None)) {
              this.clearHighlighting()
              $container.addClass(HighlightClasses.None)
              this.highlightedItems.push($container)
            }
            break
          case DROP_ACTION.PREPEND:
            if (!$container.hasClass(HighlightClasses.Prepend)) {
              this.clearHighlighting()
              $container.addClass(HighlightClasses.Prepend)
              $prev.addClass(HighlightClasses.Append)
              this.highlightedItems.push($container)
              this.highlightedItems.push($prev)
            }
            break
          case DROP_ACTION.APPEND:
            if (!$container.hasClass(HighlightClasses.Append)) {
              this.clearHighlighting()
              $container.addClass(HighlightClasses.Append)
              $next.addClass(HighlightClasses.Prepend)
              this.highlightedItems.push($container)
              this.highlightedItems.push($next)
            }
            break
          case DROP_ACTION.REPLACE:
            if (!$container.hasClass(HighlightClasses.Replace)) {
              this.clearHighlighting()
              $container.addClass(HighlightClasses.Replace)
              this.highlightedItems.push($container)
            }
            break
          default:
            this.clearHighlighting()
        }
      }).catch(() => {})
    }
  }

  clearHighlighting () {
    this.highlightedItems.forEach((item) => {
      $(item).removeClass(HighlightClasses.Append)
        .removeClass(HighlightClasses.None)
        .removeClass(HighlightClasses.Prepend)
        .removeClass(HighlightClasses.Replace)
    })
    this.highlightedItems = []
  }

  toggle (disabled) {
    this._getContainer().draggable({disabled: !!disabled})
  }
}

export default {
  props: {
    dropConfig: {
      type: Object,
      default () {
        return {}
      }
    },
    dropActionHandler: Function,
    dropHandler: Function,
    dropContext: Object
  },

  mounted () {
    this.drop = new Drop(this)
  },

  beforeDestroy () {
    this.drop.destroy()
  },

  methods: {
    toggleDrop (disabled) {
      this.drop.toggle(disabled)
    }
  }
}
