<template>
  <app-bar>
    <div class="d-flex app-header-bar_section--left" slot="left" v-if="isFinish">
      <div class="data-filter d-flex flex-row">
        <div class="selector flex-row dwxz h-flex1" v-if="isShowKeys('dwxz')">
         <span class="filter-label"> 单位性质：</span>
          <select class="dwmc" name="dwxz" v-model="selectMap.selectDwxzdm"
                       @change="onChangeDwxz" ref="app_dwxz">
          <option v-for="item in dwxzlist" :value="item.value">{{item.name}}</option>
        </select>
          <i class="select-down iconfont  icon-xiala" @click="triggerClick('dwxz')"></i>
        </div>
        <div class="selector flex-row company h-flex1" v-if="isShowKeys('dw')">
          <span class="filter-label">单位：</span>
          <select class="dwmc" name="dwdm" v-model="selectMap.selectDwdm"
                     @change="onChange" ref="app_dw">
          <option v-for="item in dwlist" :value="item.dwdm">{{item.dwmc}}</option>
        </select>
          <i class="select-down iconfont  icon-xiala" @click="triggerClick('dw')"></i>
        </div>
        <div class="selector flex-row h-flex1" v-if="isShowKeys('date')">
          <span class="filter-label">时间：</span>
          <hdate :value="selectMap.selectDate" id="zyyszbdate"
                 dateType="month"
                 @on-selected="onSelectDate"
                 ref="app_date"
          ></hdate>
          <i class="select-down iconfont  icon-xiala" @click="triggerClick('date')"></i>
        </div>
      </div>
    </div>
  </app-bar>
</template>

<script>
  import _ from 'lodash'
  import $ from 'jquery'
  import AppBar from '@/components/qmys/AppBar.vue'
  import Hdate from '@/components/qmys/Hdate.vue'

  export default {
    components: {AppBar, Hdate},
    name: 'qmys-app-bar',
    props: {
      selectDw: Object,
      selectDwxz: Object,
      selectDate: String,
      dwlist: Array,
      dwxzlist: Array,
      showKeys: {// dwxz, dw, date  显示的过滤条件
        type: Array,
        default: function () {
          return ['dwxz', 'dw', 'date']
        }
      }
    },
    data () {
      return {
        isFinish: false,
        selectMap: { // 选中的数据
          selectDw: {dwdm: null, dwmc: null},
          selectDate: null,
          selectDwxz: {value: null, name: null}
        }
      }
    },
    created () {
    },
    mounted () {
      this.$nextTick(function () {
        this.selectMap.selectDw = this.selectDw ? this.selectDw : {}
        this.selectMap.selectDwxz = this.selectDwxz ? this.selectDwxz : {}
        this.selectMap.selectDate = this.selectDate ? this.selectDate : null
        this.$set(this.selectMap, 'selectDwdm', this.selectMap.selectDw.dwdm)
        this.$set(this.selectMap, 'selectDwxzdm', this.selectMap.selectDwxz.value)
        this.$set(this.selectMap, 'selectDate', this.selectMap.selectDate)

        this.isFinish = true
      })
    },
    methods: {
      isShowKeys (bz) {
        var bz2 = bz === 'dw' ? 'dwdm' : bz
        if (bz2 !== bz) {
          return _.indexOf(this.showKeys, bz) > -1 || _.indexOf(this.showKeys, bz2) > -1
        } else {
          return _.indexOf(this.showKeys, bz) > -1
        }
      },
      triggerClick (bb) {
        console.log(bb)
        bb === 'dwxz' && $(this.$refs.app_dwxz).select()
        bb === 'dw' && $(this.$refs.app_dw).select()
        bb === 'date' && $(this.$refs.app_date).find('input').focus()
      },
      onChangeDwxz (event) {
        var $selectObj = $(event.target).find('option:selected')
        this.selectMap.selectDwxz = {
          value: $selectObj.val(),
          name: $selectObj.text()
        }
        this.$set(this.selectMap, 'selectDwxzdm', this.selectMap.selectDwxz.value)
        this.$emit('on-refresh', this.selectMap)
      },
      onChange (event) {
        var $selectObj = $(event.target).find('option:selected')
        this.selectMap.selectDw = {
          dwdm: $selectObj.val(),
          dwmc: $selectObj.text()
        }
        this.$set(this.selectMap, 'selectDwdm', this.selectMap.selectDw.dwdm)
        this.$emit('on-refresh', this.selectMap)
      },
      onSelectDate (d) {
        this.$set(this.selectMap, 'selectDate', d)
        this.$emit('on-refresh', this.selectMap)
      }
    }

  }
</script>
