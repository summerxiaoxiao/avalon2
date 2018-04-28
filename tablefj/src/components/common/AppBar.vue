<template>
  <div class="content-header">
    <slot name="left"></slot>
    <slot name="right"></slot>
  </div>
</template>
<script>
  export default {
    name: 'app-header-bar'
  }
</script>
