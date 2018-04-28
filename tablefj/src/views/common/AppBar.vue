<template>
  <app-bar>
    <div class="app-header-bar_section--left" slot="left" v-if="isFinish">
      <div class="data-filter h-box-row">
        <div class="selector dwxz h-flex1" v-if="isShowKeys('dwxz')">
          单位性质：<select class="dwmc" name="dwxz" v-model="selectMap.selectDwxzdm"
                       @change="onChangeDwxz" ref="app_dwxz">
          <option v-for="item in dwxzlist" :value="item.value">{{item.name}}</option>
        </select>
        </div>
        <div class="selector company h-flex1" v-if="isShowKeys('dw')">
          单位：<select class="dwmc" name="dwdm" v-model="selectMap.selectDwdm"
                     @change="onChange" ref="app_dwxz">
          <option v-for="item in dwlist" :value="item.dwdm">{{item.dwmc}}</option>
        </select>
        </div>
        <div class="selector h-flex1" v-if="isShowKeys('date')">
          日期选择：
          <hdate :value="selectMap.selectDate" id="zyyszbdate"
                 dateType="month"
                 @on-selected="onSelectDate"
          ></hdate>
        </div>
      </div>
    </div>
  </app-bar>
</template>

<script>
  import _ from 'lodash'
  import $ from 'jquery'
  import AppBar from '@/components/common/AppBar.vue'
  import Hdate from '@/components/common/Hdate.vue'

  export default {
    components: {AppBar, Hdate},
    name: 'zyyszb-app-bar',
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
