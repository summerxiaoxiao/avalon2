<template>
  <div class="zyyszb-sheng h-box-column h-flex-auto">
    <h-tablechart v-if="isFinish" height="50%" class="zyyszb-kkfy h-flex-auto"
                  title="可控费用(万元)"
                  :tableRows="rows"
                  :chartSeries="chartSeries"
                  :chartData="chartData"
                  :legendData="legendData"
    ></h-tablechart>
    <h-tablechart v-if="isFinish" height="50%" class="zyyszb-qtkkfy h-flex-auto"
                  title="其他可控费用(万元)"
                  :tableRows="rows"
                  :chartSeries="chartSeries"
                  :chartData="chartData"
                  :legendData="legendData"
    ></h-tablechart>
  </div>
</template>
<script>
  import Vuex from 'vuex'
  export default {
    name: 'zyyszb01-sheng-app-content',
    data () {
      return {
        isFinish: false
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
        // this.load()
        this.rows = []
      },
      load () {
        return this.$store.dispatch('zyyszb01/loadList').then(() => {
          this.isFinish = true
          this.chartSeries = {
            type: 'pie',
            name: '',
            radius: ['0%', '70%'],
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
