<template>
  <div class="vuedal__content">
    <div class="flex flex-center" v-if="loading">
      <loader></loader>
    </div>
    <div class="data-select" v-else>
      <div class="data-select__filter">
        <div class="form-inline" v-if="parentNode.ldlx != 0 || parentNode.ldlx == null">
          <label>选择工作表：</label>
          <select class="form-control form-control--small" v-model="sectionId">
            <option :value="item.id" v-for="item of sectionItems">{{item.name}}</option>
          </select>
        </div>
      </div><!-- /.data-select__filter -->
      <div class="data-select__content" v-if="sectionId">
        <div class="data-select__container">
          <div class="data-select__title">选择图表</div>
          <scrollbar>
          <ul class="data-select__items" v-if="!loading && itemList.length">
            <li class="data-select__item" v-for="item in itemList" :class="{'data-select__item--checked': isChecked(item.id)}">
              <div class="data-select__item-text trimmed-text-with-ellipsis">{{item.name}}</div>
              <div class="data-select__item-check-icon" @click="check(item.id)"><i v-if="isChecked(item.id)" class="iconfont yg-yes"></i></div>
            </li>
          </ul>
          </scrollbar>
        </div>
        <div class="data-select__container data-select__container--selected">
          <div class="data-select__title">已选择图表</div>
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
    <div class="vuedal__actions flex flex-right" v-if="!loading">
      <loader v-if="saving" style="display: inline-block"></loader>
      <button :disabled="saving" type="button" class="btn btn-black" @click.prevent="confirm">
        确定</button>
      <button type="button" class="btn btn-outline-black" @click.prevent="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>

<script>
  import _ from 'underscore'
  import { Message } from 'element-ui'
  import DataSelect from '../../mixins/dataSelect'
  import Loader from '../../common/Loader.vue'
  import Scrollbar from '../../common/Scrollbar.vue'

  export default {
    components: {
      Scrollbar,
      Loader
    },
    name: 'VisualSelect',
    mixins: [DataSelect],
    props: {
      parentNode: Object
    },
    data () {
      return {
        sectionId: null,
        loading: false,
        saving: false
      }
    },
    mounted () {
      if (!this.sectionItems) {
        this.fetchSectionItems()
      } else {
        if (!this.sectionId && this.sectionItems.length) {
          this.sectionId = this.sectionItems[0].id
        }
      }
    },
    computed: {
      root () {
        return this.$store.getters['linkage/root']
      },
      sectionItems () {
        return this.$store.state.linkage.sectionItems
      },
      sourceItemList () {
        if (!this.sectionId) {
          return []
        }
        for (const section of this.sectionItems) {
          if (section.id === this.sectionId) {
            if (this.parentNode.ldlx === '0') {
              // 自己不能关联自己
              return _.filter(section.items, item => item.id !== this.parentNode.chartId)
            } else {
              return section.items
            }
          }
        }
      }
    },
    methods: {
      fetchSectionItems () {
        if (!this.root) {
          return
        }
        this.loading = true
        this.$store.dispatch('linkage/fetchSectionItems', {chartId: this.root.chartId, onlySelfSection: this.root.ldlx === '0'}).then(() => {
          this.loading = false
        }, (...args) => {
          console.error(args)
          Message.error('获取图表数据失败')
        })
      },
      confirm () {
        if (!this.sectionId || !this.checkedList.length) {
          Message.warning('请选择图表')
          return
        }

        const hasFieldMode = _.some(this.parentNode.children || [], node => {
          return node.mode === '1'
        })

        let mode = 0
        if (hasFieldMode) {
          mode = 1
        }

        if (this.checkedList.length > 1) {
          mode = hasFieldMode ? 1 : (this.parentNode.ldlx === '1' ? 1 : 0)
        }

        this.saving = true
        this.$store.dispatch('linkage/addNode', {
          parent: {
            id: this.parentNode.id,
            chartId: this.parentNode.chartId
          },
          mode: mode,
          children: this.checkedList
        }).then(() => {
          this.saving = false
          this.$emit('vuedals:close')
        }, (...args) => {
          this.saving = false
          console.error(args)
          Message.error('添加穿透失败。')
        })
      }
    },
    watch: {
      sectionId () {
        this.checkedIds = {}
      },
      sectionItems (items) {
        if (!this.sectionId && items && items.length) {
          this.sectionId = items[0].id
        }
      }
    }
  }
</script>
