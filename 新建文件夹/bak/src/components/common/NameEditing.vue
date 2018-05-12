<template>
  <div class="name-editing">
    <input @blur="$emit('blur')" @keydown.enter="confirm" @keydown.esc="cancel" ref="input" type="text" v-model="model" :maxlength="maxLength" class="name-editing__input">
    <button @click.stop="confirm" type="button" title="确定"><i class="iconfont yg-yes"></i></button>
    <button @click.stop="cancel" type="button" title="取消"><i class="iconfont yg-no"></i></button>
  </div>
</template>
<script>
  export default {
    name: 'name-editing',
    props: {
      value: String,
      focus: Boolean,
      maxLength: {
        type: Number,
        'default': 255
      }
    },
    data () {
      return {
        model: this.value
      }
    },
    mounted () {
      this.$refs.input.select()
      this.$refs.input.focus()
    },
    methods: {
      inputFocus () {
        this.$refs.input.select()
        this.$refs.input.focus()
      },
      confirm () {
        this.$emit('input', this.model)
        this.$emit('confirm', this.model)
      },
      cancel () {
        this.model = this.value
        this.$emit('cancel')
      }
    },
    watch: {
      focus (focus) {
        if (focus) {
          this.$nextTick(() => {
            this.$refs.input.select()
            this.$refs.input.focus()
          })
        }
      }
    }
  }
</script>
