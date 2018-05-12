<template>
  <div class="app-bar">
    <slot name="left"></slot>
    <slot name="right"></slot>
  </div>
</template>
<script>
  export default {
    name: 'app-bar'
  }
</script>
