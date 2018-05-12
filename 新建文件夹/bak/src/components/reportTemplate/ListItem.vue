<template>
  <div class="data-table__row" :class="{'data-table__row--directory': type === '0', 'data-table__row--report-template': type === '1'}">
    <div class="data-table__column" :style="{width: columnWidthMap[0]}">
      <name-editing ref="nameEditing" :maxLength="64" :value="name" v-if="renaming" @cancel="nameEditCancel" @confirm="nameEditConfirm"></name-editing>
      <div ref="name" class="data-table__column__name trimmed-text-with-ellipsis" v-else>
        <router-link :title="name" v-if="type === '0'" :to="{ name: 'reportTemplates', params: {parentId: id }}">{{ name }}</router-link>
        <router-link :title="name" :to="{ name: 'reportTemplateView', params: { id: id }}" v-else>
          {{ name }}
        </router-link>
      </div>
    </div>
    <div class="data-table__column" :style="{width: columnWidthMap[1]}">{{ total }}</div>
    <div class="data-table__column" :style="{width: columnWidthMap[2]}">{{ updatedAt }}</div>
    <div class="data-table__column" :style="{width: columnWidthMap[3]}">{{ owner }}</div>
    <div class="data-table__column" :style="{width: columnWidthMap[4]}">
      <div class="data-table__actions">
        <a href="#" v-for="action in actions" :style="{visibility: action.visibility !== false ? 'visible': 'hidden'}" @click.prevent="action.callback" :title="action.name">
          <i class="iconfont" :class="action.icon" v-if="action.icon"></i>
          <span v-else>{{ action.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  import {Message} from 'element-ui'

  import NameEditing from '../common/NameEditing.vue'
  import ContextMenu from '../../common/contextMenu'
  import DeleteConfirm from './modals/DeleteConfirm.vue'
  import DirectoryTreeModal from '../common/DirectoryTreeModal.vue'
  import { getLoginContext } from '../../api/net'

  export default {
    name: 'report-list-item',
    props: {
      id: [Number, String],
      type: String,
      parentId: [Number, String],
      appending: Boolean,
      name: String,
      worksheetCount: Number,
      visualCount: Number,
      updatedAt: String,
      columnWidthMap: Array,
      owner: String
    },
    components: {
      NameEditing
    },
    data () {
      return {
        renaming: false
      }
    },
    computed: {
      typeName () {
        return this.type === '0' ? 'directory' : 'report'
      },
      total () {
        if (this.type === '0') {
          return '-'
        } else {
          return `${this.worksheetCount}/${this.visualCount}`
        }
      },
      actions () {
        if (this.appending) {
          return []
        }

        if (this.type === '0') {
          return []
        } else {
          const actions = [
            {
              name: '查看',
              icon: 'yg-yulan',
              callback: () => {
                this.$router.push({
                  name: 'reportTemplateView',
                  params: {
                    id: this.id
                  }
                })
              }
            },
            {
              name: '根据模板新建',
              icon: 'yg-mobanxinjianbaobiao',
              callback: () => {
                this.$store.dispatch('reportManage/fetchDirectoryTree')
                this.$vuedals.open({
                  name: 'directoryTreeModal',
                  title: '选择目录',
                  props: {
                    canNewDirectory: false,
                    storeKey: 'reportManage',
                    onConfirm: (parentId) => {
                      return this.$store.dispatch('reportTemplateManage/installReport', {id: this.id, parentId}).then(() => {
                        Message.success('新建成功')
                        this.$router.push({name: 'reports', params: {parentId}})
                      }, (e) => {
                        Message.error(typeof e === 'string' ? e : '新建失败')
                        console.error(e)
                        return Promise.reject()
                      })
                    }
                  },
                  component: DirectoryTreeModal
                })
              }
            }
          ]

          const loginContext = getLoginContext()
          let editable = false
          if (!loginContext || loginContext.username === this.owner) {
            editable = true
          }
          actions.push(
            {
              name: '操作',
              visibility: editable,
              icon: 'yg-gengduo1',
              callback: (event) => {
                if (!editable) {
                  return
                }
                this.openMoreMenu(event)
              }
            }
          )
          return actions
        }
      }
    },
    methods: {
      nameEditConfirm (name) {
        if (typeof name !== 'string') {
          Message.error('名称不能为空，请输入名称')
          return
        }

        name = name.trim()
        if (name === '') {
          Message.error('名称不能为空，请输入名称')
          return
        }

        if (name.length > 64) {
          Message.error(`名称长度不能大于64个字符`)
          return
        }
        if (this.appending) {
          this.createDirectoryHandler({
            id: this.id,
            name
          })
        } else {
          if (name !== this.name) {
            this.$store.dispatch('reportTemplateManage/renameItem', {id: this.id, name}).then(() => {
              Message.success('重命名成功')
            }, e => {
              Message.error(typeof e === 'string' ? e : '重命名失败')
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
          let options = [
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
                  this.$vuedals.open({
                    name: 'deleteConfirm',
                    component: DeleteConfirm,
                    title: '提示',
                    props: {
                      type: this.type,
                      onConfirm: () => {
                        return this.$store.dispatch('reportTemplateManage/deleteItem', {id: this.id}).then(() => {
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
              }
            }
          ]
          this.contextMenu = new ContextMenu(options)
        }
        this.contextMenu.show(event, 'element')
      }
    }
  }
</script>
