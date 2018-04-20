<template>
  <div class="landing-container zyyszb-container">
    <app-bar @on-refresh="onRefresh"></app-bar>
    <div class="container-fluid">
      <component :is="currentView"
                 ref="mycom"></component>
      <!--<router-view></router-view>-->
    </div>
  </div><!-- /.landing-container -->
</template>

<script>
  import '@/assets/scss/models/zyyszb01.scss'
  import AppBar from '@/views/zyyszb01/AppBar.vue'
  import AppContent from '@/views/zyyszb01/Content.vue'
  export default {
    name: 'zyyszb-app-main',
    components: {
      AppBar,
      AppContent
    },
    data () {
      return {
        currentView: 'app-content'
      }
    },
    mounted () {
    },
    methods: {
      onRefresh () {
        this.$refs.mycom.reload()
      }
    }
  }
</script>
