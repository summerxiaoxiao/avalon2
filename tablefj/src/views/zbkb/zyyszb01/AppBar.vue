<template>
  <app-bar>
    <div class="app-header-bar_section--left" slot="left">
      <div class="data-filter h-box-row">
        <div class="selector dwxz h-flex1">
          单位性质：<select class="dwmc" name="dwxz"
                       @change="onChange" ref="app_dwxz">
          <option v-for="item in dwlist" :value="item.dwdm">{{item.dwmc}}</option>
        </select>
        </div>
        <div class="selector company h-flex1">
          单位：<select class="dwmc" name="dwdm"
                     @change="onChange" ref="app_dwxz">
          <option v-for="item in dwlist" :value="item.dwdm">{{item.dwmc}}</option>
        </select>
        </div>
        <div class="selector h-flex1">
          日期选择：
          <hdate :value="mdate" :id="'zyyszbdate'"
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
    name: 'zyyszb-app-bar',
    computed: {
      ...Vuex.mapState({
        'selectDwdm': state => state.zyyszb01.selectDwdm,
        'date': state => state.zyyszb01.date,
        'dwlist': state => state.zyyszb01.dwlist,
        'dwxzlist': state => state.zyyszb01.dwxzlist
      })
    },
    data () {
      return {
        isFinish: false,
        mdate: null
      }
    },
    created () {
      this.load()
    },
    mounted () {
    },
    methods: {
      load () {
        return this.$store.dispatch('app/loadDwlist').then(() => {})
      },
      onChange (event) {
        var v = $(event.target).find('option:selected').val()
        this.$store.commit('app/setSelectDwdm', v)
        this.$emit('on-refresh')
      },
      onSelectDate (d) {
        this.$store.commit('app/setDate', d)
        this.$emit('on-refresh')
      }
    }

  }
</script>
