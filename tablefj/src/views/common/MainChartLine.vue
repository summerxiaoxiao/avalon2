<template>
  <div class="h-box-column h-chartline_main h-flex-auto">
    <div class="h-main__title ">
      <p class="h-title">{{title}}</p>
    </div>
    <div class="h-box-row h-flex-auto h-chartline">
      <div class="h-box-column h-flex2 h-chartline_left">
        <div class="h-chartline_chart" ref="mychart"></div>
      </div>
      <div class="h-box-column h-flex1 h-chartline_right">
        <div class="h-box-column h-chartline_rightchart">
          <div class="h-box-row h-flex1 h-label__bar">
            <div class="h-box-column h-label__bar1">主营业务收入净额</div>
            <div class="h-box-column h-label__bar2">主营业务成本</div>
          </div>
          <div class="h-flex1 h-chartline_right_barchart" ref="rightchart"></div>
          <div class="h-flex1 barchart_label">2017年10月</div>
        </div>
        <div class="h-chartline_box h-box-row">
          <div class="h-box-column h-chartline_area">
            <div class="h-box-row h-chartline_box__row">
              <div class="h-box-column h-flex1 h-chartline_box__item">
                <span class="h-chartline_box__value">12345</span>
                <span class="h-chartline_box__label">年初预算数</span>
              </div>
              <div class="h-box-column h-flex1 h-chartline_box__item">
                <span class="h-chartline_box__value">789</span>
                <span class="h-chartline_box__label">本年累计数</span>
              </div>
            </div>
            <div class="h-box-row h-chartline_box__row">
              <div class="h-box-column h-flex1 h-chartline_box__item">
                <span class="h-chartline_box__value h-c-red">-10%</span>
                <span class="h-chartline_box__label">完成率</span>
              </div>
              <div class="h-box-column h-flex1 h-chartline_box__item">
                <span class="h-chartline_box__value h-c-red">1%</span>
                <span class="h-chartline_box__label">累计同比</span>
              </div>
            </div>
          </div>
          <div class="h-box-column h-chartline__split"></div>
          <div class="h-box-column h-chartline_area">
            <div class="h-box-row h-chartline_box__row">
              <div class="h-box-column h-flex1 h-chartline_box__item">
                <span class="h-chartline_box__value">12345</span>
                <span class="h-chartline_box__label">年初预算数</span>
              </div>
              <div class="h-box-column h-flex1 h-chartline_box__item">
                <span class="h-chartline_box__value">789</span>
                <span class="h-chartline_box__label">本年累计数</span>
              </div>
            </div>
            <div class="h-box-row h-chartline_box__row">
              <div class="h-box-column h-flex1 h-chartline_box__item">
                <span class="h-chartline_box__value h-c-green">65%</span>
                <span class="h-chartline_box__label">完成率</span>
              </div>
              <div class="h-box-column h-flex1 h-chartline_box__item">
                <span class="h-chartline_box__value h-c-red">10%</span>
                <span class="h-chartline_box__label">累计同比</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  export default {
    name: 'h-chart-line-app',
    props: {
      title: String
    },
    data () {
      return {
        lineData: {
          categoryNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
          lengendNames: ['主营业收入净额', '主营业收入成本'],
          colors: [
            ['rgba(182,115,63,0.85)', 'rgba(96,103,108,0.2)'],
            ['rgba(47,128,194,0.85)', 'rgba(47,128,194,0.2)']
          ],
          lineColors: ['#d9834c', '#3076bf'],
          data: [
            [1320, 1132, 6500, 2300, 1400, 5020, 20],
            [590, 1000, 1500, 5000, 3500, 2600, 890]
          ],
          lengendData: [],
          seriesData: []
        },
        barData: {
          categoryNames: ['201710'],
          lengendNames: ['主营业收入净额', '主营业收入成本'],
          colors: ['#6ca6df', '#eb823a'],
          data: [
            [-2000],
            [2000]
          ]
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.setDefaultData()
        this.renderChart()
        this.renderBarChart()
      })
    },
    methods: {
      setDefaultData () {
        var self = this
        var echarts = this.$echarts
        var lengendNames = self.lineData.lengendNames
        var colors = self.lineData.colors
        var lineColors = self.lineData.lineColors
        var data = self.lineData.data

        var lengendData = []
        var seriesData = []
        lengendNames.forEach(function (item, i) {
          var obj = {
            name: item,
            textStyle: {
              fontSize: 15
            },
            icon: 'stack'
          }
          lengendData.push(obj)
          var seriesObj = {
            name: item,
            type: 'line',
            //  smooth: true,
            showSymbol: false, // 默认不显示圆点
            areaStyle: {
              normal: {
                // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: colors[i][0]
                }, {
                  offset: 1,
                  color: colors[i][1]
                }])
              }

            },
            itemStyle: {
              normal: {
                color: lineColors[i],
                lineStyle: {
                  color: lineColors[i]
                }
              }
            },
            data: data[i]
          }
          seriesData.push(seriesObj)
        })
        self.lineData.lengendData = lengendData
        self.lineData.seriesData = seriesData
      },
      renderChart () {
        var self = this
        var $dom = $(self.$refs.mychart)
        var mychart = this.$echarts.init($dom.get(0))

        var categoryNames = self.lineData.categoryNames
        var lengendData = self.lineData.lengendData
        var seriesData = self.lineData.seriesData

        var option = {
          title: {
            show: false
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          // 图表展示的类别，这里的data和series中得name对应
          legend: {
            x: 'right',
            y: 'top',
            orient: 'horizontal',
            padding: [40, 50, 0, 0],    // [5, 10, 15, 20]
            itemGap: 40,
            data: lengendData,
            textStyle: {
              color: '#fff'
            }
          },
          grid: { // 设置图形位置
            y: '17%',
            left: '10%',
            right: '5%',
            top: '30%',
            bottom: '0%',
            height: '50%',
            width: '85%'
          },
          xAxis: [{
            type: 'category',
            boundaryGap: true, // 这里表示是否补齐空白
            data: categoryNames,
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 15
              }
            },
            axisLine: {
              lineStyle: { // x轴线条颜色
                color: '#34678f'
              }
            },
            axisTick: {
              show: false
            }
          }],
          yAxis: [{
            type: 'value',
            // boundaryGap: [0, '100%'], // 如果设置这个属性，则splitNumber设置失效
            splitNumber: 4,
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 15
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: { // 隐藏网格线
              show: true,
              lineStyle: { // 网格线颜色
                color: '#34678f',
                width: 1
              }
            }
          }],
          series: seriesData
        }
        // 配置图表设置并读取
        mychart.setOption(option)
      },
      renderBarChart () {
        var self = this
        var $dom = $(self.$refs.rightchart)
        var mychart = this.$echarts.init($dom.get(0))

        var lengendNames = self.barData.lengendNames
        var categoryNames = self.barData.categoryNames
        var colors = self.barData.colors
        var data = self.barData.data

        var option = {
          tooltip: {
            trigger: 'axis',
            position: function (p) {
              return [p[0] - 200, '50%']
            },
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            show: false,
            data: lengendNames
          },
          grid: {
            y: '25%',
            top: '20%',
            left: '0%',
            right: '1%',
            bottom: '0',
            width: '96%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'value',
              show: false
            }
          ],
          yAxis: [
            {
              type: 'category',
              axisTick: {show: false},
              data: categoryNames,
              show: false
            }
          ],
          series: [
            {
              name: lengendNames[0],
              type: 'bar',
              stack: '总量',
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: function (params) {
                    return colors[0]
                  }
                }
              },
              data: data[0]
            },
            {
              name: lengendNames[1],
              type: 'bar',
              stack: '总量',
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: function (params) {
                    return colors[1]
                  }
                }
              },
              data: data[1]
            }
          ]
        }
        mychart.setOption(option)
      }
    }
  }
