<template>
  <div class="landing-container ykqk-container">
        <app-bar @on-refresh="onRefresh"></app-bar>
        <div class="container-fluid">
          <component :is="currentView"
                     @on-detail="toDetail"
                     @on-close="toClose"
                     :xmdlbm="xmdlbm"
                     ref="mycom"></component>
          <!--<router-view></router-view>-->
        </div>
  </div><!-- /.landing-container -->
</template>

<script>
  import '@/assets/scss/ykqk/_ykqk.scss'
  import AppBar from '@/views/ykqk/AppBar.vue'
  import AppContent from '@/views/ykqk/Content.vue'
  import AppContentDetail from '@/views/ykqk/ContentDetail.vue'
  export default {
    name: 'ykqk-app-main',
    components: {
      AppBar,
      AppContent,
      AppContentDetail
    },
    data () {
      return {
        currentView: 'app-content',
        xmdlbm: null
      }
    },
    mounted () {
    },
    methods: {
      toDetail (id) {
        this.xmdlbm = id
        this.currentView = 'app-content-detail'
      },
      toClose () {
        this.currentView = 'app-content'
      },
      onRefresh () {
        this.$refs.mycom.reload()
      }
    }
  }
</script>
