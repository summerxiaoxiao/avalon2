<template>
  <div class="landing-container">
    <toast :notifications="notifications" @close="dismissNotification"></toast>
    <div class="landing-root-content report-container-content" v-if="isInit">
      <exploration-container v-if="!loading" :report="report" :section="section" :editable="editable" :mode="mode"></exploration-container>
    </div><!-- /.landing-root-content -->
    <div v-if="loading" class="flex flex-auto">
      <loader class="flex-center" style="width: 80px; height: 80px"></loader>
    </div>
  </div><!-- /.landing-container -->
</template>

<script>
  import ExplorationContainer from '../../components/exploration/ExplorationContainer.vue'
  import ExplorationAppBar from '../../components/exploration/ExplorationAppBar.vue'
  import Toast from '../../components/common/toast/Toast.vue'
  import SaveConfirm from '../../components/exploration/modals/SaveConfirm.vue'
  import SaveInputName from '../../components/exploration/modals/SaveInputName.vue'

  import { Message } from 'element-ui'
  import Loader from '../../components/common/Loader.vue'

  const redoStack = []

  export default {
    name: 'report',
    components: {
      Loader,
      Toast,
      ExplorationAppBar,
      ExplorationContainer
    },

    props: {
      id: String,
      mode: String
    },

    data () {
      return {
        loading: false
      }
    },

    created () {
      this.load()
      this.unsubscribe = this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'setReport' || this.mode !== 'edit') {
          return
        }
        const mutations = [
          'report/setReportFormat',
          'report/setReportTitle',
          'report/createSection',
          'report/renameSection',
          'report/removeSection',
//          'report/selectSection',
          'report/setSectionViewMode',
          'report/setSectionFormat',
          'report/createVisualContainer',
          'report/removeVisualContainer',
          'report/addFieldProperty',
          'report/actionFieldProperty',
          'report/removeFieldProperty',
          'report/deleteFieldProperty',
          'report/renameFieldProperty',
          'report/addFilterProperty',
          'report/updateFilterProperty',
          'report/removeFieldProperty',
          'report/setVisualContainerVisibility',
          'report/setVisualContainerQueryType',
          'report/setVisualContainerPropertyFormat'
        ]
        if (mutations.indexOf(mutation.type) !== -1) {
          // redoStack.push(JSON.stringify(state.report))
          if (!this.isChanged) {
            this.$store.commit('report/setReportChanged', true)
          }
        }
      })

      let openSaveConfirm = false
      this.closeSaveConfirm = () => {
        openSaveConfirm = false
      }
      this.$vuedals.$on('vuedals:destroyed', this.closeSaveConfirm)
      this.unsubscribe2 = this.$router.beforeEach((to, from, next) => {
        if (this.isLeaveConfirm) {
          next(false)
          if (openSaveConfirm) {
            return
          }
          const _save = (title) => {
            this.$emit('vuedals:close')
            this.$store.dispatch('report/saveReport', {title}).then(report => {
              Message.success('报表保存成功')

              if (to.name === 'penetration' || to.name === 'relation') {
                next(true)
              } else {
                this.$router.back()
              }
              // this.$router.replace({name: 'reportEdit', params: {id: report.id}})
            }, (e) => {
              console.error(e)
              Message.error(typeof e === 'string' ? e : '服务器错误')
            })
          }

          let onSave
          if (this.report && (!this.report.id && this.report.title === '未命名')) {
            onSave = () => {
              this.$emit('vuedals:close')

              openSaveConfirm = true
              this.$vuedals.open({
                name: 'saveInputName',
                title: '保存报表',
                props: {
                  onSave: _save
                },
                component: SaveInputName
              })
            }
          } else {
            onSave = () => _save()
          }

          openSaveConfirm = true
          this.$vuedals.open({
            name: 'saveConfirm',
            title: '提示',
            props: {
              onSave,
              onNotSave: () => {
                this.$emit('vuedals:close')
                this.$store.commit('report/setReportChanged', false)

                if (to.name === 'penetration' || to.name === 'relation') {
                  next(true)
                } else {
                  this.$router.back()
                }
              }
            },
            component: SaveConfirm
          })
        } else {
          next()
        }
      })
      window.onbeforeunload = (e) => {
        if (this.isLeaveConfirm && !openSaveConfirm) {
          const dialogText = '系统可能不会保存您所做的更改。'
          e.returnValue = dialogText
          return dialogText
        }
      }
      // document.addEventListener('keyup', this.redo)
    },

    beforeDestroy () {
      this.$store.commit('report/unsetReport')
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      if (this.unsubscribe2) {
        this.unsubscribe2()
      }
      this.$vuedals.$off('vuedals:destroyed', this.closeSaveConfirm)
      window.onbeforeunload = null
      // document.removeEventListener('keyup', this.redo)
    },

    computed: {
      isLeaveConfirm () {
        return this.isChanged && this.editable
      },

      editable () {
        return this.mode === 'edit' || this.mode === 'new'
      },

      isChanged () {
        return this.$store.state.report.isChanged
      },

      isInit () {
        return this.$store.state.report.isInit
      },

      section () {
        return this.$store.getters['report/currentSection']
      },

      report () {
        return this.$store.state.report.report
      },

      notifications () {
        return this.$store.state.report.notifications
      }
    },
    methods: {
      redo (event) {
        if (!event.ctrlKey || event.keyCode !== 90) {
          return
        }
        if (!redoStack.length) {
          return
        }

        const reportState = redoStack.pop()
        this.$store.replaceState(Object.assign({}, this.$store.state, {report: JSON.parse(reportState)}))
      },
      load () {
        this.loading = true
        Promise.resolve().then(() => {
          if (!this.init) {
            return this.$store.dispatch('report/initReport')
          }
        }).then(() => {
          return this.mode !== 'new' ? this.$store.dispatch('report/findReport', this.id) : null
        }, (e) => {
          Message.error(typeof e === 'string' ? e : '初始化报表配置失败')
        }).then(() => {
          this.loading = false
          this.$nextTick(() => {
            if (!this.report) {
              Message.error('请先选择数据集')
              this.$router.back()
            }
          })
        }, (e) => {
          console.error(e)
          Message.error(typeof e === 'string' ? e : '获取报表信息失败')
          this.$router.push({name: 'reports'})
        })
      },
      dismissNotification (id) {
        this.$store.commit('report/dismissNotification', {id})
      }
    },

    watch: {
      editable (editable) {
        if (!editable) {
          this.$store.commit('report/selectVisualContainer', null)
        }
      }
    }
  }
</script>
