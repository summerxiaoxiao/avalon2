<template>
  <div class="zyyszb-qtkkfy h-box-column">
    <div class="zyyszb-item-title">其他可控费用</div>
    <div class="zyyszb-item h-box-row">
      <iframe id="qtkkfy-iframe" src="" style="display:block;" frameborder="0"></iframe>
    </div>
  </div>
</template>
<script>
  import Vuex from 'vuex'
  import bbutils from '@/utils/bbutils'
  import bgmc from '@/config/constant'
  export default {
    name: 'zyyszb01-kkfy-app-content',
    components: {
    },
    data () {
      return {
        bbCondition: {},
        bbItem: {},
        tableDom: null
      }
    },
    computed: {
      ...Vuex.mapState({
        'dwdm': state => state.ykqk.dwdm,
        'date': state => state.ykqk.date
      })
    },
    mounted () {
      this.$nextTick(function () {
        this.loadTable()
      })
    },
    methods: {
      reload () {
        bbutils.refreshIframe(this.bbCondition)
      },
      loadTable () {
        return this.$store.dispatch('zyyszb01/loadBar').then(() => {
          this.isFinish = true
          bbutils.loadBBItemByBbmc(bgmc.bgmc_xmdl).then((bbItem) => {
            this.bbItem = bbItem
            this.tableDom = document.querySelector('#qtkkfy-iframe')
            this.bbCondition = {
              tableCondition: bbutils.transferCondition({
                qureyType: bbItem['bglx'],
                tbid: bbItem['tbid'],
                tjqj: '201612'
              }),
              iframeAddr: bbItem['serverip'],
              iframeContainer: this.tableDom,
              id: 'receiver-content-cwzb'
            }
            bbutils.buildIframe(this.bbCondition)
            this.resizeIframe(this.tableDom)
          })
        })
      }
    }
  }
</script>
