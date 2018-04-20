import axios from 'axios'
import $ from 'jquery'

// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

export function apiAxios (method, url, params, type) {
  if (params) {
    params = filterNull(params)
  }
  type = type || 'json'
  let promise = new Promise(function (resolve, reject) {
    axios({
      method: method,
      url: url,
      responseType: type,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      withCredentials: false, // withCredentials`表明是否跨网站访问协议，// 应该使用证书
      headers: {
        'X-Requested-with': 'XMLHttpRequest',
        'Authorization': window.localStorage.getItem('tokenId'),
        'Content-Type': type !== 'json' ? type + '; charset=UTF-8' : 'application/json; charset=UTF-8'
      }
    }).then(function (res) {
      if (type) {
      }
      if (res.status === 200) {
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch(function (err) {
      console.log(err)
      reject(err)
    })
  })
  return promise
}
export function $postUrl (url, data, successFn, errorFn) {
  var options = {
    contentType: 'application/json;charset=utf-8',
    dataType: 'json',
    data: JSON.stringify(data),
    method: 'POST',
    headers: {
     //  Authorization: CCF.utils.getItem('tokenId'),
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
      if (event.status === 401) {
        $.notific8('会话超时', 'warn')
        setTimeout(function () {
          location.href = '/'
        }, 2000)
      } else {
        if (event.responseJSON && event.responseJSON.message) {
          $.notific8(event.responseJSON.message, 'warn')
        }
      }
      errorFn && errorFn()
    }
  }
  $.ajax(url, options)
}
// 返回在vue模板中的调用接口
export default {
  get: function (url, params, type) {
    let rootPath = this.config().rootPath
    return apiAxios('GET', rootPath + url, params, type)
  },
  post: function (url, params) {
    let rootPath = this.config().rootPath
    return apiAxios('POST', rootPath + url, params)
  },
  put: function (url, params) {
    let rootPath = this.config().rootPath
    return apiAxios('PUT', rootPath + url, params)
  },
  delete: function (url, params) {
    let rootPath = this.config().rootPath
    return apiAxios('DELETE', rootPath + url, params)
  },
  postUrl: function (iframeAddr, url, params) {
    let bbserver = this.config().bbserver
    return new Promise((resolve, reject) => {
      var myurl = (bbserver || iframeAddr) + url
      $postUrl(myurl, params, (res) => {
        resolve(res)
      }, (error) => {
        reject(error)
      })
    })
  },
  config: function () {
    return {
      rootPath: window._fengxian_module._modulePath || '',
      bbserver: window._fengxian_module.bbserver || ''
    }
  }
}

