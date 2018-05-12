import $ from 'jquery'
import _ from 'underscore'
import Vue from 'vue'
import Dropdown from '../../../common/Dropdown.vue'
import ColorPickPopup from '../../../common/colorPicker/Popup.vue'
import { fontOptions, defaultColor, defaultBackground, defaultFont, defaultSize } from '../../../../common/colorFont'

const fonts = fontOptions.map(font => {
  return _.unescape(font.value)
})

const sizes = [
  8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 42, 44, 54, 60, 66, 72, 80, 88, 96
].map(value => {
  return {
    value: value + 'px',
    displayName: value
  }
})

const config = [
  [{font: fontOptions}, {size: sizes}, 'color', 'background'],
  ['bold', 'italic', 'underline'],
  [{align: ''}, {align: 'center'}, {align: 'right'}],
  ['link']
]

let icons
let initialized = false
let QuillStatic

export function createEditor (Quill, elContainer, toolbarContainer) {
  if (!initialized) {
    init(Quill)
  }

  const quill = new Quill(elContainer, {
    modules: {
      toolbar: buildToolbar(toolbarContainer),
      history: {
        userOnly: true
      }
    }
  })

  ;['color', 'background'].forEach(format => {
    const toolbar = quill.theme.modules.toolbar
    const el = toolbar.container.querySelector(`.ql-format-${format}`)
    const vm = $(el).data('vm')
    if (vm) {
      vm.$on('format', (value) => {
        quill.format(format, value, QuillStatic.sources.USER)
      })
    }
  })

  quill.on(QuillStatic.events.EDITOR_CHANGE, function (event) {
    let [range] = quill.selection.getRange()
    const toolbar = quill.theme.modules.toolbar
    if (event === QuillStatic.events.SELECTION_CHANGE) {
      ;['color', 'background'].forEach(format => {
        const el = toolbar.container.querySelector(`.ql-format-${format}`)
        const vm = $(el).data('vm')
        if (vm) {
          const formats = !range ? {} : quill.getFormat(range)
          vm.value = formats[format]
          if (vm.value) {
            vm.active = true
          }
        }
      })
    }
  })
  return quill
}

function camelize (name) {
  const parts = name.split('-')
  const rest = _.map(parts.slice(1), function (part) { return part[0].toUpperCase() + part.slice(1) }).join('')
  return parts[0] + rest
}

function init (Quill) {
  QuillStatic = Quill
  icons = Quill.import('ui/icons')
  updateStyleAllowList(Quill, 'font', fonts, true)
  updateStyleAllowList(Quill, 'size', null, true)

  const parchment = Quill.import('parchment')
  const fontFormat = Quill.import('formats/font')
  fontFormat.value = function (element) {
    const key = camelize(fontFormat.keyName)
    return _.escape(element.style[key])
  }
  fontFormat.canAdd = function (node, value) {
    const match = parchment.query(node, parchment.Scope.BLOT & (fontFormat.scope | parchment.Scope.TYPE))
    return match !== null && (fontFormat.whitelist === null || fontFormat.whitelist.indexOf(_.unescape(value)) > -1)
  }
  fontFormat.add = function (node, value) {
    if (!fontFormat.canAdd(node, value)) {
      return false
    }
    const key = camelize(fontFormat.keyName)
    node.style[key] = _.unescape(value)
    return true
  }

  initialized = true
}

