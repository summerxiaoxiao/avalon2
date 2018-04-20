const fse = require('fs-extra')
const path = require('path')
const config = require('../config')


// project copy
const source = path.join(__dirname, '..', 'dist')
// const target = path.join(__dirname, '..', '..', 'ccf.portal/modules/mypro')
let target = path.join(__dirname,'..','..',  config.build.assetsPublicPath)
target = 'E:\\workspace\\cxxd-shanghai\\lightapps\\fengxian'

fse.emptyDir(target).then(function() {
  return fse.copy(source, target)
}).then(function() {
  console.log('project deploy success')
}).catch(function(e) {
  console.log('project deploy fail')
  console.error(e)
})
/*

// api copy
const source2 = path.join(__dirname, '..', 'fengxian.lapp')
const target2 = path.join(__dirname, '..', '..', 'E:\\workspace\\ccf\\fengxian.lapp')

fse.emptyDir(target2).then(function() {
  return fse.copy(source2, target2)
}).then(function() {
  console.log('api deploy success')
}).catch(function(e) {
  console.log('api deploy fail')
  console.error(e)
})
*/
