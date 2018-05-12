import $ from 'jquery'

export default {
  created () {
    const fullScreenEvents = ['fullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange', 'mozfullscreenchange']
    fullScreenEvents.forEach(eventName => {
      window.document.addEventListener(eventName, this.updateFullScreenFromBrowser)
    })
    this._fullScreenModeEnabled = false
  },
  beforeDestroy () {
    const fullScreenEvents = ['fullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange', 'mozfullscreenchange']
    fullScreenEvents.forEach(eventName => {
      window.document.removeEventListener(eventName, this.updateFullScreenFromBrowser)
    })
    this._fullScreenModeEnabled = false
  },
  methods: {
    updateFullScreenFromBrowser () {
      const doc = window.document
      const enabled = !!(doc.fullScreenElement || doc.msFullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement)
      if (enabled !== this._fullScreenModeEnabled) {
        this.toggleFullScreen()
      }
    },
    exitFullScreen () {
      this.setFullScreenMode(false)
    },
    enterFullScreen () {
      this.setFullScreenMode(true)
    },
    toggleFullScreen () {
      if (this._fullScreenModeEnabled) {
        this.exitFullScreen()
      } else {
        this.enterFullScreen()
      }
    },
    setFullScreenMode (enabled) {
      const htmlElement = $('html')
      const body = $('body')
      if (htmlElement.length <= 0 || body.length <= 0) {
        return
      }
      if (enabled) {
        body.addClass('full-screen')
        const element = htmlElement.get(0)
        if (element) {
          const requestFullScreen = element.requestFullscreen || element.msReqeustFullscreen || element.webkitRequestFullscreen || element.mozRequestFullscreen
          if (requestFullScreen) {
            requestFullScreen.call(element)
          }
        }
      } else {
        body.removeClass('full-screen')
        const doc = window.document
        const exit = doc.exitFullscreen || doc.msExitFullscreen || doc.webkitCancelFullScreen || doc.webkitExitFullscreen || doc.mozCancelFullscreen
        if (exit) {
          exit.call(doc)
        }
      }
      this._fullScreenModeEnabled = enabled
    }
  }
}
