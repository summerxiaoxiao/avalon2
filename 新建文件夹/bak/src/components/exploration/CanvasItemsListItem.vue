<template>
  <div class="canvas-items-list-item flex" @click.stop="toggleSelected(item.id, !selected)">
    <span class="flex-auto trimmed-text-with-ellipsis" :title="title">{{title}}</span>
    <button class="flex-none btn-icon" @click.stop="setVisibility(item.id, !item.visibility)" :title="item.visibility ? '可见' : '不可见'" :disabled="!editable">
      <i class="iconfont" :class="item.visibility ? 'yg-chakan1' : 'yg-jinzhichakan'"></i>
    </button>
  </div>
</template>
<script>
  import { getFormatValue } from '../../api/common'
  import { FORMAT_TYPES, VISUAL_TYPE_LIST } from '../../api/constant'

  import Drop from '../mixins/drop'
  import Drag from '../mixins/drag'

  export default {
    name: 'canvas-items-list-item',
    props: {
      editable: Boolean,
      item: Object,
      selected: Boolean
    },
    mixins: [Drag, Drop],
    computed: {
      title () {
        const title = getFormatValue(this.item.format, FORMAT_TYPES.TITLE_CARD, FORMAT_TYPES.TITLE_TEXT)
        if (title) {
          return title
        }
        for (const row of VISUAL_TYPE_LIST) {
          if (row.value === this.item.type) {
            return row.title
          }
        }
        return '未知'
      }
    },
    methods: {
      toggleSelected (id, selected) {
        this.$store.commit('report/selectVisualContainer', selected ? id : null)
      },
      setVisibility (id, visibility) {
        this.$store.commit('report/setVisualContainerVisibility', {
          id,
          visibility
        })
      }
    },
    mounted () {
      this.toggleDrag(!this.editable)
      this.toggleDrop(!this.editable)
    },
    watch: {
      editable (isEditable) {
        this.toggleDrag(!isEditable)
        this.toggleDrop(!isEditable)
      }
    }
  }
</script>
