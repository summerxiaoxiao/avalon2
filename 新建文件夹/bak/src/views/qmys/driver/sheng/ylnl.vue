<template>
  <div class="d-flex flex-column h-flex-auto driver-bottom-chart">
    <h-bar-chart2 v-if="isFinish"
                  :categoryNames="currentConfig.categoryNames"
                  :lengendTypes="currentConfig.lengendTypes"
                  :lengendNames="currentConfig.lengendNames"
                  :lengendColor="currentConfig.lengendColor"
                  :data="currentConfig.data"
                  :jldw="currentConfig.jldw"
                  :styles="currentConfig.styleMap"
                  :filterData="currentConfig.filterData"
                  :filterData2="currentConfig.filterData2"
    ></h-bar-chart2>
  </div>
</template>
<script>
  // 盈利能力、偿债能力、营运能力
  import Vuex from 'vuex'
  import HBarChart2 from '@/views/qmys/common/BarChart2'
  var myconfig = {
    selectedDate: '',
    zbmc: '利润总额 (万元)',
    zbvalue: '342300',
    ylnl: { // 盈利能力
      styleMap: {
        gridColor: '#477eb9'
      },
      jldw: '%',
      categoryNames: ['1月', '2月', '3月', '4月', '5月', '6月'],
      lengendNames: ['本年累计', '上年同期累计', '累计同比'],
      lengendTypes: ['line', 'line', 'line'],
      lengendColor: ['#0090fe', '#eefe1c', '#00e8ff'],
      data: [
        [7, 6, 10, 2, 5, 3],
        [8, 8, 8, 8, 8, 8],
        [9, 10, 12, 10, 26, 8],
        [12, 15, 10, 13, 12, 13],
        [18, 18, 18, 18, 16, 25]
      ],
      filterData: [
        {'name': '总资产报酬率', 'value': '总资产报酬率'},
        {'name': '总资产报酬率2', 'value': '总资产报酬率2'}
      ],
      filterData2: [
        {'name': '累计数', 'value': '累计数'},
        {'name': '累计数2', 'value': '累计数2'}
      ]
    },
    cznl: { // 偿债能力
      styleMap: {
        gridColor: '#477eb9'
      },
      jldw: '万元',
      categoryNames: ['1月', '2月', '3月', '4月', '5月', '6月'],
      lengendNames: ['本年累计', '上年同期累计', '累计同比'],
      lengendTypes: ['line', 'line', 'line'],
      lengendColor: ['#0090fe', '#eefe1c', '#00e8ff'],
      data: [
        [7, 6, 10, 2, 5, 3],
        [8, 8, 8, 8, 8, 8],
        [9, 10, 12, 10, 26, 8],
        [12, 15, 10, 13, 12, 13],
        [18, 18, 18, 18, 16, 25]
      ],
      filterData: [
        {'name': '流动比率', 'value': '流动比率'}
      ],
      filterData2: [
        {'name': '累计数', 'value': '累计数'}
      ]
    },
    yynl: { // 营运能力
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
    name: 'ylnl-app',
    components: {
      HBarChart2
    },
    props: {
      ylnlname: {
        type: String,
        default: function () {
          return 'ylnl'
        }
      }
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
          ylnl: {}
        },
        currentConfig: {}
      }
    },
    mounted () {
      this.$nextTick(() => {
        console.log('...........ylnl')
        this.load()
      })
    },
    methods: {
      reload (name) {
        console.log('reload....' + name)
        this.name = name
        this.load()
      },
      load () {
        this.config = myconfig
        this.isFinish = true
        this.currentConfig = this.config[this.name]  // 营运能力
      }
    }
  }
</script>
