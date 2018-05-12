<template>
  <app-bar>
    <div class="app-bar__section app-bar__section--left" slot="left">
      <div class="app-bar__title">
        数据集
      </div>
    </div>
    <div class="app-bar__section app-bar__section--right" slot="right">
      <ul>
        <li @click.prevent="handleCreateDirectory">
          <i class="iconfont yg-chuangjianmulu"></i> 创建目录
        </li>
      </ul>
    </div>
  </app-bar>
</template>

<script>
  import AppBar from '../common/AppBar.vue'

  export default {
    components: {AppBar},
    name: 'dataset-app-bar',
    computed: {
      directoryAppendingId () {
        return this.$store.getters['datasetManage/directoryAppendingId']
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
            this.$store.commit('datasetManage/createDirectory')
          })
        } else if (listVm) {
          listVm.directoryAppendingFocus(this.directoryAppendingId)
        }
      }
    }
  }
</script>
