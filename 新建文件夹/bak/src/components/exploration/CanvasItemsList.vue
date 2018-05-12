<template>
  <div class="canvas-items-list">
    <canvas-items-list-item
      data-drag="canvas-item"
      v-for="item in items"
      :editable="editable"
      :item="item"
      :key="item.id"
      :class="{selected: selectedId === item.id}"
      :selected="selectedId === item.id"
      :dropHandler="itemDropHandler"
      :dropConfig="{accept: 'canvas-item'}"
      :dropActionHandler="itemDropActionHandler"
      :dragContext="item"
      :dropContext="item">
    ></canvas-items-list-item>
  </div>
</template>
<script>
  import CanvasItemsListItem from './CanvasItemsListItem.vue'
  import DeferredPromise from '../../common/deferredPromise'
  import dragDataService from '../../common/dragDataService'

  export default {
    components: {CanvasItemsListItem},
    name: 'canvas-items-list',
    props: {
      items: Array,
      editable: Boolean,
      selectedId: String
    },
    methods: {
      itemDropActionHandler (dropPosition, target) {
        return new DeferredPromise((resolve) => {
          const source = dragDataService.getDragContext()
          let dropAction = 3 // append
          if (!source || target === source) {
            dropAction = 0
          } else {
            if (dropPosition === 0 /* 上方 */) {
              dropAction = 2 // Prepend
            }
          }
          resolve(dropAction)
        })
      },

      itemDropHandler (event, ui, dropAction, target) {
        const source = dragDataService.getDragContext()
        if (!source || dropAction === 0) {
          return
        }

        let targetIndex = target.z
        if (targetIndex === undefined) {
          return
        }

        let index = dropAction === 3 ? (targetIndex === 0 ? -1 : targetIndex) : targetIndex + 1
        this.$store.commit('report/sortVisualContainer', {id: source.id, fromIndex: source.z, toIndex: index})
      }
    }
  }
</script>
