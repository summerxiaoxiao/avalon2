<script>
  import $ from 'jquery'
  import _ from 'underscore'

  import Visual from './Visual.vue'
  import { ENABLE_JH, FORMAT_TYPES, QUERY_TYPE } from '../../../api/constant'
  import { getFormatValue } from '../../../api/common'

  export default {
    name: 'ETable',
    mixins: [Visual],

    computed: {
      queryType () {
        const queryType = getFormatValue(this.format, FORMAT_TYPES.EXTEND, FORMAT_TYPES.EXTEND_QUERY_MODE)
        return !_.isUndefined(queryType) ? parseInt(queryType) || 0 : 0
      }
    },

    created () {
      this.renderTable = _.debounce(this.renderTable, 20, true)
    },

    mounted () {
      if (this.data) {
        this.renderTable(this.data, this.format || {})
      }
    },

    render (createElement) {
      return createElement('div')
    },

    beforeDestroy () {
      this.$tableEl && this.$tableEl.zTable('destroy')
    },

    methods: {
      menuOptions (options, vc) {
        if (this.editable && !this.appending) {
          options = options.concat([
            '/',
            {
              name: '编辑穿透',
              props: {
                icon: 'yg-bianjichuantou'
              },
              on: {
                click: () => {
                  this.$router.push({name: 'penetration', params: {id: this.id}})
                }
              }
            },
            {
              name: '编辑关联',
              props: {
                icon: 'yg-bianjiguanlian'
              },
              on: {
                click: () => {
                  this.$router.push({name: 'relation', params: {id: this.id}})
                }
              }
            }
          ])
        }
        if (ENABLE_JH && !_.isEmpty(this.config.fieldProperties)) {
          let queryType = this.queryType

          options = options.concat([
            '/',
            {
              name: '查询模式',
              props: {
                selected: queryType === QUERY_TYPE.NORMAL
              },
              on: {
                click: () => {
                  const params = Object.assign({}, this.queryParams || {}, {qureyType: QUERY_TYPE.NORMAL})
                  delete params['scrollId']
                  vc.fetchData(params)
                }
              }
            },
            {
              name: '聚合模式',
              props: {
                selected: queryType === QUERY_TYPE.JH
              },
              on: {
                click: () => {
                  this.$store.commit('report/setVisualContainerPropertyFormat', {
                    id: this.id,
                    cardName: FORMAT_TYPES.EXTEND,
                    sliceValues: {
                      [FORMAT_TYPES.EXTEND_QUERY_MODE]: QUERY_TYPE.JH
                    }
                  })
                  const params = Object.assign({}, this.queryParams || {}, {qureyType: QUERY_TYPE.JH})
                  vc.fetchData(params)
                }
              }
            }
          ])
        }
        return options
      },
      resize (size) {
        if (this.$tableEl) {
          this.$tableEl.zTable('changeH', size.height - this.getVisualTitleHeight())
        }
      },
      doFormat (format) {
        if (this.$tableEl) {
          this.$tableEl.zTable('formatFunc', format)
        }
      },
      renderTable (res, format) {
        this.$tableEl = $(this.$el)
        this.$tableEl && this.$tableEl.zTable('destroy')
        const height = this.height - this.getVisualTitleHeight()
        this.$tableEl.zTable({
          data: res,
          format,
          defaultFormat: this.defaultFormat,
          tableOpts: {
            height,
            scrollY: height,
            paging: true,
            pageLength: 500,
            isTotal: true,
            isFreezeArr: false
          },
          callback: function () {},
          reRender: (params) => {
            this.$emit('fetchData', params)
          },
          pageReq: (params) => {
            this.$emit('fetchData', params)
          },
          sort: (params) => {
            this.$emit('sortData', params)
          },
          postMessage: (params) => {
            this.$emit('postMessage', params)
          },
          linkage: (params) => {
            this.$emit('linkage', params.linkage_switch, this.resolveLinkageData(params))
          }
        })
      },
      resolveLinkageData (params) {
        const {rowData, tbldData} = params
        const result = []
        for (const row of tbldData) {
          const sourceData = {}
          for (const cond of (row.tbldtjDtos || [])) {
            const ctKey = cond.yzd
            sourceData[ctKey] = rowData[ctKey]
          }
          result.push({
            visualContainerId: row.tbid,
            linkage: {
              jdid: row.jdid,
              soureData: sourceData
            }
          })
        }
        return result
      }
    },
    watch: {
      data (data) {
        if (!data) {
          return
        }

        const tablebasicInfo = data.tablebasicInfo
        if (tablebasicInfo && tablebasicInfo.sffy === '1') {
          this.$tableEl && this.$tableEl.zTable('ajaxFunc', data)
        } else {
          this.renderTable(data, this.format || {})
        }
      }
    }
  }
</script>
