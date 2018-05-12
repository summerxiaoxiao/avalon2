<template>
<span class="d-flex flex-row h-flex-auto">
  <select :style="{'width': width}">
    <option :value="item.value" v-for="item in data" >{{item.name}}</option>
  </select>
  <i class="select-down iconfont  icon-xiala" style="top: 22%;"></i>
</span>
</template>
<script>
  export default {
    name: 'filter-select-app',
    props: {
      data: Array,
      width: {
        type: [String, Number],
        default: function () {
          return 180
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
      })
    },
    methods: {
    }
  }
</script>
<style lang="scss">
  select {
  }
</style>
