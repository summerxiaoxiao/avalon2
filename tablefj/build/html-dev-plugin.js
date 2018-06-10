function HtmlDevPlugin(options) {
  this.options = options
}

HtmlDevPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin(
      'html-webpack-plugin-before-html-processing', (data, cb) => {
        data.html = '<script data-main="' + this.options.main + '" src="' + this.options.src + '"></script>' + data.html
        cb(null, data)
      })
  })
}

module.exports = HtmlDevPlugin
