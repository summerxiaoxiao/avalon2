<template>
  <div class="vuedal__content">
    <div style="max-height: 500px; overflow: auto">
      <el-tree ref="tree" node-key="id" :data="tree" :expand-on-click-node="false" @node-click="handleNodeClick" :render-content="renderTreeNode" :default-expanded-keys="['root']"></el-tree>
    </div>
    <div class="vuedal__actions vuedal__actions-multi">
      <div class="vuedal__actions-left">
        <button v-if="canNewDirectory" type="button" class="btn btn-primary" @click.prevent="newDirectory">新建文件夹</button>
      </div>
      <div class="vuedal__actions-right">
        <loader v-if="saving"></loader>
        <button :disabled="saving" type="button" class="btn btn-black" @click.prevent="handleConfirm">确定</button>
        <button type="button" class="btn btn-outline-black" @click.prevent="$emit('vuedals:close')">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'

  import {Tree, Message} from 'element-ui'
  import NameEditing from './NameEditing.vue'
  import Loader from './Loader.vue'
  Vue.use(Tree)

  export default {
    components: {
      Loader,
      Tree
    },
    props: {
      storeKey: String,
      canNewDirectory: {
        type: Boolean,
        'default': true
      },
      onNewDirectory: Function,
      onCancelNewDirectory: Function,
      onSaveNewDirectory: Function,
      onConfirm: Function
    },
    data () {
      return {
        saving: false,
        currentNode: null,
        parentId: null
      }
    },
    computed: {
      tree () {
        return this.$store.state[this.storeKey].tree
      }
    },
    methods: {
      renderTreeNode (h, {node, data}) {
        if (data.appending) {
          this.appending = h(NameEditing, {
            props: {
              value: data.name,
              maxLength: 64
            },
            on: {
              confirm: (name) => {
                if (typeof name !== 'string') {
                  Message.error('请输入文件夹名称')
                }

                name = name.trim()
                if (name === '') {
                  Message.error('文件夹名称不能为空')
                  return
                }

                if (name.length > 64) {
                  Message.error(`文件夹名称长度不能大于64个字符`)
                  return
                }

                let parentId = data.parentId
                if (parentId === 'root') {
                  parentId = null
                }

                this.onSaveNewDirectory(data.id, name, parentId).then(resp => {
                  this.$nextTick(() => {
                    if (data.id === this.$refs.tree.getCurrentKey()) {
                      this.parentId = resp.id
                      node.expanded = true
                      this.$refs.tree.setCurrentKey(resp.id)
                    }
                  })
                }, () => {})
                this.appending = null
              },
              cancel: () => {
                this.appending = null
                if (data.id === this.parentId) {
                  this.parentId = 'root'
                }
                this.onCancelNewDirectory({id: data.id, parentId: data.parentId})
              }
            }
          })
          return this.appending
        } else {
          return h('span', {'class': 'el-tree-node__label'}, data.name)
        }
      },
      newDirectory () {
        if (this.appending) {
          this.appending.componentInstance.inputFocus()
          return
        }
        const parentId = this.parentId
        this.onNewDirectory(parentId || 'root')
        if (this.currentNode) {
          this.currentNode.expanded = true
        }
      },
      handleConfirm () {
        let parentId = this.parentId
        if (!parentId) {
          Message.error('请选择一个目录')
          return
        }
        if (parentId === 'root') {
          parentId = null
        }

        this.saving = true
        this.onConfirm(parentId).then(() => {
          this.saving = false
          this.$emit('vuedals:close')
        }, () => {
          this.saving = false
        })
      },
      handleNodeClick (data, node) {
        if (!data.appending) {
          this.parentId = data.id
          this.currentNode = node
        } else {
          this.parentId = null
          this.currentNode = null
        }
      }
    }
  }
</script>
