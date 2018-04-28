<template>
  <div class="landing-container h-container_main">
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
</template>
<script>
  import '@/assets/scss/modules/app_main.scss'
  import Vuex from 'vuex'
  import AppBar from '@/views/common/AppBar.vue'
  import AppContentSheng from './shengMain'
  import AppContentFgs from './fgsMain'
  import AppContentTest from './test'
  export default {
    name: 'sheng-app-main',
    components: {
      AppBar,
      AppContentSheng,
      AppContentFgs,
      AppContentTest
    },
    computed: {
      ...Vuex.mapState({
        'selectDwxz': state => state.app.selectDwxz,
        'date': state => state.app.date,
        'dwxzlist': state => state.app.dwxzlist
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
        return this.$store.dispatch('app/loadDwxzlist').then(() => {
          _self.$set(_self.appbarConfig, 'selectDwxz', this.selectDwxz)
          _self.$set(_self.appbarConfig, 'selectDate', this.date)
          _self.$set(_self.appbarConfig, 'dwxzlist', this.dwxzlist)
          _self.isFinish = true
        })
      },
      refreshData (selectMap) {
        // 保存过滤条件
        selectMap.selectDwxz && this.$store.commit('app/setSelectDwxz', selectMap.selectDwxz)
        selectMap.selectDate && this.$store.commit('app/setDate', selectMap.selectDate)
        this.currentView = selectMap.selectDwxz.value === '分公司' ? 'app-content-fgs' : selectMap.selectDwxz.value === '省公司' ? 'app-content-sheng' : this.currentView
        // 封装查询条件
        this.$refs.mycom.reload()
      }
    }
  }
</script>
