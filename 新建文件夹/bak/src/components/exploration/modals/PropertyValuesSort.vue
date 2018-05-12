<template>
  <div class="vuedal__content">
    <div class="property-values">
      <loader v-if="loading"></loader>
      <ul ref="items">
        <li v-for="item, index in items" :key="item.id">
          <div class="property-value-name trimmed-text-with-ellipsis">{{item.value}}</div>
          <div class="property-value__sort-actions">
            <button type="button" v-if="index !== 0" @click.prevent="up(index)" title="上" class="btn-icon"><i class="iconfont yg-paixu-shang"></i></button>
            <button type="button" v-if="index !== items.length - 1" @click.prevent="down(index)" title="下" class="btn-icon"><i class="iconfont yg-paixu-xia"></i> </button>
          </div>
        </li>
      </ul>
    </div>
    <div class="vuedal__actions flex flex-right">
      <button type="button" class="btn btn-black" @click.prevent="cleanSort">清除排序</button>
      <button type="button" class="btn btn-black" @click.prevent="confirmSort">确定</button>
      <button type="button" class="btn btn-outline-black" @click.event="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import 'jquery-ui/ui/widgets/sortable'
  import {Message} from 'element-ui'
  import Loader from '../../common/Loader.vue'

  export default {
    components: {Loader},
    name: 'property-values-sort',
    props: {
      values: Array,
      propertyId: [String, Number],
      datasetId: [String, Number],
      sort: Function
    },
    data () {
      return {
        items: this.values ? this.initItems(this.values) : [],
        loading: !this.values
      }
    },
    computed: {
      propertyValues () {
        return this.$store.state.report.propertyValues[this.propertyId + '###' + this.datasetId] || []
      }
    },
    created () {
      if (!this.values) {
        this.fetchPropertyValues()
      }
    },
    mounted () {
      let fromIndex
      const $items = $(this.$refs['items']).sortable({
        helper: 'clone',
        placeholder: 'ui-state-highlight',
        start: (event, ui) => {
          $(ui.item).addClass('sorting')
          fromIndex = $items.find('li').index(ui.item)
        },
        stop: (event, ui) => {
          $(ui.item).removeClass('sorting')
          const toIndex = $items.find('li').index(ui.item)
          this.$nextTick(() => {
            this.move(fromIndex, toIndex)
          })
        }
      })
    },
    beforeDestroy () {
      $(this.$refs['items']).sortable({disabled: true}).sortable('destroy')
    },
    methods: {
      fetchPropertyValues () {
        this.loading = true
        return this.$store.dispatch('report/fetchPropertyValues', {propertyId: this.propertyId, datasetId: this.datasetId}).then((values) => {
          this.loading = false
          return values
        }, () => {
          this.loading = false
          Message.error('获取属性值失败')
          return Promise.reject()
        })
      },
      move (fromIndex, toIndex) {
        if (fromIndex === toIndex) {
          return
        }

        const fromItem = this.items[fromIndex]
        const toItem = this.items[toIndex]

        if (!fromItem || !toItem) {
          return
        }

        if (fromIndex > toIndex) {
          this.items.splice(fromIndex, 1)
          this.items.splice(toIndex, 0, fromItem)
        } else {
          this.items.splice(toIndex + 1, 0, fromItem)
          this.items.splice(fromIndex, 1)
        }
        this.items.forEach((item, index) => {
          this.$set(item, 'index', index)
        })
      },
      up (index) {
        const item = this.items[index]
        if (!item || index === 0) {
          return
        }
        this.$set(this.items[index - 1], 'index', index)
        this.$set(item, 'index', index - 1)
        this.items.splice(index, 1)
        this.items.splice(index - 1, 0, item)
      },
      down (index) {
        const item = this.items[index]
        if (!item || index === this.items.length - 1) {
          return
        }
        this.$set(this.items[index + 1], 'index', index)
        this.$set(item, 'index', index + 1)

        this.items.splice(index + 2, 0, item)
        this.items.splice(index, 1)
      },
      initItems (values) {
        const items = []
        ;(values || {}).forEach((value, index) => {
          items.push({
            id: index,
            index,
            value
          })
        })
        return items
      },
      confirmSort () {
        const values = this.items.map(item => {
          return item.value
        })
        this.sort(values)
        this.$emit('vuedals:close')
      },
      cleanSort () {
        Promise.resolve(this.values ? this.values : this.fetchPropertyValues()).then((values) => {
          this.items = this.initItems(values || [])
        })
      }
    },
    watch: {
      propertyValues (values) {
        this.items = this.initItems(values)
      }
    }
  }
</script>
