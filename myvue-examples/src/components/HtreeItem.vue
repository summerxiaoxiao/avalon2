<template>
  <div>
    <div @click="clickFun(pnode)" v-if="!pnode.root" class="folder-box">
      <span v-if="!pnode.isOpen" class="folder-logo">+</span>
      <span v-if="pnode.isOpen" class="folder-logo">-</span>
      <p :class="['folder', 'folder-'.concat(pnode.hightLight)]">{{pnode ? pnode.name : ""}}</p>
    </div>
    <ul class="tree-ul" v-show="pnode.isOpen">
      <template v-for="item in list">
        <tree_item v-if="item.childs.length > 0"
                   :list="item.childs"
                   :pnode="item"></tree_item>
        <li @click="clickFun(item)"
            v-if="item.childs.length == 0"
            :class="['node', 'node-'.concat(item.hightLight)]">
          <div class="h-box-row">
            <div class="h-flex1">{{ item.name }}</div>
            <div class="h-flex1">{{ item.age }}</div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
  let DEFAULT_NODE = [
    {
      name: '一级目录', // 目录名字
      isOpen: true, // 是否初始展开目录
      hightLight: true, // 是否初始高亮
      className: undefined, // 添加自定义样式
      childs: [], // 二级目录
      ...{} // 其他用户额外参数
    }
  ]
  let pageParams = {
    node: {default: true},
    folder: {default: true}
  }
  export default {
    name: 'tree_item',
    props: {
      list: {
        type: Array,
        required: false,
        default: function () {
          return DEFAULT_NODE
        }
      },
      pnode: {
        type: Object,
        default: function () {
          return {
            isOpen: true,
            hightLight: '1'
          }
        }
      }
    },
    methods: {
      defaultClickFun (node) {
        pageParams.node.hightLight = pageParams.folder.hightLight = false
        node.isOpen = !node.isOpen
        node.hightLight = true
        if (node.childs.length > 0 && node.isOpen === false) { // 需要递归关闭子目录
          node.hightLight = false
          closeFolder(node)
        }
        if (node.childs.length > 0 && !checkChildNode(node, pageParams.folder)) { // 查询上一次点击的目录是当前目录的父目录还是兄弟目录
          pageParams.folder.isOpen = false
        }
        if (node.childs.length > 0) {
          pageParams.folder = node
        } else {
          pageParams.node = node
        }
      },
      clickFun (node) {
        if (this.$parent.options.callback) {
          this.$parent.options.callback(node)
        }
        this.defaultClickFun(node)
      }
    }
  }
  function closeFolder (node) {
    node.isOpen = false
    node.childs.forEach((item) => {
      closeFolder(item)
    })
  }
  function checkChildNode (comNode, node) {
    if (comNode === node || node.default) {
      return true
    }
    for (let i = 0; i < node.childs.length; ++i) {
      if (checkChildNode(comNode, node.childs[i])) return true
    }
    return false
  }
</script>