function createColorBtn (el, format, value) {
  let icon
  if (icons[format]) {
    if (typeof icons[format] === 'string') {
      icon = icons[format]
    } else {
      if (value !== undefined && icons[format][value]) {
        icon = icons[format][value]
      }
    }
  }

  return new Vue({
    data: {
      active: false,
      show: false,
      value: value
    },
    updated () {
      this.rawColorLabel()
    },
    mounted () {
      this.rawColorLabel()
    },
    methods: {
      rawColorLabel () {
        let colorLabel = this.$el.querySelector('.ql-color-label')
        if (colorLabel) {
          if (colorLabel.tagName === 'line') {
            colorLabel.style.stroke = this.value || ''
          } else {
            colorLabel.style.fill = this.value || ''
          }
        }
      }
    },
    render (createElement) {
      const btnAttrs = {
        type: 'button'
      }
      if (this.value) {
        btnAttrs['value'] = this.value.toString().toLowerCase()
      }
      const btn = createElement('button', {
        'class': {
          ['ql-' + format]: true,
          'ql-active': this.active
        },
        props: {
          color: this.value
        },
        attrs: btnAttrs,
        domProps: {
          innerHTML: icon
        },
        on: {
          click: () => {
            if (!this.value) {
              this.show = true
            } else if ($(btn.elm).hasClass('ql-active')) {
              this.value = undefined
              if (format === 'background') {
                this.$emit('format', false)
              }
            }
          }
        }
      })
      const arrow = createElement('button', {
        attrs: {type: 'button'},
        on: {
          click: (event) => {
            event.stopPropagation()
            this.show = true
          }
        }
      }, [
        createElement('i', {'class': 'iconfont yg-xiala'})
      ])
      const nodes = [btn, arrow]
      if (this.show) {
        const dropdown = createElement(Dropdown, {
          props: {reference: btn},
          'class': 'colorPicker__dropdown',
          on: {
            close: () => {
              this.show = false
              this.value = value
            }
          }
        }, [
          createElement(ColorPickPopup, {
            props: {value: this.value || (format === 'color' ? defaultColor : defaultBackground)},
            on: {
              input: (value) => {
                this.value = value
                this.show = false
                this.$emit('format', value)
                this.active = false
                this.$nextTick(() => {
                  this.active = true
                })
              }
            }
          })
        ])
        nodes.push(dropdown)
      }
      return createElement('div', {'class': 'ql-format ql-format-' + format}, nodes)
    }
  }).$mount(el)
}

function buildToolbar (container) {
  container.classList.add('ql-yg')
  addControls(container, config)
  return {
    container: container,
    handlers: {
      color (value) {
        if (typeof value === 'string' && value || value === false) {
          this.quill.format('color', value, QuillStatic.sources.USER)
        }
      },
      background (value) {
        if (typeof value === 'string' && value || value === false) {
          this.quill.format('color', value, QuillStatic.sources.USER)
        }
      },
      font (value) {
        this.quill.format('font', typeof value === 'string' ? _.unescape(value) : value, QuillStatic.sources.USER)
      }
    }
  }
}

function updateStyleAllowList (Quill, attributorName, newAllowList, overwrite) {
  if (overwrite === void 0) {
    overwrite = false
  }
  const attributorPath = 'attributors/style/' + attributorName
  const attributor = Quill.import(attributorPath)
  const formatPath = 'formats/' + attributorName
  attributor.whitelist = newAllowList
  Quill.register(formatPath, attributor, overwrite)
}

function addButton (container, format, value) {
  let input
  if (format === 'color' || format === 'background') {
    input = document.createElement('div')
    container.appendChild(input)
    const vm = createColorBtn(input, format, value)
    $(vm.$el).data('vm', vm)
  } else {
    input = document.createElement('button')
    input.setAttribute('type', 'button')
    input.classList.add('ql-' + format)
    if (value !== void 0) {
      input.value = value
    }

    if (icons[format]) {
      if (typeof icons[format] === 'string') {
        input.innerHTML = icons[format]
      } else {
        const value = input.value || ''
        if (value !== undefined && icons[format][value]) {
          input.innerHTML = icons[format][value]
        }
      }
    }
    container.appendChild(input)
  }
}

function addControls (container, groups) {
  if (!Array.isArray(groups[0])) {
    groups = [groups]
  }
  groups.forEach(function (controls) {
    let group = document.createElement('span')
    group.classList.add('ql-formats')
    controls.forEach(function (control) {
      if (typeof control === 'string') {
        addButton(group, control)
      } else {
        let format = Object.keys(control)[0]
        let value = control[format]
        if (Array.isArray(value)) {
          addSelect(group, format, value)
        } else {
          addButton(group, format, value)
        }
      }
    })
    container.appendChild(group)
  })
}

