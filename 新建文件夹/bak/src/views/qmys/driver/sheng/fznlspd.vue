<template>
  <div class="d-flex flex-column h-barchart-right-spd">
    <div class="d-flex flex-column h-right-spd-label h-right-spd-title">
      输配电成本结构
    </div>
    <div class="d-flex flex-row justify-content-between h-right-spd-pie-box">
      <div class="d-flex flex-row h-right-spd-pie-chart">
        <div class="h-piechart" ref="mypie"></div>
      </div>
      <div class="d-flex flex-row justify-content-center h-right-spd-pie-desc">
        <div class="d-flex flex-column h-right-spd-pie-row" >
          <div class="d-flex flex-column align-items-center justify-content-center h-right-spd-jldw">
            <div class="d-flex flex-column h-right-spd-label2">&nbsp;</div>
            <div class="d-flex flex-column h-right-spd-label2">&nbsp;</div>
          </div>
          <div class=" h-right-spd-pie__label" v-for="(item,index) in config.sdl.data">
            <i class="h-pie-circle" :style="{'background-color': getColor(index)}"></i>{{item.name}}:</div>
        </div>
        <div class="d-flex flex-column h-right-spd-pie-row" >
          <div class="d-flex flex-column align-items-center justify-content-center h-right-spd-jldw">
            <div class="d-flex flex-column h-right-spd-label2">数值</div>
            <div class="d-flex flex-column h-right-spd-label2">(万元)</div>
          </div>
          <div class=" h-right-spd-pie__value" v-for="(item,index) in config.sdl.data">{{item.value}}</div>
        </div>
        <div class="d-flex flex-column h-right-spd-pie-row" >
          <div class="d-flex flex-column align-items-center justify-content-center h-right-spd-jldw">
            <div class="d-flex flex-column h-right-spd-label2">占比</div>
            <div class="d-flex flex-column h-right-spd-label2">(%)</div>
          </div>
          <div class=" h-right-spd-pie__value" v-for="(item,index) in config.sdl.data">{{item.zb}}</div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  // 发展能力 输配电信息
  import echarts from 'echarts'
  export default {
    name: 'fznl-djjgxx',
    props: {
    },
    data () {
      return {
        config: {
          sdl: {
            colors: ['#1390f2', '#3ed7f1', '#3fefa9', '#f1cd3c', '#ed833e', '#13d90f'],
            data: [
              {value: 1986870, zb: '9.2%', name: '工资'},
              {value: 1586870, zb: '9.2%', name: '输电费'},
              {value: 1186870, zb: '9.2%', name: '折旧费'},
              {value: 986870, zb: '9.2%', name: '委托运行维护费'},
              {value: 1686870, zb: '9.2%', name: '专项管理费'},
              {value: 1386870, zb: '9.2%', name: '可控费用'}
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
                center: ['50%', '52%'],
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
  .h-barchart-right-spd {
    /*width: 100%;*/
    height: 100%;
    background: #002f56;
    padding: 15px 20px;
    .h-right-spd-label{
      color:#a9b5c4;
    }
    .h-right-spd-label2{
      color:#a9b5c4;
      font-size:12px;
    }
    .h-right-spd-jldw{
      line-height: 18px;
      padding-bottom: 10px;
    }
    .h-right-spd-pie-box{
      width: 100%;
      height: 100%;
      padding-right: 20px;
      position: relative;
    }
    .h-right-spd-pie-chart,
    .h-right-spd-pie-desc{
      max-width:50%;
    }
    .h-right-spd-pie-chart{
      width: 40%;
    }
    .h-right-spd-pie-desc{
      padding-top: 10px;
      width: 60%;
      justify-content: space-around;
    }
    .h-piechart{
      height: 100%;
      width: 100%;
    }
    .h-right-spd-pie-row{
      line-height: 25px;
    }

    .h-right-spd-pie__label{
      font-size: 12px;
      min-width: 110px;
    }
    .h-right-spd-pie__value{
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
