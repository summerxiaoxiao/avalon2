class BasePromise {
  constructor (type, fn, delay) {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.timeoutId = window[`set${type}`](() => {
        fn(resolve, reject)
      }, delay || 0)
    })
  }

  cancel () {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId)
      this.reject('cancel')
    }
  }

  then (onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected)
  }

  'catch' (onRejected) {
    return this.promise.catch(onRejected)
  }

  'finally' (cb) {
    return this.promise().then(
      value => Promise.resolve(cb()).then(() => value),
      reason => Promise.resolve(cb()).then(() => { throw reason })
    )
  }
}

export class IntervalPromise extends BasePromise {
  constructor (fn, delay) {
    super('Interval', fn, delay)
  }
}

export default class DeferredPromise extends BasePromise {
  constructor (fn, delay) {
    super('Timeout', fn, delay)
  }
}
