<template>
    <div class="h-box-column ykqk-detail-box">
       <div class="ykqk-detail-box__data-title-close" >
            <span class="exportBtn-s" @click.stop="exportData">导出</span>
            <span @click="close"> <button class="icon-close">&nbsp;</button>关闭</span>
       </div>
       <div class="h-flex2 ykqk-detail-table-box">
         <div class="ykqk-detail-table-box__data-title">
           <div class="ykqk-detail-table-box__table-title">月度预算执行</div>
           <div class="ykqk-detail-table-box__selector-search">
             <input type="text" class="ykqk-detail-table-box__search"
                    @keyup.enter="enterSearch"
                    placeholder="项目编码" ref="xmbm">
             <button class="btn-icon selector-search-icon" @click="onSearch">
               <i class="iconfont yg-sousuo"></i>
             </button>
           </div>
           <span class="ykqk-detail-table-box__data-jldw">单位：元</span>
         </div>
         <div class="h-flex2 ykqk-detail-table-box__table" id="detail-table">
           <h-iframe-table ref="xmmxTable" title="月度预算执行"
                           id="detail-iframe"
                           :bbmc="bbmc"
                           :queryCondition="tableQueryCondition"
           ></h-iframe-table>
         </div>
       </div>
       </div>
</template>
<script>
  import Vuex from 'vuex'
  import $ from 'jquery'
  import bbconst from '@/config/constant'
  import HIframeTable from '@/components/common/Iframetable.vue'

  export default {
    name: 'ykqk-app-contentdetail',
    components: {
      HIframeTable
    },
    props: {
      _time: Number | String
    },
    data () {
      return {
        bbmc: bbconst.bbmc_xmmx,
        isFinish: false
      }
    },
    computed: {
      ...Vuex.mapState({
        'dwdm': state => state.ykqk.dwdm,
        'date': state => state.ykqk.date,
        'dwlist': state => state.ykqk.dwlist,
        'tableQueryCondition': state => state.ykqk.tableQueryCondition_xmmx
      })
    },
    mounted () {
      this.$nextTick(function () {
        $(document.body).css('overflow', 'hidden')
        $(document.body).data('overflow', 'hidden')
      })
    },
    methods: {
      close () {
        this.$emit('on-close')
      },
      exportData () {
        this.$refs.xmmxTable.download()
      },
      enterSearch (ev) {
        ev.keyCode === 13 && this.onSearch()
      },
      onSearch () {
        this.$store.commit('ykqk/setTableQueryCondition_xmmx', {xmbm: this.$refs.xmbm.value})
        this.reload()
      },
      reload () {
        this.$refs.xmmxTable.reload(this.tableQueryCondition)
      }
    }
  }
</script>
