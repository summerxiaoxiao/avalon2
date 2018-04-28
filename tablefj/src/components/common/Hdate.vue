<template>
  <div class="selector-date">
    <input class="selector-input-date" readonly type="text" v-model="value" id="id" ref="myinput">
    <span class="input-group-addon" @click="showDate">
      <span class="glyphicon glyphicon-calendar input-date-icon"></span>
    </span>
  </div>
</template>
<script>
  import $ from 'jquery'
  import { addDate } from '@/utils/commonutils'
  export default {
    name: 'app-hdate',
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
        default: 'yyyy' // yyyy-MM ,yyyy-MM-dd
      },
      position: {
        type: String,
        default: 'right' // top , right, left ,
      }
    },
    data () {
      return {
        $date: null,
        format: this.mformat,
        minView: 4,  // 4: 年 ， 3： month  2: day
        startView: 4,
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

        if (vm.dateType === 'year') {
          vm.nowDate = addDate('y', -1, vm.newDate) // 默认是上一年，或当年上一个月
        }
        if (vm.dateType === 'month') {
          vm.nowDate = addDate('m', -1, vm.newDate) // 默认是上一年，或当年上一个月
        }
        if (vm.value) {
          vm.nowDate = new Date(vm.value)
        }
        var nowDateStr = vm.nowDate.getFullYear()  //  +"年";

        if (vm.dateType === 'month') {
          vm.minView = 3
          vm.startView = 3
          vm.format = 'yyyy-MM'
          var month = (vm.nowDate.getMonth() + 1) < 10 ? ('0' + (vm.nowDate.getMonth() + 1)) : (vm.nowDate.getMonth() + 1)
          if (vm.newDate.getFullYear() !== nowDateStr) {
            month = '12'
          }
          nowDateStr = vm.nowDate.getFullYear() + '-' + month // +"月";
        } else if (this.dateType === 'day') {
          vm.minView = 2
          vm.startView = 3
          vm.format = 'yyyy-MM-dd'
          nowDateStr = vm.nowDate.getFullYear() + '年' + (vm.nowDate.getMonth() + 1) + '月' + vm.nowDate.getDay() + '日'
        }
        this.$date.datetimepicker('remove')

        this.$date.val(nowDateStr)
        this.$date.datetimepicker({
          language: 'zh-CN',
          startView: vm.startView,
          minView: vm.minView,
          format: vm.format,
          pickerPosition: 'bottom-' + this.position, // bottom-right
          todayHighlight: true,
          showMeridian: true,
          autoclose: true
//          format: 'yyyy-mm', // 显示格式
//          todayHighlight: 1, // 今天高亮
//          minView: 3, // 设置只显示到月份
//          startView: 3,
//          forceParse: 0,
//          showMeridian: 1,
//          autoclose: 1 //  选择后自动关闭
        }).off('hide').on('hide', function (ev) {
          var newValue = null
          if (vm.minView === 4) {
            newValue = ev.date.getFullYear() //  +"年";
          } else if (vm.minView === 3) {
            var mm = ev.date.getMonth() + 1 + ''
            mm = mm.length === 2 ? mm : '0' + mm
            newValue = ev.date.getFullYear() + '-' + mm //   +"月";
          } else if (vm.minView === 2) {
            newValue = ev.date.getFullYear() + '年' + ev.date.getMonth() + '月' + ev.date.getDay() + '日'
          }
          $(this).val(newValue)
          vm.$emit('on-selected', newValue)
        }).on('changeDate', function (ev) {
          vm.$emit('on-change-date', ev)
        }).on('changeYear', function (ev) {
          vm.$emit('on-change-year', ev)
        }).on('changeMonth', function (ev) {
          vm.$emit('on-change-month', ev)
        })
      }
    }
  }
</script>
