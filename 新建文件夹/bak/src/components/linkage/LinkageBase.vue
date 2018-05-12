<template>
  <div class="linkage-forms__base">
    <div class="row">
      <label class="col-1 col-form-label">{{node.ldlx == 0 ? '关联名称' : '穿透名称'}}：</label>
      <div class="col-10 col-form-input linkage-name-edit">
        <div @dblclick="editable = true" class="editable-label-container">
          <editable-label :label="node.name || node.chartName" :editable="editable" :maxLength="64" @cancel="editable = false" @change="editNodeName" inputClass="form-control form-control--small"></editable-label>
          <button v-if="!editable" @click="editable = true" type="button" class="btn-icon" title="编辑"><i class="iconfont yg-bianji"></i></button>
          <loader v-if="saving"></loader>
        </div>
      </div>
    </div>
    <div class="row">
      <label class="col-1 col-form-label">源图表：</label>
      <div class="col-10 col-form-input">
        <input type="text" class="form-control-plaintext" readonly :value="node.parent.chartName">
      </div>
    </div>
    <div class="row">
      <label class="col-1 col-form-label">目标图表：</label>
      <div class="col-10 col-form-input">
        <input type="text" class="form-control-plaintext" readonly :value="node.chartName">
      </div>
    </div>
  </div>
</template>
<script>
  import {Message} from 'element-ui'
  import EditableLabel from '../common/EditableLabel.vue'
  import Loader from '../common/Loader.vue'

  export default {
    components: {
      Loader,
      EditableLabel},
    name: 'linkage-base',
    props: {
      node: Object
    },
    data () {
      return {
        saving: false,
        editable: false
      }
    },
    methods: {
      editNodeName (name) {
        const typeStr = this.node.ldlx === '0' ? '关联' : '穿透'
        if (name !== '') {
          this.editable = false
          if (this.node.name === name) {
            return
          }
          this.saving = true
          this.$store.dispatch('linkage/saveNodeName', {
            id: this.node.id,
            name: name
          }).then(() => {
            this.saving = false
          }, (...args) => {
            console.error(args)
            Message.error(`保存${typeStr}名称失败`)
            this.saving = false
          })
        }
      }
    }
  }
</script>
