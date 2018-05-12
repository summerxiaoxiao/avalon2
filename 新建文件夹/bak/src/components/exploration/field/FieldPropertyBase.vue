<script>
  import _ from 'underscore'

  import { BUCKET_ROLES, FORMAT_TYPES, MENU_ACTION_VALUE_MAP, SORT_TYPE, VISUAL_TYPES } from '../../../api/constant'
  import { makeMenuActions } from '../../../common/fieldPropertyMenuService'
  import ContextMenu from '../../../common/contextMenu'
  import { getFormatValue } from '../../../api/common'
  import EditableLabel from '../../common/EditableLabel.vue'
  import PropertyValuesSort from '../modals/PropertyValuesSort.vue'

  export default {
    data () {
      return {
        editable: false
      }
    },

    components: {
      EditableLabel
    },

    props: {
      property: Object,
      parentProperty: Object,
      renameHandler: Function,
      actionHandler: Function,
      removeHandler: Function
    },

    computed: {
      displayName () {
        if (this.property.alias) {
          return this.property.alias
        }
        const action = this.property.action || {}
        if (action.jh) {
          return `${MENU_ACTION_VALUE_MAP[action.jh]} （${this.property.desc}）`
        } else {
          return this.property.desc
        }
      },

      currentVisualContainer () {
        return this.$store.getters['report/currentVisualContainer']
      },

      queryType () {
        if (!this.currentVisualContainer) {
          return 0
        }
        const queryType = getFormatValue(this.currentVisualContainer.format, FORMAT_TYPES.EXTEND, FORMAT_TYPES.EXTEND_QUERY_MODE)
        return !_.isUndefined(queryType) ? parseInt(queryType) || 0 : 0
      }
    },

    methods: {
      handleRename (name) {
        if (name !== '') {
          this.editable = false
          if (name !== this.displayName) {
            this.renameHandler(
              name,
              this.property.role,
              this.parentProperty ? this.parentProperty.index : this.property.index,
              this.parentProperty ? this.property.index : void 0
            )
          }
        }
      },

      handleRenameCancel () {
        this.editable = false
      },

      showMenu (event) {
        let contextMenu
        let options = [
          {
            name: '删除',
            on: {
              click: () => {
                this.removeHandler(
                  this.property.role,
                  this.parentProperty ? this.parentProperty.index : this.property.index,
                  this.parentProperty ? this.property.index : void 0
                )
              }
            }
          },
          {
            name: '重命名',
            on: {
              click: () => {
                this.editable = true
              }
            }
          }
        ]
        if (this.currentVisualContainer) {
          const menuActions = makeMenuActions(this.currentVisualContainer.type, this.property, this.parentProperty, (action, value) => {
            this.actionHandler(
              action,
              value,
              this.property.role,
              this.parentProperty ? this.parentProperty.index : this.property.index,
              this.parentProperty ? this.property.index : void 0
            )
            contextMenu.hide()
          }, this.property.action || {}, this.queryType)

          if (menuActions.length) {
            options = options.concat(menuActions)
          }

          if (this.currentVisualContainer.type === VISUAL_TYPES.MATRIX && this.property.role === BUCKET_ROLES.COLUMN && !this.property.children) {
            options.push('/')
            const index = _.findIndex(options, option => {
              return option.action === 'pxlx'
            })
            if (index !== -1) {
              options[index].items.push({
                name: '手动排序',
                props: {
                  selected: (this.property.action || {})['pxlx'] === SORT_TYPE.MANUAL
                },
                on: {
                  click: () => {
                    this.$vuedals.open({
                      name: 'propertyValuesSort',
                      title: '手动排序',
                      props: {
                        values: this.property.action.pxsxz,
                        propertyId: this.property.id,
                        datasetId: this.property.datasetId,
                        sort: (values) => {
                          this.$store.commit('report/actionFieldProperty', {
                            action: 'pxsxz',
                            value: values,
                            role: this.property.role,
                            index: this.parentProperty ? this.parentProperty.index : this.property.index,
                            childIndex: this.parentProperty ? this.property.index : void 0
                          })
                        }
                      },
                      component: PropertyValuesSort
                    })
                  }
                }
              })
            }
          }
        }
        contextMenu = new ContextMenu(options)
        contextMenu.show(event)
      }
    }
  }
</script>
