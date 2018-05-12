<template>
  <resizable-pane class="task-pane side-pane" :class="{'side-pane--collapsed': isCollapsed}" containerId="pvExplorationHost" paneSide="left" sibling="visualization-pane" :expanded="!isCollapsed" :minWidth=200 :maxWidth="420" :collapsedWidth="27" :defaultWidth="200">
    <div class="pane-header">
      <button class="toggle-btn" @click.prevent="togglePane" title="显示/隐藏窗格" aria-label="显示/隐藏窗格">
        <span v-if="!isCollapsed" class="side-pane-horizontal-title side-pane-title unselectable trimmed-text-with-ellipsis">数据集</span>
        <span class="vertical-title"><span>数据集</span></span>
      </button>
    </div>
    <div class="pane-contents">
      <section class="field-list unselectable">
        <div class="data-set-select">
          <select class="form-control" @change="changeDatasetHandler">
            <option v-for="item in datasetList" :selected="currentDatasetId == item.id" :value="item.id">{{item.desc}}</option>
          </select>
          <button type="button" title="增加数据集" class="btn-icon" @click="addDataset"><i class="iconfont yg-tianjia"></i></button>
          <button type="button" title="删除数据集" class="btn-icon" @click="removeDataset"><i class="iconfont yg-shanqu"></i></button>
        </div>
        <div class="search-box">
          <input type="text" class="form-control" placeholder="搜索" maxlength="100" ref="propertySearchKeyword" @keydown.enter="searchPropertyHandler" />
          <button type="button" title="搜索" class="btn-icon" @click="searchPropertyHandler"><i class="iconfont yg-sousuo"></i></button>
        </div>
        <scrollbar>
          <ol>
            <li class="entry-container">
              <div class="entry-fields">
                <ol class="entry-list" ref="entryList">
                  <field-list-property v-for="item in datasetPropertyList"
                                       :key="item.id"
                                       :item="item"
                                       :dragContext="item"
                                       :checked="fieldPropertyIsChecked(item)"
                                       @check="checkFieldProperty"
                  ></field-list-property>
                </ol>
              </div>
            </li>
          </ol>
        </scrollbar>
      </section>
    </div>
  </resizable-pane>