</script>
<style lang="scss">
  .h-chartline_main{
    width: 100%;
    /*height: 100%;*/
  }
.h-main__title{
  /*padding: 15px 15px 0px 15px;*/
  position: absolute;
  top: 15px;
  .h-title{
    color: #fff;
    font-weight: 500;
    font-size: 20px;
    font-weight: 800;
    background: #162736;
    width: fit-content;
    height: 40px;
    line-height: 40px;
    text-align: center;
    padding: 0px 10px 0px 10px;
  }
}
.h-chartline{
  /*height: 100%;*/
  width: 100%;
  color: #fff;

  .h-chartline_left{
    /*height: 100%;*/
    width: 65%;
    .h-chartline_chart{
      height: 100%;
      width: 100%;
    }
  }
  .h-chartline_right{
    /*height: 100%;*/
    width: 35%;
    padding-top: 25px;
  }
}
  .h-chartline_rightchart{
    align-items: center;
    justify-content: center;
    height: 22%;
    width: 100%;
    line-height: 40px;

    .barchart_label{
      line-height: 20px;
    }
    .h-chartline_right_barchart{
      height: 10px;
      width: 80%;
    }
    .h-label__bar{
      width: 100%;
      align-items: center;
      justify-content: center;
      line-height: 40px;
      .h-label__bar1{
        margin-right: 20px;
      }
      .h-label__bar2{
        margin-left: 20px;
      }
    }
  }
.h-chartline_box{
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .h-chartline__split{
    width: 1px;
    height: 60%;
    border-left: 1px solid #477eb9;
  }
  .h-chartline_area{
    height: 100%;
    width: 50%;
    align-items: center;
    justify-content: center;
    .h-chartline_box__item{
      width: 50%;
      line-height: 32px;
      align-items: center;
      justify-content: center;
    }
    .h-chartline_box__row{
      width: 100%;
      height: 35%;
    }
  }

  .h-chartline_box__value{
    font-size: 26px;
    font-weight: 550;
    transform: scale(1, 1.5);
  }
  .h-chartline_box__label{
    font-size: 15px;
    color: #90c1e9;
  }
}
</style>
