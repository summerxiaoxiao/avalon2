<template>
  <div class="color-picker__color-wheel">
    <div class="color-picker__pane">
      <saturation v-model="model" @change="childChange"></saturation>
    </div>
    <div class="color-picker__hue-slider">
      <hue v-model="model" @change="childChange"></hue>
    </div>
    <div class="color-picker__color-wheel__controls">
      <input type="text" maxlength="7" @change="childChange($event.target.value)" class="color-picker__color-wheel__hex-input" :value="formatColor">
      <button type="button" class="btn color-picker__color-wheel__button" @click="confirm">确定</button>
    </div>
  </div>
</template>
<script>
  import Saturation from './Saturation.vue'
  import Hue from './Hue.vue'
  import tinycolor from 'tinycolor2'

  function _colorChange (data, oldHue) {
    data = data === '' ? '#2d8cf0' : data
    const alpha = data && data.a
    let color

    // hsl is better than hex between conversions
    if (data && data.hsl) {
      color = tinycolor(data.hsl)
    } else if (data && data.hex && data.hex.length > 0) {
      color = tinycolor(data.hex)
    } else {
      color = tinycolor(data)
    }

    if (color && (color._a === undefined || color._a === null)) {
      color.setAlpha(alpha || 1)
    }

    const hsl = color.toHsl()
    const hsv = color.toHsv()

    if (hsl.s === 0) {
      hsv.h = hsl.h = data.h || (data.hsl && data.hsl.h) || oldHue || 0
    }

    // when the hsv.v is less than 0.0164 (base on test)
    // because of possible loss of precision
    // the result of hue and saturation would be miscalculated
    if (hsv.v < 0.0164) {
      hsv.h = data.h || (data.hsv && data.hsv.h) || 0
      hsv.s = data.s || (data.hsv && data.hsv.s) || 0
    }

    if (hsl.l < 0.01) {
      hsl.h = data.h || (data.hsl && data.hsl.h) || 0
      hsl.s = data.s || (data.hsl && data.hsl.s) || 0
    }

    return {
      hsl: hsl,
      hex: color.toHexString().toUpperCase(),
      rgba: color.toRgb(),
      hsv: hsv,
      oldHue: data.h || oldHue || hsl.h,
      source: data.source,
      a: data.a || color.getAlpha()
    }
  }

  export default {
    components: {
      Hue,
      Saturation},
    name: 'wheel',
    props: {
      value: String
    },
    data () {
      return {
        model: _colorChange(this.value)
      }
    },
    computed: {
      formatColor () {
        const value = this.model
        const format = this.format
        let color

        const rgba = `rgba(${value.rgba.r}, ${value.rgba.g}, ${value.rgba.b}, ${value.rgba.a})`
        if (format) {
          if (format === 'hsl') {
            color = tinycolor(value.hsl).toHslString()
          } else if (format === 'hsv') {
            color = tinycolor(value.hsv).toHsvString()
          } else if (format === 'hex') {
            color = value.hex
          } else if (format === 'rgb') {
            color = rgba
          }
        } else if (this.alpha) {
          color = rgba
        } else {
          color = value.hex
        }
        return color
      }
    },
    methods: {
      childChange (value) {
        this.model = _colorChange(value, this.model.oldHue)
        this.$emit('input', this.formatColor)
      },
      confirm () {
        this.$emit('confirm', this.formatColor)
      }
    },
    watch: {
      value (value) {
        if (value === this.formatColor) {
          return
        }
        this.model = _colorChange(value, this.model.oldHue)
      }
    }
  }
</script>
