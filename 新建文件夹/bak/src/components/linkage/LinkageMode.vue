<template>
  <div class="linkage-forms__mode">
    <div class="row">
      <label class="col-1 col-form-label">{{typeStr}}方式：</label>
      <div class="col-10">
        <div class="linkage-forms__header">
          <div class="linkage-forms__mode-type">
            <div class="form-check form-check-inline" :class="{disabled: rowModeDisabled}" :title="rowModeDisabled ? '同一层级行' + typeStr + '及字段' + typeStr + '不能并存' : null">
              <input name="penetration_mode" :disabled="rowModeDisabled" v-model="mode" class="form-check-input" type="radio" id="id_row" value="0" @click="saveMode('0')">
              <label class="form-check-label" for="id_row">行{{typeStr}}</label>
            </div>
            <div class="form-check form-check-inline" :class="{disabled: fieldModeDisabled}" :title="fieldModeDisabled ? '同一层级行' + typeStr + '及字段' + typeStr + '不能并存' : null">
              <input name="penetration_mode" :disabled="fieldModeDisabled" v-model="mode"  class="form-check-input" type="radio" id="id_field" value="1" @click="saveMode('1')">
              <label class="form-check-label" for="id_field">字段{{typeStr}}</label>
            </div>
          </div>
          <div class="linkage-forms__header__actions">
            <button class="btn btn-primary" @click.prevent="addField" :disabled="mode == 0">添加字段</button>
          </div>
        </div>
        <div class="data-table" v-if="mode == 1">
          <div class="data-table__head">
            <div class="data-table__row">
              <div class="data-table__column" style="width: 30%">字段名称</div>
              <div class="data-table__column" style="width: 50%">数据集</div>
              <div class="data-table__column" style="width: 20%">操作</div>
            </div>
          </div>
          <scrollbar class="flex flex-auto">
          <div class="data-table__body">
            <div class="data-table__row" v-for="field of fields">
              <div class="data-table__column" style="width: 30%">{{field.name}}</div>
              <div class="data-table__column" style="width: 50%">{{field.datasetName}}</div>
              <div class="data-table__column" style="width: 20%">
                <div class="data-table__actions">
                  <a href="#" title="删除" @click.prevent="deleteField(field.id)"> <i class="iconfont yg-shanchu"></i> </a>
                </div>
              </div>
            </div>
          </div>
          </scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Message } from 'element-ui'

  import DeleteConfirm from '../common/DeleteConfirm.vue'
  import FieldSelect from './modal/FieldSelect.vue'
  import Scrollbar from '../common/Scrollbar.vue'

  export default {
    components: {Scrollbar},
    name: 'linkage-mode',
    props: {
      node: Object
    },
    data () {
      return {
        mode: this.node.mode
      }
    },
    computed: {
      typeStr () {
        return this.node.ldlx === '0' ? '关联' : '穿透'
      },
      fields () {
        return this.node.fields ? this.node.fields : []
      },
      rowModeDisabled () {
        const parent = this.node.parent
        return this.node.mode === '1' && parent.children.length > 1
      },
      fieldModeDisabled () {
        const parent = this.node.parent
        return this.node.mode === '0' && parent.children.length > 1
      }
    },
    methods: {
      addField () {
        this.$vuedals.open({
          name: 'fieldSelect',
          title: '选择字段',
          props: {
            node: this.node
          },
          component: FieldSelect
        })
      },
      deleteField (fieldId) {
        this.$vuedals.open({
          name: 'deleteField',
          title: '删除字段',
          props: {
            title: '删除此字段',
            message: '是否确定删除此字段',
            onConfirm: () => {
              return this.$store.dispatch('linkage/deleteField', {id: this.node.id, fieldId: fieldId})
            }
          },
          component: DeleteConfirm
        })
      },
      saveMode (mode) {
        if (this.node.mode === mode) {
          return
        }

        if (mode === '0' && this.rowModeDisabled) {
          Message.warning('同一层级行穿透及字段穿透不能并存')
          this.mode = this.node.mode
          return false
        }

        this.$store.dispatch('linkage/saveMode', {
          id: this.node.id,
          mode
        }).catch((...args) => {
          console.error(args)
          Message.error(`设置${this.typeStr}方式失败`)
        })
      }
    },
    watch: {
      'node.mode' (mode) {
        this.mode = mode
      }
    }
  }
</script>
