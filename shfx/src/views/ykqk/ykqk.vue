<template>
  <div class="landing-container ykqk-container">
        <app-bar @on-refresh="onRefresh"></app-bar>
    <component :is="currentView"
               @on-detail="toDetail"
               @on-close="toClose"
               ref="mycom"></component>
  </div><!-- /.landing-container -->
</template>

<script>
  import AppBar from '@/views/ykqk/AppBar.vue'
  import AppContent from '@/views/ykqk/Content.vue'
  import AppContentDetail from '@/views/ykqk/ContentYdys.vue'

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
      // this.$router.push({ 'name': 'ykqk_content' })
    },
    methods: {
      toDetail (xmdl) {
        this.$store.commit('ykqk/setXmdlmc', xmdl)
        this.$store.commit('ykqk/setTableQueryCondition_xmmx')
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
<style>
  .content-main{
    overflow-y: visible!important;
  }
</style>
