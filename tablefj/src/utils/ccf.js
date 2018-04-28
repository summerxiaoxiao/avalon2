/* globals CCF */
import _ from 'underscore'

let loginContext
export function getLoginContext () {
  if (process.env.NODE_ENV !== 'production') {
    return {
      username: 'test'
    }
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
export function logout () {
  if (process.env.NODE_ENV !== 'production') {
    return null
  }
  if (CCF && CCF.utils) {
    CCF.utils.logout()
  }
}
