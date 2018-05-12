<template>
  <li class="filter-card unselectable">
    <section class="filter-card-title-section">
      <div class="filter-card-header" @click="toggleExpand(!expand)">
        <button @click="$emit('remove')" type="button" class="btn-icon" title="删除">
          <i class="iconfont yg-shanchu"></i>
        </button>
        <button type="button" class="btn-icon" :title="expand ? '折叠' : '展开'"><i class="iconfont" :class="expand ? 'yg-shouqi' : 'yg-xiala'"></i></button>
        <h1 class="title trimmed-text-with-ellipsis unselectable" :title="displayName + (!restatement ? '(全部)' : '')"><span>{{ displayName }}</span> <span v-if="!restatement">(全部)</span></h1>
      </div>
      <div class="control-pane flex" v-if="expand || restatement" :style="{visibility: restatement ? 'visible' : 'hidden'}">
        <h2 class="restatement trimmed-text-with-ellipsis item-fill" :title="restatement">{{ restatement }}</h2>
        <button @click="cleanCondition" type="button" class="btn-icon clean" title="清除筛选器">
          <i class="iconfont yg-shanchu"></i>
        </button>
      </div>
    </section>
    <div v-show="expand" class="filter-card-content">
      <h2 class="type-select-title trimmed-text-with-ellipsis" v-show="filterTypes.length">筛选器类型</h2>
      <select class="type-switch-options form-control" v-model="filterType" v-show="filterTypes.length">
        <option :value="option.value" v-for="option in filterTypes">{{ option.displayName }}</option>
      </select>
      <filter-advanced :propertyType="item.type" :condition="item.condition || {}" v-if="filterType === 'advanced'" :operatorList="operatorList" @apply="applyCondition"></filter-advanced>
      <slicer class="filter-base" :items="baseFilterData || []" :loading="baseFilterDataLoading" v-if="filterType === 'base'" :condition="item.condition" @apply="applyCondition"></slicer>
    </div>
  </li>
</template>
<script>
  import FilterAdvanced from './Advanced.vue'
  import _ from 'underscore'
  import {
    PROPERTY_TYPES,
    FILTER_TYPE_ADVANCED,
    FILTER_TYPE_BASE,
    NUMBER_OPERATOR_LIST,
    TEXT_OPERATOR_LIST, DATE_OPERATOR_LIST
  } from '../../../api/constant'
  import Slicer from '../../common/Slicer.vue'

  export default {
    components: {
      Slicer,
      FilterAdvanced},
    name: 'filter-card',
    props: {
      index: Number,
      item: Object
    },
    data () {
      let expand
      if (!_.isUndefined(this.item.filterExpand)) {
        expand = this.item.filterExpand
      } else {
        expand = !!_.isEmpty(this.item.condition)
      }

      const filterType = this.getFilterType(this.item)

      return {
        expand,
        filterType,
        baseFilterDataLoading: false
      }
    },
    created () {
      if (this.filterType === FILTER_TYPE_BASE && (!this.baseFilterData)) {
        this.fetchBaseFilterData()
      }
    },
    computed: {
      restatement () {
        return this.item.restatement
      },
      currentDatasetId () {
        return this.$store.state.report.currentDatasetId
      },
      displayName () {
        if (this.item.alias) {
          return this.item.alias
        } else {
          return this.item.desc
        }
      },
      filterTypes () {
        if (this.item.type === PROPERTY_TYPES.NUMBER) {
          return []
        } else {
          return [
            {value: FILTER_TYPE_BASE, displayName: '基本筛选'},
            {value: FILTER_TYPE_ADVANCED, displayName: '高级筛选'}
          ]
        }
      },
      operatorList () {
        if (this.item.type === PROPERTY_TYPES.NUMBER) {
          return NUMBER_OPERATOR_LIST
        } else if (this.item.type === PROPERTY_TYPES.DATE) {
          return DATE_OPERATOR_LIST
        } else {
          return TEXT_OPERATOR_LIST
        }
      },
      baseFilterData () {
        return this.$store.state.report.propertyValues[this.item.id + '###' + this.currentDatasetId]
      }
    },
    methods: {
      getFilterType (item) {
        return item.filterType || (item.type === PROPERTY_TYPES.NUMBER ? FILTER_TYPE_ADVANCED : FILTER_TYPE_BASE)
      },
      cleanCondition () {
        // this.restatement = ''
        this.$emit('clean', this.index)
      },
      applyCondition (condition) {
        this.$emit('apply', {index: this.index, condition, filterType: this.filterType, filterExpand: true})
      },
      fetchBaseFilterData () {
        this.baseFilterDataLoading = true
        this.$store.dispatch('report/fetchPropertyValues', {propertyId: this.item.id, datasetId: this.currentDatasetId}).then(() => {
          this.baseFilterDataLoading = false
        }).catch(() => {
          this.baseFilterDataLoading = false
        })
      },
      toggleExpand (expand) {
        this.expand = expand
        this.$emit('expand', this.index, expand)
      }
    },
    watch: {
      item (item) {
        this.filterType = this.getFilterType(item)
        this.expand = item.filterExpand
      },
      filterType (type) {
        if (type === 'base' && !this.baseFilterData) {
          this.fetchBaseFilterData()
        }
      }
    }
  }
</script>