</template>
<script>
  import _ from 'underscore'

  import {Message} from 'element-ui'

  import DeleteConfirm from '../common/DeleteConfirm.vue'
  import ResizablePane from '../common/ResizablePane.vue'
  import FieldListProperty from './field/FieldListProperty.vue'
  import Scrollbar from '../common/Scrollbar.vue'
  import dragScroll from '../mixins/dragScroll'
  import DatasetSelect from './modals/DatasetSelect.vue'

  const mixinScrollbar = Object.assign({}, Scrollbar, {mixins: []})
  mixinScrollbar['mixins'].push(dragScroll)

  export default {
    name: 'task-pane',
    components: {
      'scrollbar': mixinScrollbar,
      FieldListProperty,
      ResizablePane},

    data () {
      return {
        isCollapsed: false,
        propertySearchKeyword: ''
      }
    },

    computed: {
      visualContainers () {
        return this.$store.state.report.visualContainers
      },

      currentDatasetId () {
        return this.$store.state.report.currentDatasetId
      },

      datasetList () {
        return this.$store.getters['report/datasetList']
      },

      datasetPropertyList () {
        const list = []
        const inSearch = this.propertySearchKeyword !== ''
        ;(this.$store.getters['report/datasetPropertyList'] || []).forEach(property => {
          let hasChildSearched = false
          const children = property.children
          if (children && inSearch) {
            hasChildSearched = _.some(children, property => {
              return this.filterProperty(property, this.propertySearchKeyword)
            })
          }

          if (!inSearch || hasChildSearched === true || this.filterProperty(property, this.propertySearchKeyword)) {
            const copyProperty = _.omit(property, 'children')
            list.push(copyProperty)
          }

          if (children) {
            children.forEach(property => {
              if (!inSearch || this.filterProperty(property, this.propertySearchKeyword)) {
                list.push(_.extend({}, property))
              }
            })
          }
        })
        return list
      },

      checkedFieldProperties () {
        const currentVisualProperties = this.$store.getters['report/currentFieldProperties']
        const checkedProperties = {}
        const keys = Object.keys(currentVisualProperties)
        keys.forEach(key => {
          const properties = currentVisualProperties[key]
          properties.forEach(property => {
            if (property.parentId) {
              checkedProperties[property.parentId] = true
            }
            checkedProperties[property.id] = true
            if (property.children) {
              property.children.forEach(property => {
                checkedProperties[property.id] = true
              })
            }
          })
        })
        return checkedProperties
      }
    },

    methods: {
      /**
       * 过滤属性项目
       * @param property
       * @param keyword
       * @returns {boolean}
       */
      filterProperty (property, keyword) {
        if (typeof property.desc === 'string') {
          const match = property.desc.match(keyword)
          return match && match.length
        }
        return false
      },

      /**
       * 数据集改变事件句柄
       * @param event
       */
      changeDatasetHandler (event) {
        const value = event.target.value
        if (value === '') {
          this.propertySearchKeyword = ''
        }
        this.$store.commit('report/selectVisualContainer', null)
        this.$store.commit('report/changeDataset', value)
      },

      /**
       * 搜索属性句柄
       */
      searchPropertyHandler () {
        this.propertySearchKeyword = this.$refs['propertySearchKeyword'].value
      },

      /**
       * 切换面板
       */
      togglePane () {
        this.isCollapsed = !this.isCollapsed
      },

      /**
       * 选择属性项目
       * @param {object} datasetProperty
       * @param {boolean} checked
       */
      checkFieldProperty (datasetProperty, checked) {
        if (checked) {
          if (!this.$store.getters['report/currentVisualContainer']) {
            this.$store.commit('report/createVisualContainer')
            this.$nextTick(() => {
              this.$store.commit('report/addFieldProperty', {datasetProperty})
            })
          } else {
            this.$store.commit('report/addFieldProperty', {datasetProperty})
          }
        } else {
          this.$store.commit('report/removeFieldProperty', datasetProperty)
        }
      },
      /**
       * @param {object} property
       * @returns {boolean}
       */
      fieldPropertyIsChecked (property) {
        return this.checkedFieldProperties[property.id] === true
      },

      addDataset () {
        this.$vuedals.open({
          name: 'datasetSelect',
          title: '增加数据集',
          props: {
            filter: (item) => !_.some(this.datasetList, row => row.id === item.id),
            onConfirm: (datasetIds) => {
              this.$vuedals.close()
              this.$store.dispatch('report/addDataset', datasetIds).catch((e) => {
                console.error(e)
                Message.error('增加数据集失败')
              })
            }
          },
          component: DatasetSelect
        })
      },

      removeDataset () {
        this.$vuedals.open({
          name: 'datasetSelect',
          title: '删除数据集',
          props: {
            datasetList: this.datasetList.map(item => ({id: item.id, name: item.desc})),
            onConfirm: (datasetIds) => {
              const existsVisual = _.some(this.visualContainers, visualContainer => {
                return datasetIds.indexOf(visualContainer.datasetId) !== -1
              })
              if (!existsVisual) {
                this.$store.commit('report/removeDataset', datasetIds)
                this.$vuedals.close({$index: 0})
                return
              }
              this.$vuedals.open({
                name: 'deleteField',
                title: '删除此数据集',
                props: {
                  title: '删除此数据集',
                  message: '是否确定删除此数据集，确认后将删除此数据集及该数据集创建的图表',
                  onConfirm: () => {
                    this.$vuedals.close({$index: 1})
                    this.$store.commit('report/removeDataset', datasetIds)
                    this.$vuedals.close({$index: 0})
                    return Promise.resolve()
                  }
                },
                component: DeleteConfirm
              })
            }
          },
          component: DatasetSelect
        })
      }
    }
  }
</script>