function addSelect (container, format, values) {
  let input = document.createElement('select')
  input.classList.add('ql-' + format)
  values.forEach(function (v) {
    let value, label
    if (typeof v === 'object') {
      ({value, displayName: label} = v)
    } else {
      value = v
      label = v
    }
    let option = document.createElement('option')
    option.setAttribute('value', value)
    if (format === 'font') {
      option.style.fontFamily = value
      if (_.escape(value) === defaultFont) {
        option.setAttribute('selected', 'selected')
      }
    }
    if (format === 'size') {
      if (value === defaultSize + 'px') {
        option.setAttribute('selected', 'selected')
      }
    }
    option.innerText = label
    input.appendChild(option)
  })
  container.appendChild(input)
}

function isValidLinkUrl () {
  return true
}

export function convertDeltaToParagraphs (contents) {
  const paragraphs = []
  let paragraph = { textRuns: [] }
  for (let i = 0, len = contents.ops.length; i < len; i++) {
    let insertOp = contents.ops[i]
    if (typeof insertOp.insert === 'string') {
      // string insert values represent text.
      const text = insertOp.insert
      const attributes = insertOp.attributes
      if (attributes && attributes.align) {
        // Sometimes horizontal alignment is set after the first "insert" of the paragraph, which is likely a bug
        // in Quill. In any case we should never see different horizontal alignments in a single paragraph.
        paragraph.horizontalTextAlignment = attributes.align
      }
      // Quill gives us back text runs that may have \n's in them. We want to create a new paragraph for each \n we see.
      let start = 0
      let end = 0
      let newParagraph = void 0
      do {
        end = text.indexOf('\n', start)
        if (end < 0) {
          newParagraph = false
          end = text.length
        } else {
          newParagraph = true
        }
        if (end - start > 0) {
          let span = text.substring(start, end)
          let textRun = { value: span }
          if (attributes) {
            if (attributes.link !== undefined && isValidLinkUrl(attributes.link)) {
              textRun.url = attributes.link
            }
            const textStyle = convertFormatAttributesToTextStyle(attributes)
            if (textStyle) {
              textRun.textStyle = textStyle
            }
          }
          paragraph.textRuns.push(textRun)
        }
        // If we actually saw a '\n' then create a new paragraph
        if (newParagraph) {
          if (paragraph.textRuns.length === 0) {
            paragraph.textRuns.push({value: ''})
          }
          paragraphs.push(paragraph)
          paragraph = { textRuns: [] }
        }
        start = end + 1
      } while (start < text.length)
    } else {
      // numeric insert values represent embeds.
      console.error('embeds not supported')
    }
  }
  if (paragraph.textRuns.length > 0) {
    // Quill appears to always insert an extra '\n' at the end of the text, skip it
    if (paragraph.textRuns[0].value.length > 0) {
      paragraphs.push(paragraph)
    }
  }
  return paragraphs
}

function convertFormatAttributesToTextStyle (attributes) {
  const style = {}
  // NOTE: Align is taken care of when converting to paragraphs.
  if (attributes.bold) {
    style.fontWeight = 'bold'
  }
  // @todo font escape
  if (attributes.font) {
    style.fontFamily = _.unescape(attributes.font)
  }
  if (attributes.italic) {
    style.fontStyle = 'italic'
  }
  if (attributes.size) {
    style.fontSize = attributes.size
  }
  if (attributes.underline) {
    style.textDecoration = 'underline'
  }
  // @todo background
  if (attributes.color) {
    style.color = attributes.color
  }

  if (attributes.background) {
    style.backgroundColor = attributes.background
  }

  return style
}

