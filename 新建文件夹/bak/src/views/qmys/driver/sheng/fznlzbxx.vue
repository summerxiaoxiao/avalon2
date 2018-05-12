<template>
  <div class="d-flex flex-column h-barchart-right">
    <div class="d-flex flex-column h-barchart-right-toptitle align-items-center justify-content-center">
      <div class="d-flex flex-row h-right-toptitle align-items-center justify-content-center">
        <span class="h-right-toptitle__title">购电量</span>
        <span class="h-right-toptitle__icon"><i class="iconfont icon-bangzhu" style="color: #5fbbf5;"></i></span>
      </div>
      <div class="d-flex flex-column h-barchart-right-split"></div>
      <div class="d-flex flex-column">
        <span>2017年10月</span>
      </div>
    </div>
    <div class="d-flex flex-row h-barchart-right-content">
      <div class="d-flex flex-row h-barchart-right-content__item">
        <div class="d-flex flex-column h-barchart-right-content__label">
          <span>内部预算</span>
          <span>累计完成数</span>
        </div>
        <div class="d-flex flex-column h-barchart-right-content__value">
          <span>680</span>
          <span>590</span>
        </div>
      </div>
      <div class="d-flex flex-row h-barchart-right-content__item">
        <div class="d-flex flex-column h-barchart-right-content__label">
          <span>完成率</span>
          <span>累计同比</span>
        </div>
        <div class="d-flex flex-column h-barchart-right-content__value">
          <span class="c-red">88.23%</span>
          <span class="c-red">3%</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // 发展能力指标信息
export default {
    name: 'fznl-zbxx',
    props: {
    },
    data () {
      return {}
    },
    mounted () {
      this.$nextTick(() => {
      })
    },
    methods: {}
}
</script>
<style lang="scss">
  .h-barchart-right {
    width: 100%;
    height: 100%;
    background: #002f56;
    align-items: center;
    padding: 0px 10px;
    .h-barchart-right-toptitle{
      width: 100%;
      align-items: center;
      justify-content: center;
      padding: 30px 0px;
    }
    .h-right-toptitle{
      width: 100%;
      align-items: center;
      justify-content: center;
    }
    .h-right-toptitle__label{
      font-size: 16px;
      font-weight: 800;
    }
    .h-right-toptitle__icon{
      padding-left: 10px;
    }
    .h-barchart-right-split{
      height: 6px;
      background: #00427a;
      width: 100%;
      margin: 10px;
    }
    .h-barchart-right-content{
      width: 100%;
      justify-content: space-around;
      .h-barchart-right-content__item{
        max-width: 100%;
      }
      .h-barchart-right-content__label{
        line-height: 50px;
        color: #a9b5c4;
      }
      .h-barchart-right-content__value{
        line-height: 40px;
        padding-left: 20px;
        padding-top: 10px;
        font-weight: bold;
        transform: scale(1, 1.3);
      }
    }
  }
</style>
