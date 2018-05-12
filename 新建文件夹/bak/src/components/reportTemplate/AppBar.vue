<template>
  <app-bar>
    <div class="app-bar__section app-bar__section--left" slot="left">
      <div class="app-bar__title">
        报表模板
      </div>
    </div>
  </app-bar>
</template>

<script>
  import AppBar from '../common/AppBar.vue'

  export default {
    components: {AppBar},
    name: 'report-template-app-bar'
  }
</script>
