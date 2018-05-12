<template>
  <div class="editable-label">
    <div v-if="!editable" class="text-label trimmed-text-with-ellipsis" :title="customTooltip ? customTooltip : model">{{model}}</div>
    <input @keydown.enter="changeHandler" @keydown.esc="cancelHandler" @blur="changeHandler" v-else class="editable-label__input" :class="inputClass" type="text" v-model="model" :maxlength="maxLength" /><slot></slot>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'editable-label',
    props: {
      inputClass: {
        type: String,
        'default': 'editable-label__input--default'
      },
      editable: {
        type: Boolean,
        'default': false
      },
      maxLength: {
        type: Number,
        'default': 255
      },
      customTooltip: String,
      label: String
    },
    data () {
      return {
        model: this.label
      }
    },
    methods: {
      changeHandler () {
        if (this.cancelInput) {
          return
        }
        this.$emit('change', this.model)
      },
      cancelHandler () {
        this.cancelInput = true
        this.model = this.label
        this.$emit('cancel')
      }
    },
    watch: {
      editable (editable) {
        if (editable) {
          this.cancelInput = false
          this.$nextTick(() => {
            const $input = $(this.$el).find('.editable-label__input')
            $input.select()
            $input.focus()
            if (this.labelWidth) {
              $input.width(Math.max(this.labelWidth, $input.width()))
            }
            this.$emit('beginEdit')
          })
        } else {
          this.$nextTick(() => {
            const $input = $(this.$el).find('.text-input')
            $input.css('width', 'auto')
            this.labelWidth = $(this.$el).find('.text-label').width()
          })
        }
      },

      label (label) {
        this.model = label
      }
    }
  }
</script>
