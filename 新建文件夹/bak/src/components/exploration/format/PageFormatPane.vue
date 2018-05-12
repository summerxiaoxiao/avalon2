<template>
  <div class="page-property-pane">
    <div class="property-pane-contents">
      <scrollbar>
        <format-card v-for="card in cards" :key="card.name" v-bind="card" @change="handleChange" :cardValues="{}" :formatDefaultValues="formatDefaultValues[card.name] || {}" :formatValues="formatValues[card.name] || {}"></format-card>
      </scrollbar>
    </div>
  </div>
</template>
<script>
  import { FORMAT_FIELD_TYPES, FORMAT_TYPES } from '../../../api/constant'

  import Scrollbar from '../../common/Scrollbar.vue'
  import ColorPicker from '../../common/colorPicker/ColorPicker.vue'
  import FormatCard from './Card.vue'
  import _ from 'underscore'

  export default {
    components: {
      FormatCard,
      ColorPicker,
      Scrollbar},
    name: 'page-format-pane',

    computed: {
      currentSection () {
        return this.$store.getters['report/currentSection']
      },

      formatValues () {
        const currentSection = this.currentSection
        if (!currentSection) {
          return {}
        }
        return currentSection.format || {}
      },

      formatDefaultValues () {
        const defaultValues = {}
        this.cards.forEach(card => {
          card.slices.forEach(slice => {
            defaultValues[card.name] = defaultValues[card.name] || {}

            if (!_.isUndefined(slice.defaultValue)) {
              defaultValues[card.name][slice.name] = {
                value: slice.defaultValue
              }
            }
          })
        })
        return defaultValues
      },

      cards () {
        const cards = [
          {
            name: FORMAT_TYPES.BACKGROUND,
            displayName: '页面背景',
            slices: [
              {
                displayName: '颜色',
                name: FORMAT_TYPES.BACKGROUND_COLOR,
                type: FORMAT_FIELD_TYPES.COLOR,
                defaultValue: ''
              },
              {
                displayName: '透明度',
                name: FORMAT_TYPES.BACKGROUND_TRANSPARENCY,
                type: FORMAT_FIELD_TYPES.RANGE,
                min: 0,
                max: 100,
                defaultValue: 0
              },
              {
                displayName: '还原默认值',
                type: FORMAT_FIELD_TYPES.ACTION_RESTORE,
                defaultValue: ''
              }
            ]
          },
          {
            name: FORMAT_TYPES.SECTION_SIZE,
            displayName: '大小',
            slices: [
              {
                displayName: '类型',
                name: FORMAT_TYPES.SECTION_SIZE_TYPE,
                type: FORMAT_FIELD_TYPES.LIST,
                defaultValue: '1',
                options: [
                  {value: 1, displayName: '16:9'},
                  {value: 2, displayName: '4:3'},
                  {value: 3, displayName: 'mobile'},
                  {value: 4, displayName: '自定义'}
                ]
              },
              {
                displayName: '宽度',
                type: FORMAT_FIELD_TYPES.INTEGER,
                name: FORMAT_TYPES.SECTION_WIDTH,
                defaultValue: 1600,
                min: 100,
                max: 99999
              },
              {
                displayName: '高度',
                type: FORMAT_FIELD_TYPES.INTEGER,
                name: FORMAT_TYPES.SECTION_HEIGHT,
                defaultValue: 900,
                min: 100,
                max: 99999
              },
              {
                displayName: '还原默认值',
                type: FORMAT_FIELD_TYPES.ACTION_RESTORE,
                defaultValue: ''
              }
            ]
          }
        ]

        function setCards (cards, cardValues) {
          Object.keys(cardValues).forEach(cardName => {
            const index = _.findIndex(cards, card => card.name === cardName)
            if (index === -1) {
              return
            }

            let card = cards[index]
            const sliceValues = cardValues[cardName] || {}

            Object.keys(sliceValues).forEach(sliceName => {
              const index = _.findIndex(card.slices || [], slice => slice.name === sliceName)
              if (index === -1) {
                return
              }

              let values = sliceValues[sliceName]
              if (!_.isObject(values)) {
                values = {value: values}
              }
              Object.keys(values).forEach(key => {
                const value = values[key]
                if (key !== 'value') {
                  card.slices[index] = Object.assign({}, card.slices[index], {[key]: value})
                }
                if (sliceName === FORMAT_TYPES.SECTION_SIZE_TYPE && value.toString() !== '4') {
                  cards = setCards(cards, {
                    [FORMAT_TYPES.SECTION_SIZE]: {
                      [FORMAT_TYPES.SECTION_WIDTH]: {
                        disabled: true
                      },
                      [FORMAT_TYPES.SECTION_HEIGHT]: {
                        disabled: true
                      }
                    }
                  })
                }
              })
            })
            card = Object.assign({}, card, {slices: card.slices.slice()})
          })
          return cards.slice()
        }

        return setCards(cards, this.formatValues)
      }
    },
    methods: {
      handleChange (cardName, sliceName, value) {
        const currentSection = this.currentSection
        if (!currentSection) {
          return
        }

        let values
        if (_.isObject(sliceName)) {
          values = sliceName
        } else {
          values = {[sliceName]: value}
        }
        this.$store.commit('report/setSectionFormat', {id: currentSection.id, cardName, sliceValues: values})
      }
    }
  }
</script>
