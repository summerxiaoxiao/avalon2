<template>
  <div class="vuedal__content">
    <div class="relation">
      <div class="relation__content">
        <div class="relation__container">
          <div class="relation__title">数据集</div>
          <scrollbar>
          <ul class="relation__items" v-if="!loading && items.length">
            <li class="relation__item" v-for="item in items">
              <div class="relation__item-text relation__item-text--dataset">
                <div class="relation__item-name trimmed-text-with-ellipsis">{{item.name}}</div>
                <span>最后更新时间: </span>
              </div>
              <div class="relation__item-actions">
                <a href="#" @click.prevent="createReport(item.id)"><i class="iconfont yg-chuangjianbaobiao"></i> 新建报表</a>
              </div>
            </li>
          </ul>
          </scrollbar>
          <div class="flex flex-auto not-result" v-if="!loading && !items.length">
            <div class="flex-center">没有找到结果</div>
          </div>
          <div class="flex flex-auto" v-if="loading">
            <loader class="flex-center"></loader>
          </div>
        </div>
      </div>
    </div>
    <div class="vuedal__actions flex flex-right">
      <button type="button" class="btn btn-outline-black" @click.prevent="$emit('vuedals:close')">关闭</button>
    </div>
  </div>
</template>
<script>
  import {Message} from 'element-ui'
  import Loader from '../../common/Loader.vue'
  import { fetchDatasetListByReportId } from '../../../api/report'
  import Scrollbar from '../../common/Scrollbar.vue'

  export default {
    components: {
      Scrollbar,
      Loader
    },
    name: 'relation',
    props: {
      id: [String, Number],
      onConfirm: Function
    },
    data () {
      return {
        items: [],
        loading: true
      }
    },
    computed: {
      parentDirectory () {
        return this.$store.getters['reportManage/currentParentDirectory']
      }
    },
    created () {
      this.fetchDatasetList()
    },
    methods: {
      fetchDatasetList () {
        this.loading = true
        fetchDatasetListByReportId(this.id).then(items => {
          this.items = items
          this.loading = false
        }, (e) => {
          this.loading = false
          Message.error(typeof e === 'string' ? e : '获取数据集失败')
        })
      },
      createReport (datasetId) {
        let parentId
        if (this.parentDirectory) {
          parentId = this.parentDirectory.id
        } else {
          parentId = null
        }

        this.$store.dispatch('report/newReport', {parentId, datasetIds: [ datasetId ]}).then(() => {
          this.$router.push({
            name: 'reportNew'
          })
          this.$emit('vuedals:close')
        }).catch((e) => {
          Message.error(typeof e === 'string' ? e : '创建报表失败')
        })
      }
    }
  }
</script>
