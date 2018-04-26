(function($) {
  'use strict';

  var pluginkey = 'ecp3.ui.fengxianBulletin';

  var FengxianBulletin = function (element, option) {
    var me = this;
    this.$element = $(element);
    this.option = option;
    this.callback = option.callback;
    window._fengxian_module = {
      bbserver: window._baseConfig.bbserver,
      isReuqireLoad: true,
      _modulePath: '/fengxian'
    }

    var loginContext = ecp3.core.AppContext.getLoginContext();

    this.appUtils = new AppUtils(pluginkey,this.$element,function(base){
      me.appUtils = base;
      me.loadUser(function(){
        me.init();
      })
    });
  };

  FengxianBulletin.prototype.init = function () {
    var me = this;
    var modulePath = window._fengxian_module._modulePath
    require([modulePath + '/static/js/vendor.js'],function(){
      require(['datetimepicker', 'zTable'],function(){
        me.render();
        me.bindEvent();
      })
    })
  }
  FengxianBulletin.prototype.loadUser = function (callback) {
    var me = this;
    //查询奉贤帐户
    ecp3.core.EcpServiceUtil.postNodeService('MainDataQueryService', 'getFengxianUser',{
      yhmc: ecp3.core.AppContext.getLoginContext().userName,
      tokenId: ecp3.core.AppContext.getLoginContext().tokenId
    }, function(data){
      if(data){
        $('body').data('context', JSON.stringify(data));
        me.loadBBinfo(callback)
      }
    }, function(data){
      $.notific8("未查询到帐户信息!", {theme : "tangerine", heading: '提示', life: 5000});
    });
  }
  FengxianBulletin.prototype.loadBBinfo = function (callback) {
    //查询报表配置信息
    ecp3.core.EcpServiceUtil.postNodeService('MainDataQueryService', 'getBBpzInfo',{
    }, function(data){
      if(data){
        $('body').data('bbconfig', JSON.stringify(data));
        callback && callback();
      }
    }, function(data){
      $.notific8("未查询到报表配置信息!", {theme : "tangerine", heading: '提示', life: 5000});
    });
  }
  FengxianBulletin.prototype.render = function(){
    var me = this;
    this.$element.css({
      position: 'absolute',
      height: '100%',
      width: '100%'
    });
    $(document.body).css("overflow", "scroll");

    var $FengxianBulletin = $('<div id="app"></div>');
    this.$element.find('#app').length === 0 && this.$element.html($FengxianBulletin);
    var modulePath = window._fengxian_module._modulePath
    require([modulePath + '/static/js/app.js'], function () {
      me.vue = $(document).data('app');
      var overflow = $(document.body).data('overflow')
      $(document.body).css("overflow", overflow);
      // 再次返回上一页即可
      // me.vue.$router.go(0)
      //  me.vue.setModulePath('financial-bulletin');
      setTimeout(function () {
        // me.renderVueRouter(me.option.url);
      })
      $("#mask_loading").fadeOut(500, function(){ //不显示node里请求的loading
        $("#mask_loading").remove();
      });
    })
  };

  FengxianBulletin.prototype.renderVueRouter = function(routerUrl){
    var me = this;
    me.vue.routerUrl = routerUrl;
    me.callback && me.callback(me);
  };
  FengxianBulletin.prototype.setOptions = function(opts){
    var me = this;
    // if (me.option.id !== opts.id) {
    //   me.option = opts;
    //   me.renderVueRouter(opts.url);
    // } else {
    //   me.callback && me.callback(me);
    // }
    this.render()
  };
  FengxianBulletin.prototype.bindEvent = function(){
  };

  var old = $.fn.fengxian;

  $.fn.fengxian = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var opts;
    var method, value;
    this.each(function () {
      var $this = $(this);
      var data  = $this.data(pluginkey);

      if (args.length === 0 || typeof(args[0]) === "object") {
        opts = args.length === 0 ? {} : $.extend({}, args[0]);
        opts.element = $(this);
        if (!data)
          $this.data(pluginkey, (data = new FengxianBulletin(this, opts)));
        else {
          data.setOptions(opts);
        }
      } else if (typeof(args[0]) === "string") {
        if (!data)
          return;
        method = args[0];
        value = data[method].apply(data, args.slice(1));
      } else {
        throw "Invalid arguments to FengxianBulletin plugin: " + args;
      }
    });
    return (value) ? value : this;
  };

  $.fn.fengxian.Constructor = FengxianBulletin;

  $.fn.fengxian.noConflict = function () {
    $.fn.fengxian = old;
    return this;
  };
}(jQuery));
