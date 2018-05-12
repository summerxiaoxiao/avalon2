<script>
import Popper from 'popper.js'

export default {
  name: 'color-picker-dropdown',
  props: {
    reference: [Object, HTMLElement]
  },
  render (createElement) {
    return createElement('div', {'class': 'color-picker__dropdown'}, this.$slots.default)
  },
  mounted () {
    document.body.appendChild(this.$el)
    const reference = this.reference.elm ? this.reference.elm : (this.reference.$el ? this.reference.$el : this.reference)
    this.popper = new Popper(reference, this.$el)
    document.addEventListener('click', this.close, true)
    this.$el.addEventListener('mouseup', (event) => {
      event.stopPropagation()
    })
  },
  updated () {
    this.popper.update()
  },
  beforeDestroy () {
    this.popper.destroy()
    document.removeEventListener('click', this.close, true)
  },
  methods: {
    close (event) {
      let form = event.target
      let skip = false
      while (form) {
        if (form === this.$el) {
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
