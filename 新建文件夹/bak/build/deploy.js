const fse = require('fs-extra')
const path = require('path')

const source = path.join(__dirname, '..', 'dist')
const target = path.join(__dirname, '..', '..', 'ccf.portal/modules/bbyth')

fse.emptyDir(target).then(function() {
  return fse.copy(source, target)
}).then(function() {
  console.log('success')
}).catch(function(e) {
  console.log('deploy fail')
  console.error(e)
})


