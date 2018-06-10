<template>
  <div class="landing-container h-container_zyyszb">
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
  </div><!-- /.landing-container -->
</template>

<script>
  import Vuex from 'vuex'
  import '@/assets/scss/modules/zyyszb01.scss'
  import AppBar from '@/views/common/AppBar.vue'
  import AppContent from '@/views/zbkb/xmysfx07/Content.vue'

  // 项目类预算分析场景二
  export default {
    name: 'xmysfx07-app-main',
    components: {
      AppBar,
      AppContent
    },
    computed: {
      ...Vuex.mapState({
        'selectDw': state => state.app.selectDw,
        'selectDwxz': state => state.app.selectDwxz,
        'date': state => state.app.date,
        'dwlist': state => state.app.dwlist,
        'dwxzlist': state => state.app.dwxzlist
      })
    },
    data () {
      return {
        isFinish: false,
        currentView: 'app-content',
        appbarConfig: {
          selectDw: null,
          selectDwxz: null,
          selectDate: null,
          dwlist: null,
          dwxzlist: null,
          showKeys: ['dwxz', 'dwdm', 'date']
        }
      }
    },
    mounted () {
      this.load()
    },
    methods: {
      load () {
        var _self = this
        return this.$store.dispatch('app/loadDwlist').then(() => {
          return this.$store.dispatch('app/loadDwxzlist').then(() => {
            _self.$set(_self.appbarConfig, 'selectDw', this.selectDw)
            _self.$set(_self.appbarConfig, 'selectDwxz', this.selectDwxz)
            _self.$set(_self.appbarConfig, 'selectDate', this.date)
            _self.$set(_self.appbarConfig, 'dwlist', this.dwlist)
            _self.$set(_self.appbarConfig, 'dwxzlist', this.dwxzlist)
            _self.isFinish = true
          })
        })
      },
      refreshData (selectMap) {
        // 保存过滤条件
        selectMap.selectDw && this.$store.commit('app/setSelectDw', selectMap.selectDw)
        selectMap.selectDwxz && this.$store.commit('app/setSelectDwxz', selectMap.selectDwxz)
        selectMap.date && this.$store.commit('app/setDate', selectMap.selectDate)

        // 封装查询条件
        this.$refs.mycom.reload()
      }
    }
  }
</script>