export function convertParagraphsToHtml (paragraphs) {
  let $paragraphs = $()
  for (let paragraphIndex = 0, len = paragraphs.length; paragraphIndex < len; ++paragraphIndex) {
    const paragraphDef = paragraphs[paragraphIndex]
    let isParagraphEmpty = true
    const $paragraph = $('<p>').data('ModelObject', paragraphDef)
    if (paragraphDef.horizontalTextAlignment) {
      $paragraph.css('text-align', paragraphDef.horizontalTextAlignment)
    }
    for (let textRunIndex = 0, jlen = paragraphDef.textRuns.length; textRunIndex < jlen; ++textRunIndex) {
      let textRunDef = paragraphDef.textRuns[textRunIndex]
      let $textRun = void 0
      let text = textRunDef.value
      if (!_.isEmpty(text)) {
        isParagraphEmpty = false
      }
      // Either create a link or a `span` so we can style it directly
      if (textRunDef.url !== undefined && isValidLinkUrl(textRunDef.url)) {
        $textRun = $('<a>')
          .attr('href', textRunDef.url)
          .attr('rel', 'noopener noreferrer')
          .attr('target', '_blank')
      } else {
        $textRun = $('<span>')
      }
      $textRun.text(text).addClass('text-run').data('ModelObject', textRunDef)
      const styleDef = textRunDef.textStyle
      if (styleDef) {
        const css = {}
        if (styleDef.fontFamily) {
          css['font-family'] = styleDef.fontFamily
        }
        if (styleDef.fontSize) {
          css['font-size'] = styleDef.fontSize
        }
        if (styleDef.fontStyle) {
          css['font-style'] = styleDef.fontStyle
        }
        if (styleDef.fontWeight) {
          css['font-weight'] = styleDef.fontWeight
        }
        if (styleDef.color) {
          css['color'] = styleDef.color
        }
        if (styleDef.backgroundColor) {
          css['background-color'] = styleDef.backgroundColor
        }
        if (styleDef.textDecoration) {
          css['text-decoration'] = styleDef.textDecoration
        }
        $textRun.css(css)
      }
      $paragraph.append($textRun)
    }
    // If the entire paragraph is empty we need to make sure we enforce a line-break.
    if (isParagraphEmpty) {
      $paragraph.append($('<br>'))
    }
    $paragraphs = $paragraphs.add($paragraph)
  }
  return $paragraphs
}

export function convertParagraphsToOps (paragraphs) {
  let ops = []
  for (let paragraphIndex = 0, len = paragraphs.length; paragraphIndex < len; ++paragraphIndex) {
    let paragraphDef = paragraphs[paragraphIndex]
    for (let textRunIndex = 0, jlen = paragraphDef.textRuns.length; textRunIndex < jlen; ++textRunIndex) {
      let textRunDef = paragraphDef.textRuns[textRunIndex]
      let formats = {}
      if (paragraphDef.horizontalTextAlignment) {
        formats.align = paragraphDef.horizontalTextAlignment
      }
      let styleDef = textRunDef.textStyle
      if (styleDef) {
        if (styleDef.fontFamily) {
          formats.font = styleDef.fontFamily
        }
        if (styleDef.fontSize) {
          formats.size = styleDef.fontSize
        }
        if (styleDef.color) {
          formats.color = styleDef.color
        }
        // If the format isn't present, set the value to undefined so it's not applied
        formats.italic = (styleDef.fontStyle === 'italic') || undefined
        formats.bold = (styleDef.fontWeight === 'bold') || undefined
        formats.underline = (styleDef.textDecoration === 'underline') || undefined
      }
      const text = textRunDef.value
      if (textRunDef.url && isValidLinkUrl(textRunDef.url)) {
        formats.link = textRunDef.url
      }
      const op = {
        insert: text,
        attributes: formats
      }
      ops.push(op)
      // The last text run of the paragraph needs to end with '\n' to get Quill to handle the text alignment correctly.
      if (textRunIndex === (jlen - 1) && text[text.length - 1] !== '\n') {
        ops.push({
          insert: '\n',
          attributes: formats
        })
      }
    }
  }
  return ops
}
