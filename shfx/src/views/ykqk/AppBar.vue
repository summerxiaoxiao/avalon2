<template>
  <app-bar>
    <div class="app-header-bar_section--left" slot="left">
      <!--<div class="content-title">demo</div>-->
      <div class="data-filter">
        <div class="selector company">
          单位：<select class="dwmc" name="dwdm"
                     @change="onChange" ref="app_dw">
          <option v-for="item in dwlist" :value="item.dwdm" :compid="item.compid">{{item.dwmc}}</option>
        </select>
        </div>
        <div class="selector date">
          日期选择：
          <hdate :value="date" id="ykqkdate"
                 dateType="month"
                 @on-selected="onSelectDate"
          ></hdate>
        </div>
      </div>
    </div>
  </app-bar>
</template>

<script>
  import Vuex from 'vuex'
  import $ from 'jquery'
  import AppBar from '@/components/common/AppBar.vue'
  import Hdate from '@/components/common/Hndate.vue'

  export default {
    components: {AppBar, Hdate},
    name: 'ykqk-app-bar',
    computed: {
      ...Vuex.mapState({
        'selectDwdm': state => state.ykqk.selectDwdm,
        'selectCompid': state => state.ykqk.selectCompid,
        'date': state => state.ykqk.date,
        'dwlist': state => state.ykqk.dwlist,
        'xmdllist': state => state.ykqk.xmdllist
      })
    },
    data () {
      return {
        isFinish: false
      }
    },
    created () {
      this.load()
    },
    mounted () {
    },
    methods: {
      load () {
        return this.$store.dispatch('ykqk/loadBar').then(() => {})
      },
      onChange (event) {
        var $select = $(event.target).find('option:selected')
        var v = $select.val()
        var compid = $select.attr('compid')
        this.$store.commit('ykqk/setSelectDwdm', v)
        this.$store.commit('ykqk/setSelectCompid', compid)
        this.$store.commit('ykqk/setTableQueryCondition_xmdl')
        this.$store.commit('ykqk/setTableQueryCondition_xm')
        this.$emit('on-refresh')
      },
      onSelectDate (d) {
        this.$store.commit('ykqk/setDate', d)
        this.$store.commit('ykqk/setTableQueryCondition_xmdl')
        this.$store.commit('ykqk/setTableQueryCondition_xmmx')
        this.$emit('on-refresh')
      }
    }

  }
</script>
