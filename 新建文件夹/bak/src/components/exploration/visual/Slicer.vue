<template>
  <div>
    <div class="slicer-container" v-if="fieldProperty && data">
      <div class="slicer-header-wrapper" v-if="headerShow">
        <div class="slicer-header">
          <div class="slider-header-title" :style="headerTitleStyle">{{headerTitle}}</div>
        </div>
      </div>
      <div class="slicer-content-wrapper">
        <template v-if="isList">
          <slicer :native="false" ref="slicer" class="slicer-container" :items="data || []" :condition="condition" :itemStyle="itemStyle" @apply="applyCondition" :showCheckAll="showCheckAll" :allowMultiple="allowMultiple" ></slicer>
        </template>
        <template v-if="isDropdown">
          <div class="slicer-dropdown-menu" :style="itemStyle" @click.stop="isCollapsed = !isCollapsed" ref="anchor">
            <div class="slicer-restatement">{{restatement}}</div>
            <i class="iconfont" :class="!isCollapsed ? 'yg-shouqi' : 'yg-xiala'"></i>
          </div>
          <dropdown :reference="$refs.anchor" v-if="!isCollapsed" @close="isCollapsed = true" class="slicer-dropdown-popup visual" :style="{width: this.width - 20}" ref="dropdown">
            <slicer :native="false" class="slicer-container" :items="data || []" :condition="condition" :itemStyle="itemStyle" @apply="applyCondition" :showCheckAll="showCheckAll" :allowMultiple="allowMultiple" ></slicer>
          </dropdown>
        </template>
        <template v-if="isInput">
          <slicer-input ref="slicerInput" :inputType="slicerType" :value="inputValue" @apply="applyCondition" :sliderShow="sliderShow" :sliderColor="sliderColor" :inputStyle="inputStyle" :isDate="isDateType" :range="inputRange"></slicer-input>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import _ from 'underscore'

  import Visual from './Visual.vue'
  import { getFormatValue } from '../../../api/common'
  import {
    SLICER_TYPE,
    FORMAT_TYPES,
    PROPERTY_TYPES
  } from '../../../api/constant'
  import { toBoolean } from '../../../common/utils'
  import Slicer from '../../common/Slicer.vue'
  import Dropdown from '../../common/Dropdown.vue'
  import SlicerInput from './slicer/SlicerInput.vue'
  import moment from 'moment'
  import { getFirstFieldProperty } from '../../../common/visual'

  function isInput (slicerType) {
    return slicerType === SLICER_TYPE.INPUT_BETWEEN || slicerType === SLICER_TYPE.INPUT_EGT || slicerType === SLICER_TYPE.INPUT_ELT
  }

  function isList (slicerType) {
    return slicerType === SLICER_TYPE.LIST
  }

  function isDropdown (slicerType) {
    return slicerType === SLICER_TYPE.DROPDOWN
  }

  export default {
    components: {
      SlicerInput,
      Dropdown,
      Slicer},
    mixins: [Visual],
    data () {
      return {
        isCollapsed: true
      }
    },
    computed: {
      inputValue () {
        const {elt, egt} = this.condition
        return [egt, elt]
      },
      inputRange () {
        let max, min
        ;(this.data || []).forEach(value => {
          value = this.isDateType ? moment(value).valueOf() : value
          if (_.isUndefined(max)) {
            max = value
          } else if (max < value) {
            max = value
          }
          if (_.isUndefined(min)) {
            min = value
          } else if (min > value) {
            min = value
          }
        })
        return [parseFloat(min, 10) || 0, parseFloat(max, 10) || 0]
      },
      fieldProperty () {
        const {fieldProperties} = this.config
        return getFirstFieldProperty(fieldProperties)
      },
      headerShow () {
        return toBoolean(getFormatValue(this.format, FORMAT_TYPES.SLICER_HEADER, FORMAT_TYPES.SLICER_HEADER_SHOW))
      },
      headerTitle () {
        if (this.fieldProperty) {
          return this.fieldProperty.alias || this.fieldProperty.desc
        }
      },
      headerTitleStyle () {
        const style = {}
        const fontSize = getFormatValue(this.format, FORMAT_TYPES.SLICER_HEADER, FORMAT_TYPES.SLICER_HEADER_FONT_SIZE)
        const fontColor = getFormatValue(this.format, FORMAT_TYPES.SLICER_HEADER, FORMAT_TYPES.SLICER_HEADER_FONT_COLOR)
        const fontFamily = getFormatValue(this.format, FORMAT_TYPES.SLICER_HEADER, FORMAT_TYPES.SLICER_HEADER_FONT_FAMILY)
        if (fontSize) {
          style['font-size'] = fontSize + 'px'
        }
        if (fontColor) {
          style['color'] = fontColor
        }
        if (fontFamily) {
          style['font-family'] = fontFamily
        }
        return style
      },
      itemStyle () {
        const style = {}
        const fontSize = getFormatValue(this.format, FORMAT_TYPES.SLICER_ITEM, FORMAT_TYPES.SLICER_ITEM_FONT_SIZE)
        const fontColor = getFormatValue(this.format, FORMAT_TYPES.SLICER_ITEM, FORMAT_TYPES.SLICER_ITEM_FONT_COLOR)
        const fontFamily = getFormatValue(this.format, FORMAT_TYPES.SLICER_ITEM, FORMAT_TYPES.SLICER_ITEM_FONT_FAMILY)
        if (fontSize) {
          style['font-size'] = fontSize + 'px'
        }
        if (fontColor) {
          style['color'] = fontColor
        }
        if (fontFamily) {
          style['font-family'] = fontFamily
        }
        return style
      },
      inputStyle () {
        const style = {}
        const fontSize = getFormatValue(this.format, FORMAT_TYPES.SLICER_INPUT, FORMAT_TYPES.SLICER_INPUT_FONT_SIZE)
        const fontColor = getFormatValue(this.format, FORMAT_TYPES.SLICER_INPUT, FORMAT_TYPES.SLICER_INPUT_FONT_COLOR)
        const fontFamily = getFormatValue(this.format, FORMAT_TYPES.SLICER_INPUT, FORMAT_TYPES.SLICER_INPUT_FONT_FAMILY)
        if (fontSize) {
          style['font-size'] = fontSize + 'px'
        }
        if (fontColor) {
          style['color'] = fontColor
        }
        if (fontFamily) {
          style['font-family'] = fontFamily
        }
        return style
      },
      sliderColor () {
        return getFormatValue(this.format, FORMAT_TYPES.SLICER_SLIDER, FORMAT_TYPES.SLIDER_SLIDER_COLOR)
      },
      sliderShow () {
        return toBoolean(getFormatValue(this.format, FORMAT_TYPES.SLICER_SLIDER, FORMAT_TYPES.SLICER_SLIDER_SHOW))
      },
      showCheckAll () {
        return toBoolean(getFormatValue(this.format, FORMAT_TYPES.SLICER_CONTROL, FORMAT_TYPES.SLICER_CONTROL_SHOW_CHECK_ALL))
      },
      allowMultiple () {
        return toBoolean(getFormatValue(this.format, FORMAT_TYPES.SLICER_CONTROL, FORMAT_TYPES.SLICER_CONTROL_ALLOW_MULTIPLE))
      },
      condition () {
        let condition = getFormatValue(this.format, FORMAT_TYPES.SLICER_VALUE, FORMAT_TYPES.SLICER_VALUE_CONDITION)
        if (!_.isObject(condition)) {
          condition = {}
        }
        condition = Object.assign({inValues: [], notInValues: [], elt: null, egt: null}, condition)
        return condition
      },
      slicerType () {
        return getFormatValue(this.format, FORMAT_TYPES.SLICER_TYPE, FORMAT_TYPES.SLICER_TYPE_VALUE, SLICER_TYPE.LIST)
      },
      isList () {
        return this.slicerType === SLICER_TYPE.LIST
      },
      isDropdown () {
        return this.slicerType === SLICER_TYPE.DROPDOWN
      },
      isInput () {
        return this.slicerType === SLICER_TYPE.INPUT_BETWEEN || this.slicerType === SLICER_TYPE.INPUT_EGT || this.slicerType === SLICER_TYPE.INPUT_ELT
      },
      isDateType () {
        return this.fieldProperty.type === PROPERTY_TYPES.DATE
      },
      restatement () {
        const {inValues, notInValues} = this.condition
        if (notInValues.length || inValues.length > 1) {
          return '（多重选择）'
        }
        if (inValues.length === 1) {
          return inValues[0]
        }
        return '所有'
      }
    },
    methods: {
      menuOptions (options) {
        options = options.concat([
          {
            name: '清除',
            props: {
              icon: 'yg-qingchu'
            },
            on: {
              click: () => {
                this.$store.commit('report/setVisualContainerPropertyFormat', {
                  id: this.id,
                  cardName: FORMAT_TYPES.SLICER_VALUE,
                  sliceValues: {
                    [FORMAT_TYPES.SLICER_VALUE_CONDITION]: {}
                  }
                })
              }
            }
          }])
        if (this.editable) {
          const callback = (slicerType) => () => {
            this.$store.commit('report/setVisualContainerPropertyFormat', {
              id: this.id,
              cardName: FORMAT_TYPES.SLICER_TYPE,
              sliceValues: {
                [FORMAT_TYPES.SLICER_TYPE_VALUE]: slicerType
              }
            })
          }
          options = options.concat([
            '/',
            {
              name: '列表',
              props: { selected: this.slicerType === SLICER_TYPE.LIST },
              on: { click: callback(SLICER_TYPE.LIST) }
            },
            {
              name: '下拉',
              props: { selected: this.slicerType === SLICER_TYPE.DROPDOWN },
              on: { click: callback(SLICER_TYPE.DROPDOWN) }
            }
          ])
          if (this.fieldProperty && (this.fieldProperty.type === PROPERTY_TYPES.NUMBER || this.fieldProperty.type === PROPERTY_TYPES.DATE)) {
            options = options.concat([
              { name: '区间',
                props: { selected: this.slicerType === SLICER_TYPE.INPUT_BETWEEN },
                on: { click: callback(SLICER_TYPE.INPUT_BETWEEN) }
              },
              {
                name: '大于等于',
                props: { selected: this.slicerType === SLICER_TYPE.INPUT_EGT },
                on: { click: callback(SLICER_TYPE.INPUT_EGT) }
              },
              {
                name: '小于等于',
                props: { selected: this.slicerType === SLICER_TYPE.INPUT_ELT },
                on: { click: callback(SLICER_TYPE.INPUT_ELT) }
              }
            ])
          }
        }
        return options
      },
      applyCondition (condition) {
        this.$store.commit('report/setVisualContainerPropertyFormat', {
          id: this.id,
          cardName: FORMAT_TYPES.SLICER_VALUE,
          sliceValues: {
            [FORMAT_TYPES.SLICER_VALUE_CONDITION]: condition
          }
        })
      }
    },
    watch: {
      height () {
        this.$refs['slicer'] && this.$refs['slicer'].onResize()
      },
      fieldProperty (fieldProperty, oldFieldProperty) {
        const type = fieldProperty.type
        if (type === PROPERTY_TYPES.TEXT && this.isInput) {
          this.$store.commit('report/setVisualContainerPropertyFormat', {
            id: this.id,
            cardName: FORMAT_TYPES.SLICER_TYPE,
            sliceValues: {
              [FORMAT_TYPES.SLICER_TYPE_VALUE]: SLICER_TYPE.LIST
            }
          })
        }
        if (!_.isEqual(fieldProperty, oldFieldProperty)) {
          this.applyCondition({})
        }
      },
      slicerType (slicerType, oldSlicerType) {
        if (isInput(slicerType) && (isList(oldSlicerType) || isDropdown(oldSlicerType))) {
          this.applyCondition({})
        } else if (isInput(oldSlicerType) && (isList(slicerType) || isDropdown(slicerType))) {
          this.applyCondition({})
        }
      },
      isCollapsed (value) {
        if (value === false) {
          this.$nextTick(() => {
            $(this.$refs['dropdown'].$el).css('width', this.width - 20)
          })
        }
      }
    }
  }
</script>
