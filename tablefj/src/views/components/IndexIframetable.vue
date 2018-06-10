<template>
  <div  class="zyyszb-box-cwzb h-box-column  h-flex-auto">
      <h-iframe-table slot="body" ref="cwzb" :title="title" resizeFixed=true id="cwzb-iframe"
                      topFixed="false"
                      :bbmc="data.bbmc"
                      :queryCondition="data.tableQueryCondition"
                      :cellCallback="data.cellCallback"
                      class="zyyszb-box-cwzb-table"
                      titleClass="zyyszb-box-item-title"
      ></h-iframe-table>
  </div>
</template>
<script>
  import CardIndex from '@/views/common/CardIndex.vue'
  import HIframeTable from '@/components/common/Iframetable.vue'

  export default {
    name: 'index-Iframetable-card',
    components: {
      CardIndex,
      HIframeTable
    },
    props: {
      title: String,
      data: {
        type: Object,
        'default' () {
          return {
            cellCallback: null,
            tableQueryCondition: {},
            bbmc: ''
          }
        }
      }
    }
  }
</script>
