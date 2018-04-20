<template>
  <div id="app" :class="[getTheme,{'expand-nav-view':navExpand}]">
    <div class="landing-controller">
          <router-view></router-view>
    </div><!-- /.landing-controller -->
    <vuedal></vuedal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {default as Vuedals, Component as Vuedal} from 'vuedals'

  Vue.use(Vuedals)

  export default {
    components: {Vuedal},
    name: 'app',
    computed: {
      getTheme () {
        return this.$store.state.theme
      },
      navExpand () {
        return this.$store.state.navExpand
      }
    }
  }
</script>
