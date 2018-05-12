<template>
  <div class="exploration-app-bar fade-in">
    <div class="app-bar">
      <div class="app-bar__section app-bar__section--left trimmed-text-with-ellipsis">
        <template v-if="!editable">
        <span class="app-bar__return">
          <a href="#" @click.prevent="handleReturn">&lt; 返回</a>
        </span>
          <span class="app-bar__splitter"></span>
        </template>
        <app-bar-title  v-if="report && editable" :title="report.title" class="app-bar__title"></app-bar-title>
        <span v-else-if="report" class="app-bar__title">{{report.title}}</span>
      </div>

      <div class="app-bar__section unselectable app-bar__section--right" v-if="section">
        <ul>
          <li class="dropdown" v-if="!isPopOut">
            <i class="iconfont yg-shitu1"></i>
            <span>视图</span>
            <i class="iconfont yg-xiala"></i>
            <ul class="dropdown-menu">
              <li class="dropdown-item">
                <a href="#" @click.prevent="setFullScreenMode(true)">
                  <div class="dropdown__content">
                    <i class="iconfont yg-quanping1"></i>
                    <div class="dropdown__label">
                      全屏
                    </div>
                  </div>
                </a>
              </li>
              <li class="dropdown-divider"></li>
              <li class="dropdown-item" :class="{selected: section.viewMode === 0}">
                <a href="#" @click.prevent="setSectionViewMode(0)">
                  <div class="dropdown__content">
                    <i class="iconfont yg-tiaozhengdaoyemiandaxiao"></i>
                    <div class="dropdown__label">
                      页面大小
                    </div>
                  </div>
                </a>
              </li>
              <li class="dropdown-item" :class="{selected: section.viewMode === 1}">
                <a href="#" @click.prevent="setSectionViewMode(1)">
                  <div class="dropdown__content">
                    <i class="iconfont yg-shiyingkuandu"></i>
                    <div class="dropdown__label">
                      适应宽度
                    </div>
                  </div>
                </a>
              </li>
              <li class="dropdown-item" :class="{selected: section.viewMode === 2}">
                <a href="#" @click.prevent="setSectionViewMode(2)">
                  <div class="dropdown__content">
                    <i class="iconfont yg-shijidaxiao"></i>
                    <div class="dropdown__label">
                      实际大小
                    </div>
                  </div>
                </a>
              </li>
              <li class="dropdown-divider" v-if="editable"></li>
              <li class="dropdown-item" v-if="editable">
                <a href="javascript:void 0" @click.prevent="toggleShowGrid">
                  <div class="dropdown__content">
                    <i class="iconfont yg-xianshiwangge"></i>
                    <div class="dropdown__label">
                      显示网格
                    </div>
                    <yg-switch class="toggle" :value="isShowGrid" :holdClick="false"></yg-switch>
                  </div>
                </a>
              </li>
              <li class="dropdown-item" v-if="editable">
                <a href="javascript:void 0" @click.prevent="toggleAdjustGrid">
                  <div class="dropdown__content">
                    <i class="iconfont yg-duiqiwangge"></i>
                    <div class="dropdown__label">
                      对齐网格
                    </div>
                    <yg-switch class="toggle" :value="isAdjustGrid" :holdClick="false"></yg-switch>
                  </div>
                </a>
              </li>
              <li class="dropdown-item">
                <a href="javascript:void 0" @click.prevent="toggleSelectCanvasItems">
                  <div class="dropdown__content">
                    <i class="iconfont yg-xuanzetubiao"></i>
                    <div class="dropdown__label">
                      选择图表
                    </div>
                    <yg-switch class="toggle" :value="isSelectCanvasItems" :holdClick="false"></yg-switch>
                  </div>
                </a>
              </li>
            </ul>
          </li>
          <li class="dropdown" v-if="!isPopOut && editable">
            <i class="iconfont yg-charu"></i>
            <span>插入</span>
            <i class="iconfont yg-xiala"></i>
            <ul class="dropdown-menu">
              <li class="dropdown-item">
                <a href="#" @click.prevent="insertVisual('TEXTBOX')">
                  <div class="dropdown__content">
                    <i class="iconfont yg-wenbenkuang"></i>
                    <div class="dropdown__label">文本框</div>
                  </div>
                </a>
              </li>
              <!--
              <li class="dropdown-item">
                  <a href="#" @click.prevent="insertVisual('IMAGEBOX')">
                  <div class="dropdown__content">
                    <div class="dropdown__label">图片</div>
                  </div>
                </a>
              </li>
              -->
              <li class="dropdown-item">
                <a href="#" @click.prevent="insertVisual('BASE_SHAPE', 'rectangle')">
                  <div class="dropdown__content">
                    <i class="iconfont yg-juxing"></i>
                    <div class="dropdown__label">方形</div>
                  </div>
                </a>
              </li>
              <li class="dropdown-item">
                <a href="#" @click.prevent="insertVisual('BASE_SHAPE', 'oval')">
                  <div class="dropdown__content">
                    <i class="iconfont yg-tuoyuan"></i>
                    <div class="dropdown__label">圆形</div>
                  </div>
                </a>
              </li>
              <li class="dropdown-item">
                <a href="#" @click.prevent="insertVisual('BASE_SHAPE', 'line')">
                  <div class="dropdown__content">
                    <i class="iconfont yg-zhexian"></i>
                    <div class="dropdown__label">折线</div>
                  </div>
                </a>
              </li>
              <li class="dropdown-item">
                <a href="#" @click.prevent="insertVisual('BASE_SHAPE', 'triangle')">
                  <div class="dropdown__content">
                    <i class="iconfont yg-sanjiaoxing"></i>
                    <div class="dropdown__label">三角形</div>
                  </div>
                </a>
              </li>
            </ul>
          </li>

          <li @click.prevent="handleEdit" v-if="!editable && mode !== 'template'">
            <i class="iconfont yg-baocun"></i> 编辑
          </li>
          <li @click.prevent="handleSave" v-if="editable">
            <i class="iconfont yg-baocun"></i> 保存
          </li>
          <li @click.prevent="handleCancel" v-if="editable">
            <i class="iconfont yg-shanchu2"></i> 关闭
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {Message} from 'element-ui'
  import AppBarTitle from './AppBarTtitle.vue'
  import { BASE_SHAPE, FORMAT_TYPES, VISUAL_TYPES } from '../../api/constant'
  import SaveInputName from './modals/SaveInputName.vue'
  import Switch from '../common/Switch.vue'

  import FullScreen from '../mixins/fullScreen'

  export default {
    name: 'exploration-app-bar',

    components: {
      'yg-switch': Switch,
      AppBarTitle
    },

    mixins: [FullScreen],

    props: {
      mode: String,
      editable: Boolean,
      section: Object,
      report: Object
    },

    computed: {
      isSelectCanvasItems () {
        return this.$store.state.report.isSelectCanvasItems
      },
      isShowGrid () {
        return this.$store.getters['report/isShowGrid']
      },
      isAdjustGrid () {
        return this.$store.getters['report/isAdjustGrid']
      },
      isPopOut () {
        return !!this.$store.getters['report/popOutId']
      },
      isChanged () {
        return this.$store.state.report.isChanged
      }
    },

    methods: {
      toggleSelectCanvasItems () {
        this.$store.commit('report/toggleSelectCanvasItems', !this.isSelectCanvasItems)
      },
      toggleAdjustGrid () {
        this.$store.commit('report/setReportFormat', {
          cardName: FORMAT_TYPES.REPORT_VIEW,
          sliceName: FORMAT_TYPES.REPORT_VIEW_ADJUST_GRID,
          value: !this.isAdjustGrid
        })
      },
      toggleShowGrid () {
        this.$store.commit('report/setReportFormat', {
          cardName: FORMAT_TYPES.REPORT_VIEW,
          sliceName: FORMAT_TYPES.REPORT_VIEW_SHOW_GRID,
          value: !this.isShowGrid
        })
      },
      setSectionViewMode (mode) {
        this.$store.commit('report/setSectionViewMode', {
          id: this.section.id,
          viewMode: mode
        })
      },
      insertVisual: function (type, subType) {
        type = VISUAL_TYPES[type]
        let format
        if (type === VISUAL_TYPES.BASE_SHAPE) {
          let shapeType
          switch (subType) {
            case 'rectangle':
              shapeType = BASE_SHAPE.RECTANGLE
              break
            case 'line':
              shapeType = BASE_SHAPE.LINE
              break
            case 'oval':
              shapeType = BASE_SHAPE.OVAL
              break
            case 'triangle':
              shapeType = BASE_SHAPE.TRIANGLE
              break
          }
          if (typeof shapeType !== void 0) {
            format = {
              [FORMAT_TYPES.BASE_SHAPE_TYPE_CARD]: {
                [FORMAT_TYPES.BASE_SHAPE_TYPE]: shapeType
              }
            }
          }
        }
        this.$store.commit('report/createVisualContainer', {
          type: type || VISUAL_TYPES.TEXTBOX,
          format
        })
      },
      handleSave () {
        const isNew = !this.report.id
        const save = (title) => {
          return this.$store.dispatch('report/saveReport', title ? {title} : {}).then((report) => {
            /*
            import('html2canvas').then(html2canvas => {
              html2canvas(document.getElementById('explorationCanvas'), {
                onrendered (canvas) {
                  canvas.toDataURL('image/jpeg')
                }
              })
            })
            */
            if (isNew) {
              this.$router.replace({name: 'reportEdit', params: {id: report.id}})
            }
            Message.success('报表保存成功')
          }, (e) => {
            Message.error(typeof e === 'string' ? e : '服务器错误')
          })
        }

        if (isNew && this.report.title === '未命名') {
          this.$vuedals.open({
            name: 'saveInputName',
            title: '保存报表',
            props: {
              onSave: (title) => {
                save(title)
                this.$emit('vuedals:close')
              }
            },
            component: SaveInputName
          })
        } else {
          save()
        }
      },
      handleCancel () {
        this.$router.go(-1)
      },
      handleEdit () {
        this.$router.push({name: 'reportEdit', params: {id: this.report.id}})
      },
      handleReturn () {
        this.$router.go(-1)
      }
    }
  }
</script>
