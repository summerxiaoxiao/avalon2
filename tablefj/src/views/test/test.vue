<template>
  <div class="d-flex h-container_main h-box-main" style="height: 100%;padding: 30px;">
    <div class="flex-column h-flex0-auto" style="margin:30px;">
      <div class="d-flex flex-lg-column h-flex0-auto" style="position:relative;height: 60%; border: 1px solid red;">
        <h-ybpchart2 :data="config.outerData" style="height:100%;width:100%;position:absolute;bottom:30px;"></h-ybpchart2>
      </div>

    </div>
  </div>
</template>
<script>
  import HChartLine from '../common/MainChartLine'
  import HChartBar from '../common/MainChartBar'
  export default {
    name: 'test-app',
    components: {
      HChartBar,
      HChartLine
    },
    data () {
      return {
        config: {
          outerData: [
            {'name': '雨露计划', 'value': 20},
            {'name': '金融扶贫', 'value': 15},
            {'name': '产业扶贫', 'value': 43},
            {'name': '基础设施', 'value': 56},
            {'name': '基础设施2', 'value': 56},
            {'name': '基础设施3', 'value': 36},
            {'name': '完成率', 'value': '20%'}
          ]
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
      })
    },
    methods: {
      load () {
      }
    }
  }
</script>
<style lang="scss">
  .test_box{
    width: 100%;
    & > div {
      height: 40%;
    }
  }
  .test_chart{
    height: 100%;
    width: 100%;
  }
</style>
