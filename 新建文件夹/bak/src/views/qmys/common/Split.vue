<template>
  <div class="d-flex flex-column c-split" ref="mysplit">
    <div class="c-split-item" ref="mysplititem" :style="{'border-color': color, 'border-width': borderWidth}"></div>
  </div>
</template>
<script>
  import $ from 'jquery'
  export default {
    name: 'split-app',
    props: {
      height: {
        type: [String, Number],
        default: function () {
          return 20
        }
      },
      width: {
        type: [String, Number],
        default: function () {
          return 40
        }
      },
      borderWidth: {
        type: [String, Number],
        default: function () {
          return 1
        }
      },
      color: {
        type: [String],
        default: function () {
          return '#406683'
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.load()
      })
    },
    methods: {
      load () {
        console.log(this.color)
        $(this.$refs.mysplit).width(this.width)
        $(this.$refs.mysplititem).height(this.height)
        // $(this.$refs.myspliteitem).css('border-color', this.color)
      }
    }
  }
</script>
<style lang="scss">
  .c-split {
    width: 40px;
    align-items: center;
    justify-content: center;
    .c-split-item {
      border: 1px solid;
      height: 20px;
    }
  }
</style>
