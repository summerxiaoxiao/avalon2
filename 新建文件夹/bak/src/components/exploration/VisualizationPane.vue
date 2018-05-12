<template>
  <resizable-pane class="visualization-pane side-pane" :class="{'side-pane--collapsed': isCollapsed}" containerId="pvExplorationHost" paneSide="left" sibling="task-pane" :expanded="!isCollapsed" :minWidth=200 :maxWidth="420" :collapsedWidth="27" :defaultWidth="200">
    <div class="pane-header">
      <button class="toggle-btn" @click.prevent="togglePane" title="显示/隐藏窗格" aria-label="显示/隐藏窗格">
        <span v-if="!isCollapsed" class="side-pane-horizontal-title side-pane-title unselectable trimmed-text-with-ellipsis">可视化</span>
        <span class="vertical-title"><span>可视化</span><span>筛选器</span></span>
      </button>
    </div>
    <div class="pane-contents flex">
      <div class="lazy-load-wrapper">
        <visual-types-container :types="visualTypes" :activeType="activeVisualType" @active="activeVisual"></visual-types-container>
      </div>
      <div class="section-header item-auto unselectable">
        <ul>
          <li v-if="isDataVisualType" class="section-tab" :class="{active: activeTab === 'field'}" @click.prevent="toggleTab('field')">属性</li>
          <li class="section-tab" :class="{active: activeTab === 'format'}" @click.prevent="toggleTab('format')">格式</li>
        </ul>
      </div>
      <div class="section-host item-fill" v-show="activeTab === 'field'" v-if="isDataVisualType">
        <scrollbar>
          <div class="lazy-load-wrapper">
            <field-well :buckets="fieldWellBuckets" :properties="fieldWellProperties" :visualType="activeVisualType"></field-well>
          </div><!-- /.lazy-loader-wrapper -->
          <h3 class="section-header"><span class="section-title side-pane-title unselectable">筛选器</span></h3>
          <filter-well v-if="activeVisualType"></filter-well>
        </scrollbar>
      </div><!-- /.section-host -->
      <div class="lazy-load-wrapper stretch item-fill" v-show="activeTab === 'format'">
        <visual-format-pane v-if="currentVisualContainer"></visual-format-pane>
        <page-format-pane v-else></page-format-pane>
      </div>
    </div>
  </resizable-pane>
</template>
<script>
  import Scrollbar from '../common/Scrollbar'
  import ResizablePane from '../common/ResizablePane.vue'

  import FilterWell from './FilterWell.vue'
  import FieldWell from './FieldWell.vue'
  import PageFormatPane from './format/PageFormatPane.vue'
  import VisualTypesContainer from './VisualTypesContainer.vue'
  import { isDataVisualType } from '../../api/common'
  import VisualFormatPane from './format/VisualFormatPane.vue'
  import { VISUAL_TYPE_LIST } from '../../api/constant'
  import dragScroll from '../mixins/dragScroll'

  const DragScrollBar = {
    'extends': Scrollbar,
    mixins: [dragScroll]
  }

  export default {
    name: 'visualization-pane',
    components: {
      VisualFormatPane,
      VisualTypesContainer,
      PageFormatPane,
      FilterWell,
      FieldWell,
      ResizablePane,
      'scrollbar': DragScrollBar
    },

    data () {
      return {
        isCollapsed: false,
        activeTab: 'field'
      }
    },

    computed: {
      visualTypes () {
        return VISUAL_TYPE_LIST.filter(item => item.visible)
      },
      currentVisualContainer () {
        return this.$store.getters['report/currentVisualContainer']
      },
      activeVisualType () {
        return this.currentVisualContainer ? this.currentVisualContainer.type : null
      },
      fieldWellBuckets () {
        return this.$store.getters['report/fieldWellBuckets']
      },
      fieldWellProperties () {
        return this.$store.getters['report/currentFieldProperties']
      },
      isDataVisualType () {
        return isDataVisualType(this.activeVisualType)
      }
    },

    methods: {
      activeVisual (type) {
        if (this.currentVisualContainer && isDataVisualType(this.currentVisualContainer.type)) {
          this.$store.commit('report/transformVisualType', {id: this.currentVisualContainer.id, type})
        } else {
          this.$store.commit('report/createVisualContainer', {type})
        }
      },

      togglePane () {
        this.isCollapsed = !this.isCollapsed
      },

      toggleTab (activeTab) {
        this.activeTab = activeTab
      }
    },
    watch: {
      isDataVisualType (value) {
        if (!value) {
          this.activeTab = 'format'
        }
      }
    }
  }
</script>
