<template>
  <div @contextmenu="showMenu" class="section dynamic" :class="{selected}" @click="handleClick" @dblclick="handleDblclick">
    <editable-label :editable="labelEditable" class="section-index" :label="section" @change="renameHandler" @beginEdit="beginEditHandler" @cancel="cancelRenameHandler"></editable-label>
    <div v-if="canDelete" class="section-delete-icon" title="删除页" @click.prevent.stop="deleteHandler">x</div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import 'jquery-ui/ui/widgets/droppable'

  import Drag from '../mixins/drag'
  import EditableLabel from '../common/EditableLabel.vue'
  import ContextMenu from '../../common/contextMenu'
  import DeleteSectionConfirm from './modals/DeleteSectionConfirm'

  export default {
    name: 'exploration-navigation-tab',
    components: {EditableLabel},
    mixins: [
      Drag
    ],
    props: {
      id: [Number, String],
      editable: Boolean,
      canDelete: Boolean,
      index: Number,
      section: String,
      selected: Boolean
    },

    data () {
      return {
        labelEditable: false
      }
    },

    mounted () {
      $(this.$el).droppable({
        disabled: !this.editable,
        accept: (elem) => {
          return $(elem).data('drag') === 'sections'
        },
        hoverClass: 'dragover',
        tolerance: 'pointer',
        drop: (event, ui) => {
          const dragSourceElement = ui.draggable
          if (!dragSourceElement) {
            return
          }
          const fromIndex = $(dragSourceElement).data('index')
          const toIndex = this.index
          if (fromIndex !== toIndex) {
            this.$emit('move', fromIndex, toIndex)
          }
        }
      })
      this.toggleDrag(!this.editable)
    },

    beforeDestroy () {
      $(this.$el).droppable({disabled: true}).droppable('destroy')
    },

    methods: {
      handleClick () {
        if (!this.labelEditable) {
          this.$emit('select', this.id)
        }
      },

      handleDblclick () {
        if (this.editable) {
          this.labelEditable = true
        }
      },

      beginEditHandler () {
        this.$emit('beginEdit')
      },

      renameHandler (name) {
        this.labelEditable = false
        this.$emit('rename', this.id, name)
      },

      cancelRenameHandler () {
        this.labelEditable = false
      },

      deleteHandler () {
        this.$vuedals.open({
          name: 'confirmDelete',
          title: '提示',
          props: {
            onConfirm: () => {
              this.$emit('delete', this.id)
              this.$emit('vuedals:close')
            }
          },
          component: DeleteSectionConfirm
        })
      },

      showMenu (event) {
        if (!this.editable) {
          return
        }
        if (this.labelEditable) {
          return
        }
        event.preventDefault()
        const menuOptions = [
          {
            name: '重命名工作表',
            on: {
              click: () => {
                this.labelEditable = true
                contextMenu.hide()
              }
            }
          },
          {
            name: '复制工作表',
            on: {
              click: () => {
                this.$store.commit('report/copySection', this.id)
                contextMenu.hide()
              }
            }
          }
        ]

        if (this.canDelete) {
          menuOptions.unshift({
            name: '删除工作表',
            on: {
              click: () => {
                this.deleteHandler()
                contextMenu.hide()
              }
            }
          })
        }
        const contextMenu = new ContextMenu(menuOptions)
        contextMenu.show(event)
      }
    },
    watch: {
      editable () {
        this.toggleDrag(!this.editable)
      }
    }
  }
</script>
