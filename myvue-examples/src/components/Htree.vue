<style lang="scss">
  .tree-box {
    padding: 10px 25px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    min-height: 400px;
    .ellipsis {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    p {
      padding: 0;
      margin: 0;
    }
    .tree-ul {
      padding-left: 20px !important;
      line-height:20px;
    }
    .tree-ul:first-child {
      padding-left: 0 !important
    }
    .folder, .node {
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .folder-box {
      cursor: pointer;
      line-height:20px;
    }
    .folder-logo {
      display: inline-block;
      width: 12px;
      height: 11px;
      line-height: 7px;
      font-weight: 400;
      border: 1px solid #8e7878;
      color: #000;
      background: rgba(91, 192, 222, 0.1);
      text-align: center;
      float: left;
      margin-left: -15px;
      margin-top: 6px;
      margin-right: 5px;
    }
    .folder-true {
      color: #2494f2;
    }
    .node-true {
      color: #2494f2;
    }
  }
</style>

<template>
  <div id = 'tree-box' class = 'tree-box' v-if='list'>
    <tree_item :list='treelist' :pnode.once='{root: true, isOpen: true}'></tree_item>
  </div>
</template>

<script type="text/javascript">
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
  let DEFAULT_OPTIONS = {
    callback: undefined // 自定义点击事件，callback(node)
  }
  let pageParams = {
    node: {default: true},
    folder: {default: true}
  }
  import treeItem from './HtreeItem.vue'
  export default {
    props: {
      list: {
        type: Array,
        required: false,
        default: function () {
          return DEFAULT_NODE
        }
      },
      options: {
        type: Object,
        default: function () {
          return DEFAULT_OPTIONS
        }
      }
    },
    data () {
      return {
        treelist: []
      }
    },
    // computed: {
    //   treelist () {
    //     return this.list
    //   }
    // },
    methods: {
      initTree () {
        let tempList = JSON.parse(JSON.stringify(this.list))
        let loadDatas = function (datas) {
          datas.forEach((item) => {
            item.isOpen = item.isOpen || false
            item.hightLight = item.hightLight || false
            item.className = item.className || ''
            item.childs = item.childs || []
            if (item.childs.length > 0) {
              if (item.hightLight) {
                pageParams.folder = item
              }
              loadDatas(item.childs)
            } else {
              if (item.hightLight) {
                pageParams.node = item
              }
              item.isOpen = false
            }
          })
        }
        loadDatas(tempList)
        this.treelist = tempList
      }
    },
    components: {
      tree_item: treeItem
    },
    created: function () {
      this.initTree()
    }
  }
</script>
