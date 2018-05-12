<template>
  <div @dblclick="editable = true" class="editable-label-container">
    <editable-label :label="title" :editable="editable" @change="editTitleHandler" @cancel="editable = false" :maxLength="64">
      <button @click="editable = true" type="button" class="btn-icon" title="编辑"><i class="iconfont yg-bianji"></i> </button>
    </editable-label>
  </div>
</template>
<script>
  import EditableLabel from '../common/EditableLabel.vue'

  export default {
    components: {EditableLabel},
    name: 'app-bar-title',
    props: {
      title: String
    },
    data () {
      return {
        editable: false
      }
    },
    methods: {
      editTitleHandler (newTitle) {
        if (newTitle !== '') {
          this.editable = false
          if (newTitle !== this.title) {
            this.$store.commit('report/setReportTitle', newTitle)
          }
        }
      }
    },
    watch: {
      '$store.state.report.saveError.titleExists' (exists) {
        if (exists === true) {
          window.setTimeout(() => {
            this.editable = true
          }, 600)
        }
      }
    }
  }
</script>
