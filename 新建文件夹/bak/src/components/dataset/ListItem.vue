<template>
  <div class="data-table__row" :class="{'data-table__row--directory': type === '0', 'data-table__row--dataset': type === '1', 'data-table__row--active': appending || renaming}">
    <div class="data-table__column" :style="{width: columnWidthMap[0]}">
      <name-editing ref="nameEditing" :maxLength="64" :value="name" v-if="appending || renaming" @cancel="nameEditCancel" @confirm="nameEditConfirm"></name-editing>
      <div ref="name" class="data-table__column__name trimmed-text-with-ellipsis" v-else>
        <router-link v-if="type === '0'" :to="{ name: 'datasetList', params: {parentId: id }}" :title="name">{{ name }}</router-link>
        <span v-else><a href="#" @click.prevent="preview" :title="name">{{ name }}</a></span>
      </div>
    </div>
    <div class="data-table__column" :style="{width: columnWidthMap[1]}">{{ type === '0' ? '-' : fieldCount }}</div>
    <div class="data-table__column" :style="{width: columnWidthMap[2]}">{{ type === '0' ? '-' : visualCount }}</div>
    <div class="data-table__column" :style="{width: columnWidthMap[3]}">{{ updatedAt }}</div>
    <div class="data-table__column" :style="{width: columnWidthMap[4]}">
      <div class="data-table__actions">
        <a href="#" v-for="action in actions" @click.prevent="action.callback" :title="action.name">
          <i class="iconfont" :class="action.icon" v-if="action.icon"></i>
          <span v-else>{{ action.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  import { Message } from 'element-ui'

  import ContextMenu from '../../common/contextMenu'
  import NameEditing from '../common/NameEditing.vue'
  import DirectoryTreeModal from '../common/DirectoryTreeModal.vue'
  import Relation from './modals/Relation.vue'
  import Preview from './modals/Preview.vue'

  import listItemDragDrop from '../mixins/listItemDragDrop'

  export default {
    components: {NameEditing},
    name: 'dataset-list-item',
    mixins: [listItemDragDrop],
    props: {
      id: [Number, String],
      type: String,
      parentId: [Number, String],
      appending: Boolean,
      name: String,
      fieldCount: Number,
      reportCount: Number,
      visualCount: Number,
      updatedAt: String,
      columnWidthMap: Array,
      owner: String,
      createDirectoryHandler: Function,
      moveItemHandler: Function
    },
    data () {
      return {
        renaming: false
      }
    },
    computed: {
      typeName () {
        return this.type === '0' ? 'directory' : 'dataset'
      },
      actions () {
        if (this.appending) {
          return []
        }

        if (this.type === '0') {
          return [
            {
              name: '操作',
              icon: 'yg-gengduo1',
              callback: (event) => {
                this.openMoreMenu(event)
              }
            }
          ]
        } else {
          return [
            {
              name: '创建报表',
              icon: 'yg-chuangjianbaobiao',
              callback: () => {
                this.$store.dispatch('report/newReport', {parentId: null, datasetIds: [ this.id ]}).then(() => {
                  this.$router.push({
                    name: 'reportNew'
                  })
                }).catch((e) => {
                  Message.error(typeof e === 'string' ? e : '创建报表失败')
                })
              }
            },
            {
              name: '查看',
              icon: 'yg-yulan',
              callback: () => {
                this.preview()
              }
            },
            /*
            {
              name: '共享',
              icon: 'yg-fenxiang',
              callback: () => {
              }
            },
            */
            {
              name: '相关',
              icon: 'yg-fenxiang1',
              callback: () => {
                this.$vuedals.open({
                  name: 'relation',
                  title: '相关',
                  props: {
                    id: this.id
                  },
                  component: Relation
                })
              }
            },
            {
              name: '操作',
              icon: 'yg-gengduo1',
              callback: (event) => {
                this.openMoreMenu(event)
              }
            }
          ]
        }
      }
    },
    methods: {
      preview () {
        this.$vuedals.open({
          name: 'preview',
          title: '字段',
          props: {
            id: this.id
          },
          component: Preview
        })
      },
      nameEditingFocus () {
        if (this.$refs['nameEditing']) {
          this.$refs['nameEditing'].inputFocus()
        }
      },
      nameEditConfirm (name) {
        if (typeof name !== 'string') {
          Message.error('文件(夹)名称不能为空，请输入文件名称')
          return
        }

        name = name.trim()
        if (name === '') {
          Message.error('文件(夹)名称不能为空，请输入文件名称')
          return
        }
        if (name.length > 64) {
          Message.error(`文件(夹)名称长度不能大于64个字符`)
          return
        }
        if (this.appending) {
          this.createDirectoryHandler({
            id: this.id,
            name
          })
        } else {
          if (name !== this.name) {
            this.$emit('rename', {
              id: this.id,
              type: this.type,
              parentId: this.parentId,
              name
            })
          }
          this.renaming = false
        }
      },
      nameEditCancel () {
        if (this.appending) {
          this.$emit('delete', this.id)
        } else {
          this.renaming = false
        }
      },
      openMoreMenu (event) {
        if (!this.contextMenu) {
          let options = []
          options = [
            {
              name: '移动到',
              props: {
                icon: 'yg-yidongdao'
              },
              on: {
                click: () => {
                  this.contextMenu.hide()
                  this.$store.dispatch('datasetManage/fetchDirectoryTree')
                  this.$vuedals.open({
                    name: 'directoryTreeModal',
                    title: '移动至',
                    props: {
                      storeKey: 'datasetManage',
                      parentId: this.parentId,
                      onNewDirectory: (parentId) => {
                        this.$store.commit('datasetManage/addTreeNode', parentId)
                      },
                      onCancelNewDirectory: ({id, parentId}) => {
                        this.$store.commit('datasetManage/removeTreeNode', {id, parentId})
                      },
                      onSaveNewDirectory: (id, name, parentId) => {
                        return this.createDirectoryHandler({id, parentId, name})
                      },
                      onConfirm: (parentId) => {
                        return this.moveItemHandler({id: this.id, parentId, type: this.type})
                      }
                    },
                    component: DirectoryTreeModal
                  })
                }
              }
            },
            {
              name: '重命名',
              props: {
                icon: 'yg-zhongmingming'
              },
              on: {
                click: () => {
                  this.renaming = true
                  this.contextMenu.hide()
                }
              }
            },
            {
              name: '删除',
              props: {
                icon: 'yg-shanchu'
              },
              on: {
                click: () => {
                  this.$emit('delete', this.id, this.type)
                  this.contextMenu.hide()
                }
              }
            }
          ]
          this.contextMenu = new ContextMenu(options)
        }
        this.contextMenu.show(event, 'element')
      }
    },
    watch: {
      appending (value) {
        this.$emit('editing', value)
      },
      renaming (value) {
        this.$emit('editing', value)
      }
    }
  }
</script>
