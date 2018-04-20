// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
     // assetsPublicPath: 'ccf.portal/modules/ykqk/',
   assetsPublicPath: '/fengxian/', // html页面中引用js的路径 前缀
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 9999,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/apis': 'http://127.0.0.1:9999',
      '/ecp3.portal': 'http://127.0.0.1:9081',
      '/ecp3.core': 'http://127.0.0.1:9081',
      // '/ccf.icon': 'http://127.0.0.1:8888'
    },
    cssSourceMap: false
  }
}
