<template>
  <ol class="properties">
    <li class="bucket-top-border"></li>
    <field-property data-drag="field" class="field-well-field" v-for="item, index in items"
                      :key="item.id"
                      :property="item"
                      :actionHandler="itemAction"
                      :renameHandler="itemRename"
                      :removeHandler="itemDelete"
                      :dropHandler="itemDropHandler"
                      :dropConfig="{accept: 'field'}"
                      :dropActionHandler="itemDropActionHandler"
                      :dragContext="item"
                      :dropContext="item">
    </field-property>

    <field-dropzone
      :dropHandler="dropzoneDropHandler"
      :dropActionHandler="dropzoneDropActionHandler"
      :dropConfig="{accept: 'field'}"
      :class="items.length ? 'end-dropzone' : 'dropzone'"
      tagName="li"
      class="trimmed-text-with-ellipsis"
      :title="items.length ? '' : '拖动数据字段到此处'">{{ items.length ? '' : '拖动数据字段到此处'}}</field-dropzone>
  </ol>
</template>
<script>
  import FieldProperty from './FieldProperty.vue'
  import Drop from '../../mixins/drop'
  import FieldDropzone from './Dropzone.vue'
  import DeferredPromise from '../../../common/deferredPromise'

  import dragDataService from '../../../common/dragDataService'
  import { BUCKET_ROLES, DROP_ACTION, DROP_POSITION, PROPERTY_TYPES, VISUAL_TYPES } from '../../../api/constant'

  export default {
    name: 'field-properties',
    components: {
      FieldDropzone,
      FieldProperty
    },
    mixins: [
      Drop
    ],
    props: {
      role: String,
      visualType: [String, Number],
      items: Array,
      itemAction: Function,
      itemDelete: Function,
      itemRename: Function,
      itemMove: Function,
      itemDrop: Function,
      itemReplace: Function
    },
    methods: {
      dropzoneDropActionHandler () {
        return new DeferredPromise((resolve) => {
          const source = dragDataService.getDragContext()
          let dropAction = DROP_ACTION.NONE
          if (source) {
            if (this.items.length > 0) {
              dropAction = DROP_ACTION.NONE
            } else {
              dropAction = DROP_ACTION.APPEND
            }

            /*
            if (source.role === this.role && source.index === this.items.length - 1) {
              dropAction = 0
            } else {
              // 2 Prepend 1 Replace
              dropAction = this.items.length ? 2 : 1
            }
            */

            if (this.visualType === VISUAL_TYPES.MATRIX && this.role !== BUCKET_ROLES.VALUE && source.type === PROPERTY_TYPES.NUMBER) {
              dropAction = DROP_ACTION.NONE
            }
          }
          resolve(dropAction)
        })
      },

      dropzoneDropHandler (event, ui, dropAction) {
        const source = dragDataService.getDragContext()
        if (!source || dropAction === DROP_ACTION.NONE) {
          return
        }

        if (dropAction === DROP_ACTION.REPLACE) {
          this.itemReplace(this.role, source, 0)
          return
        }

        if (source.role !== undefined) {
          this.itemMove(source.role, this.role, source.index, this.items.length)
        } else {
          this.itemDrop(this.role, source)
        }
      },

      itemDropActionHandler (dropPosition, target) {
        return new DeferredPromise((resolve) => {
          const source = dragDataService.getDragContext()
          let dropAction = DROP_ACTION.APPEND
          if (!source || target === source) {
            dropAction = DROP_ACTION.NONE
          } else {
            if (dropPosition === DROP_POSITION.ABOVE) {
              dropAction = DROP_ACTION.PREPEND
            }

            if (dropAction === DROP_ACTION.PREPEND && source.role !== undefined && source.index === target.index - 1) {
              dropAction = DROP_ACTION.NONE
            }

            if (dropAction === DROP_ACTION.APPEND && source.role !== undefined && source.index === target.index + 1) {
              dropAction = DROP_ACTION.NONE
            }

            if (this.visualType === VISUAL_TYPES.MATRIX && this.role !== BUCKET_ROLES.VALUE && source.type === PROPERTY_TYPES.NUMBER) {
              dropAction = DROP_ACTION.NONE
            }

            if (this.visualType === VISUAL_TYPES.SLICER && this.items.length > 0) {
              dropAction = DROP_ACTION.REPLACE
            }
          }
          resolve(dropAction)
        })
      },

      itemDropHandler (event, ui, dropAction, target) {
        const source = dragDataService.getDragContext()
        if (!source || dropAction === DROP_ACTION.NONE) {
          return
        }

        let targetIndex = target.index
        if (dropAction === DROP_ACTION.REPLACE) {
          this.itemReplace(this.role, source, targetIndex)
          return
        }
        let index
        if (targetIndex === undefined) {
          index = -1
        } else {
          index = dropAction === DROP_ACTION.PREPEND ? (targetIndex === 0 ? -1 : targetIndex) : targetIndex + 1
        }

        if (source.role !== undefined) {
          this.itemMove(source.role, this.role, source.index, index)
        } else {
          this.itemDrop(this.role, source, index)
        }
      }
    }
  }
</script>
