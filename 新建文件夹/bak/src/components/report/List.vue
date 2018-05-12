<template>
  <div class="data-list">
    <directory-breadcrumb :directories="directoryStack" class="data-breadcrumb" pathName="reports"></directory-breadcrumb>
    <div class="data-filter">
      <div class="data-search">
        <shortcut-search :value="keyword" @search="search"></shortcut-search>
      </div>
      <div class="data-sort">
        <span class="data-total">共{{ total }}条</span>
        <select class="form-control" v-model="sortType">
          <option value="1">按名称排序（升序）</option>
          <option value="2">按名称排序（降序）</option>
          <option value="3">最后修改时间（升序）</option>
          <option value="4">最后修改时间（降序）</option>
        </select>
      </div>
    </div>
    <div class="data-table">
      <div class="data-table__head">
        <div class="data-table__row">
          <div class="data-table__column" :style="{width: columnWidthMap[0]}">名称</div>
          <div class="data-table__column" :style="{width: columnWidthMap[1]}">工作表/图表</div>
          <div class="data-table__column" :style="{width: columnWidthMap[2]}">最后修改时间</div>
          <div class="data-table__column" :style="{width: columnWidthMap[3]}">所有者</div>
          <div class="data-table__column" :style="{width: columnWidthMap[4]}">操作</div>
        </div>
      </div>
      <scrollbar ref="scrollbar" class="flex flex-auto">
        <div class="data-table__body" v-if="!loading && (directories.length || reports.length)">
          <report-list-item ref="directories" class="data-table__row" v-for="item, index in directories" v-bind="item" @editing="editingItem" :key="item.id" :columnWidthMap="columnWidthMap" :createDirectoryHandler="createDirectory" :moveItemHandler="moveItem" @rename="renameItem" @delete="deleteItem"></report-list-item>
          <report-list-item ref="reports" class="data-table__row" v-for="item, index in reports" v-bind="item" :key="item.id" @editing="editingItem" :columnWidthMap="columnWidthMap" :moveItemHandler="moveItem" :createDirectoryHandler="createDirectory" @rename="renameItem" @delete="deleteItem" @copy="copyItem"></report-list-item>
        </div>
        <div class="flex flex-auto" v-if="loading">
          <loader class="flex-center"></loader>
        </div>
        <div class="data-table__empty" v-if="!loading && !(directories.length || reports.length)">
          <div class="data-table__empty-content can-add-report">
            <h4 v-if="keyword">没有找到结果</h4>
            <h4 v-else>您还没有创建过报表</h4>
            <p>可以试试 <a href="#" @click.prevent="createReport">创建报表</a></p>
          </div>
        </div>
      </scrollbar>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import _ from 'underscore'

  import DatasetSelect from './modals/DatasetSelect.vue'
  import DeleteConfirm from './modals/DeleteConfirm.vue'

  import ReportListItem from './ListItem.vue'
  import Scrollbar from '../common/Scrollbar.vue'
  import ShortcutSearch from '../common/ShortcutSearch.vue'

  import DirectoryBreadcrumb from '../common/DirectoryBreadcrumb.vue'
  import { fetchReportDirectoryParents } from '../../api/report'
  import { isGenerateId } from '../../api/data'

  import dragScroll from '../mixins/dragScroll'

  import { Message } from 'element-ui'
  import Loader from '../common/Loader.vue'

  const DragScrollBar = {
    'extends': Scrollbar,
    mixins: [dragScroll]
  }

  export default {
    components: {
      Loader,
      DirectoryBreadcrumb,
      ShortcutSearch,
      'scrollbar': DragScrollBar,
      ReportListItem},
    props: {
      parentId: {
        type: String,
        'default': null
      }
    },
    name: 'report-list',
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
      directoryStack () {
        return this.$store.state.reportManage.directoryStack
      },
      total () {
        return this.directories.length + this.reports.length
      },
      items () {
        return this.$store.state.reportManage.items
      },
      tree () {
        return this.$store.state.reportManage.tree
      },
      directories () {
        return _.filter(this.items, item => {
          const isDirectory = item.type === '0'
          if (this.keyword) {
            return isDirectory
          } else {
            return isDirectory && this.parentId === item.parentId
          }
        })
      },
      reports () {
        return _.filter(this.items, item => {
          const isReport = item.type === '1'
          if (this.keyword) {
            return isReport
          } else {
            return isReport && this.parentId === item.parentId
          }
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
          this.fetchList({parent: this.parentId})
        } else {
          this.fetchList({keyword})
        }
      },
      load () {
        this.loading = true
        return this.$store.dispatch('reportManage/fetchDirectoryStack', {id: this.parentId}).then(() => {
          return this.fetchList({parentId: this.parentId})
        }, e => {
          Message.error(typeof e === 'string' ? e : '获取目录信息失败')
          this.$router.push({name: 'reports'})
        }).then(() => {
          this.loading = false
        }, () => {
          this.loading = false
        })
      },
      fetchList ({parentId, keyword} = {}) {
        this.loading = true
        if (_.isUndefined(keyword) && _.isUndefined(parentId)) {
          parentId = this.parentId
        }
        return this.$store.dispatch('reportManage/fetchList', {parentId, keyword, sortType: this.sortType}).then(() => {
          this.loading = false
        }).catch(() => {
          this.loading = false
          Message.error('获取我的报表数据失败')
        })
      },
      directoryAppendingFocus () {
        if (this.$refs['directories']) {
          this.$refs['directories'].forEach(vm => {
            if (vm.appending) {
              vm.nameEditingFocus()
            }
          })
        }
      },
      createDirectory ({id, name, parentId}) {
        if (_.isUndefined(parentId)) {
          parentId = this.parentId
        }
        // name = this.normalizeName({name, type: '0'})
        return this.$store.dispatch('reportManage/createDirectory', {id, parentId, name}).then((resp) => {
          Message.success('创建目录成功')
          if (!parentId === this.parentId) {
            this.fetchList({parentId: this.parentId})
          }
          return resp
        }, e => {
          Message.error(typeof e === 'string' ? e : '创建目录失败')
          throw new Error(e)
        })
      },
      renameItem ({id, type, name}) {
        // name = this.normalizeName({name, type})
        this.$store.dispatch('reportManage/renameItem', {id, type, name}).then(() => {
          Message.success('重命名成功')
        }, e => {
          Message.error(typeof e === 'string' ? e : '重命名失败')
        })
      },
      deleteItem (id, type) {
        if (isGenerateId(id)) {
          this.$store.commit('reportManage/removeDirectory', id)
        } else {
          this.$vuedals.open({
            name: 'deleteConfirm',
            component: DeleteConfirm,
            title: '提示',
            props: {
              type,
              onConfirm: () => {
                return this.$store.dispatch('reportManage/deleteItem', {id, type}).then(() => {
                  Message.success('删除成功')
                }, e => {
                  Message.error(typeof e === 'string' ? e : '删除失败')
                  console.error(e)
                  return Promise.reject()
                })
              }
            }
          })
        }
      },
      moveItem ({id, parentId, type}) {
        return this.validateParentDirectory(id, parentId).then(() => {
          return this.$store.dispatch('reportManage/moveItem', {id, parentId, type}).then(() => {
            Message.success('移动成功')
          }, e => {
            Message.error(typeof e === 'string' ? e : `移动${type === '0' ? '目录' : '报表'}失败`)
          })
        }, () => {
          Message.error(type === '0' ? '移动的目录无效，请不要移动到该目录的子目录或自身目录' : '移动的目录无效')
          return Promise.reject()
        })
      },
      normalizeName ({name, type, items}) {
        if (!items) {
          if (type === '0') {
            items = this.directories
          } else {
            items = this.reports
          }
        }
        const item = _.find(items, item => {
          return item.name === name
        })
        if (item) {
          const match = /^(.*)\((\d+)\)$/.exec(item.name)
          let numMath
          if (match && (numMath = (/^[1-9]*[1-9][0-9]*$/.exec(match[2])))) {
            return `${match[1]}(${parseInt(numMath[0]) + 1})`
          } else {
            return `${name}(1)`
          }
        } else {
          return name
        }
      },
      editingItem (value) {
        if (this.$refs['directories']) {
          this.$refs['directories'].forEach(vm => {
            vm.toggleDragdrop(!!value)
          })
        }
        if (this.$refs['reports']) {
          this.$refs['reports'].forEach(vm => {
            vm.toggleDragdrop(!!value)
          })
        }
      },
      copyItem (id, type) {
        if (type === '1') {
          this.$store.dispatch('reportManage/copyReport', {id}).then(() => {
            Message.success('复制成功')
            this.fetchList()
          }, () => {
            Message.error('复制失败')
          })
        }
      },
      createReport () {
        this.$vuedals.open({
          name: 'datasetSelect',
          title: '选择数据集',
          component: DatasetSelect
        })
      },
      validateParentDirectory (id, parentId) {
        if (id === parentId || (id === null && parentId === 'root')) {
          return Promise.reject()
        }
        return fetchReportDirectoryParents(parentId).then(parents => {
          const result = _.some(parents, parent => {
            return parent.id === id
          })
          return result ? Promise.reject() : Promise.resolve()
        })
      }
    },
    watch: {
      'sortType' () {
        this.fetchList(this.keyword ? {keyword: this.keyword} : {parentId: this.parentId})
      },
      'parentId' () {
        this.keyword = null
        this.load()
      },
      'directories' (directories) {
        const hasAppending = _.some(directories, directory => {
          return directory.appending === true
        })
        if (hasAppending) {
          this.$nextTick(() => {
            this.$refs['scrollbar'].scrollTop(0)
          })
        }
      }
    }
  }
</script>
