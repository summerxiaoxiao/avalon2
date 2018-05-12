<template>
  <div class="d-flex h-container_main h-content-box ">
    <div class="flex-column h-flex0-auto h-box-main driver-box">
      <div class="d-flex flex-row h-flex0-auto driver-top">
        <div class="flex-column h-flex-auto driver-top-left" >
          <h-map-chart
            title="国网山东省电力公司"
            dwdm="GW21"
            :date="config.selectedDate"
            :zbmc="config.zbmc"
            :zbvalue="config.zbvalue"
            size="110%"
            map-type="china"
            :map-mark=true
            :show-range=true
            @on-loaded="onLoaded"
          ></h-map-chart>
        </div>
        <div class="flex-column h-flex-auto driver-top-right">
          <div class="d-flex flex-row driver-top-right-top justify-content-between">
            <div class="d-flex flex-row driver-top-right-title">
              <div class="flex-column driver-title-hover c-white">业绩考核指标</div>
              <h-split-line></h-split-line>
              <div class="flex-column driver-title-hover c-gray">省份指标对比</div>
            </div>
            <div  class="d-flex flex-column">
              <span class="selector">
                <h-filter-select :data="config.yjzb.filterData" width="130"></h-filter-select>
              </span>
            </div>
          </div>
          <div class="d-flex flex-column driver-top-zb">
            <component :is="viewconfig.topView"
                       ref="mycom"></component>
          </div>
        </div>

      </div>
      <div class="d-flex flex-column h-flex0-auto driver-mg driver-middle">
        <div class="d-flex flex-column driver-title ">同业对标</div>
        <div class="d-flex flex-column h-flex-auto driver-middle-chart">
          <h-bar-chart v-if="isFinish"
            :yInverse="true"
            :categoryNames="config.tydb.categoryNames"
            :lengendTypes="config.tydb.lengendTypes"
            :lengendNames="config.tydb.lengendNames"
            :lengendColor="config.tydb.lengendColor"
            :data="config.tydb.data"
            yMin="1"
            yMax="20"
          ></h-bar-chart>
        </div>
      </div>
      <div class="d-flex flex-column h-flex0-auto driver-mg driver-bottom">
        <div class="d-flex flex-row driver-title-box">
          <div class="flex-column driver-title-hover driver-title c-white ylnl"
               @click.event="activeYlnl('ylnl')">盈利能力</div>
          <h-split-line color="#477eba" borderWidth="0.5"></h-split-line>
          <div class="flex-column driver-title-hover driver-title c-gray2 cznl"
               @click.event="activeYlnl('cznl')">偿债能力</div>
          <h-split-line color="#477eba" borderWidth="0.5"></h-split-line>
          <div class="flex-column driver-title-hover driver-title c-gray2 yynl"
               @click.event="activeYlnl('yynl')">营运能力</div>
          <h-split-line color="#477eba" borderWidth="0.5"></h-split-line>
          <div class="flex-column driver-title-hover driver-title c-gray2 fznl"
               @click.stop="activeFznl('fznl')">发展能力</div>
        </div>
        <component :is="viewconfig.bottomView" :ylnlname="config.ylnlname"
                   ref="mybottom"></component>
      </div>
    </div>
  </div>
</template>
<script>
  import Vuex from 'vuex'
  import $ from 'jquery'
  import HFilterSelect from '../common/FilterSelect'
  import HSplitLine from '../common/Split'
  import HMapChart from '../common/MapChart'
  import Yjkhzb from './sheng/yjkhzb'
  import HBarChart from '@/views/qmys/common/BarChart'
  import ylnl from './sheng/ylnl'
  import fznl from './sheng/fznl'
  var myconfig = {
    ylnlname: 'yynl',
    listData: [],
    selectedDate: '',
    zbmc: '利润总额 (万元)',
    zbvalue: '342300',
    yjzb: {
      filterData: [
        {'name': '国网下达', 'value': '国网下达'},
        {'name': '国网下达2', 'value': '国网下达2'}
      ]
    },
    tydb: { // 同业对标
      categoryNames: ['2016年03月', '2016年09月', '2016年12月', '2017年03月', '2017年09月', '2017年12月'],
      lengendNames: ['流动资产周转率', '单位资产增售电量', '资产负债率', '经济增加值率', '资本性资金投资保障率'],
      lengendTypes: ['line', 'line', 'line', 'line', 'line'],
      lengendColor: ['#f5ff23', '#ffa301', '#0ff90b', '#fe3332', '#00e8fc'],
      data: [
        [7, 6, 10, 2, 5, 3],
        [8, 8, 8, 8, 8, 8],
        [9, 10, 12, 10, 9, 8],
        [12, 15, 10, 13, 12, 13],
        [18, 18, 18, 18, 16, 20]
      ]
    }
  }
  export default {
    name: 'driver-app-content',
    components: {
      HFilterSelect,
      HSplitLine,
      HMapChart,
      Yjkhzb,
      HBarChart,
      ylnl,
      fznl
    },
    computed: {
      ...Vuex.mapState({
        'date': state => state.qmys.dateZW
      })
    },
    data () {
      return {
        isFinish: false,
        viewconfig: {
          topView: 'yjkhzb',
          bottomView: 'ylnl'
        },
        config: {
          ylnlname: 'ylnl',
          listData: [],
          selectedDate: '',
          zbmc: '',
          zbvalue: '',
          yjzb: {},
          tydb: {
            categoryNames: [],
            lengendNames: [],
            lengendTypes: [],
            lengendColor: [],
            data: [
            ]
          }
        }

      }
    },
    mounted () {
      this.$nextTick(() => {
        var _self = this
        _self.config = myconfig
        _self.load()
      })
    },
    methods: {
      onLoaded (finish) {
        this.config.isFinish = finish
        this.$set(this.config, 'isFinish', finish)
        this.load()
      },
      load () {
        this.isFinish = true
        this.$set(this.config, 'selectedDate', this.date)
      },
      reload () {
        this.$set(this.config, 'selectedDate', this.date)
      },
      activeYlnl (name, isHover) {
        var obj = $('.' + name)
        obj.css({
          'cursor': 'pointer'
        })
        obj.parent().find('.driver-title').removeClass('c-white').addClass('c-gray2')
        obj.addClass('c-white').removeClass('c-gray2')
        if (this.viewconfig.bottomView !== 'ylnl') {
          this.$set(this.viewconfig, 'bottomView', 'ylnl')
          this.config.ylnlname = name
        } else {
          this.$refs.mybottom.reload(name)
        }
      },
      activeFznl (name, isHover) {
        var obj = $('.' + name)
        obj.css({
          'cursor': 'pointer'
        })
        obj.parent().find('.driver-title').removeClass('c-white').addClass('c-gray2')
        obj.addClass('c-white').removeClass('c-gray2')
        if (this.viewconfig.bottomView !== 'fznl') {
          this.$set(this.viewconfig, 'bottomView', 'fznl')
          this.config.ylnlname = name
        } else {
          this.$refs.mybottom.reload(name)
        }
      }
    }
  }
</script>
