<template>
  <div class="exploration-mask" v-if="show">
    <loader></loader>
  </div>
</template>
<script>
  import Loader from '../common/Loader.vue'

  export default {
    components: {Loader},
    name: 'exploration-mask',
    props: {
      show: Boolean
    }
  }
</script>
