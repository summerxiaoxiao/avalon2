<template>
  <div class="shortcut-search">
    <input type="search" v-model="model" :maxlength="maxLength" class="shortcut-search__input form-control" :placeholder="placeholder" @keydown.enter="search" />
    <button type="button" class="btn-icon shortcut-search__icon" @click="search">
      <i class="iconfont yg-sousuo"></i>
    </button>
  </div>
</template>
<script>
  export default {
    name: 'shortcut-search',
    props: {
      maxLength: {
        type: Number,
        'default': 64
      },
      placeholder: {
        type: String,
        'default': '输入关键字'
      },
      value: {
        type: String,
        required: false,
        'default': ''
      }
    },
    data () {
      return {
        model: this.value
      }
    },
    methods: {
      search () {
        this.$emit('input', this.model)
        this.$emit('search', this.model)
      }
    },
    watch: {
      value (value) {
        this.model = value
      }
    }
  }
</script>
