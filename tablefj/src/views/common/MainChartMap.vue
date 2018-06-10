<template>
  <div class="h-box-column h-map-box" >
    <div class="h-map_tip">
      <div class="h-map_tip__bg"></div>
      <div class="h-map_tip__label">
        <div class="h-map__label__title">{{title}}</div>
        <div class="h-map__label__date">{{date}}</div>
        <div class="h-map__label__desc">{{zbmc}}</div>
      </div>
    </div>
    <div class="h-map-box_area h-box-row h-flex-auto" >
      <div class="h-map_chart h-flex-auto" ref="chinaMap"></div>
      <div class="h-map_marker h-map_marker__arrow" v-show="!showRange">
          <div class="h-map_marker__bg"></div>
          <div class="h-map_marker__label">
            <div class="h-map_marker__label__title">福建省</div>
            <div class="h-map_marker__label__desc">
              <span class="h-map_marker_circle"></span>
              <span class="">{{zbmc}}</span> :
            </div>
            <div class="h-map_marker__label__value">{{zbvalue}}</div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
  // import $ from 'jquery'
  import {convertData, convertMapJson} from '@/utils/commonutils'
  import Vuex from 'vuex'
  export default {
    name: 'main-chart-map',
    props: {
      title: String,
      date: String,
      zbmc: String,
      zbvalue: [String, Number],
      dwdm: String,
      mapDwdm: String,
      datas: {// 已存在的地图数据，地图区域颜色根据数值动态显示
        type: Array,
        default: function () {
          return []
        }
      },
      roam: { // 是否允许缩放地图
        type: [Boolean, String],
        default: function () {
          return false
        }
      },
      size: {
        type: String,
        default: function () {
          return '125%'
        }
      },
      mapType: {
        type: String,
        default: function () {
          return 'china'
        }
      },
      mapMark: {
        type: [Boolean, String],
        default: function () {
          return true
        }
      },
      showRange: {
        type: [Boolean, String],
        default: function () {
          return false
        }
      }
    },
    computed: {
      ...Vuex.mapState({
        'geoCoordMapData': state => state.app.geoCoordMapData,
        'mapFeaturesData': state => state.app.mapFeaturesData,
        'registerMapData': state => state.app.registerMapData,
        'localType': state => state.app.localType
      })
    },
    data () {
      return {
        isFinish: false,
        config: {
          maxValue: 0,
          mapTitle: this.title,
          currentDwdm: this.dwdm, // 当前单位代码
          mapDwdm: this.mapDwdm
        }
      }
    },
    created () {
    },
    mounted () {
      this.$nextTick(() => {
        this.load()
      })
    },
    methods: {
      load () {
        this.$store.dispatch('app/loadMap', {mapType: this.mapType, mapMark: this.mapMark}).then(() => {
          // 注册map
          this.$echarts.registerMap(this.localType, this.registerMapData) // 全国地图数据
          if (this.$refs.chinaMap) {
            this.renderMap()// 渲染map
          }
        })
      },
      renderMap () {
        var _self = this
        var geoCoordMap = this.geoCoordMapData
        var existData = [ // 地图上需要显示坐标的数据
          {
            'id': this.config.currentDwdm,
            'name': this.config.mapTitle,
            'value': this.zbvalue
          }
        ]
        var localType = this.localType
        var allData = convertData(geoCoordMap, existData, this.config.currentDwdm) // 转换坐标数据，
        // 当前坐标
        var currentData = allData.currentData
        var mydata = allData.data

        var defaultObj = convertMapJson(this.mapFeaturesData, this.datas, this.config.currentDwdm) // 显示地图用的基础数据
        var defaultData = defaultObj.data
        this.config.maxValue = defaultObj.maxValue
        this.$set(this.config, 'maxValue', defaultObj.maxValue)
        // currentData = [{"id":"2102","name":"国网福建省电力公司","coord":[119.313409,26.111851],"value":"12536"}];

        var option = {
          title: {
            show: false
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: '#182e41',
            borderColor: '#34678f',
            borderRadius: '5',
            borderWidth: 1,
            padding: [5, 50, 10, 10],
            textStyle: {
              fontSize: 16
            },
            formatter: function (item) {
              var res = []
              if (!_self.mapMark) {
                console.log(item)
                res.push('<div style="text-align:left;">')
                res.push(item.name + '<br/>')
                // res.push(item.marker)
              }
              return res.join('')
            }
          },
          dataRange: {
            show: this.showRange,
            orient: 'vertical',
            x: 'right',
            y: 'bottom',
            itemWidth: 7,
            itemHeight: 80,
            padding: [15, 35, 15, 15],
            color: ['#74cff1', '#3c90d1'],
            text: ['高', '低'],           // 文本，默认为数值文本
            textStyle: {
              color: '#fff'          // 值域文字颜色
            },
            splitNumber: 0,
            precision: 2,  // 显示精度位数
            calculable: true
          },
          roamController: {
            show: true,
            x: 'right',
            mapTypeControl: {
              'china': true
            }
          },
          series: [{ // 中国地图，没有背景色
            type: 'map',
            mapType: localType,
            roam: this.roam, // 地图缩放
            showLegendSymbol: false,
            zoom: 0.9,
            layoutCenter: ['42%', '50%'],
            layoutSize: this.size,
            selectedMode: 'single',
            label: {
              normal: {
                show: false,
                textStyle: {
                  color: '#fff',
                  fontSize: 10
                }
              },
              emphasis: {
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              }
            },
            itemStyle: { // 地图区块设置
              normal: {
                label: {show: true},
                areaColor: 'rgba(74,145,194,1)', // '#4a91c2',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                borderColor: '#fff', // 地图边框
                shadowColor: 'rgba(0, 0, 0, 0.2)'
              },
              emphasis: { //  鼠标选中样式
                label: {show: true},
                areaColor: 'rgba(74,145,194,1)',  // '#4a91c2',
                borderWidth: 2,
                borderColor: '#fff'
              }
            }
          }
          ]// series
        }
        if (!this.mapMark) { // 普通地图
          let mapData = convertMapJson(this.mapFeaturesData, this.datas, this.config.mapDwdm).data
          option.series[0].data = mapData
        } else { // 地图标
          option.series[0].markPoint = { // 所有标注数据
            symbol: 'circle',
            symbolSize: 8,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                label: {show: false},
                areaColor: '#3fc6b0',
                color: '#3fc6b0'  // 会设置点和线的颜色，所以需要下面定制 line
              },
              emphasis: {
                label: {show: true},
                areaColor: '#3fc6b0',
                color: '#3fc6b0',
                shadowBlur: 20,
                shadowColor: '#3fc6b0',
                borderColor: '#3fc6b0', // 区域边框颜色
                borderWidth: 10
              }
            },
            data: mydata
          }
          option.series.push({  //  当前标注数据
            type: 'map',
            mapType: localType,
            markPoint: { // 当前坐标设置
              // symbol: 'image://ccf.portal/images/point.png',
              symbol: 'pin',
              symbolSize: 50,
              itemStyle: {
                normal: {
                  color: '#ff706e',  // 会设置点和线的颜色，所以需要下面定制 line
                  label: {show: false},
                  textStyle: {
                    color: '#363636',
                    fontSize: 4
                  }
                },
                emphasis: {
                  color: '#ff706e',
                  shadowBlur: 20,
                  shadowColor: '#ff706e',
                  borderColor: '#ff706e', //  区域边框颜色
                  borderWidth: 10
                }
              },
              data: currentData
            },
            data: defaultData
          })
        }
        // this.$refs.chinaMap
        var chart = this.$echarts.init(this.$refs.chinaMap)
        chart.setOption(option)
      }
    }
  }
