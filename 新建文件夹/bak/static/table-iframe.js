/* eslint-disable no-undef */

requirejs([
  '/ccf.core/scripts/ccfcore.js'
], function () {
  requirejs(['jquery', 'vue', 'underscore', 'datatables_responsive'], function ($, Vue) {
    requirejs(['/realReport.js', '/ccf.portal/plugins/component/zTable/zTable.js'], function (realReport) {
      function getParams () {
        var url = location.href
        var index = url.indexOf('?')
        var paramsObj = {}
        if (index === -1) return
        var str = url.slice(index + 1)
        var strArr = str.split('&')
        for (var i in strArr) {
          var temp = strArr[i].split('=')
          paramsObj[temp[0]] = temp[1]
        }
        return paramsObj
      }

      function fetchData (params) {
        return realReport.request('/api/pzTb/getTableInfo', params)
      }

      function init () {
        var params = getParams()
        var condition = {}
        try {
          condition = JSON.parse(decodeURIComponent(params.initIframeObject))
        } catch (e) {
        }

        var tableConfig = {}
        if (params.tableConfig) {
          try {
            tableConfig = JSON.parse(decodeURIComponent(params.tableConfig))
          } catch (e) {
          }
        }

        var vm
        var $app = $('#app')

        fetchData(condition).then(function (resp) {
          var format = {}
          ;(resp.pzTbsxgszs || []).forEach(row => {
            let value
            try {
              value = JSON.parse(row.gsz)
            } catch (e) {
              value = row.gsz
            }
            if (!format[row.gslxbm]) {
              format[row.gslxbm] = {}
            }
            format[row.gslxbm][row.gsbm] = value
          })

          vm = realReport.createVisual($app, {
            type: 1,
            data: resp,
            format: format,
            defaultFormat: {17: {}}
          })

          vm.$on('fetchData', function (params) {
            condition = $.extend(condition, params)
            fetchData(condition).then(function (resp) {
              vm.data = resp
            })
          })

          vm.$on('postMessage', function (params) {
            console.log(params)
          })

          window.onmessage = function (event) {
            if (event.source !== window.parent) return
            var message = event.data
            var params = (JSON.parse(message))
            condition = $.extend(condition, params)
            fetchData(condition).then(function (resp) {
              vm.data = resp
            })
          }
        })
      }

      init()
    })
  })
})
