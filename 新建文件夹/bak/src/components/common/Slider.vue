<template>
  <div class="slider">
    <div class="slider__input-container">
      <input class="slider__input" type="number" :min="min" :max="max" v-model="model" @input="onChange($event.target.value)" @blur="onBlur"/> <span class="slider__suffix" v-if="suffix">{{suffix}}</span>
    </div>
    <div class="slider__bar-container" ref="barContainer">
      <div class="slider__bar" ref="bar"></div>
    </div>
  </div>
</template>
<script>
  import _ from 'underscore'
  import $ from 'jquery'
  import 'jquery-ui/ui/widgets/slider'

  export default {
    name: 'slider',
    props: {
      suffix: String,
      min: {
        type: Number,
        'default': 0
      },
      max: {
        type: Number,
        'default': 100
      },
      value: [String, Number]
    },
    data () {
      return {
        model: this.value
      }
    },
    created () {
      this.onChange = _.debounce(this.onChange, 20)
    },
    mounted () {
      $(this.$refs['bar']).slider({
        orientation: 'horizontal',
        max: this.max,
        min: this.min,
        value: this.model,
        start: () => {
          $(this.$refs['barContainer']).addClass('sliding')
        },
        slide: (event, ui) => {
          this.onChange(ui.value)
        },
        stop: () => {
          $(this.$refs['barContainer']).removeClass('sliding')
        }
      })
    },
    beforeDestroy () {
      $(this.$refs['bar']).slider({disabled: true}).slider('destroy')
    },
    methods: {
      onChange (value) {
        value = parseInt(value, 10)
        if (isNaN(value) || (value < this.min || value > this.max)) {
          return
        }
        this.$emit('input', value)
        this.model = value
        this.$nextTick(() => {
          $(this.$refs['bar']).slider('value', value)
        })
      },
      onBlur () {
        let value = this.model
        if (isNaN(value) || (value < this.min || value > this.max)) {
          this.model = this.value
        }
      }
    },
    watch: {
      value (value) {
        if (value !== this.model) {
          this.model = value
          this.$nextTick(() => {
            $(this.$refs['bar']).slider('value', value)
          })
        }
      }
    }
  }
</script>
