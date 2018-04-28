<template>
  <div class="h-box-column">
    <div class="zyyszb-title">{{title}}</div>
    <div class="zyyszb-left-box h-box-column">
      <div class="zyyszb-left-item h-flex1 h-box-column" v-for="item in ybpList">
        <div class="zyyszb-left-item-ybp h-box-row">
          <div class="zyyszb-left-item-ybp__image" ref="ybpchart">
            <h-ybpchart :val="item.hss" :targetValue="item.yss"></h-ybpchart>
          </div>
          <div class="zyyszb-left-item-desc h-flex1 h-box-column">
            <div class="zyyszb-left-item-desc__label h-box-column">
              <div class="zyyszb-left-item-desc__value">{{item.yss}} </div>
              <div class="zyyszb-left-item-desc__title">预算</div>
            </div>
            <div class="zyyszb-left-item-desc__label h-box-column">
              <div class="zyyszb-left-item-desc__value">{{item.hss}} </div>
              <div class="zyyszb-left-item-desc__title">核算</div>
            </div>
          </div>
        </div>
        <div class="zyyszb-left-item-title h-box-column">
          <div class="zyyszb-left-item-title__value">{{getWcl(item.hss,item.yss)}}%</div>
          <div class="zyyszb-left-item-title__title">{{item.zb2}}</div>
        </div>
        <div class="zyyszb-left-item__line"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vuex from 'vuex'

  export default {
    name: 'zyyszb01-jyzb-app-content',
    components: {
    },
    data () {
      return {
      }
    },
    props: {
      title: String
    },
    computed: {
      ...Vuex.mapState({
        'dwdm': state => state.app.dwdm,
        'date': state => state.app.date,
        'ybpList': state => state.zyyszb01.ybpList
      })
    },
    mounted () {
      this.$nextTick(function () {
        this.load()
      })
    },
    methods: {
      reload () {
      },
      getWcl (hss, yss) {
        return (Number(hss) / Number(yss) * 100).toFixed(2)
      },
      load () {
        return this.$store.dispatch('zyyszb01/loadYbpList').then(() => {
          this.isFinish = true
        })
      }
    }
  }
</script>
