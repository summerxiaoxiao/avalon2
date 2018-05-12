<template>
  <div class="d-flex flex-column h-flex-auto driver-bottom-chart">
    <h-bar-chart3 v-if="isFinish"
                  :categoryNames="currentConfig.categoryNames"
                  :lengendTypes="currentConfig.lengendTypes"
                  :lengendNames="currentConfig.lengendNames"
                  :lengendColor="currentConfig.lengendColor"
                  :data="currentConfig.data"
                  :jldw="currentConfig.jldw"
                  :styles="currentConfig.styleMap"
                  :filterData="currentConfig.filterData"
                  :filterData2="currentConfig.filterData2"
    ></h-bar-chart3>

  </div>
</template>
<script>
  // 发展能力
  import Vuex from 'vuex'
  import HBarChart3 from '@/views/qmys/common/BarChart3'
  var myconfig = {
    selectedDate: '',
    zbmc: '利润总额 (万元)',
    zbvalue: '342300',
    fznl: { // 发展能力
      styleMap: {
        gridColor: '#477eb9'
      },
      jldw: '次',
      categoryNames: ['1月', '2月', '3月', '4月', '5月', '6月'],
      lengendNames: ['本年累计', '上年同期累计', '累计同比'],
      lengendTypes: ['bar', 'bar', 'line'],
      lengendColor: ['#0090fe', '#eefe1c', '#00e8ff'],
      data: [
        [7, 6, 10, 2, 5, 3],
        [8, 8, 8, 8, 8, 8],
        [9, 10, 12, 10, 26, 8],
        [12, 15, 10, 13, 12, 13],
        [18, 18, 18, 18, 16, 25]
      ],
      filterData: [
        {'name': '总资产周转率', 'value': '总资产周转率'}
      ],
      filterData2: [
        {'name': '累计数', 'value': '累计数'}
      ]
    }
  }
  export default {
    name: 'fznl-app',
    components: {
      HBarChart3
    },
    computed: {
      ...Vuex.mapState({
        'date': state => state.qmys.dateZW
      })
    },
    data () {
      return {
        isFinish: false,
        name: this.ylnlname,
        config: {
          selectedDate: '',
          zbmc: '',
          zbvalue: '',
          fznl: {}
        },
        currentConfig: {}
      }
    },
    mounted () {
      this.$nextTick(() => {
        console.log('...........fznl')
        this.load()
      })
    },
    methods: {
      reload (name) {
        this.name = name
        this.load()
      },
      load () {
        this.config = myconfig
        this.isFinish = true
        this.currentConfig = this.config['fznl']  // 营运能力
      }
    }
  }
</script>
