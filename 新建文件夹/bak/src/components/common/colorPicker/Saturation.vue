<template>
  <div class="color-picker__saturation-wrapper">
    <div class="color-picker__saturation" :style="{background: bgColor}" ref="container" @mousedown="handleMouseDown">
      <div class="color-picker__saturation--white"></div>
      <div class="color-picker__saturation--black"></div>
      <div class="color-picker__saturation-pointer" :style="{top: pointerTop, left: pointerLeft}">
        <div class="color-picker__saturation-circle"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'underscore'

  export default {
    name: 'saturation',
    props: {
      value: Object
    },
    computed: {
      colors () {
        return this.value
      },
      bgColor () {
        return `hsl(${this.colors.hsv.h}, 100%, 50%)`
      },
      pointerTop () {
        return (-(this.colors.hsv.v * 100)) + 100 + '%'
      },
      pointerLeft () {
        return this.colors.hsv.s * 100 + '%'
      }
    },
    methods: {
      throttle: _.throttle((fn, data) => { fn(data) }, 20, {
        leading: true,
        trailing: false
      }),
      handleChange (e, skip) {
        !skip && e.preventDefault()
        const container = this.$refs.container
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        const xOffset = container.getBoundingClientRect().left + window.pageXOffset
        const yOffset = container.getBoundingClientRect().top + window.pageYOffset

        const pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0)
        const pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0)

        let left = pageX - xOffset
        let top = pageY - yOffset

        if (left < 0) {
          left = 0
        } else if (left > containerWidth) {
          left = containerWidth
        }
        if (top < 0) {
          top = 0
        } else if (top > containerHeight) {
          top = containerHeight
        }
        const saturation = left / containerWidth
        let bright = -(top / containerHeight) + 1
        bright = bright > 0 ? bright : 0
        bright = bright > 1 ? 1 : bright

        this.throttle(this.onChange, {
          h: this.colors.hsv.h,
          s: saturation,
          v: bright,
          a: this.colors.hsv.a,
          source: 'hsva'
        })
      },

      onChange (param) {
        this.$emit('change', param)
      },

      handleMouseDown () {
        window.addEventListener('mousemove', this.handleChange, true)
        window.addEventListener('mouseup', this.handleChange, true)
        window.addEventListener('mouseup', this.handleMouseUp, true)
      },

      handleMouseUp () {
        this.unbindEventListeners()
      },

      unbindEventListeners () {
        window.removeEventListener('mousemove', this.handleChange, true)
        window.removeEventListener('mouseup', this.handleChange, true)
        window.removeEventListener('mouseup', this.handleMouseUp, true)
      }
    }
  }
</script>
