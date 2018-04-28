<template>
  <div class="landing-container h-container_main ">
    <div class="h-content-box h-flex0-auto h-box-main">
      <div class="h-box-column h-flex0-auto h-box-main" >
        <div class="h-box-row h-flex-auto h-main_top__fgs">
          <div class="h-box-column h-main_top__map h-flex0-auto">
            <hmain-chart-map
              title="国网福建省电力分公司"
              dwdm="GW21"
              :date="config.selectedDate"
              :zbmc="config.zbmc"
              :zbvalue="config.zbvalue"
              size="105%"
              map-type="fj"
              :map-mark=false
              :show-range=true
            ></hmain-chart-map>
          </div>
          <div class="h-box-column h-flex-auto h-main_top__listitems ">
            <div class="h-main_box_title ">
              <p class="h-title">经营考核指标</p>
            </div>
            <div class="h-main_top__listitems__list h-box-column h-flex-auto">
              <hlist-item class="h-list-box" v-for="item in config.listData"
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
        <div class="h-box-column h-flex-auto ">
          <h-chart-line class="h-main_panel h-main_srcb" title="收入成本"
          ></h-chart-line>
        </div>
        <div class="h-box-column h-flex-auto h-main_panel h-main_kkfy__fgs">
          <div class="h-box-column h-flex-auto">
            <div class="h-main_box_title ">
              <p class="h-title">十四项严控费用</p>
            </div>
            <div class="h-box-column h-flex-auto h-main_box_barchart">
              <h-chart-bar title="" id="ykfy" lengendPadding="0"  :categoryNames="config.categoryNames" :data="config.barData"></h-chart-bar>
            </div>
          </div>
        </div>
        <div class="h-box-column h-flex-auto h-main_panel h-main_xmzc">
          <h-qtfy-item title="其他运营费用" :data="config.qtyyfyData"></h-qtfy-item>
        </div>
        <div class="h-box-column h-flex-auto h-main_panel h-main_kkfy__fgs">
          <div class="h-box-column h-flex-auto">
            <div class="h-main_box_title ">
              <p class="h-title">项目预算类分析</p>
            </div>
            <div class="h-box-column h-flex-auto h-main_box_barchart">
              <h-chart-bar title="" lengendPadding="0" id="xmysfx" :categoryNames="config.category2Names" :data="config.bar2Data"></h-chart-bar>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import '@/assets/scss/modules/app_main.scss'
  import Vuex from 'vuex'
  import HmainChartMap from '../common/MainChartMap'
  import HlistItem from '../common/ListItem'
  import HChartLine from '../common/MainChartLine'
  import HChartBar from '../common/MainChartBar'
  import HQtfyItem from '../common/MainQtfy'
  export default {
    name: 'fgs-app-main',
    components: {
      HmainChartMap,
      HlistItem,
      HChartLine,
      HChartBar,
      HQtfyItem
    },
    computed: {
      ...Vuex.mapState({
        'date': state => state.app.dateZW
      })
    },
    data () {
      return {
        isFinish: false,
        config: {
          listData: [],
          selectedDate: '',
          zbmc: '',
          zbvalue: '',
          qtyyfyData: [
            {value: 335, name: '可控费用', yss: 123, hss: 222, wcl: 23},
            {value: 1548, name: '非可控费用', yss: 234, hss: 3456, wcl: 100}
          ],
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
          },
          category2Names: ['基本建\n设投资', '技改', '大修',
            '研究开\n发费', '信息化\n投入', '营销专\n业投入', '管理\n咨询',
            '固定资\n产零购', '股权\n投资', '教育培训'],
          bar2Data: {
            '本年累计数': {
              type: 'bar',
              data: [1320, 1132, 6500, 2300, 1400, 5020, 20, 590, 1000, 1500]
            },
            '上年同期累计数': {
              type: 'bar',
              data: [590, 1000, 1500, 5000, 3500, 2600, 890, 1320, 1132, 6500]
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
        this.reload()
      })
    },
    methods: {
      reload () {
        this.$set(this.config, 'selectedDate', this.date)
        this.$store.dispatch('app/getJykhzbFgsData').then((data) => {
          this.isFinish = true
          this.$set(this.config, 'listData', data)
          this.$set(this.config, 'zbmc', data[0].name)
          this.$set(this.config, 'zbvalue', data[0].ncs)
          console.log(this.config)
        })
      },
      onOver (item) {
        this.$set(this.config, 'zbmc', item.name)
        this.$set(this.config, 'zbvalue', item.ncs + item.dw)
      }
    }
  }
</script>
