<template>
  <div class="h-box-column h-flex-auto zyyszb-box-kkfy">

    <h-tablechart v-if="isFinish"  class="zyyszb-kkfy-item h-flex-auto"
                  title="三项费用合计(万元)"
                  :tableRows="rows"
                  :chartSeries="chartSeries"
                  :chartData="chartData"
                  :legendData="legendData"
    ></h-tablechart>
    <h-tablechart v-if="isFinish"  class="zyyszb-qtkkfy-item h-flex-auto"
                  title="其他可控费用(万元)"
                  :tableRows="rows"
                  :chartSeries="chartSeries"
                  :chartData="chartData"
                  :legendData="legendData"
    ></h-tablechart>
  </div>
</template>
<script>
  import bbconst from '@/config/constant'
  import HIframeTable from '@/components/common/Iframetable.vue'
  import Vuex from 'vuex'
  export default {
    name: 'zyyszb01-fgs-app-content',
    components: {
      HIframeTable
    },
    data () {
      return {
        isFinish: false,
        bbmc: bbconst.bgmc_xmdl,
        tableQueryCondition: {
          tjqj: '201612'
        },
        showFgs: true,
        currentView: 'fgs-zb',
        chartSeries: {}
      }
    },
    computed: {
      ...Vuex.mapState({
        'dwdm': state => state.app.dwdm,
        'date': state => state.app.date,
        'dwlist': state => state.app.dwlist,
        'rows': state => state.zyyszb01.tableList,
        'chartData': state => state.zyyszb01.chartData,
        'legendData': state => state.zyyszb01.legendData
      })
    },
    mounted () {
      this.load()
    },
    methods: {
      reload () {
      },
      load () {
        return this.$store.dispatch('zyyszb01/loadList').then(() => {
          this.isFinish = true
          this.chartSeries = {
            type: 'pie',
            name: '',
            radius: ['0%', '100%'], // 内圈半径，外圈半径
            center: ['50%', '50%'], //  饼状图位置，第一个参数是左右，第二个是上下。
            label: {
              normal: {
                formatter: '{b}:{c} ({d}%)',
                position: 'inner',
                show: false
              }
            },
            data: this.chartData
          }
        })
      }
    }
  }
</script>

