<template>
  <div class="d-flex content-header">
    <slot name="left"></slot>
    <slot name="right"></slot>
  </div>
</template>
<script>
  export default {
    name: 'qmys-app-header-bar'
  }
</script>
