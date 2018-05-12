<template>
  <li class="field-list-property property" :class="{'is-leaf': item.isLeaf}" data-drag="field" :data-parent-id="item.parentId">
    <div class="flex">
      <div class="property-checkbox item-auto">
        <input type="checkbox" @click="clickHandler($event)" :checked="checked">
      </div>
      <div class="property-type item-auto">
        <i class="iconfont" :class="propertyIconClass" @click="toggleChildren"></i>
      </div>
      <div class="property-text item-fill trimmed-text-with-ellipsis" :title="item.desc">
        {{item.desc}}
      </div>
    </div>
  </li>
</template>
<script>
  import Drag from '../../mixins/drag'
  import $ from 'jquery'
  import { PROPERTY_GROUP_TYPES, VISUAL_TYPES } from '../../../api/constant'
  import { getFirstFieldProperty } from '../../../common/visual'

  export default {
    name: 'field-list-property',
    mixins: [Drag],
    props: {
      checked: Boolean,
      item: Object
    },
    mounted () {
      this.$nextTick(() => {
        if (this.item.groupType === '0') {
          this.toggleDrag(true)
        }
      })
    },
    updated () {
      this.$nextTick(() => {
        if (this.item.groupType === '0') {
          this.toggleDrag(true)
        }
      })
    },
    computed: {
      currentVisualContainer () {
        return this.$store.getters['report/currentVisualContainer']
      },
      propertyIconClass () {
        const isLevelOrGroup = this.item.groupType === PROPERTY_GROUP_TYPES.GROUP || this.item.groupType === PROPERTY_GROUP_TYPES.LEVEL
        return {
          'yg-xiangmu': this.item['type'] === 1 && !isLevelOrGroup, // 文本
          'yg-rili': this.item['type'] === 2 && !isLevelOrGroup, // 日期
          'yg-shuzhi': this.item['type'] === 3 && !isLevelOrGroup, // 数值
          'yg-wenjianjia1': this.item.groupType === PROPERTY_GROUP_TYPES.GROUP,
          'yg-zu': this.item.groupType === PROPERTY_GROUP_TYPES.LEVEL
        }
      }
    },
    methods: {
      clickHandler ($event) {
        const checked = $event.target.checked
        if (this.currentVisualContainer && this.currentVisualContainer.type === VISUAL_TYPES.SLICER) {
          const firstFieldProperty = getFirstFieldProperty(this.currentVisualContainer.config.fieldProperties)
          if (firstFieldProperty && checked) {
            $event.preventDefault()
            return
          }
        }
        this.$emit('check', this.item, checked)
      },
      toggleChildren (event) {
        if (this.item.groupType !== PROPERTY_GROUP_TYPES.GROUP) {
          return
        }
        const $element = $(event.target)
        const $children = $(this.$el).closest('ol').find(`[data-parent-id="${this.item.id}"]`)
        if ($element.hasClass('yg-wenjianjia')) {
          $element.removeClass('yg-wenjianjia').addClass('yg-wenjianjia1')
          $children.show()
        } else {
          $element.removeClass('yg-wenjianjia1').addClass('yg-wenjianjia')
          $children.hide()
        }
      }
    }
  }
</script>
