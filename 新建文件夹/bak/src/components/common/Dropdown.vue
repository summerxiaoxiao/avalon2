<template>
  <div class="dropdown-container">
    <slot></slot>
  </div>
</template>
<script>
import Popper from 'popper.js'

export default {
  name: 'dropdown',
  props: {
    reference: [Object, HTMLElement]
  },
  mounted () {
    document.body.appendChild(this.$el)
    this.referenceElm = this.reference.elm ? this.reference.elm : (this.reference.$el ? this.reference.$el : this.reference)
    this.popper = new Popper(this.referenceElm, this.$el)
    this.$el.addEventListener('mouseup', this.stopEvent)
    document.addEventListener('mousedown', this.close, true)
  },
  updated () {
    this.popper.update()
  },
  beforeDestroy () {
    this.popper.destroy()
    this.$el.removeEventListener('mouseup', this.stopEvent)
    document.removeEventListener('mousedown', this.close, true)
  },
  methods: {
    stopEvent (event) {
      event.stopPropagation()
    },
    close (event) {
      let form = event.target
      let skip = false
      while (form) {
        if (form === this.$el || form === this.referenceElm) {
          skip = true
          break
        }
        form = form.parentNode
      }
      !skip && this.$emit('close')
    }
  }
}
</script>
