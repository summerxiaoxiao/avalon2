<template>
  <div class="data-list">
    <div class="breadcrumb data-breadcrumb">
      <span>报表模板</span>
    </div>
    <div class="data-filter">
      <div class="data-search">
        <shortcut-search :value="keyword" @search="search"></shortcut-search>
      </div>
      <div class="data-sort">
        <span class="data-total">共{{ total }}条</span>
        <select class="form-control" v-model="sortType">
          <option value="1">按名称排序（升序）</option>
          <option value="2">按名称排序（降序）</option>
          <option value="3">最后发布时间（升序）</option>
          <option value="4">最后发布时间（降序）</option>
        </select>
      </div>
    </div>
    <div class="data-table">
      <div class="data-table__head">
        <div class="data-table__row">
          <div class="data-table__column" :style="{width: columnWidthMap[0]}">名称</div>
          <div class="data-table__column" :style="{width: columnWidthMap[1]}">工作表/图表</div>
          <div class="data-table__column" :style="{width: columnWidthMap[2]}">最后发布时间</div>
          <div class="data-table__column" :style="{width: columnWidthMap[3]}">发布者</div>
          <div class="data-table__column" :style="{width: columnWidthMap[4]}">操作</div>
        </div>
      </div>
      <scrollbar ref="scrollbar" class="flex flex-auto">
        <div class="data-table__body" v-if="!loading && reports.length">
          <report-list-item ref="reports" class="data-table__row" v-for="item, index in reports" v-bind="item" :key="item.id" :columnWidthMap="columnWidthMap"></report-list-item>
        </div>
        <div class="flex flex-auto" v-if="loading">
          <loader class="flex-center"></loader>
        </div>
        <div class="data-table__empty" v-if="!loading && !reports.length">
          <div class="data-table__empty-content">
            <h4 v-if="keyword">没有找到结果</h4>
            <h4 v-else>没有找到报表模板</h4>
          </div>
        </div>
      </scrollbar>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import _ from 'underscore'

  import ReportListItem from './ListItem.vue'
  import Scrollbar from '../common/Scrollbar.vue'
  import ShortcutSearch from '../common/ShortcutSearch.vue'

  import { Message } from 'element-ui'
  import Loader from '../common/Loader.vue'

  export default {
    components: {
      Loader,
      ShortcutSearch,
      Scrollbar,
      ReportListItem},
    name: 'report-template-list',
    data () {
      return {
        keyword: '',
        loading: true,
        sortType: 4
      }
    },
    created () {
      this.load()
    },
    computed: {
      total () {
        return this.reports.length
      },
      items () {
        return this.$store.state.reportTemplateManage.items
      },
      reports () {
        return _.filter(this.items, item => {
          return item.type === '1'
        })
      },
      columnWidthMap () {
        return ['25%', '15%', '20%', '20%', '20%']
      }
    },
    methods: {
      search (keyword) {
        keyword = $.trim(keyword)
        this.keyword = keyword
        if (keyword === '') {
          this.fetchList()
        } else {
          this.fetchList({keyword})
        }
      },
      load () {
        return this.fetchList()
      },
      fetchList ({keyword} = {}) {
        this.loading = true
        return this.$store.dispatch('reportTemplateManage/fetchList', {keyword, sortType: this.sortType}).then(() => {
          this.loading = false
        }).catch(() => {
          this.loading = false
          Message.error('获取报表模板失败')
        })
      }
    },
    watch: {
      'sortType' () {
        this.fetchList(this.keyword ? {keyword: this.keyword} : {})
      }
    }
  }
</script>
