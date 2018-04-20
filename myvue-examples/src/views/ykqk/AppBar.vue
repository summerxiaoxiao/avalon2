<template>
  <app-bar>
    <div class="app-header-bar_section--left" slot="left">
      <!--<div class="content-title">demo</div>-->
      <div class="data-filter">
        <div class="selector company">
          单位：<select class="dwmc" name="dwdm"
                     @change="onChange" ref="app_dw">
          <option v-for="item in dwlist" :value="item.dwdm">{{item.dwmc}}</option>
        </select>
        </div>
        <div class="selector date">
          日期选择：
          <hdate :value="mdate" :id="'ykqkdate'"
                 @on-hide="onSelectDate"
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
  import Hdate from '@/components/common/Hdate.vue'

  export default {
    components: {AppBar, Hdate},
    name: 'ykqk-app-bar',
    computed: {
      ...Vuex.mapState({
        'selectDwdm': state => state.ykqk.selectDwdm,
        'date': state => state.ykqk.date,
        'dwlist': state => state.ykqk.dwlist,
        'xmdllist': state => state.ykqk.xmdllist
      })
    },
    data () {
      return {
        isFinish: false,
        mdate: '2018-01'
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
        var v = $(event.target).find('option:selected').val()
        this.$store.commit('ykqk/setSelectDwdm', v)
        this.$emit('on-refresh')
      },
      onSelectDate (d) {
        this.$store.commit('ykqk/setDate', d)
        this.$emit('on-refresh')
      }
    }

  }
</script>
