<template>
  <div class="vuedal__content">
    <div class="data-select">
      <div class="data-select__filter">
        <shortcut-search v-model="keyword"></shortcut-search>
      </div><!-- /.data-select__filter -->
      <div class="data-select__content">
        <div class="data-select__container">
          <div class="data-select__title">字段名 <span v-if="keyword">（搜索）</span></div>
          <scrollbar>
          <ul class="data-select__items" v-if="!loading && itemList.length">
            <li class="data-select__item" v-for="item in itemList" :class="{'data-select__item--checked': isChecked(item.id)}">
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
          <div class="data-select__title">已选择字段</div>
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
      </div><!-- /.data-select__content-->
    </div><!-- /.data-select -->
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
  import {Message} from 'element-ui'

  import ShortcutSearch from '../../common/ShortcutSearch.vue'
  import DataSelect from '../../mixins/dataSelect'
  import Loader from '../../common/Loader.vue'
  import Scrollbar from '../../common/Scrollbar.vue'

  export default {
    components: {
      Scrollbar,
      ShortcutSearch,
      Loader
    },
    props: {
      node: Object
    },
    name: 'FieldSelect',
    mixins: [DataSelect],
    data () {
      const checkedIds = {}
      /*
      if (this.node.fields) {
        this.node.fields.forEach(field => {
          checkedIds[field.id] = true
        })
      }
      */
      const parentNode = this.node.parent
      let usedFieldIds = []
      if (parentNode.children) {
        for (const node of parentNode.children) {
          if (node.id !== this.node.id) {
            usedFieldIds = usedFieldIds.concat(node.fieldIds)
          }
        }
      }
      return {
        loading: false,
        saving: false,
        usedFieldIds,
        checkedIds
      }
    },
    computed: {
      sourceItemList () {
        const sourceDataset = this.$store.getters['linkage/sourceDataset']
        const items = sourceDataset ? sourceDataset.items : []
        if (this.node.ldlx === '0') {
          return items
        } else {
          return _.filter(items, item => {
            return this.usedFieldIds.indexOf(item.id) === -1
          })
        }
      }
    },
    mounted () {
      const sourceDataset = this.$store.getters['linkage/sourceDataset']
      if (!sourceDataset) {
        this.loading = true
        this.$store.dispatch('linkage/fetchDataset', this.node.parentChartId).then(() => {
          this.loading = false
        }, () => {
          this.loading = false
          Message.error('获取源图表数据集字段失败')
        })
      }
    },
    methods: {
      confirm () {
        const fieldIds = Object.keys(this.checkedIds)
        if (!fieldIds.length) {
          Message.warning('请选择字段')
          return
        }
        this.saving = true
        this.$store.dispatch('linkage/addFields', {
          id: this.node.id,
          fieldIds: fieldIds
        }).then(() => {
          this.saving = false
          this.$emit('vuedals:close')
        }, (...args) => {
          this.saving = false
          console.error(args)
          Message.error('添加字段失败')
        })
      }
    }
  }
</script>
