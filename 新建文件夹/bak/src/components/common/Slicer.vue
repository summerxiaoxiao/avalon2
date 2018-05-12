<template>
  <div class="slicer" :class="{'is-multi-select-enabled': allowMultiple}">
    <loader v-if="loading"></loader>
    <div class="slicer__body" ref="body">
      <scrollbar :options="scrollOptions">
        <div class="scroll-region" v-if="realItems && realItems.length" ref="scrollRegion" :style="{height: scrollHeight + 'px'}">
          <div class="visible-group" ref="visibleGroup">
            <div class="scroll-row" v-for="item, index in sliceItems">
              <div class="slicer__item-container" @click="check(item, !isChecked(item, index), index)">
                <div v-if="!native" class="slicer__checkbox" :class="{selected: isChecked(item, index), 'partially-selected': showCheckAll === true && index === 0 && isPartially && startIndex === 0}">
                  <input type="checkbox" :checked="isChecked(item, index)">
                  <span class="checkbox"></span>
                </div>
                <input v-else type="checkbox" :checked="isChecked(item, index)" @click.prevent="" />
                <span :style="itemStyle" class="slicer__text trimmed-text-with-ellipsis" :title="item">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </scrollbar>
    </div>
  </div>
</template>

<script>
  import Scrollbar from './Scrollbar.vue'
  import Loader from './Loader.vue'
  import $ from 'jquery'
  import { clampValue } from '../../common/utils'

  const ROW_LIMIT = 10
  const ROW_HEIGHT = 24

  export default {
    components: {
      Loader,
      Scrollbar},
    name: 'slicer',
    props: {
      condition: Object,
      items: Array,
      loading: Boolean,
      native: {
        type: Boolean,
        'default': true
      },
      allowMultiple: {
        type: Boolean,
        'default': true
      },
      showCheckAll: {
        type: Boolean,
        'default': true
      },
      itemStyle: Object
    },
    data () {
      const inValues = ((this.condition && this.condition.inValues) || []).slice()
      const notInValues = ((this.condition && this.condition.notInValues) || []).slice()

      return {
        inValues,
        notInValues,
        all: false,
        notIn: false,
        overflow: false,
        rowLimit: ROW_LIMIT,
        rowHeight: ROW_HEIGHT,
        startIndex: 0
      }
    },
    mounted () {
      this.rowHeight = this.calculateRowHeight()
      this.rowLimit = this.calculateRowLimit()
    },
    updated () {
      this.rowHeight = this.calculateRowHeight()
      this.rowLimit = this.calculateRowLimit()
    },
    computed: {
      rowTotal () {
        return this.realItems.length
      },
      realItems () {
        const items = this.items.slice()
        if (this.showCheckAll) {
          items.unshift('全部')
        }
        return items
      },
      sliceItems () {
        return this.realItems.slice(this.startIndex, this.startIndex + this.rowLimit)
      },
      isPartially () {
        return this.inValues.length || this.notInValues.length
      },
      scrollHeight () {
        return this.rowHeight * this.rowTotal
      },
      scrollOptions () {
        return {
          scrollStep: this.rowHeight,
          onScroll: (x) => {
            if (this.rowTotal <= this.rowLimit) {
              return
            }
            this.startIndex = Math.floor(x.scroll / this.rowHeight)
            let translateY = x.scroll
            if ((this.startIndex + this.rowLimit) >= this.realItems.length) {
              this.startIndex = this.realItems.length - this.rowLimit
              translateY = this.startIndex * this.rowHeight
            }
            $(this.$refs['visibleGroup']).css('transform', `translate(0px, ${translateY}px)`)
          }
        }
      }
    },
    methods: {
      calculateRowLimit () {
        const availableHeight = $(this.$refs['body']).height()
        if (availableHeight === 0) {
          return clampValue(ROW_LIMIT, 1, this.rowTotal)
        }
        const limit = Math.ceil(availableHeight / this.rowHeight)
        return clampValue(limit, 1, this.rowTotal)
      },
      calculateRowHeight () {
        return $(this.$el).find('.scroll-row').outerHeight() || ROW_HEIGHT
      },
      toggleAll (checked) {
        this.all = checked
        this.inValues = []
        this.notInValues = []
        this.notIn = false
        this.$emit('apply', {})
      },
      isChecked (value, index) {
        if (this.showCheckAll && index === 0 && this.startIndex === 0) {
          return this.all
        }
        return this.all || (this.inValues.length && this.inValues.indexOf(value) > -1) || (this.notInValues.length && this.notInValues.indexOf(value) === -1)
      },
      toggleChecked (name, value, checked) {
        const values = name === 'notIn' ? this.notInValues : this.inValues
        const index = values.indexOf(value)
        if (!checked && index === -1) {
          values.unshift(value)
        } else if (checked && index > -1) {
          values.splice(index, 1)
        }
      },
      check (value, checked, index) {
        if (this.showCheckAll && index === 0 && this.startIndex === 0) {
          return this.toggleAll(checked)
        }
        if (!this.allowMultiple) {
          if (this.all) {
            this.notIn = true
            this.notInValues = []
            this.toggleChecked('notIn', value, checked)
          } else if (this.notIn) {
            this.toggleChecked('notIn', value, checked)
          } else {
            this.notIn = false
            this.notInValues = []
            this.inValues = checked ? [value] : []
          }
        } else {
          if (this.all === true || this.notIn) { // 部分选择
            this.notIn = true
            this.toggleChecked('notIn', value, checked)
          } else {
            this.notIn = false
            this.toggleChecked('in', value, !checked)
          }
        }

        if (this.notIn) {
          this.all = !this.notInValues.length && !this.inValues.length
        }

        if (this.all === true) {
          this.notIn = false
        }

        this.$emit('apply', {
          inValues: this.inValues.slice(),
          notInValues: this.notInValues.slice()
        })
      },
      onResize () {
        this.$nextTick(() => {
          this.rowHeight = this.calculateRowHeight()
          this.rowLimit = this.calculateRowLimit()
        })
      }
    },
    watch: {
      condition (condition) {
        this.inValues = ((condition && condition.inValues) || []).slice()
        this.notInValues = ((condition && condition.notInValues) || []).slice()
        this.notIn = !!this.notInValues.length
      }
    }
  }
</script>
