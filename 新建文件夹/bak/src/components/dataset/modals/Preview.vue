<template>
  <div class="vuedal__content">
    <div class="dataset-properties-preview" v-if="!loading && field.properties.length">
      <ul class="entry-list">
        <li class="field-list-property property" :class="{'is-leaf': property.isLeaf}" v-for="property in field.properties">
          <div class="flex">
            <div class="property-type item-auto">
              <i class="iconfont" :class="propertyIconClass(property)"></i>
            </div>
            <div class="property-text item-fill trimmed-text-with-ellipsis" :title="property.desc">
              {{property.desc}}
            </div>
          </div>
        </li>
      </ul>
      <p class="dataset-properties-preview__desc">字段总计数：{{field.count}}</p>
    </div>
    <div class="flex flex-auto" v-if="loading">
      <loader class="flex-center"></loader>
    </div>
    <div class="flex flex-auto" v-if="!loading && !field.properties.length">
      <div class="flex-center">没有找到字段</div>
    </div>
    <div class="vuedal__actions flex flex-right">
      <button type="button" class="btn btn-outline-black" @click.prevent="$emit('vuedals:close')">关闭</button>
    </div>
  </div>
</template>
<script>
  import _ from 'underscore'
  import {Message} from 'element-ui'
  import Loader from '../../common/Loader.vue'
  import { PROPERTY_GROUP_TYPES } from '../../../api/constant'
  import { fetchPropertiesById } from '../../../api/dataset'

  export default {
    components: {Loader},
    name: 'preview',
    props: {
      id: [String, Number]
    },
    data () {
      return {
        loading: true,
        items: []
      }
    },
    computed: {
      field () {
        const list = []
        const children = {}
        this.items.forEach(property => {
          if (!property.parentId) {
            return
          }
          const copyProperty = Object.assign({}, property, {isLeaf: true})
          if (!children[property.parentId]) {
            children[property.parentId] = []
          }
          copyProperty.index = children[property.parentId].length
          children[property.parentId].push(copyProperty)
        })
        this.items.forEach((property, index) => {
          if (!property.parentId) {
            const copyProperty = Object.assign({}, property, {index, parentId: null})
            if (children[property.id]) {
              Object.assign(copyProperty, {children: children[property.id]})
            }
            if (!copyProperty.type && copyProperty.children && copyProperty.children) {
              copyProperty.type = copyProperty.children[0].type
            }
            list.push(copyProperty)
          }
        })
        const properties = []
        let count = 0
        list.forEach(property => {
          count++
          properties.push(_.omit(property, 'children'))
          if (Array.isArray(property.children)) {
            count--
            property.children.forEach(property => {
              count++
              properties.push(_.omit(property))
            })
          }
        })
        return {properties, count}
      }
    },

    created () {
      this.fetchItems()
    },
    methods: {
      propertyIconClass (item) {
        const isLevelOrGroup = item.groupType === PROPERTY_GROUP_TYPES.GROUP || item.groupType === PROPERTY_GROUP_TYPES.LEVEL
        return {
          'yg-xiangmu': item['type'] === 1 && !isLevelOrGroup, // 文本
          'yg-rili': item['type'] === 2 && !isLevelOrGroup, // 日期
          'yg-shuzhi': item['type'] === 3 && !isLevelOrGroup, // 数值
          'yg-wenjianjia1': item.groupType === PROPERTY_GROUP_TYPES.GROUP,
          'yg-zu': item.groupType === PROPERTY_GROUP_TYPES.LEVEL
        }
      },
      fetchItems () {
        this.loading = true
        fetchPropertiesById(this.id).then(items => {
          this.items = items
          this.loading = false
        }, (e) => {
          this.loading = false
          Message.error(typeof e === 'string' ? e : '获取相关报表失败')
        })
      }
    }
  }
</script>
