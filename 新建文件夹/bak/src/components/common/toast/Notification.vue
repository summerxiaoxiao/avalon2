<template>
  <div class="toast" :class="{'toast--not-title': !title}" role="alert">
    <button class="toast__close-btn btn-icon" @click.prevent="close" type="button">
      <i class="iconfont yg-shanchu"></i>
    </button>
    <div class="toast__content">
      <div class="toast__icon">
        <i class="iconfont yg-yes" v-if="type == 1"></i>
        <i class="iconfont yg-no" v-if="type == 0"></i>
        <loader v-if="type == 3"></loader>
      </div>
      <div class="toast__body">
        <h3 class="toast__title">{{ title }}</h3>
        <div class="toast__message">{{ message}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import Loader from '../Loader.vue'

  export default {
    components: {Loader},
    name: 'notification',
    props: {
      id: [String, Number],
      type: [Number, String],
      title: String,
      message: String,
      delay: {
        type: Number,
        'default': 3000
      }
    },
    created () {
      if (this.delay !== 0) {
        window.setTimeout(() => {
          this.close()
        }, this.delay)
      }
    },
    methods: {
      close () {
        this.$emit('close', this.id)
      }
    }
  }
</script>
