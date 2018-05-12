<template>
  <div class="filter-pane">
    <filter-cards
      :dropHandler="dropHandler"
      :dropActionHandler="dropActionHandler"
      :dropConfig="{accept: 'field'}"
      :items="items"
      @apply="applyFilter"
      @clean="cleanFilter"
      @remove="removeFilter"
      @expand="expandFilter"
    ></filter-cards>
  </div><!-- /.filter-pane -->
</template>
<script>
  import DeferredPromise from '../../common/deferredPromise'
  import dragDataService from '../../common/dragDataService'

  import FilterCards from './filter/Cards.vue'
  import { PROPERTY_GROUP_TYPES } from '../../api/constant'

  export default {
    name: 'filter-well',
    components: {
      FilterCards
    },

    computed: {
      items () {
        return this.$store.getters['report/currentFilterProperties']
      }
    },

    methods: {
      applyFilter ({index, filterType, condition, filterExpand}) {
        this.$store.commit('report/updateFilterProperty', {index, condition, filterType, filterExpand})
      },

      cleanFilter (index) {
        this.$store.commit('report/updateFilterProperty', {index, condition: {}})
      },

      expandFilter (index, filterExpand) {
        this.$store.commit('report/updateFilterProperty', {index, filterExpand})
      },

      removeFilter (index) {
        this.$store.commit('report/removeFilterProperty', index)
      },

      dropActionHandler () {
        return new DeferredPromise((resolve) => {
          const source = dragDataService.getDragContext()
          let dropAction = 0
          if (source && (source.groupType !== PROPERTY_GROUP_TYPES.GROUP && source.groupType !== PROPERTY_GROUP_TYPES.LEVEL)) {
            dropAction = 3
          }
          resolve(dropAction)
        })
      },

      dropHandler (event, ui, dropAction, target) {
        const source = dragDataService.getDragContext()
        if (!source || dropAction === 0) {
          return
        }
        this.$store.commit('report/addFilterProperty', source)
      }
    }
  }
</script>
