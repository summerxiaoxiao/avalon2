import $ from 'jquery'
import Popper from 'popper.js'

export default class Overlay {
  constructor (ref, el, options) {
    this.destroyed = false
    this.$overlay = $('<div>').addClass('overlay')
    this.$overlay.append(el)
    $(document.body).append(this.$overlay)
    let popper
    this.getPopper = () => {
      if (!popper) {
        popper = new Popper(ref, this.$overlay, options || {})
      }
      return popper
    }
  }

  active () {
    if (!this.destroyed) {
      this.$overlay.addClass('overlay-active')
      this.getPopper()
    }
    return this
  }

  deactive () {
    if (!this.destroyed) {
      this.$overlay.removeClass('overlay-active')
    }
    return this
  }

  update () {
    if (this.destroyed) {
      return this
    }
    this.getPopper().update()
    return this
  }

  destroy () {
    this.getPopper().destroy()
    this.$overlay.remove()
    this.destroyed = true
  }
}
