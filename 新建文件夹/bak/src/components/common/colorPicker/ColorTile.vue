<template>
  <div class="color-picker__color-tile" :style="{background: color}"></div>
</template>
<script>
  export default {
    name: 'color-tile',
    props: {
      color: String
    }
  }
</script>
