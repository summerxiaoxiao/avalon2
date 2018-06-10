<template>
  <div class="d-flex h-container_main h-box-main" style="height: 100%;padding: 30px;">
    <!--<div class="h-content-box h-box-main" style="height: 100%;">
      <div class="h-box-row h-flex0-auto h-box-main">
        <div class="h-box-column h-box-main">
          <div class="h-box-column h-flex0-auto">
            <h-chart-bar title="" id="ykfy" style="height:40%;" lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>
          </div>
          <div class="h-box-column h-flex0-auto" style="margin-top:20px;">
            <h-chart-bar title="" id="ykfy2" style="height:40%;" lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>
          </div>
          <div class="h-box-column h-flex0-auto" style="margin-top:20px;">
            <h-chart-bar title="" id="ykfy2" style="height:40%;"  lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>
          </div>
        </div>
      </div>
    </div>-->
    <div class="flex-column h-flex0-auto" style="margin:30px;">
      <div class="d-flex flex-lg-column h-flex0-auto" style="height:55%;">
        <h-chart-bar title="" id="ykfy" style="height: 100%;" lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>
      </div>
      <div class="d-flex flex-lg-row h-flex0-auto" style="height:40%;">
        <h-chart-bar class="h-flex1" title="" id="ykfy2"  style="width: 40%;" lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>
        <h-chart-bar class="h-flex1" title="" id="ykfy22"  style="width: 40%;" lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>

      </div>
      <div class="d-flex flex-lg-row"  style="height:40%;">
        <div class="flex-lg-column" style="height: 100%;">
          <h-chart-bar title="" id="ykfy3" lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>
        </div>
      </div>
      <div class="d-flex flex-lg-column h-main_panel h-main_srcb">
        <h-chart-line title="收入成本"
        ></h-chart-line>
      </div>
      <div class="d-flex flex-lg-column h-main_panel h-main_kkfy__fgs" style="margin-bottom:30px;">
        <div class="h-main_box_title ">
          <p class="h-title">十四项严控费用</p>
        </div>
        <div class="d-flex flex-lg-column h-main_box_barchart">
          <h-chart-bar title="" id="ykfy" lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>
        </div>
      </div>
    </div>

    <!--<div class="col-lg-12" style="height:55%;">
      <h-chart-bar title="" id="ykfy" style="height: 100%;" lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>
    </div>
    <div class="col-lg-12" style="height:55%;">
      <h-chart-bar title="" id="ykfy22" style="height: 100%;" lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>
    </div>
    <div class="col-lg-12" style="height:55%;">
      <h-chart-bar title="" id="ykfy33" style="height: 100%;" lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>
    </div>-->
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
          categoryNames: ['公务用车\n使用费', '外部劳\n务费', '会议费',
            '客服及商\n务费用', '出国人员\n经费', '职工教育\n经费', '工会\n费用',
            '业务招\n待费', '研究开\n发费', '团体\n会费', '社会保\n险费', '工资\n总额', '职工福\n利费', '信息系统\n维护费'],
          barData: {
            '本年累计数': {
              type: 'bar',
              data: [1320, 1132, 6500, 2300, 1400, 5020, 20, 590, 1000, 1500, 5000, 3500, 2600, 890]
            },
            '上年同期累计数': {
              type: 'bar',
              data: [590, 1000, 1500, 5000, 3500, 2600, 890, 1320, 1132, 6500, 2300, 1400, 5020, 20]
            },
            '累计同比': {
              type: 'line',
              data: [110, 520, 210, 313, 424, 314, 155, 112, 189, 11]
            }
          }
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
      })
    },
    methods: {
      load () {
        var dom = this.$refs.mychart
        var chart = this.$echarts.init(dom)
        chart.setOption({
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '直接访问',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 200, 334, 390, 330, 220]
            }
          ]
        })
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
