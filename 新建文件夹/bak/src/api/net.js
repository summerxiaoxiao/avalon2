/* globals CCF */

import _ from 'underscore'
import $ from 'jquery'

const requestFailCallbacks = []

export function addRequestFailCallback (callback) {
  if (requestFailCallbacks.indexOf(callback) === -1) {
    requestFailCallbacks.push(callback)
  }
}

export function removeRequestFailCallBack (callback) {
  const index = requestFailCallbacks.indexOf(callback)
  if (index !== -1) {
    requestFailCallbacks.splice(index, 1)
  }
}

function requestFail (args) {
  const results = []
  for (const callback of requestFailCallbacks) {
    results.push(callback(...args))
  }
  return Promise.all(results)
}

export class RequestCancel extends Error {
  constructor (message) {
    super(message)
    this.name = 'RequestCancel'
  }
}

export function request (url, data, options, canCancel) {
  if (typeof options === 'string') {
    options = {
      type: options
    }
  }

  options = Object.assign({
    url: url,
    contentType: 'application/json;charset=utf-8',
    dataType: 'json',
    type: 'POST',
    headers: {
      Authorization: window.localStorage.getItem('tokenId'),
      'Content-Type': 'application/json; charset=UTF-8'
    }
  }, options || {})

  if (options.type === 'POST') {
    options.data = JSON.stringify(data)
  } else {
    options.data = data
  }

  let ajax
  const promise = new Promise(function (resolve, reject) {
    ajax = $.ajax(options).done(function (result) {
      try {
        if (typeof result === 'string') {
          resolve(JSON.parse(result))
        } else {
          resolve(result)
        }
      } catch (e) {
        reject(e)
      }
    }).fail(function (xhr, error) {
      requestFail(arguments).then(() => {
        if (error === 'abort') {
          reject(new RequestCancel())
        } else {
          reject(arguments)
        }
      })
    })
  })
  if (canCancel) {
    return [promise, function () { ajax.abort() }]
  }
  return promise
}

export function onceRequest (fn) {
  let cancel
  return function (...args) {
    if (cancel) {
      cancel()
    }
    let promise
    const requestArgs = fn(...args)
    requestArgs[3] = true;
    [promise, cancel] = request(...requestArgs)
    return promise
  }
}

let loginContext
export function getLoginContext () {
  if (process.env.NODE_ENV !== 'production') {
    return null
  }
  if (_.isUndefined(loginContext)) {
    if (CCF && CCF.utils) {
      const loginContent = CCF.utils.getItem('loginContent')
      if (loginContent) {
        try {
          loginContext = JSON.parse(loginContent)
        } catch (e) {}
      }
    }
  }
  return loginContext
}
