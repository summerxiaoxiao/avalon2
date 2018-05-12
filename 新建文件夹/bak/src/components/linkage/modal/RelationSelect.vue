<template>
  <div class="vuedal__content">
    <div class="linkage-relation">
      <div class="linkage-relation__block">
        <h3>源</h3>
        <div class="linkage-relation__block__content" v-if="sourceDataset">
          <div class="row">
            <label class="col-sm-4 col-form-label">数据集：</label>
            <div class="col-sm-4 col-form-input">
              <input type="text" class="form-control-plaintext" readonly :value="sourceDataset.name">
            </div>
          </div>
          <div class="row">
            <label class="col-sm-4 col-form-label">字段：</label>
            <div class="col-sm-4 col-form-input">
              <el-select v-model="sourceFieldId" filterable>
                <el-option v-for="item in sourceDataset.items" :key="item.id" :value="item.id" :label="item.name">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <div class="linkage-relation__block">
        <h3>目标</h3>
        <div class="linkage-relation__block__content" v-if="targetDataset">
          <div class="row">
            <label class="col-sm-4 col-form-label">数据集：</label>
            <div class="col-sm-4 col-form-input">
              <input type="text" class="form-control-plaintext" readonly :value="targetDataset.name">
            </div>
          </div>
          <div class="row">
            <label class="col-sm-4 col-form-label">字段：</label>
            <div class="col-sm-4 col-form-input">
              <el-select  v-model="targetFieldId" filterable>
                <el-option v-for="item in targetDataset.items" :key="item.id" :value="item.id" :label="item.name">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="vuedal__actions flex flex-right">
      <loader v-if="saving" style="display: inline-block"></loader>
      <button :disabled="saving" type="button" class="btn btn-black" @click.prevent="confirm">
        确定</button>
      <button type="button" class="btn btn-outline-black" @click.prevent="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>
<script>
  import _ from 'underscore'
  import {Message, Select, Option} from 'element-ui'
  import Loader from '../../common/Loader.vue'
  export default {
    components: {Loader, 'el-select': Select, 'el-option': Option},
    name: 'RelationSelect',
    props: {
      node: Object,
      relation: Object
    },
    data () {
      return {
        saving: false,
        sourceFieldId: this.relation ? this.relation.sourceFieldId : null,
        targetFieldId: this.relation ? this.relation.targetFieldId : null
      }
    },
    computed: {
      sourceDataset () {
        return this.$store.getters['linkage/sourceDataset']
      },
      targetDataset () {
        return this.$store.getters['linkage/targetDataset']
      }
    },
    mounted () {
      if (!this.sourceDataset) {
        this.$store.dispatch('linkage/fetchDataset', this.node.parentChartId)
      }
      if (!this.targetDataset) {
        this.$store.dispatch('linkage/fetchDataset', this.node.chartId)
      }
    },
    methods: {
      convert (items) {
        return items.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
      },
      confirm () {
        if (_.isEmpty(this.sourceFieldId) || _.isEmpty(this.targetFieldId)) {
          Message.error('源字段和目标字段不能为空')
          return
        }

        this.saving = true
        this.$store.dispatch('linkage/saveFieldRelation', {
          id: this.relation ? this.relation.id : null,
          linkageId: this.node.id,
          sourceDatasetId: this.sourceDataset.id,
          targetDatasetId: this.targetDataset.id,
          sourceFieldId: this.sourceFieldId,
          targetFieldId: this.targetFieldId
        }).then(() => {
          this.saving = false
          this.$emit('vuedals:close')
        }, (...args) => {
          this.saving = false
          console.error(args)
          Message.error('保存关系失败')
        })
      }
    }
  }
</script>
