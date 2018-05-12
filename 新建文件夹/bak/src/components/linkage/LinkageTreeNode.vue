<template>
  <div class="linkage-node" :class="{'linkage-node--root': isRoot}">
    <div class="linkage-node__content " :class="{'linkage-node__content--selected': selected}" @click="selectNode()">
      <span class="linkage-node__content__name trimmed-text-with-ellipsis" :title="node.chartName">{{node.chartName}}</span>
      <span class="linkage-node__content__section-name trimmed-text-with-ellipsis" :title="node.sectionName">
        <i class="iconfont yg-qiapian"></i> {{node.sectionName}}
      </span>
      <span class="linkage-node__content__actions">
        <button type="button" class="btn-icon" v-if="node.ldlx === '1' || isRoot" :title="node.ldlx === '0' ? '添加关联' : '添加穿透'"><i class="iconfont yg-tianjia" @click.stop="addNode"></i></button>
        <button type="button" class="btn-icon" :title="node.ldlx === '0' ? '删除关联' : '删除穿透'"><i class="iconfont yg-shanchu1" v-if="!isRoot" @click.stop="deleteNode"></i></button>
      </span>
    </div>

    <div class="linkage-node__children" v-if="node.children && node.children.length">
      <linkage-tree-node v-for="child in node.children" :key="child.id" :node="child">
      </linkage-tree-node>
    </div><!-- /.linkage-node__children -->
  </div><!-- /.linkage-node -->
</template>
<script>
  import {Message} from 'element-ui'
  import _ from 'underscore'
  import VisualSelect from './modal/VisualSelect.vue'
  import DeleteConfirm from '../common/DeleteConfirm.vue'

  export default {
    name: 'linkage-tree-node',
    props: {
      node: Object,
      isRoot: Boolean
    },
    computed: {
      typeStr () {
        return this.node.ldlx === '0' ? '关联' : '穿透'
      },
      selected () {
        return this.$store.state.linkage.selectedNodeId === this.node.id
      }
    },
    methods: {
      deleteNode () {
        let message

        if (this.node.ldlx === '0') {
          message = `是否确定删除此${this.typeStr}图表`
        } else {
          message = `是否确定删除此${this.typeStr}图表，<br />确认后将删除此图表关联及此图表下的所有${this.typeStr}图表`
        }

        this.$vuedals.open({
          name: 'deleteNode',
          title: `删除${this.typeStr}`,
          props: {
            title: `删除此${this.typeStr}图表`,
            message,
            onConfirm: () => {
              return this.$store.dispatch('linkage/deleteNode', this.node.id)
            }
          },
          component: DeleteConfirm
        })
      },
      addNode () {
        const hasRowMode = _.some(this.node.children || [], node => {
          return node.mode === '0'
        })
        if (hasRowMode && this.node.ldlx === '1') {
          Message.warning('当前节点已存在行穿透，不能再定义穿透图表')
          return
        }
        this.$vuedals.open({
          name: 'visualSelect',
          title: '选择图表',
          props: {
            parentNode: this.node
          },
          component: VisualSelect
        })
      },
      selectNode () {
        if (this.isRoot || this.selected) {
          return
        }
        this.$store.commit('linkage/selectNode', this.node.id)
      }
    }
  }
</script>
