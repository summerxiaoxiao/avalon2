<template>
  <div class="content-main">
    <div class="container-fluid">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-xs-12">
            <span class="data-title-close" @click="close">
             <button class="icon-close">&nbsp;</button>关闭
          </span>
          </div>
       <!-- </div>
        <div class="row">-->
          <div class="col-lg-12 col-md-12 col-xs-12">
            <div class="data-table-title">
              <div class="detail-title">月度预算执行</div>
              <div class="selector-search">
                <input type="text" class="search" placeholder="项目编码">
                <button class="btn-icon selector-search-icon" @click="onSearch">
                  <i class="iconfont yg-sousuo"></i>
                </button>
              </div>
              <span class="jldw">单位：元</span>
            </div>
            <div class="table-area-detail" id="detail-table">
              <iframe id="detail-iframe" src="" ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vuex from 'vuex'
  import bbutils from '@/utils/bbutils'
  import bgmc from '@/config/constant'
  export default {
    name: 'ykqk-app-contentdetail',
    props: {
      xmdlbm: String,
      _time: Number | String
    },
    data () {
      return {
        chart: null,
        chartOption: {},
        isFinish: false,
        bbItem: {}
      }
    },
    computed: {
      ...Vuex.mapState({
        'dwdm': state => state.ykqk.dwdm,
        'date': state => state.ykqk.date,
        'dwlist': state => state.ykqk.dwlist
      })
    },
    mounted () {
      this.$nextTick(function () {
        this.loadTable()
      })
    },
    methods: {
      close () {
        this.$emit('on-close')
      },
      onSearch () {
        this.reload()
      },
      reload () {
        bbutils.refreshIframe(this.bbCondition)
      },
      loadTable () {
        return this.$store.dispatch('ykqk/loadBar').then(() => {
          this.isFinish = true
          bbutils.loadBBItemByBbmc(bgmc.bgmc_xmdl).then((bbItem) => {
            this.bbItem = bbItem
            this.tableDom = document.querySelector('#detail-iframe')
            this.bbCondition = {
              tableCondition: bbutils.transferCondition({
                qureyType: bbItem['bglx'],
                tbid: bbItem['tbid'],
                tjqj: '201612'
              }),
              iframeAddr: bbItem['serverip'],
              iframeContainer: this.tableDom,
              id: 'receiver-content-detail'
            }
            bbutils.buildIframe(this.bbCondition)
          })
        })
      }
    }
  }
</script>
