<template>
  <div class="content-main zyyszb-main">
    <div class="container-fluid h-box-row">
      <div class="zyyszb-main-left h-flex1">
        <div class="zyyszb-title">经营指标</div>
        <div class="zyyszb-left-box h-box-column">
          <div class="zyyszb-left-item h-flex1">112</div>
          <div class="zyyszb-left-item h-flex1">222</div>
          <div class="zyyszb-left-item h-flex1">2222</div>
          <div class="zyyszb-left-item h-flex1">1111</div>
          <div class="zyyszb-left-item h-flex1">1111</div>
        </div>
      </div>
      <div class="zyyszb-main-right h-flex2">
        <div class="zyyszb-content-box h-box-column">
          <cwzb ref="cwzb"></cwzb>
          <kkfy ref="kkfy"></kkfy>
          <qtkkfy ref="qtkkfy"></qtkkfy>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import '@/assets/scss/ykqk/_ykqk.scss'
  import Vuex from 'vuex'
  import Cwzb from './components/Cwzb.vue'
  import Kkfy from './components/Kkfy.vue'
  import Qtkkfy from './components/Qtkkfy.vue'
  export default {
    name: 'zyyszb01-app-content',
    components: {
      Cwzb,
      Kkfy,
      Qtkkfy
    },
    data () {
      return {
        isFinish: false
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
      })
    },
    methods: {
      reload () {
        this.$refs.cwzb.reload()
        this.$refs.kkfy.reload()
        this.$refs.qtkkfy.reload()
      }
    }
  }
</script>
