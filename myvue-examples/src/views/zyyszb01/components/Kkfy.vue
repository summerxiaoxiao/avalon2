<template>
  <div class="zyyszb-kkfy h-box-column">
    <div class="zyyszb-item-title">可控费用（万元）</div>
    <div class="zyyszb-item h-box-row">
      <div class="zyyszb-item-list h-flex2">
        <h-tree-grid
          :items='data'
          :columns='columns'
          :options="options"
          @on-row-click='rowClick'
          @on-selection-change='selectionClick'
          @on-sort-change='sortClick'
        ></h-tree-grid>
      </div>
      <div class="zyyszb-item-chart h-flex1">
        chart
      </div>
    </div>
  </div>
</template>
<script>
  import Vuex from 'vuex'
  import HTreeGrid from '@/components/HTreeGrid.vue'
  import bbutils from '@/utils/bbutils'
  import bgmc from '@/config/constant'
  export default {
    name: 'zyyszb01-kkfy-app-content',
    components: {
      HTreeGrid
    },
    data () {
      return {
        bbCondition: {},
        bbItem: {},
        tableDom: null,
        options: {
          expandAll: true,
          isExpandClick: false,
          bgcolorField: [0]
        },
        columns: [{
          title: '编码',
          key: 'code',
          sortable: false,
          align: 'left'
        }, {
          title: '名称',
          key: 'name',
          align: 'center'
        }, {
          title: '状态',
          key: 'status',
          align: 'center'
        }, {
          title: '备注',
          key: 'remark',
          align: 'center'
        }],
        data: [{
          id: '1',
          code: '0001',
          name: '测试数据1',
          status: '启用',
          bgcolor: 'red',
          remark: '测试数据测试数据'
        }, {
          id: '2',
          code: '0002',
          name: '测试数据2',
          status: '启用',
          bgcolor: 'red',
          remark: '测试数据测试数据',
          children: [{
            id: '01',
            code: '020001',
            name: '测试数据01',
            status: '启用',
            bgcolor: 'red',
            remark: '测试数据测试数据'
          }, {
            id: '02',
            code: '020002',
            name: '测试数据02',
            status: '启用',
            bgcolor: 'red',
            remark: '测试数据测试数据'
          }]
        }, {
          id: '3',
          code: '0003',
          name: '测试数据3',
          status: '启用',
          bgcolor: 'red',
          remark: '测试数据测试数据'
        }, {
          id: '4',
          code: '0004',
          name: '测试数据4',
          status: '启用',
          bgcolor: 'red',
          remark: '测试数据测试数据'
        }, {
          id: '5',
          code: '00045',
          name: '测试数据4',
          status: '启用',
          bgcolor: 'red',
          remark: '测试数据测试数据'
        }, {
          id: '6',
          code: '00046',
          name: '测试数据4',
          status: '启用',
          bgcolor: 'red',
          remark: '测试数据测试数据'
        }, {
          id: '7',
          code: '00047',
          name: '测试数据4',
          status: '启用',
          remark: '测试数据测试数据'
        }]
      }
    },
    computed: {
      ...Vuex.mapState({
        'dwdm': state => state.ykqk.dwdm,
        'date': state => state.ykqk.date
      })
    },
    mounted () {
      this.$nextTick(function () {
        this.loadContent()
      })
    },
    methods: {
      reload () {
      },
      loadContent () {
        return this.$store.dispatch('zyyszb01/loadBar').then(() => {
          this.isFinish = true
          bbutils.loadBBItemByBbmc(bgmc.bgmc_xmdl).then((bbItem) => {
            console.log('....load chart..')
          })
        })
      },
      rowClick (data, index, event) {
        console.log('当前行数据:' + data)
        console.log('点击行号:' + index)
        console.log('点击事件:' + event)
      },
      selectionClick (arr) {
        console.log('选中数据id数组:' + arr)
      },
      sortClick (key, type) {
        console.log('排序字段:' + key)
        console.log('排序规则:' + type)
      }
    }
  }
</script>
