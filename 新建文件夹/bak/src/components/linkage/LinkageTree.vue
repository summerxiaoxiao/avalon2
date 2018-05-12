<template>
  <div class="linkage-tree">
    <linkage-tree-node :node="root" :isRoot="true"></linkage-tree-node>
  </div>
</template>
<script>
  import LinkageTreeNode from './LinkageTreeNode.vue'

  export default {
    components: {LinkageTreeNode},
    name: 'linkage-tree',
    props: {
      root: Object
    }
  }
</script>
