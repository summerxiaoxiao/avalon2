<template>
  <div class="linkage-forms__relation">
    <div class="row">
      <label class="col-1 col-form-label">关联关系：</label>
      <div class="col-10">
        <div class="linkage-forms__header linkage-forms__header--right">
          <div class="linkage-forms__header__actions">
            <button class="btn btn-primary" @click="addRelation">添加关联</button>
          </div>
        </div>
        <div class="data-table">
          <div class="data-table__head">
            <div class="data-table__row">
              <div class="data-table__column" style="width: 20%">源字段</div>
              <div class="data-table__column" style="width: 20%">源数据集</div>
              <div class="data-table__column" style="width: 20%">目标字段</div>
              <div class="data-table__column" style="width: 20%">目标数据集</div>
              <div class="data-table__column" style="width: 20%">操作</div>
            </div>
          </div>
          <scrollbar class="flex flex-auto">
          <div class="data-table__body">
            <div class="data-table__row" v-for="relation of fieldRelations" :key="relation.id">
              <div class="data-table__column" style="width: 20%">{{relation.sourceFieldName}}</div>
              <div class="data-table__column" style="width: 20%">{{relation.sourceDatasetName}}</div>
              <div class="data-table__column" style="width: 20%">{{relation.targetFieldName}}</div>
              <div class="data-table__column" style="width: 20%">{{relation.targetDatasetName}}</div>
              <div class="data-table__column" style="width: 20%">
                <div class="data-table__actions">
                  <a href="#" title="编辑" @click.prevent="editRelation(relation)"> <i class="iconfont yg-bianji1"></i> </a>
                  <a href="#" title="删除" @click.prevent="deleteRelation(relation.id)"> <i class="iconfont yg-shanchu"></i> </a>
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
  import DeleteConfirm from '../common/DeleteConfirm.vue'
  import RelationSelect from './modal/RelationSelect.vue'
  import Scrollbar from '../common/Scrollbar.vue'

  export default {
    components: {Scrollbar},
    name: 'linkage-relation',
    props: {
      node: Object
    },
    computed: {
      fieldRelations () {
        return this.node ? this.node.fieldRelations : []
      }
    },
    methods: {
      addRelation () {
        this.$vuedals.open({
          name: 'relationSelect',
          title: '添加关联',
          props: {
            node: this.node
          },
          component: RelationSelect
        })
      },
      editRelation (relation) {
        this.$vuedals.open({
          name: 'relationSelect',
          title: '编辑关联',
          props: {
            relation,
            node: this.node
          },
          component: RelationSelect
        })
      },
      deleteRelation (relationId) {
        this.$vuedals.open({
          name: 'deleteRelation',
          title: '删除关联',
          props: {
            title: '删除此关联',
            message: '是否确定删除此关联',
            onConfirm: () => {
              return this.$store.dispatch('linkage/deleteFieldRelation', {id: this.node.id, relationId})
            }
          },
          component: DeleteConfirm
        })
      }
    }
  }
</script>
