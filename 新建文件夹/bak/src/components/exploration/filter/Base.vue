<template>
  <div class="filter-base">
    <loader v-if="loading"></loader>
    <scrollbar :options="scrollOptions">
      <div class="scroll-region" v-if="items && items.length" :style="{height: scrollHeight + 'px'}">
        <div class="visible-group" ref="visibleGroup">
          <div class="scroll-row" v-if="startIndex === 0">
            <label class="flex">
              <input type="checkbox" class="item-auto" :checked="all" @click="toggleAll($event.target.checked)">
              <span class="item-fill trimmed-text-with-ellipsis">全选</span>
            </label>
          </div>
          <div class="scroll-row" v-for="item in sliceItems">
            <label class="flex">
              <input type="checkbox" class="item-auto" :checked="isChecked(item)" @click="check(item, $event.target.checked)">
              <span class="item-fill trimmed-text-with-ellipsis" :title="item">{{ item }}</span>
            </label>
          </div>
        </div>
      </div>
    </scrollbar>
  </div>
</template>

<script>
  import Scrollbar from '../../common/Scrollbar.vue'
  import Loader from '../../common/Loader.vue'
  import $ from 'jquery'

  const ROW_LIMIT = 10
  const ROW_HEIGHT = 24

  export default {
    components: {
      Loader,
      Scrollbar},
    name: 'filter-base',
    props: {
      condition: Object,
      items: Array,
      loading: [Boolean]
    },
    data () {
      const inValues = ((this.condition && this.condition.inValues) || []).slice()
      const notInValues = ((this.condition && this.condition.notInValues) || []).slice()

      return {
        inValues,
        notInValues,
        all: false,
        notIn: false,
        startIndex: 0
      }
    },
    computed: {
      sliceItems () {
        return this.items.slice(this.startIndex === 1 ? 0 : this.startIndex, this.startIndex + ROW_LIMIT)
      },
      partially () {
        return this.inValues.length || this.notInValues.length
      },
      scrollHeight () {
        return ROW_HEIGHT * (this.items.length <= ROW_LIMIT + 1 ? this.items.length : this.items.length - 1)
      },
      scrollOptions () {
        return {
          scrollStep: 24,
          onScroll: (x) => {
            if (this.items.length <= ROW_LIMIT) {
              return
            }
            this.startIndex = Math.ceil(x.scroll / ROW_HEIGHT)
            if (this.items.length <= ROW_LIMIT + 1) {
              return
            }
            const translateY = (this.startIndex > 1 ? this.startIndex - 1 : this.startIndex) * ROW_HEIGHT
            $(this.$refs['visibleGroup']).css('transform', `translate(0px, ${translateY}px)`)
          }
        }
      }
    },
    methods: {
      toggleAll (checked) {
        this.all = checked
        this.inValues = []
        this.notInValues = []
        this.notIn = false
        this.$emit('apply', {})
      },
      isChecked (value) {
        return this.all || (this.inValues.length && this.inValues.indexOf(value) > -1) || (this.notInValues.length && this.notInValues.indexOf(value) === -1)
      },
      check (value, checked) {
        if (this.all === true || this.notIn) { // 部分选择
          this.notIn = true
          const index = this.notInValues.indexOf(value)
          if (!checked && index === -1) {
            this.notInValues.unshift(value)
          } else if (checked && index > -1) {
            this.notInValues.splice(index, 1)
          }
        } else {
          this.notIn = false
          const index = this.inValues.indexOf(value)
          if (checked && index === -1) {
            this.inValues.unshift(value)
          } else if (!checked && index > -1) {
            this.inValues.splice(index, 1)
          }
        }

        if (this.notIn && !this.notInValues.length) {
          this.toggleAll(false)
        } else {
          this.all = false
        }
        this.$emit('apply', {
          inValues: this.inValues.slice(),
          notInValues: this.notInValues.slice()
        })
      }
    },
    watch: {
      condition (condition) {
        this.inValues = ((condition && condition.inValues) || []).slice()
        this.notInValues = ((condition && condition.notInValues) || []).slice()
      }
    }
  }
</script>
