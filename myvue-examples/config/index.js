// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
     assetsPublicPath: 'ccf.portal/modules/app/',
//    assetsPublicPath: '/app/dist/', // html页面中引用js的路径 前缀
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
      '/api': 'http://10.121.55.8:8888',
      '/ccf.portal': 'http://10.121.55.8:8888',
      '/ccf.core': 'http://10.121.55.8:8888',
      '/ccf.icon': 'http://10.121.55.8:8888'
      // '/api': {
      //   target: 'http://10.121.55.5:8990',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': '/api'
      //   }
      // },
      // '/ccf.portal': {
      //   target: 'http://10.121.55.5:8990',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/ccf.portal': '/ccf.portal'
      //   }
      // },
      // '/ccf.core': {
      //   target: 'http://10.121.55.5:8990',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/ccf.core': '/ccf.core'
      //   }
      // },
      // '/ccf.icon': {
      //   target: 'http://10.121.55.5:8990',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/ccf.icon': '/ccf.icon'
      //   }
      // }
    },
    cssSourceMap: false
  }
}
