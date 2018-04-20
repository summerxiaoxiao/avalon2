window.homepath = ''
require(['/ecp3.core/scripts/ecpcore.js'], function () {
  require(['echarts', 'jquery', 'datetimepicker', 'zTable'], function (echarts) {
      if ($.fn.datetimepicker) {
        window._fengxian_module = {
          isReuqireLoad: true,
          _modulePath: ''
        }
        // 加载登录信息
        loadLoginContext(function(loginContext){
          // 加载报表配置信息
          loadBBconfig(function(bbconfig){
            $('body').data('bbconfig', JSON.stringify(bbconfig))
          })
        })
      }

      function loadLoginContext(callback) {
        var loginContext = {
          'loginOrgId': '13A0Z',
          'loginDwdm': '1301',
          'loginOrgName': '国网上海市电力公司奉贤供电公司',
          'userDisplayName': '董峻赓',
          'userId': '402137529',
          'userName': '23DONGJG',
          'tokenId': '49e76c1e-116f-4f15-8e82-a53a5f0ae20a',
          'dataRole': {
            'full_comp_ids': '13A0Z'
          },
          'roles':['fengxian']
        }
        $('body').data('context', JSON.stringify(loginContext))
        return loginContext
      }

      function loadBBconfig (successFn, errorFn) {
        $.ajax('static/datas/bbmc.json', {
          contentType: 'application/json;charset=utf-8',
          dataType: 'json',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          success: function (result) {
            try {
              result = JSON.parse(result)
            } catch (e) {
            }
            successFn && successFn(result)
          },
          error: function (event) {
            errorFn && errorFn()
          }
        })
      }
  })
})
