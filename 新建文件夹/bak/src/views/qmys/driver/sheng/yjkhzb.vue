<template>
  <div class="d-flex flex-row h-flex-auto driver-zb-chart-row">
    <div class="d-flex flex-column h-flex-auto driver-zb-chart-item "
         :class="{'active': index===0}"
         v-if="isFinish" v-for="(item,index) in khzblist">
      <div class="d-flex flex-column h-flex-auto item-chart align-items-center justify-content-center">
        <h-pie-chart
          :value="item.value"
          :colors="getColor(index)"
        ></h-pie-chart>
      </div>
      <div class="d-flex flex-column h-flex-auto item-content-box">
        <div class="d-flex flex-row justify-content-around item-content">
          <div class="d-flex flex-column justify-content-center align-items-center">
            <span class="item-content__value">123</span>
            <span class="item-content__label">国网下达</span>
          </div>
          <div class="d-flex flex-column justify-content-center align-items-center">
            <span class="item-content__value">123</span>
            <span class="item-content__label">本年累计</span>
          </div>
          <div class="d-flex flex-column justify-content-center align-items-center">
            <span class="item-content__value"
                  :class="[{'c-green': index===0, 'c-red': index==1 || index===3, 'c-blue': index===2}]">123</span>
            <span class="item-content__label">累计同比</span>
          </div>
          <div class="d-flex flex-column justify-content-center align-items-center">
            <span class="item-content__value">123</span>
            <span class="item-content__label">排名</span>
          </div>
        </div>
        <div class="yj-box d-flex flex-row justify-content-center">
         <div class="d-flex flex-row yj-box-item " :class="{'yj-box-item-active': index===0}">
           <i class="iconfont icon-lingdang" style="color: #fdec04;"></i>&nbsp;&nbsp;
           <span >利润总额</span>
           <span>&nbsp;&nbsp;(万元)</span>&nbsp;&nbsp;
           <span><i class="iconfont icon-bangzhu" style="color: #5fbbf5;"></i></span>
         </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import Vuex from 'vuex'
  import HPieChart from '@/views/qmys/common/PieChart'
  // 省-业绩考核指标
  export default {
    name: 'yjkhzb-app',
    components: {
      HPieChart
    },
    props: {
    },
    data () {
      return {
        isFinish: false
      }
    },
    computed: {
      ...Vuex.mapState({
        'khzblist': state => state.driver.khzblist
      })
    },
    mounted () {
      this.$nextTick(() => {
        console.log(this.khzblist)
        this.load()
      })
    },
    methods: {
      load () {
        this.$store.dispatch('driver/loadKhzblist', {}).then((list) => {
          console.log(list)
          this.isFinish = true
        })
      },
      getColor (index) {
        var arr = []
        arr.push(['#29720f', '#3d627f', '#04e210']) // 绿色
        arr.push(['#661c14', '#3f6482', '#fe0200']) // 红色
        arr.push(['#013270', '#3f6481', '#1d83fc']) // 蓝色
        arr.push(['#691b12', '#fe90a4', '#fc0200']) // 红色
        return arr[index]
      }
    }
  }
</script>
