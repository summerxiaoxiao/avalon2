<template>
  <div class="d-flex flex-column h-barchart-right-sdl">
    <div class="d-flex flex-column h-right-sdl-label h-right-sdl-title">
      售电量结构
    </div>
    <div class="d-flex flex-row justify-content-between h-right-sdl-pie-box">
      <div class="d-flex flex-row h-right-sdl-pie-chart">
        <div class="h-piechart" ref="mypie"></div>
      </div>
      <div class="d-flex flex-row justify-content-center h-right-sdl-pie-desc">
        <div class="d-flex flex-column h-right-sdl-pie-row" >
          <div class="d-flex flex-column align-items-center justify-content-center h-right-sdl-jldw">
            <div class="d-flex flex-column h-right-sdl-label2">&nbsp;</div>
            <div class="d-flex flex-column h-right-sdl-label2">&nbsp;</div>
          </div>
          <div class=" h-right-sdl-pie__label" v-for="(item,index) in config.sdl.data">
            <i class="h-pie-circle" :style="{'background-color': getColor(index)}"></i>{{item.name}}:</div>
        </div>
        <div class="d-flex flex-column h-right-sdl-pie-row" >
          <div class="d-flex flex-column align-items-center justify-content-center h-right-sdl-jldw">
            <div class="d-flex flex-column h-right-sdl-label2">电量值</div>
            <div class="d-flex flex-column h-right-sdl-label2">(亿千瓦时)</div>
          </div>
          <div class=" h-right-sdl-pie__value" v-for="(item,index) in config.sdl.data">{{item.value}}</div>
        </div>
        <div class="d-flex flex-column h-right-sdl-pie-row" >
          <div class="d-flex flex-column align-items-center justify-content-center h-right-sdl-jldw">
            <div class="d-flex flex-column h-right-sdl-label2">占比</div>
            <div class="d-flex flex-column h-right-sdl-label2">(%)</div>
          </div>
          <div class=" h-right-sdl-pie__value" v-for="(item,index) in config.sdl.data">{{item.zb}}</div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  // 发展能力 售电价结构信息
  import echarts from 'echarts'
  export default {
    name: 'fznl-djjgxx',
    props: {
    },
    data () {
      return {
        name: '售电量',
        config: {
          sdl: {
            colors: ['#1390f2', '#3ed7f1', '#3fefa9', '#f1cd3c', '#ed833e'],
            data: [
              {value: 1986870, zb: '9.2%', name: '大工业'},
              {value: 1586870, zb: '9.2%', name: '一般工商业'},
              {value: 1186870, zb: '9.2%', name: '农业生产'},
              {value: 986870, zb: '9.2%', name: '居民生活'},
              {value: 1686870, zb: '9.2%', name: '趸售和其他'}
            ]
          },
          options: {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              show: false,
              orient: 'vertical',
              x: 'left',
              data: ['购电价', '线损电价', '输配电价']
            },
            series: [
              {
                name: '',
                type: 'pie',
                radius: ['0%', '80%'],
                center: ['50%', '42%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '14'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: true
                  }
                },
                data: []
              }
            ]
          }
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.render()
      })
    },
    methods: {
      getColor (index) {
        return this.config.sdl.colors[index]
      },
      render () {
        this.config.options.series[0].data = this.config.sdl.data
        this.config.options.color = this.config.sdl.colors
        this.chart = echarts.init(this.$refs.mypie)
        this.chart.setOption(this.config.options)
      }
    }
  }
</script>
<style lang="scss">
  .h-barchart-right-sdl {
    /*width: 100%;*/
    height: 100%;
    background: #002f56;
    padding: 15px 20px;
    .h-right-sdl-label{
      color:#a9b5c4;
    }
    .h-right-sdl-label2{
      color:#a9b5c4;
      font-size:12px;
    }
    .h-right-sdl-jldw{
      line-height: 18px;
      padding-bottom: 10px;
    }
    .h-right-sdl-pie-box{
      width: 100%;
      height: 100%;
      position: relative;
    }
    .h-right-sdl-pie-chart,
    .h-right-sdl-pie-desc{
      max-width:50%;
    }
    .h-right-sdl-pie-chart{
      width: 40%;
    }
    .h-right-sdl-pie-desc{
      padding-top: 10px;
      width: 60%;
      justify-content: space-around;
    }
    .h-piechart{
      height: 100%;
      width: 100%;
    }
    .h-right-sdl-pie-row{
      line-height: 25px;
    }

    .h-right-sdl-pie__label{
      font-size: 12px;
      min-width: 80px;
    }
    .h-right-sdl-pie__value{
      font-size: 12px;
      transform: scale(1, 1.3);
      padding-left: 18px;
    }
    .h-pie-circle{
      display: inline-block;
      margin-right: 7px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      cursor: pointer;
      background-color: red;
    }
  }
</style>
