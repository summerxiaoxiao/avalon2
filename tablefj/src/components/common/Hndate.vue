<template>
  <div class="selector-date">
    <input class="selector-input-date" v-model="value" id="id" ref="inputdate">
    <span class="input-group-addon" >
      <span class="glyphicon glyphicon-calendar" @click="showDate"></span>
    </span>
  </div>
</template>
<script>
  import $ from 'jquery'
  // 适用于node里的datetimepicker
  export default {
    name: 'app-hndate',
    props: {
      id: String,
      value: String, // 2018-01-01
      width: Number,
      dateType: {
        type: String,
        default: 'month' // year, day
      },
      mformat: {
        type: String,
        default: 'YYYY年' // yyyy-MM ,yyyy-MM-dd
      },
      onSelected: Function,
      position: {
        type: String,
        default: 'right' // top , right, left ,
      }
    },
    data () {
      return {
        $date: null,
        format: this.mformat,
        viewMode: 'years',
        newDate: new Date(),
        nowDate: null
      }
    },
    mounted () {
      // this.$nextTick(function () {
      // })
      this.$date = $(this.$el).find('input')
      this.init()
    },
    methods: {
      showDate () {
        this.$date && this.$date.focus()
      },
      init () {
        var vm = this
        var option = {
          viewMode: vm.viewMode,
          format: 'YYYY年',
          onSelected: function (ev) {
            var selectdate = vm.$refs.inputdate.value
            $(vm.$refs.inputdate).blur()
            vm.$emit('on-selected', selectdate)
          },
          keepOpen: false,
          alwaysOpen: false
          // minDate: '01/01/2012'
        }
        if (vm.dateType === 'month') {
          option.viewMode = 'months'
          option.format = 'YYYY年M月'
        }
        this.$date.datetimepicker(option)
      }
    }
  }
</script>
<style>

</style>