</script>
<style lang="scss">
  .h-map-box {
    position: relative;
    width: 100%;
    height: 100%;
    .h-map-box_area {
      height: 100%;
      width: 100%;
      position: relative;

      .h-map_chart {
        height: 100%;
        width: 100%;
      }
      .h-map_marker{
        position: absolute;
        width: 30%;
        height: 20%;
        max-width: 200px;
        min-width: 160px;
        min-height: 120px;
        padding: 10px;
        z-index: 999;
        right: 30px;
        bottom: 80px;
      }
      @media screen and (max-width: 1200px) {
        .h-map_marker{
          bottom: 20px;
        }
        .h-map_marker__arrow{
          &::before{
            transform: rotate(90deg);
            margin-top: 0px!important;
            top: -2.2%!important;
            left: 35%!important;;
          }
          &::after{
            transform: rotate(90deg);
            margin-top: 1px!important;
            top: -2%!important;;
            left: 35%!important;;
          }
        }
      }
      .h-map_marker__arrow {
        &::before {
          top: 52%;
          content: "";
          position: absolute;
          margin-top: -23px;
          width: 0px;
          height: 18px;
          border-color: rgba(194, 225, 245, 0);
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-right: 10px solid #306189;
          left: 1px;
          z-index: 99999;
        }
        &::after {
          top: 50%;
          margin-top: -20px;
          content: '';
          position: absolute;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-right: 10px solid #182e41;
          left: 1px;
          z-index: 999999;
        }
        .h-map_marker__bg{
          position: absolute;
          width: 100%;
          height: 100%;
          background: #182e41;
          /* opacity: 0.3; */
          border: 1px solid #34678f;
          border-radius: 5px;
        }
        .h-map_marker__label{
          position: absolute;
          font-size: 18px;
          padding: 10px 15px;
          width: 100%;
          /*height: 100%;*/
          color: #fff;
          div{
            line-height: 30px;
          }
          .h-map_marker__label__title{
            font-weight: 800;
            font-size: 20px;
          }
          .h-map_marker__label__desc{
            margin-top: 10px;
            .h-map_marker_circle{
              display: inline-block;
              margin-right: 5px;
              border-radius: 10px;
              width: 9px;
              height: 9px;
              background-color: #e47f8a;
            }
          }
          .h-map_marker__label__value{
            margin-left: 20px;
          }
        }
      }
    }
    .h-map_tip {
      position: absolute;
      width: 30%;
      min-width: 240px;
      height: 100px;
      /*padding: 15px;*/
      z-index: 999;

      .h-map_tip__bg{
        position: absolute;
        width: 100%;
        height: 100%;
        background: #111;
        opacity: 0.3;
      }
      .h-map_tip__label{
        position: absolute;
        /*height: 100%;*/
        width: 100%;
        font-size: 18px;
        font-family: "Open Sans", Arial, sans-serif;
        padding:5px 10px 10px 10px;
        div{
          display: block;
        }
        .h-map__label__title,
        .h-map__label__date,
        .h-map__label__desc{
          line-height: 30px;
        }
        .h-map__label__title{
          color: #fff;
          font-weight: 800;
          font-size: 20px;
        }
        .h-map__label__date,
        .h-map__label__desc{
          color: #95c0e8; // #6c9fcf; //#95c0e8
        }
      }
    }
  }
</style>
