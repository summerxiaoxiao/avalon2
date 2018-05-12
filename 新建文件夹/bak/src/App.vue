<template>
  <div id="app">
    <div class="landing-controller">
      <div class="content-main">
        <div class="content-column">
          <router-view></router-view>
        </div><!-- /.content-column -->
      </div><!-- /.content-main -->
    </div><!-- /.landing-controller -->
    <vuedal></vuedal>
  </div>
</template>

<script>
import Vue from 'vue'
import Report from './views/report/Report.vue'
import {default as Vuedals, Component as Vuedal} from 'vuedals'

Vue.use(Vuedals)

export default {
  components: {Report, Vuedal},
  name: 'app'
}
</script>
