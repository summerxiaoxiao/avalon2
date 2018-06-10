<template>
  <div class="h-box-row h-list-box">
    <div class="h-box-column h-list-box__align">
      <span>{{name}}</span>
      <span class="h-list-box__dw">({{dw}})</span>
    </div>
    <div class="h-box-column h-list-box__align">
      <span class="h-list-box__value">{{ncs}}</span>
      <span class="h-list-box__label">年初预算数</span>
    </div>
    <div class="h-box-column h-list-box__align">
      <span class="h-list-box__value">{{bnljs}}</span>
      <span class="h-list-box__label">本年累计数</span>
    </div>
    <div class="h-box-column h-list-box__align h-list-box__bfb">
      <span class="h-list-box__value h-c-green">{{wcl}}%</span>
      <span class="h-list-box__label">完成率</span>
    </div>
    <div class="h-box-column h-list-box__align h-list-box__bfb">
      <span class="h-list-box__value h-c-red">{{ljtb}}%</span>
      <span class="h-list-box__label">累计同比</span>
    </div>
  </div>
</template>
<script>
 export default {
   name: 'list-item-app',
   props: {
     name: [String, Number],
     dw: [String, Number],
     ncs: [String, Number],
     bnljs: [String, Number],
     wcl: [String, Number],
     ljtb: [String, Number]
   },
   data () {
     return {

     }
   },
   mounted () {
     this.$nextTick(() => {
       console.log('.....item..')
     })
   },
   methods: {
   }
 }
</script>
<style lang="scss">
  .h-list-box{
    /*width: 100%;*/
    /*height: 100%;*/
  }
  .h-list-box__bfb{
    width: 15%!important;
  }
  .h-list-box__align{
    align-items: center;
    align-content: center;
    padding-bottom: 5px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, Arial, sans-serif;
    span{
      line-height: 32px;
    }
    &:first-child{
      width: 28%;
      font-size: 24px;
      font-weight: 800;
    }
    & + & {
      width: 20%;
    }

    .h-list-box__value{
      font-size: 24px;
      /*font-weight: bold;*/
      color: #fff;
      transform: scale(1, 1.5);
    }
    .h-list-box__label{
      font-size: 16px;
      color: #95c0e8;
      /*transform: scale(1,1.08);*/
    }

    .h-c-green{
      color: #21e6b6;
    }
    .h-c-red{
      color: #ea4d4d;
    }
    .h-list-box__dw{
      font-size: 18px;
    }
  }
</style>
