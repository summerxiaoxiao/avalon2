<template>
  <div class="d-flex flex-column h-barchart-right2">
      <div class="d-flex flex-column h-right2-label h-right2-title">
        售电价结构
      </div>
      <div class="d-flex flex-row justify-content-end ">
        <div class="d-flex flex-column align-items-center justify-content-center h-right2-jldw">
          <div class="d-flex flex-column h-right2-label">数值</div>
          <div class="d-flex flex-column h-right2-label">(元/千千瓦时)</div>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-between h-right2-pie-box">
        <div class="d-flex flex-row h-right2-pie-chart">
          <div class="h-piechart" ref="mypie"></div>
        </div>
        <div class="d-flex flex-row justify-content-center h-right2-pie-desc">
          <div class="d-flex flex-column h-right2-pie-row">
            <div class=" h-right2-pie__label"><i class="h-pie-circle" :style="{'background-color': getColor(0)}"></i>购电价:</div>
            <div class=" h-right2-pie__label"><i class="h-pie-circle" :style="{'background-color': getColor(1)}"></i>线损电价:</div>
            <div class=" h-right2-pie__label"><i class="h-pie-circle" :style="{'background-color': getColor(2)}"></i>输配电价:</div>
          </div>
          <div class="d-flex flex-column h-right2-pie-row">
            <div class=" h-right2-pie__value">125.34</div>
            <div class=" h-right2-pie__value">190.05</div>
            <div class=" h-right2-pie__value">290.05</div>
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
          sdj: {
            colors: ['#1293f4', '#00e7fe', '#ffd000'],
            data: [
              {value: 335, name: '购电价'},
              {value: 310, name: '线损电价'},
              {value: 234, name: '输配电价'}
            ]
          },
          sdl: {
            colors: ['#1390f2', '#3ed7f1', '#3fefa9', '#f1cd3c', '#ed833e'],
            data: [
              {value: 335, name: '大工业'},
              {value: 310, name: '一般工商业'},
              {value: 234, name: '农业生产'},
              {value: 234, name: '居民生活'},
              {value: 234, name: '趸售和其他'}
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
                radius: ['0%', '70%'],
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
        this.config.options.series[0].data = this.config.sdj.data
        this.config.options.color = this.config.sdj.colors
        this.chart = echarts.init(this.$refs.mypie)
        this.chart.setOption(this.config.options)
      }
    }
  }
</script>
<style lang="scss">
  .h-barchart-right2 {
    /*width: 100%;*/
    height: 100%;
    background: #002f56;
    padding: 15px 20px;
    .h-right2-label{
      color:#a9b5c4;
    }

    .h-right2-jldw{
      line-height: 26px;
    }
    .h-right2-pie-box{
      width: 100%;
      height: 100%;
    }
    .h-right2-pie-chart,
    .h-right2-pie-desc{
      max-width:50%;
    }
    .h-right2-pie-chart{
      width: 50%;
    }
    .h-right2-pie-desc{
      width: 50%;
    }
    .h-piechart{
      height: 100%;
      width: 100%;
    }
    .h-right2-pie-row{
      line-height: 50px;
    }

    .h-right2-pie__label{
      font-size: 16px;
    }
    .h-right2-pie__value{
      font-size: 16px;
      padding-left: 20px;
      transform: scale(1, 1.3);
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
