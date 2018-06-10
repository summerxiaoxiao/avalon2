<template>
  <card-index class=" h-flex-auto" style="margin-top:15px;">
    <h-tablechart slot="body" class=""
                  :title="title"
                  :tableRows="data.rows"
                  :chartSeries="mchartSeries"
                  :legendFn = "data.legendFn"
                  :seriesDataFn="data.seriesDataFn"
                  :legendData="data.legendData"
    ></h-tablechart>
  </card-index>
</template>
<script>
  import _ from 'lodash'
  import CardIndex from '@/views/common/CardIndex.vue'

  export default {
    name: 'index-Iframetable-card',
    components: {
      CardIndex
    },
    props: {
      title: String,
      chartSeries: Array,
      data: {
        type: Object,
        'default' () {
          return {
            rows: [],
            chartSeries: [],
            chartData: [],
            legendData: []
          }
        }
      }
    },
    watch: {
      data () {
      }
    },
    computed: {
      mchartSeries () {
        var series = _.cloneDeep(this.chartSeries)
        series.map(item => {
          item.data = item.data || []
        })
        return series
      }
    },
    mounted () {
      this.$nextTick(() => {
      })
    }
  }
</script>
