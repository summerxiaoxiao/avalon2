import Vue from 'vue'
import $ from 'jquery'

export default class ContextMenu {
  constructor (menuOptions) {
    this.menuOptions = menuOptions || {}
    this.hide = this.hide.bind(this)
  }

  show (event, positionType) {
    if (!this.overlay) {
      this.createOverlay()
    }
    this.overlay.visible = true
    this.overlay.$nextTick(() => {
      const width = $(this.overlay.$el).width()
      const height = $(this.overlay.$el).height()
      const winWidth = $(window).width()
      const winHeight = $(window).height()
      const targetWidth = $(event.currentTarget || event.target).outerWidth()
      const targetHeight = $(event.currentTarget || event.target).outerHeight()
      let x, y
      if (positionType === 'element') {
        const offset = $(event.currentTarget || event.target).offset()
        x = offset.left
        y = offset.top + targetHeight
      } else {
        x = event.x + 2
        y = event.y + 2
      }

      if (x + width > winWidth) {
        x = x - width
        if (positionType === 'element') {
          x += targetWidth
        }
      }
      if (y + height > winHeight) {
        y = y - height
        if (positionType === 'element') {
          y -= targetHeight
        }
      }
      this.overlay.position = {x, y}
    })
  }

  hide () {
    if (this.overlay) {
      this.overlay.$destroy()
      document.body.removeChild(this.overlay.$el)
      this.overlay = null
    }
  }

  createOverlay () {
    const overlayNode = document.createElement('div')
    const menuOptions = this.menuOptions
    document.body.appendChild(overlayNode)

    const _this = this

    const createMenu = (h, options) => {
      const nodes = []
      const items = []
      options.forEach(option => {
        if (Array.isArray(option.items)) {
          items.push('/')
          option.items.forEach(item => {
            items.push(item)
          })
        } else {
          items.push(option)
        }
      })
      items.forEach(item => {
        if (typeof item === 'string') {
          nodes.push(h('li', {
            'class': 'menu-sep'
          }, ''))
        } else {
          const props = item.props || {}
          const _class = Object.assign({'menu-item': true, 'has-icon': !!props.icon}, item.class || {})
          if (props.selected) {
            _class['selected'] = true
          }
          const children = []
          if (props.icon) {
            children.push(h('i', {'class': ['iconfont', props.icon]}))
          }
          children.push(h('span', {}, item.name || ''))
          const on = item.on || {}
          const onWrap = {}
          Object.keys(on).forEach(key => {
            onWrap[key] = () => {
              const result = on[key]()
              if (result !== false) {
                this.hide()
              }
            }
          })
          nodes.push(h('li', {
            on: onWrap,
            style: item.style || {},
            'class': _class,
            attrs: item.attrs || {}
          }, children))
        }
      })
      return h('div', {'class': 'context-menu'}, [h('ul', {}, nodes)])
    }

    this.overlay = new Vue({
      el: overlayNode,
      data: {
        visible: false,
        position: null
      },
      render (createElement) {
        const options = {
          'class': 'overlay overlay-active',
          style: {
            top: (this.position ? this.position.y : -9999) + 'px',
            left: (this.position ? this.position.x : -9999) + 'px'
          }
        }
        if (!this.visible) {
          return null
        }
        return createElement('div', options, [createMenu(createElement, menuOptions)])
      },
      methods: {
        handleClick (event) {
          if (event.path) {
            if (Array.prototype.indexOf.call(event.path, this.$el) > -1) {
              event.stopPropagation()
              return false
            }
          } else {
            let parent = event.target
            while (parent) {
              if (parent === this.$el) {
                event.stopPropagation()
                return false
              }
              parent = parent.parentNode
            }
          }

          _this.hide()
        }
      },
      mounted () {
        document.addEventListener('mousedown', this.handleClick, true)
        document.addEventListener('mousewheel', _this.hide, true)
        window.addEventListener('resize', _this.hide, true)
      },
      beforeDestroy () {
        document.removeEventListener('mousedown', this.handleClick, true)
        document.removeEventListener('mousewheel', _this.hide, true)
        window.removeEventListener('resize', _this.hide, true)
      }
    })
  }
}
