<template>
  <div class="property-card" @click="toggleExpanded(!expanded)">
    <div class="flex card-title">
      <div :title="displayName" class="card-title-display-name item-fill trimmed-text-with-ellipsis"><i class="iconfont" :class="expanded ? 'yg-shouqi' : 'yg-xiala'"></i> {{displayName}}</div>
    </div>
    <div v-if="expanded" @click.stop="" class="card-slices">
      <format-card-slice
        :key="slice.name"
        v-bind="slice"
        :value="getSliceValue(slice)"
        v-for="slice in formatSlices"
        @change="handleChange"
        v-show="sliceVisible(slice)"
      >
        <label slot="displayName" class="title unselectable trimmed-text-with-ellipsis item-auto" :title="slice.displayName">{{slice.displayName}}</label>
      </format-card-slice>

      <format-card-slice
        :key="slice.name"
        v-bind="slice" v-for="slice in actionSlices"
      >
        <field
          slot="field"
          :displayName="slice.displayName"
          :disabled="!getActionStatus(slice.type)"
          :type="slice.type"
          :name="slice.name"
          @restore="handleRestore"
          >
        </field>
      </format-card-slice>
    </div>
  </div>
</template>
<script>
  import _ from 'underscore'
  import { FORMAT_FIELD_TYPES } from '../../../api/constant'

  import FormatCardSlice from './CardSlice.vue'
  import Field from './Field.vue'
  import { toBoolean } from '../../../common/utils'
  import { formatSliceIsValidByPropertyType, getFormatPropertyFieldOptions } from '../../../api/common'

  const parentSliceCache = {}

  export default {
    name: 'format-card',
    components: {FormatCardSlice, Field},
    props: {
      cardValues: Object,
      formatValues: Object,
      formatDefaultValues: {
        type: Object,
        'default' () {
          return {}
        }
      },
      name: String,
      displayName: String,
      slices: Array
    },
    data () {
      return {
        changed: this.isChanged(this.slices),
        expanded: (this.cardValues && this.cardValues.expanded) || false
      }
    },
    computed: {
      currentVisualContainer () {
        return this.$store.getters['report/currentVisualContainer']
      },
      formatSlices () {
        const slices = []
        this.slices.forEach(slice => {
          if (!this.isFormatAction(slice.type)) {
            slices.push(slice)
          }
        })
        return slices
      },
      actionSlices () {
        const slices = []
        this.slices.forEach(slice => {
          if (this.isFormatAction(slice.type)) {
            slices.push(slice)
          }
        })
        return slices
      }
    },
    methods: {
      isChanged (slices) {
        let changed = false
        slices.forEach(slice => {
          if (this.isFormatAction(slice.type)) {
            return
          }

          if (!changed && !this.compareDefaultValue(slice)) {
            changed = true
          }
        })
        return changed
      },
      compareValue (type, a, b) {
        if (_.isObject(a)) {
          if (!_.isObject(b)) {
            return !_.some(a, (v) => {
              return !this.compareValue(type, v, b)
            })
          } else {
            return _.isEqual(a, b)
          }
        } else if (type === FORMAT_FIELD_TYPES.BOOLEAN) {
          return toBoolean(a) === toBoolean(b)
        } else {
          return String(a) === String(b)
        }
      },
      compareDefaultValue (slice) {
        const value = this.formatValues[slice.name]
        const defaultValue = this.getSliceDefaultValue(slice)

        if (_.isUndefined(value)) {
          return true
        }
        return this.compareValue(slice.type, value, defaultValue)
      },
      getSliceDefaultValue (slice) {
        if (this.formatDefaultValues[this.name]) {
          const sliceDefault = this.formatDefaultValues[this.name][slice.name]
          return _.isObject(sliceDefault) ? sliceDefault.value : slice.defaultValue
        } else {
          return slice.defaultValue
        }
      },
      getSliceValue (slice) {
        let value = this.formatValues[slice.name]
        const parentSlice = this.getParentSlice(slice)
        if (parentSlice && parentSlice.type === FORMAT_FIELD_TYPES.PROPERTY) {
          const parentValue = this.getSliceValue(parentSlice)
          value = parentValue ? (value || {})[parentValue] : void 0
        }
        return value
      },
      getSliceByName (sliceName) {
        return _.find(this.slices, (slice) => {
          return slice.name === sliceName
        })
      },
      getParentSlice (slice) {
        if (slice.parentName) {
          const parentName = slice.parentName
          if (!(parentName in parentSliceCache)) {
            parentSliceCache[parentName] = _.find(this.formatSlices, slice => {
              return parentName === slice.name
            })
          }
          return parentSliceCache[parentName]
        }
      },
      toggleExpanded (value) {
        this.expanded = value
        this.$emit('changeCard', this.name, 'expanded', value)
      },
      sliceVisible (slice) {
        const parentSlice = this.getParentSlice(slice)
        let visible = true
        if (parentSlice) {
          if (parentSlice.name in this.formatValues) {
            visible = toBoolean(this.formatValues[parentSlice.name])
          } else {
            visible = toBoolean(parentSlice.defaultValue)
          }
          if (visible) {
            visible = this.sliceVisible(parentSlice)
            if (visible && parentSlice.type === FORMAT_FIELD_TYPES.PROPERTY) {
              const parentSliceValue = this.getSliceValue(parentSlice)
              if (parentSliceValue) {
                const propertyType = this.getFieldPropertyType(parentSliceValue, parentSlice)
                if (_.isUndefined(propertyType) || !formatSliceIsValidByPropertyType(slice, propertyType)) {
                  visible = false
                }
              }
            }
          }
        }
        return visible
      },
      getFieldPropertyType (fieldPropertyId, slice) {
        this.fieldPropertyTypes = this.fieldPropertyTypes || {}
        if (!this.fieldPropertyTypes[fieldPropertyId]) {
          const fieldOptions = getFormatPropertyFieldOptions(this.currentVisualContainer, slice.extra)
          const option = _.find(fieldOptions, (option) => {
            return option.value === fieldPropertyId
          })
          if (option) {
            return option.type
          }
        }
      },
      isFormatAction (type) {
        return [
          FORMAT_FIELD_TYPES.ACTION_CANCEL,
          FORMAT_FIELD_TYPES.ACTION_CONFIRM,
          FORMAT_FIELD_TYPES.ACTION_DELETE,
          FORMAT_FIELD_TYPES.ACTION_EDIT,
          FORMAT_FIELD_TYPES.ACTION_RESTORE
        ].indexOf(type) > -1
      },
      handleChange (value, sliceName) {
        const slice = this.getSliceByName(sliceName)
        if (!slice) {
          return
        }
        this.changed = true
        const parentSlice = this.getParentSlice(slice)
        if (parentSlice && parentSlice.type === FORMAT_FIELD_TYPES.PROPERTY) {
          const parentValue = this.getSliceValue(parentSlice)
          if (parentValue) {
            let oldValue = this.formatValues[slice.name] || {}
            if (!_.isObject(oldValue)) {
              oldValue = {}
            }
            value = Object.assign({}, oldValue, {[parentValue]: value})
          }
        }
        this.$emit('change', this.name, sliceName, value)
      },
      handleRestore () {
        this.changed = false
        const values = {}
        Object.keys(this.formatDefaultValues).forEach(key => {
          const slice = this.formatDefaultValues[key]
          const sliceValue = this.formatValues[slice.name]
          let value = _.isObject(slice) ? slice.value : slice
          if (_.isObject(sliceValue)) {
            const combValue = {}
            Object.keys(sliceValue).forEach(key => {
              combValue[key] = value
            })
            values[key] = combValue
          } else {
            values[key] = value
          }
        })
        this.$emit('change', this.name, values)
      },
      getActionStatus (type) {
        if (type === FORMAT_FIELD_TYPES.ACTION_RESTORE) {
          return this.changed
        }
        return false
      }
    },
    watch: {
      slices (slices) {
        this.changed = this.isChanged(slices)
      }
    }
  }
</script>
