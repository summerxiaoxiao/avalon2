<template>
  <div class="filter-cards">
    <ul>
      <filter-card v-for="item, index in items" :index="index" :item="item" :key="item.id" @remove="$emit('remove', index)" @apply="handleApply" @clean="handleClean" @expand="handleExpand"></filter-card>
      <li :class="items.length ? 'end-dropzone' : 'dropzone'"
          class="trimmed-text-with-ellipsis"
          :title="items.length ? '' : '拖动数据字段到此处'">{{ items.length ? '' : '拖动数据字段到此处'}}</li>
    </ul>
  </div>
</template>

<script>
  import FilterCard from './Card.vue'
  import Drop from '../../mixins/drop'

  export default {
    name: 'filter-cards',
    components: {
      FilterCard
    },
    mixins: [
      Drop
    ],
    props: {
      items: Array,
      dropActionHandler: Function,
      dropHandler: Function,
      dropConfig: Object
    },
    methods: {
      handleApply ({index, condition, filterType, filterExpand}) {
        this.$emit('apply', {index, condition, filterType, filterExpand})
      },
      handleClean (index) {
        this.$emit('clean', index)
      },
      handleExpand (index, expand) {
        this.$emit('expand', index, expand)
      }
    }
  }
</script>

