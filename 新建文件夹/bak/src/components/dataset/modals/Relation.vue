<template>
  <div class="vuedal__content">
    <div class="relation">
      <div class="relation__content">
        <div class="relation__container">
          <div class="relation__title">报表</div>
          <scrollbar>
          <ul class="relation__items" v-if="!loading && items.length">
            <li class="relation__item" v-for="item in items">
              <div class="relation__item-text relation__item-text--report">
                <div class="relation__item-name trimmed-text-with-ellipsis">{{item.name}}</div>
                <span>所有者: {{item.owner}} </span>
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
  import { fetchReportListByDatasetId } from '../../../api/dataset'
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
        fetchReportListByDatasetId(this.id).then(items => {
          this.items = items
          this.loading = false
        }, (e) => {
          this.loading = false
          Message.error(typeof e === 'string' ? e : '获取相关报表失败')
        })
      }
    }
  }
</script>
