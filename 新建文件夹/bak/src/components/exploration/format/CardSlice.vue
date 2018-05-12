<template>
  <div class="card-slice">
    <div class="input-field" :class="{disabled: disabled}">
      <slot name="displayName"></slot>
      <div class="item-fill">
        <slot name="field">
          <field
            v-model="model"
            :max="max"
            :min="min"
            :type="type"
            :disabled="disabled"
            :defaultValue="defaultValue"
            :name="name"
            :extra="extra"
            :options="options">
          </field>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'underscore'
  import Field from './Field.vue'

  export default {
    components: {Field},
    name: 'format-card-slice',
    props: {
      disabled: Boolean,
      displayName: String,
      name: String,
      parentName: String,
      defaultValue: {},
      max: [String, Number],
      min: [String, Number],
      value: {},
      extra: [String, Number],
      type: String,
      options: Array
    },
    data () {
      let model
      if (Array.isArray(this.value)) {
        model = this.value.slice()
      } else if (_.isObject(this.value)) {
        model = Object.assign({}, this.value)
      } else if (_.isUndefined(this.value)) {
        model = this.defaultValue
      } else {
        model = this.value
      }
      return {
        model
      }
    },
    created () {
      this.onChange = _.debounce(this.onChange)
    },
    methods: {
      onChange (model) {
        this.$emit('change', model, this.name)
      }
    },
    watch: {
      value (value) {
        if (!_.isEqual(value, this.model)) {
          this.model = Array.isArray(value) ? value.slice() : (_.isObject(value) ? Object.assign({}, value) : value)
        }
      },
      model (model) {
        if (!_.isEqual(this.value, this.model)) {
          this.onChange(model)
        }
      }
    }
  }
</script>
