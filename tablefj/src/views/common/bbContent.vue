<template>
  <div class="landing-container h-container_zyyszb" v-if="isFinish">
    <app-bar @on-refresh="onRefresh" ref="myappbar"
             :selectDw="appBar.selectDw"
             :selectDwxz="appBar.selectDwxz"
             :selectDate="appBar.selectDate"
             :dwlist="appBar.dwlist"
             :dwxzlist="appBar.dwxzlist"
             :showKeys="appBar.showKeys"
    ></app-bar>
    <div class="h-content-main zyyszb-fxbb-container" >
      <div class="zyyszb-fxbb-box h-box-column h-flex-auto">
        <h-iframe-table ref="cwzb"
                        id="cwzb-iframe"
                        class="zyyszb-fxbb"
                        topFixed="false"
                        :title="title"
                        :bbmc="bbmc"
                        :queryCondition="queryCondition"
                        titleClass="zyyszb-fxbb-title"
        ></h-iframe-table>
      </div>
    </div>
  </div>
</template>
<script>
  import '@/assets/scss/modules/zyyszb01.scss'
  import AppBar from '@/views/common/AppBar.vue'
  import HIframeTable from '@/components/common/Iframetable.vue'
  // iframe 报表通用
  export default {
    name: 'bbcontent-app',
    components: {
      AppBar,
      HIframeTable
    },
    props: {
      title: String,
      bbmc: String,
      queryCondition: Object,
      appBar: Object
    },
    data () {
      return {
        isFinish: false
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.isFinish = true
      })
    },
    methods: {
      onRefresh (selectMap) {
        // dwxz, dwdm, date
        this.$emit('on-refresh', selectMap)
      },
      reload (queryParams) {
        this.$refs.cwzb.reload(queryParams)
      }
    }
  }
</script>
<style>
  .zyyszb-table-box__table{
    height: 100%;
  }
</style>
<!--
<bb-content ref="bbcontent" v-if="isFinish"
            :bbmc="config.bbmc"
            :appBar="appBar"
            :queryCondition="config.queryCondition"
            title="test 报表"
            @on-refresh="refreshData"
></bb-content>-->
