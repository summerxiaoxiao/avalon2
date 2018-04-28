<template>
  <bb-content ref="bbcontent" v-if="isFinish"
              :bbmc="config.bbmc"
              :appBar="appBar"
              :queryCondition="config.queryCondition"
              title="利润预算明细表(万元)"
              @on-refresh="refreshData"
  ></bb-content>
</template>

<script>
  import Vuex from 'vuex'
  import bbconst from '@/config/constant'
  import bbContent from '@/views/common/bbContent.vue'

  export default {
    components: {bbContent},
    name: 'fxbb08-app',
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
        config: {
          bbmc: bbconst.bgmc_xmdl,
          queryCondition: {
          }
        },
        appBar: {
          selectDwxz: null,
          selectDate: null,
          dwxzlist: null,
          showKeys: ['dwxz', 'date']
        }
      }
    },
    created () {
    },
    mounted () {
      this.load()
    },
    methods: {
      load () {
        var _self = this
        return this.$store.dispatch('app/loadDwxzlist').then(() => {
          _self.$set(_self.appBar, 'selectDwxz', this.selectDwxz)
          _self.$set(_self.appBar, 'selectDate', this.date)
          _self.$set(_self.appBar, 'dwxzlist', this.dwxzlist)

          // 查询条件
          this.$set(this.config, 'queryCondition', this.getQueryCondition(_self.appBar))
          _self.isFinish = true
        })
      },
      refreshData (selectMap) {
        // 保存过滤条件
        selectMap.selectDw && this.$store.commit('zyyszb01/setSelectDw', selectMap.selectDw)
        selectMap.selectDwxz && this.$store.commit('zyyszb01/setSelectDwxz', selectMap.selectDwxz)
        selectMap.date && this.$store.commit('zyyszb01/setDate', selectMap.selectDate)

        // 封装查询条件

        this.$set(this.config, 'queryCondition', this.getQueryCondition(selectMap))
        this.$refs.bbcontent.reload(this.config.queryCondition)
      },
      getQueryCondition (queryMap) { // 封装查询条件
        console.log('get query condition....')
        console.log(queryMap)
        return {
          tjqj: queryMap.selectDate
        }
      }
    }

  }
</script>
