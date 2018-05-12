<template>
  <div class="visual-property-pane property-pane">
    <div class="property-pane-contents">
      <scrollbar>
        <property-card :cardValues="currentCardValues[card.name]" :formatValues="currentFormatValues[card.name] || {}" :formatDefaultValues="currentFormatDefaultValues[card.name] || {}" v-for="card in cards" :key="card.name" v-bind="card" @change="handleChange" @changeCard="handleChangeCard"></property-card>
      </scrollbar>
    </div>
  </div>
</template>
<script>
  import _ from 'underscore'

  import Scrollbar from '../../common/Scrollbar.vue'
  import PropertyCard from './Card.vue'
  import { SLICER_TYPE, FORMAT_TYPES, PROPERTY_TYPES } from '../../../api/constant'
  import { getFirstFieldProperty } from '../../../common/visual'
  import { getFormatValue } from '../../../api/common'

  export default {
    name: 'visual-format-pane',
    components: {
      PropertyCard,
      Scrollbar
    },

    computed: {
      currentSection () {
        return this.$store.getters['report/currentSection']
      },
      currentVisualContainer () {
        return this.$store.getters['report/currentVisualContainer']
      },
      cards () {
        const fieldProperty = getFirstFieldProperty(this.currentVisualContainer.config.fieldProperties)
        return this.$store.getters['report/currentFormatProperties'].filter(card => {
          if (card.name === FORMAT_TYPES.SLICER_SLIDER || card.name === FORMAT_TYPES.SLICER_INPUT) {
            if (!fieldProperty) {
              return false
            }
            const slicerType = getFormatValue(this.currentFormatValues, FORMAT_TYPES.SLICER_TYPE, FORMAT_TYPES.SLICER_TYPE_VALUE, SLICER_TYPE.LIST)
            return (fieldProperty.type === PROPERTY_TYPES.DATE || fieldProperty.type === PROPERTY_TYPES.NUMBER) && (slicerType !== SLICER_TYPE.LIST && slicerType !== SLICER_TYPE.DROPDOWN)
          }
          if (card.name === FORMAT_TYPES.SLICER_CONTROL || card.name === FORMAT_TYPES.SLICER_ITEM) {
            if (!fieldProperty) {
              return false
            }
            const slicerType = getFormatValue(this.currentFormatValues, FORMAT_TYPES.SLICER_TYPE, FORMAT_TYPES.SLICER_TYPE_VALUE, SLICER_TYPE.LIST)
            return slicerType === SLICER_TYPE.LIST || slicerType === SLICER_TYPE.DROPDOWN
          }
          return true
        })
      },
      currentFormatDefaultValues () {
        return this.$store.getters['report/currentFormatDefaultValues']
      },
      currentFormatValues () {
        return this.currentVisualContainer.format || {}
      },
      currentCardValues () {
        return this.currentVisualContainer.cards || {}
      }
    },
    methods: {
      handleChangeCard (cardName, name, value) {
        this.$store.commit('report/setVisualContainerPropertyCard', {id: this.currentVisualContainer.id, cardName, name, value})
      },
      handleChange (cardName, sliceName, value) {
        if (!this.currentVisualContainer) {
          return
        }

        let values
        if (_.isObject(sliceName)) {
          values = sliceName
        } else {
          values = {[sliceName]: value}
        }
        this.$store.commit('report/setVisualContainerPropertyFormat', {id: this.currentVisualContainer.id, cardName, sliceValues: values})
      }
    }
  }
</script>
