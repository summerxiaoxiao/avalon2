import $ from 'jquery'
import _ from 'underscore'

import Vue from 'vue'

export default {
  data () {
    return {
      keyword: '',
      checkedIds: {}
    }
  },
  computed: {
    itemList () {
      const items = this.sourceItemList || []
      const keyword = $.trim(this.keyword)
      if (keyword === '') {
        return items
      } else {
        return _.filter(items, item => {
          const match = item.name.match(keyword)
          return match && match.length
        })
      }
    },
    checkedList () {
      return _.filter(this.itemList, item => {
        return this.checkedIds[item.id]
      })
    }
  },
  methods: {
    check (id) {
      if (this.isChecked(id)) {
        this.removeChecked(id)
      } else {
        Vue.set(this.checkedIds, id, true)
      }
    },
    isChecked (id) {
      return !!this.checkedIds[id]
    },
    removeChecked (id) {
      Vue.delete(this.checkedIds, id)
    }
  }
}
