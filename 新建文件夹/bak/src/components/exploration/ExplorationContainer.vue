<template>
  <div class="exploration-container">
    <exploration-app-bar :mode="mode" :editable="editable" :section="section" :report="report"></exploration-app-bar>
    <div class="exploration-host">
      <div class="fill-available-space vertical-items-container" id="pvExplorationHost">
        <task-pane v-if="editable"></task-pane>
        <visualization-pane v-if="editable"></visualization-pane>
        <canvas-items-pane v-if="isSelectCanvasItems" :editable="editable"></canvas-items-pane>
        <div class="horizontal-items-container" id="exploration">
          <div class="exploration">
            <exploration-canvas :editable="editable" v-if="section" :section="section" :isPopOut="isPopOut"></exploration-canvas>
          </div>
          <exploration-footer :editable="editable" v-if="!isPopOut"></exploration-footer>
        </div>
      </div>
    </div>
    <exploration-mask :show="$store.state.report.saving"></exploration-mask>
  </div><!-- /.exploration-container -->
</template>

<script>
  import ExplorationAppBar from './ExplorationAppBar.vue'
  import TaskPane from './TaskPane.vue'
  import VisualizationPane from './VisualizationPane.vue'
  import ExplorationFooter from './ExplorationFooter.vue'
  import ExplorationCanvas from './ExplorationCanvas.vue'
  import ExplorationMask from './ExplorationMask.vue'
  import CanvasItemsPane from './CanvasItemsPane.vue'

  export default {
    name: 'exploration-container',

    components: {
      CanvasItemsPane,
      ExplorationMask,
      ExplorationCanvas,
      ExplorationFooter,
      VisualizationPane,
      TaskPane,
      ExplorationAppBar
    },

    props: {
      mode: String,
      editable: Boolean,
      report: Object,
      section: Object
    },

    computed: {
      isSelectCanvasItems () {
        return this.$store.state.report.isSelectCanvasItems
      },
      isPopOut () {
        return !!this.$store.getters['report/popOutId']
      }
    }
  }
</script>
