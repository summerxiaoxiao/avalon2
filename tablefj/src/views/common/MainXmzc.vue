<template>
  <div class="h-box-column h-flex-auto h-box_xmzc">
    <div class="h-main_box_title ">
      <p class="h-title">{{title}}</p>
    </div>
    <div class="h-box-row h-flex-auto h-box_xmzc__content">
      <div class="h-box-row h-flex-auto h-box_xmzc__desc">
        <div class="h-box-column h-box_xmzc__desc_item">
          <span>{{data.name}}</span>
          <span class="h-box_xmzc__dw">({{data.type}})</span>
        </div>
        <div class="h-box-column h-box_xmzc__desc_item">
          <span class="h-box_xmzc__value">{{data.ncs}}</span>
          <span class="h-box_xmzc__label">年初预算数</span>
        </div>
        <div class="h-box-column h-box_xmzc__desc_item">
          <span class="h-box_xmzc__value">{{data.bnljs}}</span>
          <span class="h-box_xmzc__label">本年累计值</span>
        </div>
        <div class="h-box-column h-box_xmzc__desc_item">
          <span class="h-box_xmzc__value" :class="[{'h-c-green': data.wcl>50, 'h-c-red': data.wcl<50}]">{{data.wcl}}%</span>
          <span class="h-box_xmzc__label">完成率</span>
        </div>
        <div class="h-box-column h-box_xmzc__desc_item">
          <span class="h-box_xmzc__value" :class="[{'h-c-green': data.ljtb>0, 'h-c-red': data.ljtb<0}]">{{data.ljtb}}%</span>
          <span class="h-box_xmzc__label">累计同比</span>
        </div>
      </div>
      <div class="h-box-column h-flex-auto h-box_xmzc__circle">
        <div class="h-box_circle" ref="pieChart"></div>
        <div class="h-box_circle_title">完成率</div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  /**
   * 严控费用--项目支出
   */
  export default {
    name: 'xmzc-app',
    props: {
      title: {
        type: String,
        required: true
      },
      data: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        pieValue: this.data.pieData
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.renderChart()
      })
    },
    watch: {
      data () {
        this.renderChart()
      }
    },
    methods: {
      renderChart () {
        var self = this
        var $dom = $(self.$refs.pieChart)
        var chart = this.$echarts.init($dom.get(0))
        var value = self.pieValue
        if (isNaN(value)) {
          value = '0.00'
        }
        var valueBlank = (100 - Number(value))
        var valueStr = value + '%'
        var valueBlankStr = valueBlank + '%'
        var colorObj = {
          'red': '#ea4d4d',
          'green': '#21e6b6'
        }
        var mycolor = colorObj['green']
        mycolor = value > 50 ? mycolor : colorObj['red']
        var option = {
          color: [mycolor, '#6a7f99'],
          title: {
            text: valueStr,   // 设置环比图中间标题
            left: 'center',
            y: '30%',
            textStyle: {
              color: mycolor,
              fontFamily: '微软雅黑',
              fontSize: 26,
              fontWeight: 'bolder'
            }
          },
          series: [
            {
              name: '比率',
              type: 'pie',
              center: ['50%', '40%'], // 设置环比图的上下左右的位置
              radius: ['50%', '80%'], // 设置环比图的图形大小
              hoverAnimation: false,
              silent: true,
              itemStyle: {
                normal: {
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                }
              },
              data: [
                {value: value, name: valueStr},
                {value: valueBlank, name: valueBlankStr}
              ]
            }
          ]
        }
        chart.setOption(option)
      }
    }
  }
</script>
<style lang="scss">
.h-box_xmzc{
  height: 100%;
  width: 100%;
}
.h-box_xmzc__content{
  width: 100%;
  height: 100%;
  padding: 0px 0px 20px;
}
.h-box_xmzc__desc{
  width: 80%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border: 1px solid #33668e;
  background: #254766;

  .h-box_xmzc__desc_item{
    align-items: center;
    justify-content: center;
    line-height: 40px;
    &:first-child{
      width: 30%;
      font-size: 26px;
      font-weight: 700;
      color: #d1e9ff;
    }
  }
  .h-box_xmzc__desc_item + .h-box_xmzc__desc_item {
    width: 25%;
  }
  .h-box_xmzc__dw{
    font-size: 20px;
  }
  .h-box_xmzc__value{
    font-size: 26px;
    font-weight: 700;
    color: #ffffff;
    transform: scale(1,1.5);
  }
  .h-box_xmzc__label{
    font-size: 16px;
    color: #92beeb;
  }
}
.h-box_xmzc__circle{
  width: 20%;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  .h-box_circle{
    width: 100%;
    height: 100%;
  }
  .h-box_circle_title{
    position: absolute;
    bottom: 6px;
    color: #ffffff;
  }

}
</style>
