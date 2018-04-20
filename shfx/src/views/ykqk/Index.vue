<template>
  <div class="landing-container ykqk-container" >
    <app-bar @on-refresh="onRefresh"></app-bar>
    <!--<div style="display: flex; flex-flow: column;padding:0px 25px;height:100%;">
        <div style="height: 50px;line-height:50px;border: 1px solid gray">title</div>
        <div style="diplay:flex;flex: 2 1 auto;border: 1px solid gray;height: 50%;align-content: stretch;">
          <div style="height: calc(100% - 10px);">
            <iframe src="http://www.baidu.com" frameborder="0" height="100%"></iframe>
          </div>
        </div>
        <div style="diplay:flex;flex: 2 1 auto;align-content: stretch;border: 1px solid gray;margin: 20px 0px 20px 0px;">
          <div style="height: 45%;">echarts</div>
        </div>
    </div>-->
    <div style="display: flex; flex-flow: column;padding:25px 25px;height:calc(100% - 220px);">
      <div style="diplay:flex;flex: 1 0 auto;border: 1px solid gray;height:100%;align-content: stretch;">
        <div style="height: calc(100% - 0px);">
          <iframe src="http://www.baidu.com" frameborder="0" height="100%"></iframe>
        </div>
      </div>
    </div>
  </div><!-- /.landing-container -->
</template>

<script>
  import AppBar from '@/views/ykqk/AppBar.vue'
//  import AppContent from '@/views/ykqk/Content2.vue'
//  import AppContentDetail from '@/views/ykqk/ContentYdys.vue'

  export default {
    name: 'ykqk-app-main',
    components: {
      AppBar
//      AppContent,
//      AppContentDetail
    },
    data () {
      return {
        currentView: 'app-content'
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
