<template>
  <div class="landing-container h-container_zyyszb">
    <app-bar @on-refresh="onRefresh"></app-bar>
    <component :is="currentView"
               ref="mycom"></component>
  </div><!-- /.landing-container -->
</template>

<script>
  import '@/assets/scss/modules/zyyszb01.scss'
  import AppBar from '@/views/test/AppBar.vue'
  import AppContent from '@/views/test/Content.vue'
  import AppYbp from './Ybp'

  export default {
    name: 'test-app-main',
    components: {
      AppBar,
      AppContent,
      AppYbp
    },
    props: {
    },
    data () {
      return {
        currentView: 'app-ybp'
      }
    },
    mounted () {
      // this.$router.push({'name': 'zbkb01_bb', params: {mode: 'bb'}})
    },
    methods: {
      onRefresh () {
        this.$refs.mycom.reload()
      }
    }
  }
</script>
