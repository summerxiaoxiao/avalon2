// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: 'ccf.portal/modules/bbyth/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    sourceRoot: path.join(__dirname, '..', 'dist'),
    targetRoot: path.join(__dirname, '../../../resources/static/ccf.portal/modules/app')
  },
  dev: {
    env: require('./dev.env'),
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/ccf.portal/modules/app/',
    proxyTable: {
      /*'/rest': 'http://127.0.0.1:8998',
      '/api': 'http://127.0.0.1:8998',
      '/ccf.core': 'http://127.0.0.1:8998',
      '/ccf.icon': 'http://127.0.0.1:8998',
      '/ccf.portal': 'http://127.0.0.1:8998',*/
      '/': {
        target: 'http://127.0.0.1:8998', // 'http://127.0.0.1:8998',  'http://10.121.8.2:8983'
        secure: false,
        bypass: function(req, res, proxyOptions) {
          var url = req.url;
          // console.log('url：' + url);
          var paths = ['/ccf.portal/modules/app/', '/__webpack'];
          for(var i in paths) {
            var path = paths[i];
            var index = url.indexOf(path);
            if (index !== -1) {
              //var a = url.substring(index + path.length);
              //console.log('url:' + a);
              return url;//'/bbyth/'+a;
            }
          }
        }
      }

    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
