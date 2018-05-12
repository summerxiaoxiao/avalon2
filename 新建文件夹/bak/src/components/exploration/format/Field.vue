<script>
  import $ from 'jquery'
  import _ from 'underscore'
  import { FORMAT_FIELD_TYPES } from '../../../api/constant'

  import ColorPicker from '../../common/colorPicker/ColorPicker.vue'
  import Switch from '../../common/Switch.vue'
  import Slider from '../../common/Slider.vue'

  import { toBoolean } from '../../../common/utils'
  import { fontOptions } from '../../../common/colorFont'
  import { getFormatPropertyFieldOptions } from '../../../api/common'

  function input (createElement, type, name, value, options = {}) {
    const {'class': _class = {}, style = {}, attrs = {}, props = {}, on = {}} = options
    attrs.type = type

    return createElement('input', {
      'class': _class,
      style,
      attrs,
      props,
      domProps: {
        value
      },
      on
    })
  }

  function button (createElement, name, label, options = {}) {
    const {'class': _class = {}, style = {}, attrs = {}, props = {}, on = {}} = options
    attrs.type = 'button'
    return createElement('button', {
      'class': _class,
      style,
      attrs,
      props,
      on
    }, [label])
  }

  function select (createElement, name, value, list, options = {}, optionCallback) {
    const {'class': _class = {}, style = {}, attrs = {}, props = {}, on = {}} = options
    const nodes = []
    ;(list || []).forEach(v => {
      const attrs = {}
      let name
      let selected
      let style = {}

      if (typeof v === 'string') {
        attrs.value = v
        name = v
        selected = v.toString() === value.to
      } else {
        attrs.value = v.value
        name = v.displayName
        selected = _.isEqual(String(v.value), String(value))
      }

      const domProps = {}
      if (selected) {
        attrs.selected = 'selected'
        domProps.selected = true
      }
      if (typeof optionCallback === 'function') {
        optionCallback({attrs, domProps, style})
      }

      nodes.push(createElement('option', {attrs, domProps, style}, [name]))
    })

    return createElement('select', {
      'class': _class,
      style,
      attrs,
      props,
      on
    }, nodes)
  }

  export default {
    name: 'field',
    props: {
      parentName: String,
      name: String,
      options: Array,
      defaultValue: {},
      displayName: String,
      type: String,
      max: [String, Number],
      min: [String, Number],
      extra: [Number, String],
      value: {},
      disabled: {
        type: Boolean,
        'default': false
      }
    },
    data () {
      return {
        model: this.value
      }
    },
    computed: {
      propertyOptions () {
        return getFormatPropertyFieldOptions(this.$store.getters['report/currentVisualContainer'], this.extra)
      }
    },
    render: function (createElement) {
      switch (this.type) {
        case FORMAT_FIELD_TYPES.NUMBER:
          return input(createElement, 'text', this.name, this.model, {
            'class': {
              'input-field-in-slice': true
            },
            attrs: {
              disabled: this.disabled
            },
            on: {
              input: (event) => {
                this.model = event.target.value
                this.$emit('input', this.model)
              }
            }
          })
        case FORMAT_FIELD_TYPES.INTEGER:
          return input(createElement, 'number', this.name, this.model, {
            'class': {
              'input-field-in-slice': true
            },
            attrs: {
              disabled: this.disabled,
              min: 0
            },
            on: {
              input: (event) => {
                let value = event.target.value
                if ($.trim(value) !== '' && $.isNumeric(value)) {
                  value = parseInt(value, 10)
                  if (!(_.isUndefined(this.max) || _.isNull(this.max)) && value > this.max) {
                    value = this.max
                    event.target.value = value
                  }
                  this.model = value
                  this.$emit('input', this.model)
                }
              },
              blur: (event) => {
                let value = event.target.value
                if ($.trim(value) === '' || !$.isNumeric(value)) {
                  value = parseInt(this.value || 0, 10) || 0
                  if (!(_.isUndefined(this.min) || _.isNull(this.min)) && value < this.min) {
                    value = this.min
                  }
                  if (!(_.isUndefined(this.max) || _.isNull(this.min)) && value > this.max) {
                    value = this.max
                  }
                  this.model = value
                  this.$emit('input', this.model)
                } else {
                  if (!(_.isUndefined(this.min) || _.isNull(this.min)) && value < this.min) {
                    this.model = this.min
                    event.target.value = this.model
                    this.$emit('input', this.model)
                  }
                }
              }
            }
          })
        case FORMAT_FIELD_TYPES.TEXT:
          return input(createElement, 'text', this.model, this.value, {
            'class': {
              'input-field-in-slice': true
            },
            attrs: {
              disabled: this.disabled
            },
            on: {
              input: (event) => {
                this.model = event.target.value
                this.$emit('input', this.model)
              }
            }
          })
        case FORMAT_FIELD_TYPES.BOOLEAN:
          return createElement(Switch, {
            props: {
              width: 34,
              value: toBoolean(this.model),
              'active-text': '开',
              'inactive-text': '关'
            },
            on: {
              input: (value) => {
                this.model = value ? 1 : 0
                this.$emit('input', this.model)
              }
            }
          })
        case FORMAT_FIELD_TYPES.COLOR:
          return createElement(ColorPicker, {
            props: {
              value: this.model,
              defaultValue: this.defaultValue
            },
            on: {
              input: (value) => {
                this.model = value
                this.$emit('input', this.model)
              }
            }
          })
        case FORMAT_FIELD_TYPES.RANGE:
          return createElement(Slider, {
            props: {
              value: this.model,
              min: this.min,
              max: this.max
            },
            on: {
              input: (value) => {
                this.model = Number(value) || 0
                this.$emit('input', this.model)
              }
            }
          })
        case FORMAT_FIELD_TYPES.FONT:
          return select(createElement, this.name, this.model, fontOptions, {
            'class': {
              'input-field-in-slice': true
            },
            attrs: {
              disabled: this.disabled
            },
            on: {
              change: (event) => {
                this.model = _.unescape(event.target.value)
                this.$emit('input', this.model)
              }
            }
          }, function ({attrs, style}) {
            style['font-family'] = _.unescape(attrs.value)
          })
        case FORMAT_FIELD_TYPES.PROPERTY:
          return select(createElement, this.name, this.model, [{value: '', displayName: '请选择'}].concat(this.propertyOptions), {
            'class': {
              'input-field-in-slice': true
            },
            attrs: {
              disabled: this.disabled
            },
            on: {
              change: (event) => {
                this.model = _.unescape(event.target.value)
                this.$emit('input', this.model)
              }
            }
          })
        case FORMAT_FIELD_TYPES.ENUM:
        case FORMAT_FIELD_TYPES.LIST:
          return select(createElement, this.name, this.model, this.options, {
            'class': {
              'input-field-in-slice': true
            },
            attrs: {
              disabled: this.disabled
            },
            on: {
              change: (event) => {
                this.model = event.target.value
                this.$emit('input', this.model)
              }
            }
          })
        case FORMAT_FIELD_TYPES.ACTION_RESTORE:
          return button(createElement, this.name, this.displayName, {
            attrs: {
              disabled: this.disabled
            },
            'class': {
              'format-restore': true
            },
            on: {
              click: () => {
                this.$emit('restore')
              }
            }
          })
      }
    },
    watch: {
      value (value) {
        this.model = value
      }
    }
  }
</script>
