<template>
  <div class="h-ztables-box" ref="content_table" >
  </div>
</template>
<script>
  import $ from 'jquery'
  import _ from 'lodash'
  import 'script-loader!@/../static/lib/jquery.table2excel.js'
  import bbutils from '@/utils/bbutils'

  export default {
    name: 'h-ztables',
    props: {
      bbmc: String,
      queryParams: {
        type: Object,
        default: function () {
          return {}
        }
      },
      bbmc2: String, //  合并两个报表的表头
      queryParams2: {
        type: Object,
        default: function () {
          return {}
        }
      },
      unionKeys: Array, // 两表关联的key值集合
      onClick: Function, // 点击事件
      postMessage: Function, // 双击事件
      cellCallback: Function // 渲染单元格事件
    },
    data () {
      return {
        config: {
          bbmc: this.bbmc,
          bbmc2: this.bbmc2,
          queryParams: this.queryParams,
          queryParams2: this.queryParams2,
          unionKeys: this.unionKeys
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.reloadTable()
      })
    },
    methods: {
      reload (config) {
        this.$set(this.config, 'queryParams', config.queryParams)
        this.$set(this.config, 'queryParams2', config.queryParams2)
        this.$set(this.config, 'unionKeys', config.unionKeys)
        this.reloadTable()
      },
      downloadLocal (filename) { // 本地table导出excel
        filename = filename || 'excel'
        this.$tableEl && this.$tableEl.table2excel({
          exclude: '.noExl',
          name: filename,
          filename: filename,
          exclude_img: true,
          exclude_links: true,
          exclude_inputs: true
        })
      },
      download (bbmc, params) { // 远程报表工具接口导出
        if (bbmc) {
          bbutils.download(bbmc, params)
        } else {
          bbutils.download(this.bbmc, this.config.queryParams)
          if (this.bbmc2) {
            bbutils.download(this.bbmc2, this.config.queryParams2)
          }
        }
      },
      reloadTable () {
        let _self = this
        let config = this.config
        if (config.bbmc) {
          _self.getTableData(config).then((data, format) => {
            _self.renderTable(data, _self.formatOptions)
          })
        }
      },
      renderTable (res, format) {
        this.$tableEl && this.$tableEl.zTable('destroy')
        this.$tableEl = $(this.$refs.content_table)
        let options = {
          data: res,
          format: format,
          tableOpts: {
            height: this.$tableEl.height(),
            scrollY: this.$tableEl.height(),
            scrollClass: 'greenScroll',
            paging: true,
            pageLength: 500,
            isTotal: true,
            isUserDefinedCt: true
          }
          // postMessage: this.postMessage
        }
        if (this.postMessage) {
          options.postMessage = this.postMessage
        }
        if (this.onClick) {
          options.onClick = this.onClick
        }
        if (this.cellCallback) {
          options.cellCallback = this.cellCallback
        }
        this.$tableEl.zTable(options)
      },
      getTableData (config) {
        let _self = this
        return new Promise((resolve, reject) => {
          _self.loadData(config.bbmc, config.queryParams).then((result) => {
            var res = JSON.parse(JSON.stringify(result))
            if (_self.bbmc2) {
              _self.loadData(config.bbmc2, config.queryParams2).then((result2) => {
                var headers = result.headers.concat(result2.headers) // 合并两个报表的表头
                res['headers'] = headers
                var datas = []
                for (var i = 0; i < result.datas.length; i++) {
                  var item = result.datas[i]
                  for (var j = 0; j < result2.datas.length; j++) {
                    var item2 = result2.datas[j]
                    if (config.unionKeys && config.unionKeys.length > 0) {
                      let isunion = false
                      for (var k = 0; k < config.unionKeys.length; k++) { // 两表关联的key
                        if (item[config.unionKeys[k]] !== item2[config.unionKeys[k]]) {
                          isunion = false
                          break
                        } else {
                          isunion = true
                        }
                      }
                      if (isunion) {
                        for (var key in item2) { // 合并行数据
                          item[key] = item2[key]
                        }
                      }
                    } else {
                      for (var kk in item2) { // 合并行数据
                        item[kk] = item2[kk]
                      }
                    }
                  }
                  datas.push(item)
                }
                // total data
                var zjdata = _.merge(result.zjdata, result2.zjdata)
                res.zjdata = zjdata
                res.datas = datas

                var formatOptions = _self.getFormat(result.pzTbsxgszs, result2.pzTbsxgszs)
                _self.formatOptions = formatOptions
                resolve(res)
              })
            } else { // bbdata1
              resolve(res)
            }
          })
        })
      },
      getFormat (pzTbsxgszs, pzTbsxgszs2) {
        var formatOpts = {}
        // 需要合并的属性，以第一个result的属性值为主
        var unionArr = ['16010601', '170100', '170101', '170102', '170103',
          '170104', '170105', '170108', '170109', '170110']
        $.each(pzTbsxgszs, function (i, item) {
          if (item.gslxbm === '13' || item.gslxbm === '14' || item.gslxbm === '16') {
          }
          formatOpts[item.gslxbm] = formatOpts[item.gslxbm] || {}
          formatOpts[item.gslxbm][item.gsbm] = JSON.parse(item.gsz)
          if (_.indexOf(unionArr, item.gsbm) > -1) { // 合并属性
            var gsz = formatOpts[item.gslxbm][item.gsbm]
            var cindex = _.findIndex(pzTbsxgszs2, function (o) { return o.gsbm === item.gsbm })
            var gsz2 = JSON.parse(pzTbsxgszs2[cindex].gsz) // 合并总计行的属性值
            formatOpts[item.gslxbm][item.gsbm] = _.merge(gsz, gsz2)
          }
        })
        return formatOpts
      },
      loadData (bbmc, params) { // 查询报表工具的数据
        var pp = JSON.parse(JSON.stringify(params))
        pp.bbmc = bbmc
        return bbutils.loadBBData(pp)
      }
    }
  }
</script>
<style>
  .h-ztables-box{
    width: 100%;
    border:1px solid gainsboro;
    position: relative;
  }
</style>
