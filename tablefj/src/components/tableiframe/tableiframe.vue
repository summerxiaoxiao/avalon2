<template>
  <div class="h-iframe-box h-box-column" :style="{height: height}" >
    <div class="h-iframe-box__title" :style="titleStyle" :class="titleClass" v-show="isTitle" >{{title}}</div>
    <div class="h-iframe-box__item h-box-row h-flex-auto" :style="iframeStyle" :class="iframeClass">
      <iframe :id="id" src=""  frameborder="0"></iframe>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import _ from 'lodash'
  import bbutils from '@/utils/bbutils'
  let iframeid = 'mtableiframe'
  export default {
    name: 'tableiframe',
    components: {
    },
    props: {
      title: String,
      bbmc: String,
      height: String,
      cellCallback: Function, // 单元格渲染事件
      drillRender: Function, // 穿透事件
      isTitle: {
        type: [Boolean, String],
        default: function () {
          return true
        }
      },
      topFixed: {
        type: [Boolean, String],
        default: function () {
          return true
        }
      },
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
          resizePadding: this.resizePadding
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
        if (this.topFixed === true) {
          var tt = $(this.$el).offset().top
          this.resize.resizePadding = tt + 25
          this.$set(this.resize, 'resizePadding', this.resize.resizePadding)
        }
        this.load()
      })
    },
    methods: {
      reload (condition) {
        if (condition) {
          var mcondition = _.cloneDeep(condition)
          mcondition['qureyType'] = this.queryType
          mcondition['tbid'] = this.tbid
          this.bbCondition.tableCondition = bbutils.transferCondition(mcondition)
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
          if (this.cellCallback) {
            this.bbCondition.cellCallback = this.cellCallback
          }
          // this.bbCondition.cellCallback = function (cell, cellData, rowData, rowIndex, colIndex, colMap, $obj) {
          //   if (colIndex === 1) {
          //     $(cell).addClass('tdHover')
          //   }
          // }
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
    min-height: 100px;
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
