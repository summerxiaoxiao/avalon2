<template>
  <div class="d-flex flex-column h-barchart-right-dwjs">
    <div class="d-flex flex-column h-right-dwjs-label h-right-dwjs-box">
      <div class="d-flex flex-row h-right-dwjs-title-top">
        <span class="h-right-dwjs-title h-right-color">财务人员总数</span>
        <span class="h-right-dwjs-title-value h-right-color">230</span>
      </div>
      <div class="d-flex flex-row h-right-dwjs-split">
        <div class="h-right-dwjs-split-item"></div>
      </div>
      <div class="d-flex flex-row h-right-dwjs-title-bottom">
        <span class="h-right-dwjs-title h-right-color2">高端人才总数</span>
        <span class="h-right-dwjs-title-value h-right-color2">200</span>
      </div>
      <div class="d-flex flex-row justify-content-end h-right-dwjs-content">
        <div class="d-flex flex-row h-rigt-dwjs-image">
          <div class="d-flex flex-column h-right-dwjs-img">
            <div class="d-flex flex-column h-right-color2 ">其中:</div>
            <img :src="myimg" alt="">
          </div>
        </div>
        <div class="d-flex flex-row h-right-dwjs-labelbox">
          <div class="d-flex flex-column align-items-end justify-content-center">
            <span class="label">&nbsp;</span>
            <span>中级职称:</span>
            <span>注会:</span>
            <span>研究生:</span>
            <span>注会 & 研究生:</span>
            <span>注会 & 中级职称:</span>
            <span>中级职称 & 研究生:</span>
            <span>注会 & 研究生 & 中级职称:</span>
          </div>
          <div class="d-flex flex-column h-right-dwjs-valuebox">
            <span class="label">人数</span>
            <span class="value">122</span>
            <span class="value">122</span>
            <span class="value">122</span>
            <span class="value">122</span>
            <span class="value">122</span>
            <span class="value">122</span>
            <span class="value">122</span>
          </div>
          <div class="d-flex flex-column h-right-dwjs-valuebox">
            <span class="label">占比</span>
            <span class="value">61</span>
            <span class="value">61</span>
            <span class="value">61</span>
            <span class="value">61</span>
            <span class="value">61</span>
            <span class="value">61</span>
            <span class="value">61</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import circleimg from '@/assets/images/qmys/4.jpg'
  // 发展能力 队伍建设，财会队伍
  export default {
    name: 'fznl-djjgxx',
    props: {
    },
    data () {
      return {
        myimg: circleimg
      }
    },
    mounted () {
      this.$nextTick(() => {
      })
    },
    methods: {
    }
  }
</script>
<style lang="scss">
  .h-barchart-right-dwjs {
    /*width: 100%;*/
    height: 100%;
    background: #002f56;
    padding: 20px 20px;

    .h-right-dwjs-title{
      font-size: 16px;
      padding-left: 10px;
    }
    .h-right-dwjs-title-value{
      font-size: 16px;
      padding-left: 20px;
      transform: scale(1, 1.3);
    }
    .h-right-dwjs-split{
      width: 100%;
      height: 25px;
      align-items: center;
      .h-right-dwjs-split-item{
        width: 100%;
        height:1px;
        background: #477eba;
      }
    }
    .h-right-dwjs-labelbox{
      line-height: 25px;
      color: #a7b6c6;
    }
    .h-right-dwjs-content{
      width: 100%;
      padding-top: 10px;
      position: relative;
    }
    .h-rigt-dwjs-image{
      position: absolute;
      left: 0px;
      width: 50%;
      height: 80%;
      img{
        position: relative;
        width: 90%;
      }
      .h-right-dwjs-img > div{
        padding-left: 10px;
      }
    }
    .h-right-dwjs-valuebox{
      padding-left: 12px;
      align-items: center;
      justify-content: center;
      .label{
        color: #486f95;
      }
      .value{
        color: #a7b6c6;
        transform: scale(1, 1.3);
      }
    }
    .h-right-dwjs-title-top{
      .h-right-color {
        color: #4d769d;
      }
    }
    .h-right-color2 {
      color: #657a90;
    }
  }
</style>
