<template>
  <div class="field-well unselectable">
    <ol>
      <li class="bucket" v-for="bucket in buckets">
        <span class="caption trimmed-text-with-ellipsis">{{bucket.name}}</span>
        <field-properties
          :visualType="visualType"
          :itemDelete="itemDelete"
          :itemRename="itemRename"
          :itemDrop="itemDrop"
          :itemMove="itemMove"
          :itemReplace="itemReplace"
          :itemAction="itemAction"
          :items="getProperties(bucket.role)"
          :dropConfig="{accept: 'field'}"
          :role="bucket.role"
          ></field-properties>
      </li>
    </ol>
  </div>
</template>

<script>
  import FieldProperties from './field/FieldProperties.vue'

  export default {
    name: 'field-well',
    components: {
      FieldProperties
    },

    props: {
      visualType: [String, Number],
      buckets: Array,
      properties: Object
    },

    methods: {
      getProperties (role) {
        return this.properties[role] || []
      },

      itemAction (action, value, role, index, childIndex) {
        this.$store.commit('report/actionFieldProperty', {
          action,
          value,
          role,
          index,
          childIndex
        })
      },

      itemRename (name, role, index, childIndex) {
        this.$store.commit('report/renameFieldProperty', {
          name,
          role,
          index,
          childIndex
        })
      },

      itemMove (sourceRole, targetRole, fromIndex, toIndex) {
        this.$store.commit('report/moveFieldProperty', {
          sourceRole,
          targetRole,
          fromIndex,
          toIndex
        })
      },

      itemReplace (sourceRole, datasetProperty, index) {
        this.$store.commit('report/replaceFieldProperty', {
          sourceRole,
          datasetProperty,
          index
        })
      },

      itemDrop (role, datasetProperty, index) {
        if (!this.$store.getters['report/currentVisualContainer']) {
          this.$store.commit('report/createVisualContainer')
        }

        const properties = this.$store.getters['report/currentFieldProperties'][role] || []

        if (index === undefined) {
          index = properties.length
        }

        this.$store.commit('report/addFieldProperty', {
          role,
          datasetProperty,
          index
        })
      },

      itemDelete (role, index, childIndex) {
        this.$store.commit('report/deleteFieldProperty', {
          role,
          index,
          childIndex
        })
      }
    }
  }
</script>
