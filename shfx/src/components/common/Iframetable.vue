<template>
  <div class="h-iframe-box h-box-column" :style="{height: height}" >
    <div class="h-iframe-box__item h-box-row h-flex-auto" :style="iframeStyle" :class="iframeClass">
      <iframe :id="id" src=""  frameborder="0"></iframe>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import bbutils from '@/utils/bbutils'
  let iframeid = 'tableiframe'
  export default {
    name: 'tableiframe-app',
    components: {
    },
    props: {
      title: String,
      bbmc: String,
      height: String,
      drillRender: Function, // 穿透事件
      resizePadding: {
        type: [Number, String]
      },
      resizeFixed: {
        type: [Boolean, String],
        default: false
      },
      id: {
        type: String,
        default: function () {
          return iframeid
        }
      },
      queryCondition: {
        type: Object,
        default: {}
      },
      boxStyle: Object,
      titleStyle: Object,
      iframeStyle: Object,
      titleClass: String,
      iframeClass: String
    },
    data () {
      return {
        condition: JSON.parse(JSON.stringify(this.queryCondition)),
        bbCondition: {},
        bbItem: {},
        queryType: '',
        tbid: '',
        tableDom: null,
        resize: {
          resizePadding: 25
        }
      }
    },
    computed: {
      toStyle () {
        return this.mstyle
      }
    },
    mounted () {
      this.$nextTick(function () {
        var tt = $(this.$el).offset().top
        this.resize.resizePadding = tt + 25
        this.$set(this.resize, 'resizePadding', this.resize.resizePadding)
        this.load()
      })
    },
    methods: {
      reload (condition) {
        if (condition) {
          condition['qureyType'] = this.queryType
          condition['tbid'] = this.tbid
          this.bbCondition.tableCondition = bbutils.transferCondition(condition)
        }
        bbutils.refreshIframe(this.bbCondition)
      },
      download (bbmc, params) { // 远程报表工具下载excel
        if (bbmc) {
          bbutils.download(bbmc, params)
        } else {
          bbutils.download(this.bbmc, this.queryCondition)
        }
      },
      load () {
        let _self = this
        bbutils.loadBBItemByBbmc(this.bbmc).then((bbItem) => {
          this.bbItem = bbItem
          this.tableDom = document.querySelector('#' + this.id)
          this.condition['qureyType'] = bbItem['bglx']
          this.condition['tbid'] = bbItem['tbid']
          this.queryType = bbItem['bglx']
          this.tbid = bbItem['tbid']
          this.bbCondition = {
            tableCondition: bbutils.transferCondition(this.condition),
            iframeAddr: bbItem['serverip'],
            iframeContainer: this.tableDom,
            id: 'receiver-content-' + this.id
          }
          bbutils.buildIframe(this.bbCondition)
          this.resizeIframe(this.tableDom, this.resize.resizePadding, this.resizeFixed)
          if (this.drillRender) {
            window.onmessage = function (event) {
              if (event.origin === _self.bbItem['serverip']) {
                var colItem = JSON.parse(event.data)
                _self.drillRender.call(this, colItem)
              }
            }
          }
        })
      }
    }
  }
</script>
<style>
  .h-iframe-box{
    height: 100%;
    min-height: 300px;
    /*background: #1c3147;*/
  }
  .h-iframe-box .h-iframe-box__title{
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 15px;
  }
  .h-iframe-box .h-iframe-box__item{
    height: 100%;
  }
</style>
<!-- demo:
<h-iframe-table ref="xmmxTable" title="月度预算执行" resizeFixed="false"-->
                <!--:resizePadding="resize.resizePadding"-->
                <!--id="detail-iframe"-->
                <!--:bbmc="bbmc"-->
                <!--:queryCondition="tableQueryCondition"-->
<!--&gt;</h-iframe-table>-->
