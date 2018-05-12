<template>
  <app-bar>
    <div class="app-bar__section app-bar__section--left" slot="left">
      <div class="app-bar__title">
        我的报表
      </div>
    </div>
    <div class="app-bar__section app-bar__section--right" slot="right">
      <ul>
        <li @click.prevent="handleCreateDirectory">
          <i class="iconfont yg-chuangjianmulu"></i> 创建目录
        </li>
        <li @click.prevent="handleCreateReport">
          <i class="iconfont yg-chuangjianbaobiao"></i> 创建报表
        </li>
      </ul>
    </div>
  </app-bar>
</template>

<script>
  import AppBar from '../common/AppBar.vue'

  import DatasetSelect from './modals/DatasetSelect.vue'

  export default {
    components: {AppBar},
    name: 'report-app-bar',
    computed: {
      directoryAppendingId () {
        return this.$store.getters['reportManage/directoryAppendingId']
      }
    },
    methods: {
      handleCreateDirectory () {
        const listVm = this.$parent.$refs['list']

        if (!this.directoryAppendingId) {
          Promise.resolve().then(() => {
            if (listVm && listVm.keyword) {
              listVm.keyword = null
              return listVm.fetchList()
            }
          }).then(() => {
            this.$store.commit('reportManage/createDirectory')
          })
        } else if (listVm) {
          listVm.directoryAppendingFocus(this.directoryAppendingId)
        }
      },
      handleCreateReport () {
        this.$vuedals.open({
          name: 'datasetSelect',
          title: '选择数据集',
          component: DatasetSelect
        })
      }
    }
  }
</script>
