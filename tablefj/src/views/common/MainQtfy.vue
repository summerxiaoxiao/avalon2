<template>
  <div class="h-box-column h-flex-auto h-box_qtfy">
    <div class="h-main__title ">
      <p class="h-title">{{title}}</p>
    </div>
    <div class="h-box-row h-flex-auto h-box_qtfy__content">
      <div class="h-box-column h-flex-auto h-box_qtfy__left">
        <div class="h-box-column h-flex-auto h-box_qtfy__box_item">
          <div class="h-box-row h-box_qtfy_title">
            <span class="h-box_qtfy_line_green"></span>
            <span>可控费用</span>
          </div>
          <div class="h-box-row h-box_qtfy_item">
            <div class="h-box-column h-box_qtfy_item__item">
              <span class="h-box_left_value h-value-green">{{config.kkfyData.yss}}</span>
              <span class="h-box_left_label">预算数</span>
            </div>
            <div class="h-box-column h-box_qtfy_item__item">
              <span class="h-box_left_value h-value-green">{{config.kkfyData.hss}}</span>
              <span class="h-box_left_label">核算数</span>
            </div>
            <div class="h-box-column h-box_qtfy_item__item">
              <span class="h-box_left_value h-value-green">{{config.kkfyData.wcl}}%</span>
              <span class="h-box_left_label">完成率</span>
            </div>
          </div>
        </div>
      </div>
      <div class="h-box-row h-flex-auto h-box_qtfy__middle">
          <div class="h-box-column h-box_middle_left">
            <span class="h-box_middle_value h-box_qtfy_green">95%</span>
            <span class="h-box_middle_label">可控费用</span>
          </div>
          <div class="h-box_middle_circle" ref="mycircle"></div>
         <div class="h-box-column h-box_middle_right">
           <span class="h-box_middle_value h-box_qtfy_blue">95%</span>
           <span class="h-box_middle_label">非可控费用</span>
         </div>
      </div>
      <div class="h-box-column h-flex-auto h-box_qtfy__right">
        <div class="h-box-column h-flex-auto h-box_qtfy__box_item">
          <div class="h-box-row h-box_qtfy_title">
            <span class="h-box_qtfy_line_blue"></span>
            <span>非可控费用</span>
          </div>
          <div class="h-box-row h-box_qtfy_item">
            <div class="h-box-column h-box_qtfy_item__item">
              <span class="h-box_left_value h-value-blue">{{config.fkkfyData.yss}}</span>
              <span class="h-box_left_label">预算数</span>
            </div>
            <div class="h-box-column h-box_qtfy_item__item">
              <span class="h-box_left_value h-value-blue">{{config.fkkfyData.hss}}</span>
              <span class="h-box_left_label">核算数</span>
            </div>
            <div class="h-box-column h-box_qtfy_item__item">
              <span class="h-box_left_value h-value-blue">{{config.fkkfyData.wcl}}%</span>
              <span class="h-box_left_label">完成率</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  /**
   *其他运营费用
   */
  export default {
    name: 'hqtfy-app',
    props: {
      title: {
        type: String,
        required: true
      },
      data: {
        type: Array
      }
    },
    data () {
      return {
        colors: ['#4fa589', '#328adf'],
        config: {
          pieData: [], // 圆图
          kkfyData: {}, // 可控费用
          fkkfyData: {} // 非可控费用
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.toData()
        this.renderChart()
      })
    },
    methods: {
      toData () {
        var pieData = []
        for (var i = 0; i < this.data.length; i++) {
          var item = this.data[i]
          pieData.push({
            value: item.value,
            name: item.name
          })
          if (item.name === '可控费用') {
            this.config.kkfyData = item
          } else if (item.name === '非可控费用') { // 非可控费用
            this.config.fkkfyData = item
          }
        }
        this.config.pieData = pieData
      },
      renderChart () {
        var self = this
        var $dom = $(self.$refs.mycircle)
        var chart = this.$echarts.init($dom.get(0))
        var option = {
          color: self.colors,
          tooltip: {
            trigger: 'item',
            position: 'right',
            formatter: '{b} : {c} ({d}%)'
          },
          series: [
            {
              // name:'结果分析',
              type: 'pie',
              selectedMode: 'single',
              center: ['50%', '50%'], // 设置环比图的上下左右的位置
              radius: [0, '85%'],
              label: {
                normal: {
                  position: 'inner',
                  formatter: function (params) { // 饼图显示百分比
                    return ''
                  },
                  textStyle: {
                  }
                },
                emphasis: {
                  position: 'inner',
                  formatter: function (params) { // 饼图显示百分比
                    // return (params.percent - 0).toFixed(2) + '%' ;
                    return ''
                  },
                  textStyle: {
                  }
                }
              },
              data: self.config.pieData
            }
          ]
        }
        chart.setOption(option)
      }
    }
  }
</script>
<style lang="scss">
.h-box_qtfy{
  /*height: 100%;*/
  width: 100%;

  .h-box_qtfy__content{
    width: 100%;
    /*height: 100%;*/
    padding: 0px 0px 20px;
  }
  .h-box_qtfy__middle
  {
    width: 30%;
    /*height: 100%;*/
    padding-top: 20px;
    align-items: center;
    justify-content: center;
  }
  .h-box_qtfy__left,
  .h-box_qtfy__right{
      width: 25%;
      padding: 70px 30px 40px 40px;
  }
.h-box_qtfy__box_item{
  border: 1px solid #33668e;
  background: #254766;
  width: 100%;
  /*height: 100%;*/
}

.h-box_qtfy__middle{

  .h-box_middle_value{
    font-size: 40px;
    transform: scale(1, 1.5);
  }
  .h-box_middle_label{
    font-size: 20px;
    color: #ffffff;
  }
  .h-box_middle_right,
  .h-box_middle_left{
    width: 25%;
    /*height: 100%;*/
    line-height: 50px;
    align-items: center;
    justify-content: center;
  }

  .h-box_middle_circle{
    height: 100%;
    width: 45%;
    line-height: 40px;
    align-items: center;
    justify-content: center;
  }
}
.h-box_qtfy_title{
  font-size: 20px;
  font-weight: 700;
  line-height: 70px;
  align-items: center;
  color: #cce5fc;
  .h-box_qtfy_line_green{
    border-left: 4px solid #1fe7bb;
    height: 20px;
    padding-right: 12px;
  }
  .h-box_qtfy_line_blue{
    border-left: 4px solid #328adf;
    height: 20px;
    padding-right: 12px;
  }
}
.h-box_qtfy_item{
  align-items: center;
  justify-content: center;
  padding: 30px 0px;

  .h-box_qtfy_item__item{
    width: 30%;
    line-height: 35px;
    align-items: center;
    justify-content: center;
  }
  .h-box_left_value{
    font-size: 30px;
    transform: scale(1,1.5);
  }
  .h-box_left_label{
    font-size: 17px;
    color: #94beeb;
  }

  .h-value-green{
    color: #1ee7b8;
  }
  .h-value-blue{
    color: #5fabf1;
  }

}

.h-box_qtfy_green{
  color:#20e9ba;
}
.h-box_qtfy_blue{
  color: #3589df;
}

}

</style>
