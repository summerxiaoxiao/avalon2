<script>
  import Visual from './Visual.vue'
  import {line} from 'd3-shape'
  import { getFormatValue } from '../../../api/common'
  import { BASE_SHAPE, FORMAT_TYPES } from '../../../api/constant'

  const backArrowPath = `M30,18.1c0,1.1-0.1,2.2-0.4,3.2s-0.7,2-1.2,2.9s-1.1,1.7-1.9,2.4S24.9,28,24,28.5s-1.8,0.9-2.9,1.2s-2.1,0.4-3.2,0.4 \
s-2.2-0.1-3.2-0.4s-2-0.7-2.9-1.2s-1.7-1.1-2.4-1.9s-1.4-1.5-1.9-2.4s-0.9-1.8-1.2-2.9S6,19.2,6,18.1s0.1-2.2,0.4-3.2 \
s0.7-2,1.2-2.9s1.1-1.7,1.9-2.4s1.5-1.4,2.4-1.9s1.8-0.9,2.9-1.2s2.1-0.4,3.2-0.4c1.1,0,2.2,0.1,3.2,0.4s2,0.7,2.9,1.2 \
s1.7,1.1,2.4,1.9s1.4,1.5,1.9,2.4s0.9,1.8,1.2,2.9S30,17,30,18.1z M7.5,18.1c0,1,0.1,1.9,0.4,2.8s0.6,1.7,1.1,2.5s1,1.5,1.6,2.1 \
s1.3,1.2,2.1,1.6s1.6,0.8,2.5,1.1s1.8,0.4,2.8,0.4c1,0,1.9-0.1,2.8-0.4s1.7-0.6,2.5-1.1s1.5-1,2.1-1.6s1.2-1.3,1.6-2.1 \
s0.8-1.6,1.1-2.5s0.4-1.8,0.4-2.8s-0.1-1.9-0.4-2.8s-0.6-1.7-1.1-2.5s-1-1.5-1.6-2.1S24,9.5,23.3,9S21.6,8.2,20.8,8 \
S18.9,7.6,18,7.6S16.1,7.7,15.2,8S13.5,8.6,12.7,9s-1.5,1-2.1,1.6S9.4,12,8.9,12.8s-0.8,1.6-1.1,2.5S7.5,17.1,7.5,18.1z M19.2,24.3 \
l-1.1,1.1l-7.3-7.3l7.3-7'3l1.1,1.1l-5.5,5.5l11.7,0v1.5l-11.7,0L19.2,24.3z`

  export default {
    name: 'basic-shape',
    mixins: [Visual],
    data () {
      return {
        viewportWidth: this.width,
        viewportHeight: this.height - this.getVisualTitleHeight()
      }
    },
    computed: {
      shapeType () {
        return getFormatValue(this.format, FORMAT_TYPES.BASE_SHAPE_TYPE_CARD, FORMAT_TYPES.BASE_SHAPE_TYPE) || BASE_SHAPE.RECTANGLE
      },
      lineColor () {
        return getFormatValue(this.format, FORMAT_TYPES.BASE_SHAPE_LINE, FORMAT_TYPES.BASE_SHAPE_LINE_COLOR) || '#00B8AA'
      },
      fillColor () {
        return getFormatValue(this.format, FORMAT_TYPES.BASE_SHAPE_FILL, FORMAT_TYPES.BASE_SHAPE_FILL_COLOR) || '#e6e6e6'
      },
      showFill () {
        return true
      },
      roundEdge () {
        return getFormatValue(this.format, FORMAT_TYPES.BASE_SHAPE_LINE, FORMAT_TYPES.BASE_SHAPE_LINE_ROUND_EDGE) || 0
      },
      shapeTransparency () {
        return getFormatValue(this.format, FORMAT_TYPES.BASE_SHAPE_FILL, FORMAT_TYPES.BASE_SHAPE_FILL_TRANSPARENCY) || 0
      },
      lineWeight () {
        return parseInt(getFormatValue(this.format, FORMAT_TYPES.BASE_SHAPE_LINE, FORMAT_TYPES.BASE_SHAPE_LINE_WEIGHT), 10) || 3
      },
      lineTransparency () {
        return getFormatValue(this.format, FORMAT_TYPES.BASE_SHAPE_LINE, FORMAT_TYPES.BASE_SHAPE_LINE_TRANSPARENCY) || 0
      },
      degrees () {
        let angle = getFormatValue(this.format, FORMAT_TYPES.BASE_SHAPE_ANGLE_CARD, FORMAT_TYPES.BASE_SHAPE_ANGLE) || 0
        if (angle !== 0 && (Math.abs(angle) % 360) === 0) {
          return angle
        }
        angle = angle % 360
        angle = (angle + 360) % 360
        return angle
      },
      scale () {
        const originalWidth = this.viewportWidth
        const originalHeight = this.viewportHeight
        const offsetAngle = Math.atan2(this.viewportHeight, this.viewportWidth)
        const originalFactor = Math.sqrt(Math.pow(this.viewportHeight, 2) + Math.pow(this.viewportWidth, 2))
        let radians = (this.degrees / 180) * Math.PI
        if (this.viewportWidth >= this.viewportHeight) {
          if (this.degrees < 90) {
            radians += offsetAngle
          } else if (this.degrees < 180) {
            radians -= offsetAngle
          } else if (this.degrees < 270) {
            radians += offsetAngle
          } else {
            radians -= offsetAngle
          }
          return (originalHeight / Math.abs(Math.sin(radians))) / originalFactor
        } else {
          if (this.degrees < 90) {
            radians -= offsetAngle
          } else if (this.degrees < 180) {
            radians += offsetAngle
          } else if (this.degrees < 270) {
            radians -= offsetAngle
          } else {
            radians += offsetAngle
          }
          return (originalWidth / Math.abs(Math.cos(radians))) / originalFactor
        }
      },
      style () {
        return {
          'transform': `rotate(${this.degrees}deg) scale(${this.scale})`,
          'transform-origin': 'center',
          '-webkit-transform': `rotate(${this.degrees}deg) scale(${this.scale})`,
          '-webkit-transform-origin': 'center',
          'width': this.viewportWidth + 'px',
          'height': this.viewportHeight + 'px'
        }
      },
      shapeStyle () {
        const style = {
          'vector-effect': 'non-scaling-stroke',
          'stroke-width': this.lineWeight + 'px',
          'stroke': this.lineColor,
          'stroke-opacity': (100 - this.lineTransparency) / 100
        }
        if (this.shapeType !== BASE_SHAPE.LINE) {
          style['fill'] = this.fillColor
          style['fill-opacity'] = this.showFill ? (100 - this.shapeTransparency) / 100 : 0
        }
        return style
      }
    },
    methods: {
      menuOptions (options) {
        if (this.editable) {
          const currentShapeType = getFormatValue(this.format, FORMAT_TYPES.BASE_SHAPE_TYPE_CARD, FORMAT_TYPES.BASE_SHAPE_TYPE)
          options.push('/')
          options = options.concat([{
            name: '方形',
            icon: 'yg-juxing',
            shapeType: BASE_SHAPE.RECTANGLE
          }, {
            name: '圆形',
            icon: 'yg-tuoyuan',
            shapeType: BASE_SHAPE.OVAL
          }, {
            name: '折线',
            icon: 'yg-zhexian',
            shapeType: BASE_SHAPE.LINE
          }, {
            name: '三角形',
            icon: 'yg-sanjiaoxing',
            shapeType: BASE_SHAPE.TRIANGLE
          }
          ].map(({name, icon, shapeType}) => {
            return {
              name,
              props: {
                icon,
                selected: currentShapeType === shapeType
              },
              on: {
                click: () => {
                  this.$store.commit('report/setVisualContainerPropertyFormat', {
                    id: this.id,
                    cardName: FORMAT_TYPES.BASE_SHAPE_TYPE_CARD,
                    sliceValues: {
                      [FORMAT_TYPES.BASE_SHAPE_TYPE]: shapeType
                    }})
                }
              }
            }
          }))
        }
      },
      resize (size) {
        if (size.width !== void 0) {
          this.viewportWidth = size.width
        }
        if (size.height !== void 0) {
          this.viewportHeight = size.height - this.getVisualTitleHeight()
        }
      },
      createOval () {
        const widthForCircle = (this.viewportWidth / 2).toString()
        const heightForCircle = (this.viewportHeight / 2).toString()
        const radiusXForCircle = this.viewportWidth / (2 + 0.2) - this.lineWeight
        const radiusYForCircle = this.viewportHeight / (2 + 0.2) - this.lineWeight
        return {
          shapeAttrs: {
            cx: widthForCircle,
            cy: heightForCircle,
            rx: radiusXForCircle,
            ry: radiusYForCircle
          },
          shapeType: 'ellipse'
        }
      },
      createArrowButton () {
        return {
          svgAttrs: {
            viewBox: '5 5 26 26'
          },
          shapeAttrs: {
            d: backArrowPath
          },
          shapeType: 'path'
        }
      },

      createLine () {
        let x1, y1, x2, y2
        const width = this.viewportWidth - 10 - 10
        const height = this.viewportHeight - 10 - 10
        let ratio
        if (this.degrees <= 45) {
          ratio = this.degrees / 90
          x1 = this.viewportWidth / 2 + width * ratio
          y1 = 10
          x2 = this.viewportWidth / 2 - width * ratio
          y2 = this.viewportHeight - 10
        } else if (this.degrees <= 135) {
          ratio = (this.degrees - 45) / 90
          x1 = this.viewportWidth - 10
          y1 = 10 + height * ratio
          x2 = 10
          y2 = (this.viewportHeight - 10) - height * ratio
        } else if (this.degrees <= 225) {
          ratio = (this.degrees - 135) / 90
          x1 = (this.viewportWidth - 10) - width * ratio
          y1 = this.viewportHeight - 10
          x2 = 10 + width * ratio
          y2 = 10
        } else if (this.degrees <= 315) {
          ratio = (this.degrees - 225) / 90
          x1 = 10
          y1 = (this.viewportHeight - 10) - height * ratio
          x2 = this.viewportWidth - 10
          y2 = 10 + height * ratio
        } else if (this.degrees <= 360) {
          ratio = (this.degrees - 315) / 90
          x1 = 10 + width * ratio
          y1 = 10
          x2 = (this.viewportWidth - 10) - width * ratio
          y2 = this.viewportHeight - 10
        }
        return {
          svgAttrs: {
            width: this.viewportWidth,
            height: this.viewportHeight
          },
          shapeAttrs: {
            x1,
            y1,
            x2,
            y2
          },
          shapeType: 'line'
        }
      },

      createPathFromArray (points) {
        const lineFunction = line().x(d => d.x).y(d => d.y)
        return {
          shapeAttrs: {
            d: lineFunction(points) + ' Z'
          },
          shapeType: 'path'
        }
      },

      createUpArrow () {
        const lineWeight = this.lineWeight
        const heightWeight = this.viewportHeight - lineWeight
        const widthWeight = this.viewportWidth - lineWeight
        const arrowPoints = [
          {x: (widthWeight * 0.05).toString(), y: (heightWeight * 0.42).toString()},
          {x: (widthWeight * 0.5).toString(), y: (heightWeight * 0.016).toString()},
          {x: (widthWeight * 0.95).toString(), y: (heightWeight * 0.42).toString()},
          {x: (widthWeight * 0.764).toString(), y: (heightWeight * 0.42).toString()},
          {x: (widthWeight * 0.764).toString(), y: (heightWeight * 0.993).toString()},
          {x: (widthWeight * 0.246).toString(), y: (heightWeight * 0.993).toString()},
          {x: (widthWeight * 0.246).toString(), y: (heightWeight * 0.42).toString()}
        ]
        return this.createPathFromArray(arrowPoints)
      },

      createRectangle () {
        const x = this.viewportWidth * 0.01 + this.lineWeight / 2
        const y = this.viewportHeight * 0.01 + this.lineWeight / 2
        const width = this.viewportWidth * 0.98 - this.lineWeight
        const height = this.viewportHeight * 0.98 - this.lineWeight
        return {
          shapeAttrs: {
            x,
            y,
            width,
            height,
            rx: this.roundEdge,
            ry: this.roundEdge
          },
          shapeType: 'rect'
        }
      },

      createTriangle () {
        let lineWeight = this.lineWeight
        if (lineWeight > 3) {
          lineWeight -= 3
        }
        let firstPointX = (this.viewportWidth + lineWeight) * 0.15
        let firstPointY = this.viewportHeight - 10 - lineWeight < 0 ? this.viewportHeight - 10 : this.viewportHeight - 10 - lineWeight
        let secondPointY = (this.viewportHeight + lineWeight) * 0.15
        let thirdPointX = (this.viewportWidth - lineWeight) * 0.85 < 0 ? this.viewportWidth * 0.85 : (this.viewportWidth - lineWeight) * 0.85
        let thirdPointY = (this.viewportHeight - 10 - lineWeight) < 0 ? this.viewportHeight - 10 : this.viewportHeight - lineWeight - 10
        let secondPointX = (firstPointX + thirdPointX) / 2
        if (firstPointX < 10) {
          firstPointX = 10
        }
        if (secondPointY < 10) {
          secondPointY = 10
        }

        const trianglePoints = [
          {x: firstPointX, y: firstPointY},
          {x: secondPointX, y: secondPointY},
          {x: thirdPointX, y: thirdPointY}
        ]

        return this.createPathFromArray(trianglePoints)
      }
    },
    render (h) {
      let svgAttrs = {}
      let shapeAttrs = {}
      let shapeType
      switch (this.shapeType) {
        case 'arrowButton':
          ({svgAttrs = {}, shapeType, shapeAttrs = {}} = this.createArrowButton())
          break
        case BASE_SHAPE.OVAL:
          ({svgAttrs = {}, shapeType, shapeAttrs = {}} = this.createOval())
          break
        case BASE_SHAPE.LINE:
          ({svgAttrs = {}, shapeType, shapeAttrs = {}} = this.createLine())
          break
        case 'arrow':
          ({svgAttrs = {}, shapeType, shapeAttrs = {}} = this.createUpArrow())
          break
        case BASE_SHAPE.RECTANGLE:
          ({svgAttrs = {}, shapeType, shapeAttrs = {}} = this.createRectangle())
          break
        case BASE_SHAPE.TRIANGLE:
          ({svgAttrs = {}, shapeType, shapeAttrs = {}} = this.createTriangle())
          break
        default:
          break
      }

      if (!shapeType) {
        return null
      }

      const svgNode = h('svg', {
        attrs: Object.assign({width: this.viewportWidth, height: this.viewportHeight}, svgAttrs)
      }, [h(shapeType, {
        attrs: shapeAttrs,
        style: this.shapeStyle
      })])

      if (shapeType === 'line') {
        return h('div', [svgNode])
      } else {
        return h('div', [h('div', {style: this.style}, [svgNode])])
      }
    }
  }
</script>
