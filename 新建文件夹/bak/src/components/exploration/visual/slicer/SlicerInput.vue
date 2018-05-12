<template>
  <div class="slicer-input-container">
    <div class="slicer-input-wrapper">
      <div class="slicer-input" :class="{'has-icon': isDate}">
        <input @blur="change('egt', $event.target.value)" @keydown.enter="change('egt', $event.target.value)" ref="egt" type="text" class="form-control" :value="format(egtValue)" :disabled="sliderRange ==='min'" :style="inputStyle" />
        <i class="iconfont yg-rili" v-if="isDate" :style="inputStyle" @click="$refs.egt.focus()"></i>
      </div>
      <div class="sep"> - </div>
      <div class="slicer-input" :class="{'has-icon': isDate}">
        <input @blur="change('elt', $event.target.value)" @keydown.enter="change('elt', $event.target.value)" ref="elt" type="text" class="form-control" :value="format(eltValue)" :disabled="sliderRange ==='max'" :style="inputStyle" />
        <i class="iconfont yg-rili" v-if="isDate" :style="inputStyle" @click="$refs.elt.focus()"></i>
      </div>
    </div>
    <div class="slicer-slider" v-show="sliderShow">
      <div class="slicer-slider__bar-container">
        <div class="slicer-slider__bar" ref="sliderBar"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'underscore'
  import $ from 'jquery'
  import moment from 'moment'
  import { SLICER_TYPE } from '../../../../api/constant'
  import { clampValue } from '../../../../common/utils'

  export default {
    name: 'SlicerInput',
    props: {
      value: [Array],
      inputStyle: Object,
      isDate: Boolean,
      inputType: [Number, String],
      sliderShow: Boolean,
      sliderColor: String,
      range: Array
    },
    data () {
      let [egtValue, eltValue] = this.initValue(this.value, this.range)
      return {
        eltValue,
        egtValue
      }
    },
    mounted () {
      this._$slider = $(this.$refs['sliderBar']).slider(this.sliderOptions)
      if (this.sliderColor) {
        this._$slider.find('.ui-slider-range').css('background', this.sliderColor)
        this._$slider.find('.ui-slider-handle').css('background', this.sliderColor)
      }
      this._$elt = $(this.$refs['elt'])
      this._$egt = $(this.$refs['egt'])
      if (this.isDate) {
        this.bindDatePicker()
      }
    },
    beforeDestroy () {
      this._$slider.slider({disabled: true}).slider('destroy')
      if (this.isDate) {
        this.unbindDatePicker()
      }
    },
    computed: {
      max () {
        return this.range[1]
      },
      min () {
        return this.range[0]
      },
      sliderStep () {
        return this.isDate ? 86400 * 1000 : 1
      },
      sliderRange () {
        let range
        if (this.inputType === SLICER_TYPE.INPUT_ELT) {
          range = 'min'
        } else if (this.inputType === SLICER_TYPE.INPUT_EGT) {
          range = 'max'
        } else {
          range = true
        }
        return range
      },
      sliderOptions () {
        const options = {
          orientation: 'horizontal',
          range: this.sliderRange,
          max: this.max,
          min: this.min,
          step: this.sliderStep,
          slide: (event, ui) => {
            if (this.sliderRange === 'min') {
              this.eltValue = ui.value
            } else if (this.sliderRange === 'max') {
              this.egtValue = ui.value
            } else {
              if (ui.handleIndex === 0) {
                this.egtValue = ui.value
              } else {
                this.eltValue = ui.value
              }
            }
            if (this.isDate) {
              this.setDatePickerValue()
            }
          },
          stop: () => {
            this.apply()
          }
        }
        if (this.sliderRange === 'max') {
          options.value = this.egtValue
        } else if (this.sliderRange === 'min') {
          options.value = this.eltValue
        } else {
          options.values = [this.egtValue, this.eltValue]
        }
        return options
      }
    },
    methods: {
      apply () {
        const egt = this.isDate ? moment(this.egtValue).format('YYYY-MM-DD') : this.egtValue
        const elt = this.isDate ? moment(this.eltValue).format('YYYY-MM-DD') : this.eltValue
        this.$emit('apply', {
          egt,
          elt
        })
      },
      change (name, value) {
        value = $.trim(value)
        const isDate = this.isDate
        let invalid = false
        if (value === '') {
          invalid = true
        } else if (isDate) {
          const date = moment(value)
          if (!date.isValid()) {
            invalid = true
          } else {
            value = date.valueOf()
          }
        } else if (!$.isNumeric(value)) {
          invalid = true
        } else {
          value = parseFloat(value, 10) || 0
        }

        if (!invalid) {
          invalid = name === 'egt' ? (value < this.min || value > this.eltValue) : (value > this.max || value < this.egtValue)
        }

        if (invalid) {
          if (name === 'egt') {
            this._$egt.val(this.format(this.egtValue))
          } else {
            this._$elt.val(this.format(this.eltValue))
          }
        } else {
          if (name === 'egt') {
            if (value !== this.egtValue) {
              this.egtValue = value
              this.setControlValue()
              this.apply()
            }
          } else {
            if (value !== this.eltValue) {
              this.eltValue = value
              this.setControlValue()
              this.apply()
            }
          }
        }
      },
      unbindDatePicker () {
        this._$elt.datepicker('remove')
        this._$egt.datepicker('remove')
      },
      bindDatePicker () {
        const self = this
        this._$elt.datepicker({
          language: 'cn',
          format: 'yyyy-mm-dd',
          startDate: moment(this.min).toDate(),
          endDate: moment(this.max).toDate(),
          autoclose: true
        }).on('changeDate', function () {
          const date = moment($(this).val())
          if (!date.isValid() || date > this.max || date < this.egtValue) {
            return
          }
          self.eltValue = date.valueOf()
          self.setSliderValue()
          self.apply()
        })
        this._$egt.datepicker({
          language: 'cn',
          format: 'yyyy-mm-dd',
          startDate: moment(this.min).toDate(),
          endDate: moment(this.max).toDate(),
          autoclose: true
        }).on('changeDate', function () {
          const date = moment($(this).val())
          if (!date.isValid() || date < this.min || date > this.eltValue) {
            return
          }
          self.egtValue = date.valueOf()
          self.setSliderValue()
          self.apply()
        })
      },
      initValue (value, range) {
        const [min, max] = range
        let [egtValue, eltValue] = value
        if (!_.isNull(egtValue) && this.isDate) {
          egtValue = moment(egtValue).valueOf()
        }

        if (!_.isNull(eltValue) && this.isDate) {
          eltValue = moment(eltValue).valueOf()
        }

        if (_.isNull(eltValue)) {
          eltValue = max
        }
        if (_.isNull(egtValue)) {
          egtValue = min
        }
        egtValue = clampValue(egtValue, min, max)
        eltValue = clampValue(eltValue, min, max)
        return [egtValue, eltValue]
      },
      format (value) {
        if (this.isDate) {
          return moment(value).format('YYYY-MM-DD')
        } else {
          return value
        }
      },
      setDatePickerValue () {
        const egtDate = moment(this.egtValue)
        const eltDate = moment(this.eltValue)
        this._$egt.datepicker('update', egtDate.format('YYYY-MM-DD')).datepicker('setDate', egtDate.toDate())
        this._$elt.datepicker('update', eltDate.format('YYYY-MM-DD')).datepicker('setDate', eltDate.toDate())
      },
      setSliderValue () {
        if (this.sliderRange === 'max') {
          this._$slider.slider('value', this.egtValue)
        } else if (this.sliderRange === 'min') {
          this._$slider.slider('value', this.eltValue)
        } else {
          this._$slider.slider('values', [this.egtValue, this.eltValue])
        }
      },
      setControlValue () {
        if (this.isDate) {
          this.setDatePickerValue()
        }
        this.setSliderValue()
      }
    },
    watch: {
      range (range) {
        if (_.isEqual(range, [this.min, this.max])) {
          return
        }
        const [min, max] = range
        this._$slider.slider('option', 'min', min)
        this._$slider.slider('option', 'max', max)
        if (this.isDate) {
          this._$elt.datepicker('setEndDate', moment(min).toDate())
          this._$egt.datepicker('setStartDate', moment(max).toDate())
        }

        this.egtValue = clampValue(this.egtValue, min, max)
        this.eltValue = clampValue(this.eltValue, min, max)
        this.setSliderValue()
        this.apply()
      },
      sliderRange (range, oldRange) {
        this._$slider.slider('option', 'range', range)
        if (range === 'min') {
          if (oldRange !== true) {
            this.eltValue = this.egtValue === this.min ? this.max : this.egtValue
          }
          this.egtValue = this.min
        } else if (range === 'max') {
          if (oldRange !== true) {
            this.egtValue = this.eltValue === this.max ? this.min : this.eltValue
          }
          this.eltValue = this.max
        } else {
          if (oldRange === 'min') {
            this.egtValue = this.min
          } else {
            this.eltValue = this.max
          }
        }

        this.setControlValue()
        this.apply()
      },
      sliderStep (step) {
        this._$slider.slider('option', 'step', step)
      },
      isDate (value, oldValue) {
        if (oldValue) {
          this.unbindDatePicker()
        }

        if (value) {
          this.bindDatePicker()
        }

        this.egtValue = this.min
        this.eltValue = this.max
        this.setControlValue()
      },
      inputType () {
        this.apply()
      },
      value (value) {
        const [egtValue, eltValue] = this.initValue(value, this.range)
        if (_.isEqual([egtValue, eltValue], [this.egtValue, this.eltValue])) {
          return
        }
        this.egtValue = egtValue
        this.eltValue = eltValue
        this.setControlValue()
      },
      sliderColor (sliderColor) {
        if (sliderColor) {
          this._$slider.find('.ui-slider-range').css('background', sliderColor)
          this._$slider.find('.ui-slider-handle').css('background', sliderColor)
        }
      }
    }
  }
</script>
