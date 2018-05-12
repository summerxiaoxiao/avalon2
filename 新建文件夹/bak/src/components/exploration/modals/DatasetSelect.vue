<template>
  <div class="vuedal__content">
    <div class="data-select">
      <div class="data-select__filter">
        <shortcut-search v-model="keyword"></shortcut-search>
      </div>
      <div class="data-select__content">
        <div class="data-select__container">
          <div class="data-select__title">数据集 <span v-if="keyword">（搜索）</span></div>
          <scrollbar>
          <ul class="data-select__items" v-if="!loading && itemList.length">
            <li class="data-select__item" v-for="item in itemList" :class="{' data-select__item--checked': isChecked(item.id)}">
              <div class="data-select__item-text trimmed-text-with-ellipsis">{{item.name}}</div>
              <div class="data-select__item-check-icon" @click="check(item.id)"><i v-if="isChecked(item.id)" class="iconfont yg-yes"></i></div>
            </li>
          </ul>
          </scrollbar>
          <div class="flex flex-auto not-result" v-if="!loading && !itemList.length">
            <div class="flex-center">没有找到结果</div>
          </div>
          <div class="flex flex-auto" v-if="loading">
            <loader class="flex-center"></loader>
          </div>
        </div>
        <div class="data-select__container data-select__container--selected">
          <div class="data-select__title">已选择数据集</div>
          <scrollbar>
          <ul class="data-select__items" v-if="checkedList.length">
            <li class="data-select__item" v-for="item in checkedList">
              <div class="data-select__item-text trimmed-text-with-ellipsis">{{item.name}}</div>
              <div class="data-select__item-check-icon" @click="removeChecked(item.id)">
                <i class="iconfont yg-no"></i>
              </div>
            </li>
          </ul>
          </scrollbar>
        </div>
      </div>
    </div>
    <div class="vuedal__actions flex flex-right">
      <loader v-if="saving" style="display: inline-block"></loader>
      <button :disabled="saving" type="button" class="btn btn-black" @click.prevent="confirm">
        确定</button>
      <button type="button" class="btn btn-outline-black" @click.prevent="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>
<script>
  import _ from 'underscore'

  import ShortcutSearch from '../../common/ShortcutSearch.vue'
  import {Message} from 'element-ui'
  import Loader from '../../common/Loader.vue'
  import DataSelect from '../../mixins/dataSelect'
  import Scrollbar from '../../common/Scrollbar.vue'

  export default {
    components: {
      Scrollbar,
      Loader,
      ShortcutSearch},
    name: 'dataset-select',
    mixins: [DataSelect],
    props: {
      filter: Function,
      datasetList: Array,
      onConfirm: Function
    },
    data () {
      return {
        saving: false,
        loading: false
      }
    },
    computed: {
      sourceItemList () {
        if (this.datasetList) {
          return this.datasetList
        } else {
          const datasetList = this.$store.state.reportManage.datasetList || []
          if (this.filter) {
            return datasetList.filter(this.filter)
          } else {
            return datasetList
          }
        }
      }
    },
    created () {
      if (!this.datasetList) {
        this.fetchDatasetList()
      }
    },
    methods: {
      confirm () {
        const datasetIds = _.keys(this.checkedIds)
        if (!datasetIds.length) {
          Message.error('请选择数据集')
          return
        }
        this.onConfirm(datasetIds)
      },
      fetchDatasetList () {
        this.loading = true
        this.$store.dispatch('reportManage/fetchDatasetList').then(() => {
          this.loading = false
        }, (e) => {
          this.loading = false
          Message.error(typeof e === 'string' ? e : '获取数据集失败')
        })
      }
    }
  }
</script>
