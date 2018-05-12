<template>
  <div class="black-theme">
  <div class="landing-container h-container_main ">
    <app-bar @on-refresh="refreshData" ref="myappbarConfig" v-if="isFinish"
             :selectDw="appbarConfig.selectDw"
             :selectDwxz="appbarConfig.selectDwxz"
             :selectDate="appbarConfig.selectDate"
             :dwlist="appbarConfig.dwlist"
             :dwxzlist="appbarConfig.dwxzlist"
             :showKeys="appbarConfig.showKeys"
    ></app-bar>
    <component :is="currentView"
               ref="mycom"></component>
  </div>
  </div>
</template>
<script>
  import '@/assets/scss/modules/qmys.scss'
  import Vuex from 'vuex'
  import AppBar from '@/views/qmys/common/AppBar.vue'
  import AppContentSheng from '@/views/qmys/driver/Content'
  export default {
    name: 'driver-app-main',
    components: {
      AppBar,
      AppContentSheng
    },
    computed: {
      ...Vuex.mapState({
        'selectDwxz': state => state.qmys.selectDwxz,
        'date': state => state.qmys.date,
        'dwxzlist': state => state.qmys.dwxzlist
      })
    },
    data () {
      return {
        isFinish: false,
        currentView: 'app-content-sheng',
        appbarConfig: {
          selectDwxz: null,
          selectDate: null,
          dwxzlist: null,
          showKeys: ['dwxz', 'date']
        }
      }
    },
    mounted () {
      // this.$router.push({'name': 'zbkb01_bb', params: {mode: 'bb'}})
      this.load()
    },
    methods: {
      load () {
        var _self = this
        return this.$store.dispatch('qmys/loadDwxzlist').then(() => {
          _self.$set(_self.appbarConfig, 'selectDwxz', this.selectDwxz)
          _self.$set(_self.appbarConfig, 'selectDate', this.date)
          _self.$set(_self.appbarConfig, 'dwxzlist', this.dwxzlist)
          _self.isFinish = true
        })
      },
      refreshData (selectMap) {
        // 保存过滤条件
        selectMap.selectDwxz && this.$store.commit('qmys/setSelectDwxz', selectMap.selectDwxz)
        selectMap.selectDate && this.$store.commit('qmys/setDate', selectMap.selectDate)
        this.currentView = selectMap.selectDwxz.value === '分公司' ? 'app-content-fgs' : selectMap.selectDwxz.value === '省公司' ? 'app-content-sheng' : this.currentView
        // 封装查询条件
        this.$refs.mycom.reload()
      }
    }
  }
</script>
