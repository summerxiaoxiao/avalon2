<template>
  <div class="linkage">
    <div class="flex flex-auto flex-center" v-if="loading">
      <loader></loader>
    </div>
    <div class="linkage-left" v-if="!loading">
      <linkage-tree :root="root" v-if="root"></linkage-tree>
    </div>
    <div class="linkage-right" v-if="!loading">
      <div class="linkage-forms" v-if="selectedNode">
        <linkage-base :node="selectedNode"></linkage-base>
        <linkage-mode :node="selectedNode"></linkage-mode>
        <linkage-relation :node="selectedNode"></linkage-relation>
      </div>
      <div class="flex flex-auto flex-center" v-if="root">
        <div class="linkage-empty" v-if="!selectedNode && isEmpty">
          <h4>您还没有建立过{{typeStr}}</h4>
          <p>可以试试 <a href="#" @click.prevent="selectVisual">添加{{typeStr}}图表</a> </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Message } from 'element-ui'
  import LinkageRelation from './LinkageRelation.vue'
  import LinkageMode from './LinkageMode.vue'
  import LinkageBase from './LinkageBase.vue'
  import LinkageTree from './LinkageTree.vue'

  import VisualSelect from './modal/VisualSelect.vue'
  import Loader from '../common/Loader.vue'

  export default {
    components: {
      Loader,
      LinkageRelation,
      LinkageBase,
      LinkageMode,
      LinkageTree
    },
    name: 'linkage',
    props: {
      id: [Number, String],
      type: String
    },
    data () {
      return {
        loading: false
      }
    },
    mounted () {
      this.loading = true
      this.$store.dispatch('linkage/fetchTree', {id: this.id, type: this.type === 'penetration' ? '1' : '0'}).then(() => {
        this.loading = false
        if (!this.root) {
          Message.error(`获取${this.typeStr}数据根节点失败`)
        }
      }, (e) => {
        console.error(e)
        Message.error(`获取${this.typeStr}数据失败`)
      })
    },
    computed: {
      typeStr () {
        return this.type === 'penetration' ? '穿透' : '关联'
      },
      isEmpty () {
        return !(this.root && this.root.children && this.root.children.length > 0)
      },
      selectedNode () {
        return this.$store.getters['linkage/selectedNode']
      },
      root () {
        return this.$store.getters['linkage/root']
      }
    },
    methods: {
      selectVisual () {
        if (!this.root) {
          return
        }
        this.$vuedals.open({
          name: 'visualSelect',
          title: '选择图表',
          props: {
            parentNode: this.root
          },
          component: VisualSelect
        })
      }
    },
    watch: {
      selectedNode (node, oldNode) {
        if (node && node !== oldNode) {
          this.$store.dispatch('linkage/fetchNodeRelation', node.id)
        }
      }
    }
  }
</script>
