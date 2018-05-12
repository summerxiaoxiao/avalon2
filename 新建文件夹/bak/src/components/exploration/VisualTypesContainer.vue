<template>
  <div class="visual-types-container clearfix">
    <button v-for="item in types" type="button" class="visual-icon-container" :class="{active: activeType === item.value}" :title="item.title" @click="handleClick(item.value)">
      <span class="visual-icon" :class="item.type + '-chart'"></span>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'visual-types-container',
    props: {
      types: Array,
      activeType: [String, Number]
    },
    methods: {
      handleClick (type) {
        if (type === this.activeType) {
          return
        }
        this.$emit('active', type)
      }
    }
  }
</script>
