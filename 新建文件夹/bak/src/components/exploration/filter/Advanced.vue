<template>
  <div>
    <h3 class="description">筛选条件:</h3>
    <select class="comparison-operator advanced-control form-control" v-model="comparisonOperator1">
      <option v-for="option in operatorList" :value="option.value">{{ option.name }}</option>
    </select>
    <div class="advanced-control condition-value flex" :class="{'has-icon': isDateType}">
      <i class="iconfont yg-rili" v-if="isDateType"></i>
      <input ref="comparisonValue1" type="text" class="item-fill form-control " v-model="comparisonValue1" />
    </div>
    <section class="logical-operator">
      <label class="logical-operator-field">
        <input type="radio" v-model="logicalOperator" value="0"><span>且</span>
      </label>
      <label class="logical-operator-field">
        <input type="radio" v-model="logicalOperator" value="1"><span>或</span>
      </label>
    </section>
    <select class="comparison-operator advanced-control form-control" v-model="comparisonOperator2">
      <option v-for="option in operatorList" :value="option.value">{{ option.name }}</option>
    </select>
    <div class="advanced-control condition-value flex" :class="{'has-icon': isDateType}">
      <i class="iconfont yg-rili" v-if="isDateType"></i>
      <input ref="comparisonValue2" type="text" class="item-fill form-control" v-model="comparisonValue2" />
    </div>
    <div class="text-right">
      <button class="apply-filter" type="button" @click="apply" :disabled="!canApply">应用筛选器</button>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import _ from 'underscore'
  import { PROPERTY_TYPES } from '../../../api/constant'
  const DEFAULT_LOGICAL_OPERATOR = '0'

  export default {
    name: 'filter-advanced',
    props: {
      propertyType: [String, Number],
      condition: Object,
      operatorList: Array
    },
    data () {
      const {
        comparisonOperator1 = '1',
        comparisonOperator2 = '',
        comparisonValue1 = '',
        comparisonValue2 = '',
        logicalOperator = DEFAULT_LOGICAL_OPERATOR
      } = this.condition
      return {
        comparisonOperator1,
        comparisonOperator2,
        comparisonValue1,
        comparisonValue2,
        logicalOperator,
        canApply: false
      }
    },
    mounted () {
      const self = this
      if (this.propertyType === PROPERTY_TYPES.DATE) {
        $(this.$refs['comparisonValue1']).datepicker({
          language: 'cn',
          format: 'yyyy-mm-dd',
          autoclose: true
        }).on('changeDate', function () {
          self.comparisonValue1 = $(this).val()
        })
        $(this.$refs['comparisonValue2']).datepicker({
          language: 'cn',
          format: 'yyyy-mm-dd',
          autoclose: true
        }).on('changeDate', function () {
          self.comparisonValue2 = $(this).val()
        })
      }
    },
    beforeDestroy () {
      if (this.propertyType === PROPERTY_TYPES.DATE) {
        $(this.$refs['comparisonValue1']).datepicker('destroy')
        $(this.$refs['comparisonValue2']).datepicker('destroy')
      }
    },
    computed: {
      isDateType () {
        return this.propertyType === PROPERTY_TYPES.DATE
      }
    },
    methods: {
      apply () {
        let {
          comparisonOperator1 = '1',
          comparisonOperator2 = '',
          comparisonValue1 = '',
          comparisonValue2 = '',
          logicalOperator = DEFAULT_LOGICAL_OPERATOR
        } = this

        comparisonValue1 = comparisonValue1.trim()
        comparisonValue2 = comparisonValue2.trim()

        let hasComparison1 = false
        let hasComparison2 = false

        if (comparisonOperator1 !== '' && comparisonValue1 !== '') {
          hasComparison1 = true
        }
        if (comparisonOperator2 !== '' && comparisonValue2 !== '') {
          hasComparison2 = true
        }

        if (['7', '8'].indexOf(comparisonOperator1) > -1) {
          hasComparison1 = true
          comparisonValue1 = ''
        }

        if (['7', '8'].indexOf(comparisonOperator2) > -1) {
          hasComparison2 = true
          comparisonValue2 = ''
        }

        if (hasComparison2 && !hasComparison1) {
          comparisonValue1 = comparisonValue2
          comparisonOperator1 = comparisonOperator2
          comparisonValue2 = ''
          comparisonOperator2 = ''
          logicalOperator = DEFAULT_LOGICAL_OPERATOR
        } else if (hasComparison1 && !hasComparison2) {
          comparisonValue2 = ''
          comparisonOperator2 = ''
          logicalOperator = DEFAULT_LOGICAL_OPERATOR
        } else if (!hasComparison1 && !hasComparison2) {
          logicalOperator = DEFAULT_LOGICAL_OPERATOR
        }

        let condition
        if (!hasComparison1 && !hasComparison2) {
          condition = {}
        } else {
          condition = {
            comparisonOperator1,
            comparisonOperator2,
            comparisonValue1,
            comparisonValue2,
            logicalOperator
          }
        }
        if (_.isEmpty(this.condition) && _.isEmpty(condition)) {
          this.reset()
        } else {
          this.$emit('apply', condition)
        }
        this.$nextTick(() => {
          this.canApply = false
        })
      },

      reset () {
        this.comparisonOperator1 = '1'
        this.comparisonOperator2 = ''
        this.comparisonValue1 = ''
        this.comparisonValue2 = ''
        this.logicalOperator = DEFAULT_LOGICAL_OPERATOR
      }
    },
    watch: {
      condition (condition) {
        this.comparisonOperator1 = condition.comparisonOperator1 || '1'
        this.comparisonOperator2 = condition.comparisonOperator2 || ''
        this.comparisonValue1 = condition.comparisonValue1 || ''
        this.comparisonValue2 = condition.comparisonValue2 || ''
        this.logicalOperator = condition.logicalOperator || DEFAULT_LOGICAL_OPERATOR
      },
      comparisonOperator1 () {
        this.canApply = true
      },
      comparisonOperator2 () {
        this.canApply = true
      },
      comparisonValue1 () {
        this.canApply = true
      },
      comparisonValue2 () {
        this.canApply = true
      },
      logicalOperator () {
        this.canApply = true
      }
    }
  }
</script>
