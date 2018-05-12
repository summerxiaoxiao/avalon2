import _ from 'underscore'

import {
  installReport,
  deleteReportItem,
  fetchReportList, renameReportItem
} from '../../api/reportTemplate'

export default {
  namespaced: true,
  state: {
    items: []
  },

  mutations: {
    setItems (state, items) {
      state.items = items
    },
    deleteItem (state, {id}) {
      const index = _.findIndex(state.items, item => {
        return item.id === id
      })
      if (index > -1) {
        state.items.splice(index, 1)
      }
    },
    renameItem (state, {id, name}) {
      const index = _.findIndex(state.items, item => {
        return item.id === id
      })
      if (index > -1) {
        const item = state.items[index]
        item.name = name
        state.items.splice(index, 1, Object.assign({}, item))
      }
    }
  },
  actions: {
    fetchList ({commit}, {parentId, keyword, sortType}) {
      return fetchReportList({parentId, keyword, sortType}).then(items => {
        commit('setItems', items)
      })
    },
    deleteItem ({commit}, {id}) {
      return deleteReportItem({id}).then(() => {
        commit('deleteItem', {id})
      })
    },
    installReport ({commit}, {id, parentId}) {
      return installReport({id, parentId})
    },
    renameItem ({commit}, {id, type, name}) {
      return renameReportItem({id, type, name}).then(() => {
        commit('renameItem', {id, type, name})
      })
    }
  }
}
