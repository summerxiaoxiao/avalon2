<template>
  <resizable-pane class="visualization-pane side-pane" :class="{'side-pane--collapsed': isCollapsed}" containerId="pvExplorationHost" paneSide="left" sibling="task-pane" :expanded="!isCollapsed" :minWidth=200 :maxWidth="420" :collapsedWidth="27" :defaultWidth="200">
    <div class="pane-header">
      <button class="toggle-btn" @click.prevent="togglePane" :title="!isCollapsed ? '折叠窗口' : '展开窗口'" :aria-label="!isCollapsed ? '折叠窗口' : '展开窗口'">
        <span v-if="!isCollapsed" class="side-pane-horizontal-title side-pane-title unselectable trimmed-text-with-ellipsis">选择图表</span>
        <span class="vertical-title"><span>选择图表</span></span>
      </button>
      <button class="btn-icon canvas-items-close" v-if="!isCollapsed"><i class="iconfont yg-shanchu" @click.stop="hideSelectCanvasItems"></i></button>
    </div>
    <div class="pane-contents flex">
      <section class="canvas-items-section flex-auto">
        <div class="canvas-items-actions">
          <div class="canvas-items-actions-move">
            <button @click.prevent="bringForward()" title="上移一层" class="btn-icon" :disabled="!editable">
              <i class="iconfont yg-paixu-shang"></i>
            </button>
            <button @click.prevent="sendBackward()" title="下移一层" class="btn-icon" :disabled="!editable">
              <i class="iconfont yg-paixu-xia"></i>
            </button>
          </div>
          <div class="canvas-items-actions-visibility">
            <button @click.prevent="setVisibility(true)" title="显示全部" class="btn-icon" :disabled="!editable">显示全部</button>
            <button @click.prevent="setVisibility(false)" title="隐藏全部" class="btn-icon" :disabled="!editable">隐藏全部</button>
          </div>
        </div>
        <scrollbar>
          <canvas-items-list :items="visualContainers" :selectedId="selectedVisualContainerId " :editable="editable"></canvas-items-list>
        </scrollbar>
      </section>
    </div>
  </resizable-pane>
</template>

<script>
  import _ from 'underscore'
  import Scrollbar from '../common/Scrollbar'
  import ResizablePane from '../common/ResizablePane.vue'
  import CanvasItemsList from './CanvasItemsList.vue'
  import dragScroll from '../mixins/dragScroll'

  const DragScrollBar = {
    'extends': Scrollbar,
    mixins: [dragScroll]
  }

  export default {
    components: {
      CanvasItemsList,
      ResizablePane,
      'scrollbar': DragScrollBar
    },
    name: 'canvas-items-pane',
    props: {
      editable: Boolean
    },
    data () {
      return {
        isCollapsed: false
      }
    },
    computed: {
      visualContainers () {
        return this.$store.getters['report/currentVisualContainers'].reverse()
      },
      selectedVisualContainerId () {
        return this.$store.state.report.currentVisualContainerId
      }
    },
    methods: {
      hideSelectCanvasItems () {
        this.$store.commit('report/toggleSelectCanvasItems', false)
      },
      setVisibility (visibility) {
        const id = this.visualContainers.map(d => d.id)
        this.$store.commit('report/setVisualContainerVisibility', {
          id,
          visibility
        })
      },
      togglePane () {
        this.isCollapsed = !this.isCollapsed
      },
      bringForward () {
        const selectedId = this.selectedVisualContainerId
        if (!selectedId) {
          return
        }
        const visualContainer = _.find(this.visualContainers, visualContainer => visualContainer.id === selectedId)
        if (!visualContainer) {
          return
        }
        const fromIndex = visualContainer.z
        let toIndex
        if (fromIndex !== -1) {
          toIndex = fromIndex + 2
          this.$store.commit('report/sortVisualContainer', {id: selectedId, fromIndex, toIndex})
        }
      },
      sendBackward () {
        const selectedId = this.selectedVisualContainerId
        if (!selectedId) {
          return
        }
        const visualContainer = _.find(this.visualContainers, visualContainer => visualContainer.id === selectedId)
        if (!visualContainer) {
          return
        }
        const fromIndex = visualContainer.z
        let toIndex
        if (fromIndex !== -1) {
          toIndex = fromIndex - 1
          this.$store.commit('report/sortVisualContainer', {id: selectedId, fromIndex, toIndex})
        }
      }
    }
  }
</script>
