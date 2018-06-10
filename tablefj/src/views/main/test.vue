<template>
  <div class="d-flex h-content-box h-container_main">
    <div class="flex-lg-column h-flex0-auto h-box-main">
        <div class="d-flex flex-lg-row h-flex-auto h-main_top">
          <div class="d-flex flex-lg-column h-flex1 h-main_top__map" :style="{'background-image': getBg}">
            <hmain-chart-map
              title="国网福建省电力公司"
              dwdm="GW21"
              :date="config.selectedDate"h-content-box
              :zbmc="config.zbmc"
              :zbvalue="config.zbvalue"
              @on-loaded="onLoaded"
            ></hmain-chart-map>
          </div>
          <div class="d-flex flex-lg-column h-flex1 h-main_top__listitems ">
            <div class="h-main_box_title ">
              <p class="h-title">经营考核指标</p>
            </div>
            <div class="d-flex flex-lg-column h-flex-auto h-main_top__listitems__list" >
              <hlist-item class="h-list-box h-flex-auto" v-for="item in config.listData"
                          :key="item.name"
                          :name="item.name"
                          :dw="item.dw"
                          :ncs="item.ncs"
                          :bnljs="item.bnljs"
                          :wcl="item.wcl"
                          :ljtb="item.ljtb"
                          @mouseover.native="onOver(item)"
              ></hlist-item>
            </div>
          </div>
        </div>
        <div class="d-flex flex-lg-column h-flex-auto h-main_panel h-main_srcb">
          <h-chart-line  title="收入成本"></h-chart-line>
        </div>
        <div class="d-flex flex-lg-column h-flex-auto h-main_panel h-main_kkfy">
          <div class="h-main_box_title ">
            <p class="h-title">可控费用</p>
          </div>
          <div class="d-flex flex-lg-column h-flex-auto h-main_box_barchart">
            <h-chart-bar title="九大地区可控费用完成情况" :categoryNames="config.bar1CategoryNames" :data="config.bar1Data"></h-chart-bar>
          </div>
          <div class="d-flex flex-lg-column h-flex-auto h-main_box_barchart">
            <h-chart-bar  title="分项目类别可控费用完成情况" :categoryNames="config.bar2CategoryNames" :data="config.bar2Data"></h-chart-bar>
          </div>
        </div>
        <div class="d-flex flex-lg-column h-flex-auto h-main_panel h-main_xmzc">
          <h-xmzc-item title="严控费用" class="h-flex-auto"
                       :data="config.ykfyData"></h-xmzc-item>
        </div>
        <div class="d-flex flex-lg-column h-flex-auto h-main_panel h-main_xmzc">
          <h-xmzc-item title="项目支出" class="h-flex-auto"
                       :data="config.xmzcData"></h-xmzc-item>
        </div>
      </div>
  </div>
</template>
<script>
  import Vuex from 'vuex'
  import HmainChartMap from '../common/MainChartMap'
  import HlistItem from '../common/ListItem'
  import HChartLine from '../common/MainChartLine'
  import HChartBar from '../common/MainChartBar'
  import HXmzcItem from '../common/MainXmzc'
  import bg from '@/assets/images/map_grid.png'
  var myconfig = {
    listData: [],
    selectedDate: '',
    zbmc: '',
    zbvalue: '',
    bar1CategoryNames: ['省公司', '福建地区', '厦门地区', '莆田地区', '泉州地区', '漳州地区',
      '龙岩地区', '三明地区', '南平地区', '宁德地区'],
    bar1Data: {
      '本年累计数': {
        type: 'bar',
        data: [1320, 1132, 6500, 2300, 1400, 5020, 20, 590, 1000, 1500]
      },
      '上年同期累计数': {
        type: 'bar',
        data: [590, 1000, 1500, 5000, 3500, 2600, 890, 1320, 1132, 6500]
      },
      '完成率': {
        type: 'line',
        data: [10, 50, 20, 33, 44, 34, 55, 12, 89, 11]
      },
      '累计同比': {
        type: 'line',
        data: [110, 520, 210, 313, 424, 314, 155, 112, 189, 11]
      }
    },
    bar2CategoryNames: [
      '生产大修', '非生产大修', '配网大修', '营销投入', '研究开发', '信息化投入', '生产运维'
    ],
    bar2Data: {
      '本年累计数': {
        type: 'bar',
        data: [1320, 1132, 6500, 2300, 1400, 5020, 20]
      },
      '上年同期累计数': {
        type: 'bar',
        data: [590, 1000, 1500, 5000, 3500, 2600, 890]
      },
      '完成率': {
        type: 'line',
        data: [10, 67, 20, 11, 44, 34, 55]
      },
      '累计同比': {
        type: 'line',
        data: [44, 44, 78, 90, 123, 111, 222]
      }
    },
    ykfyData: {
      name: '十四项严控费用合计',
      type: '万元',
      ncs: 10.23,
      bnljs: 10.23,
      wcl: 12,
      ljtb: 20,
      pieData: 56
    },
    xmzcData: {
      name: '项目支出合计',
      type: '万元',
      ncs: 4110.23,
      bnljs: 11110.23,
      wcl: 57,
      ljtb: 5,
      pieData: 26
    }
  }
  export default {
    name: 'test-app-main',
    components: {
      HmainChartMap,
      HlistItem,
      HChartLine,
      HChartBar,
      HXmzcItem
    },
    computed: {
      ...Vuex.mapState({
        'date': state => state.app.dateZW
      }),
      getBg () {
        return 'url(' + this.bg + ')'
      }
    },
    data () {
      return {
        isFinish: false,
        bg: '\'' + bg + '\'',
        config: {
          listData: [],
          selectedDate: '',
          zbmc: '',
          zbvalue: '',
          bar1CategoryNames: [],
          bar1Data: {},
          bar2CategoryNames: [],
          bar2Data: {},
          ykfyData: {},
          xmzcData: {}
        }

      }
    },
    mounted () {
      this.$nextTick(() => {
        var _self = this
        _self.load()
        _self.config = myconfig
      })
    },
    methods: {
      onLoaded (finish) {
        this.config.isFinish = finish
        this.$set(this.config, 'isFinish', finish)
        this.load()
      },
      load () {
        console.log('load....')
        this.$set(this.config, 'selectedDate', this.date)
        this.$store.dispatch('app/getJykhzbData').then((data) => {
          this.isFinish = true
          this.$set(this.config, 'listData', data)
          this.$set(this.config, 'zbmc', data[0].name)
          this.$set(this.config, 'zbvalue', data[0].ncs)
        })
      },
      reload () {
        this.$set(this.config, 'selectedDate', this.date)
        this.$store.dispatch('app/getJykhzbData').then((data) => {
          this.isFinish = true
          this.config.listData = data
          this.$set(this.config, 'zbmc', data[0].name)
          this.$set(this.config, 'zbvalue', data[0].ncs)
          var dd = ['1省公司', '1福建地区', '1厦门地区', '莆田地区', '泉州地区', '漳州地区',
            '龙岩地区', '三明地区', '南平地区', '宁德地区']
          this.config.bar1CategoryNames = dd
          this.config.bar1Data['本年累计数'] = {
            type: 'bar',
            data: [110, 1032, 1500, 300, 11400, 7020, 1200, 1590, 100, 100]
          }
        })
      },
      onOver (item) {
        this.config.zbmc = item.name
        this.config.zbvalue = item.ncs + item.dw
        // this.$set(this.config, 'zbmc', item.name)
        // this.$set(this.config, 'zbvalue', item.ncs + item.dw)
      }
    }
  }
</script>
