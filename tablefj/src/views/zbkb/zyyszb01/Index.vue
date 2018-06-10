<template>
  <div  class="h-content-main">
    <div class="h-content-box">
      <div  class="zyyszb-box-left">
        <jyzb title="经营考核指标" :data="jyzbData"></jyzb>
      </div>
      <div  class="zyyszb-box-right">
        <layout :rows="rows" :data="data" v-if="isFinish"></layout>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import moment from 'moment'
  import {Message} from 'element-ui'
  import bbconst from '@/config/constant'
  import Jyzb from './Jyzb.vue'
  import Layout from '@/views/common/Layout.vue'
  import IndexIframetable from '@/views/components/IndexIframetable.vue'
  import IndexTablechart from '@/views/components/IndexTablechart.vue'

  import {findZblist, findYbpList} from '../../../services/ZyyszbService'
  export default {
    name: 'zyyszb01-app-content',
    components: {
      Jyzb,
      Layout
    },
    prop: {
      // dwxzName: String,
      // orgId: String,
      // yearmonth: String
    },
    data () {
      return {
        data: {},
        jyzbData: {},
        isFinish: false
      }
    },
    computed: {
      rows () {
        return [
          [{
            span: 12,
            key: 'cwzbBase',
            component: IndexIframetable,
            props: {
              title: '财务指标',
              data: {
                bbmc: bbconst.bgmc_xmdl,
                tableQueryCondition: {
                  month_id: this.yearMonth
                },
                cellCallback: function (cell, cellData, rowData, rowIndex, colIndex, colMap, $obj) {
                  if (colIndex === 1) {
                    $(cell).css('color', 'red')
                  }
                }
              }
            }
          }],
          [{
            span: 12,
            key: 'sxfyhjBase',
            component: IndexTablechart,
            props: {
              title: this.titleArr[0].title,
              unit: this.titleArr[0].unit,
              chartSeries: [{
                type: 'pie',
                name: '',
                radius: ['0%', '60%'], // 内圈半径，外圈半径
                center: ['50%', '50%'], //  饼状图位置，第一个参数是左右，第二个是上下。
                label: {
                  normal: {
                    formatter: '{b}:{c} ({d}%)',
                    position: 'inner',
                    show: false
                  }
                },
                data: []
              }]
            }
          }],
          [{
            span: 12,
            key: 'qtkkfyBase',
            component: IndexTablechart,
            props: {
              unit: this.titleArr[1].unit,
              title: this.titleArr[1].title,
              chartSeries: [{
                type: 'pie',
                name: '',
                radius: ['0%', '50%'], // 内圈半径，外圈半径
                center: ['50%', '50%'], //  饼状图位置，第一个参数是左右，第二个是上下。
                label: {
                  normal: {
                    formatter: '{b}:{c} ({d}%)',
                    position: 'inner',
                    show: false
                  }
                }
              }, {
                type: 'pie',
                name: '',
                radius: ['58%', '70%'], // 内圈半径，外圈半径
                center: ['50%', '50%'], //  饼状图位置，第一个参数是左右，第二个是上下。
                label: {
                  normal: {
                    formatter: '{b}:{c} ({d}%)',
                    position: 'inner',
                    show: false
                  }
                }
              }]
            }
          }]
        ]
      },
      titleArr () {
        if (this.dwxzName === '省公司') {
          return [
            {title: '三项费用合计(万元)', unit: '万元'},
            {title: '其他可控费用(万元)', unit: '万元'}
          ]
        } else if (this.dwxzName === '分公司') {
          return [
            {title: '可控费用合计(万元)', unit: '万元'},
            {title: '其他可控费用(万元)', unit: '万元'}
          ]
        }
        return [
          {title: '三项费用合计(万元)', unit: '万元'},
          {title: '其他可控费用(万元)', unit: '万元'}
        ]
      },
      dwxzName () {
        return this.$store.state.app.selectDwxz.name || '省公司'
      },
      orgId () {
        return this.$store.state.app.selectDw.dwdm
      },
      yearMonth () {
        return moment(this.$store.state.app.date, 'YYYYMM').format('YYYYMM')
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.fetchData()
      })
    },
    methods: {
      getParams () {
        return {code: this.code, orgId: this.orgId, yearMonth: this.yearMonth}
      },
      getQueries () {
        const params = this.getParams()
        const queries = []
        const wrap = (key, promise) => {
          return promise.then(data => ({key, data}))
        }
        queries.push(wrap('jyzbBase', findYbpList(params, this.dwxzName))) // 查询经营指标
        if (this.dwxzName === '省公司') {
          // 查询三项费用合计，查询可控费用
          queries.push(wrap('sxfyhjBase', findZblist(params, this.dwxzName)))
          queries.push(wrap('qtkkfyBase', findZblist(params, this.dwxzName)))
        } else if (this.dwxzName === '分公司') {
          // 查询三项费用合计，查询可控费用
          queries.push(wrap('sxfyhjBase', findZblist(params, this.dwxzName)))
          queries.push(wrap('qtkkfyBase', findZblist(params, this.dwxzName)))
        }
        return queries
      },
      fetchData () {
        this.loading = true
        return Promise.all(this.getQueries()).then(result => {
          this.data = {}
          result.forEach(res => {
            this.$set(this.data, res.key, res.data)
          })
          this.isFinish = true
          this.loading = false
          this.jyzbData = this.data['jyzbBase']
        }, (e) => {
          this.loading = false
          console.error(e)
          Message.error('获取数据失败')
        })
      }
    }
    // watch: {
    //   '$route.query' () {
    //     this.fetchData()
    //   }
    // }
  }
</script>
