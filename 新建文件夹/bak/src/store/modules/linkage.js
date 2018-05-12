import _ from 'underscore'
import Vue from 'vue'
import {
  addNode, deleteNode, fetchDataset, fetchTree,
  fetchSectionItems,
  saveFieldRelation, saveMode,
  saveNodeName, deleteFieldRelation, fetchNodeRelation, saveFields
} from '../../api/linkage'

function genTree (nodes) {
  const root = {id: 0, children: {}}
  const children = {}
  for (const node of nodes) {
    children[node.parentId] = children[node.parentId] || []
    children[node.parentId].push(node)
  }
  function subTree (node) {
    if (children[node.id]) {
      children[node.id].map(child => {
        Vue.set(child, 'parent', node)
      })
      Vue.set(node, 'children', children[node.id])
      for (const parent of node.children) {
        subTree(parent)
      }
    }
  }
  subTree(root)
  return root
}

function genEntries (nodes) {
  const items = {}
  for (const node of nodes) {
    items[node.id] = node
  }
  return items
}

export default {
  namespaced: true,
  state: {
    selectedNodeId: null,
    nodeEntries: {},
    tree: null,
    sectionItems: null,
    datasetEntries: {},
    datasetMapByChartId: {}
  },
  getters: {
    root (state) {
      if (state.tree) {
        return state.tree.children[0]
      }
    },
    selectedNode (state) {
      return state.nodeEntries[state.selectedNodeId]
    },
    sourceDataset (state, getters) {
      const selectedNode = getters.selectedNode
      if (!selectedNode) {
        return
      }
      if (state.datasetMapByChartId[selectedNode.parentChartId]) {
        return state.datasetEntries[state.datasetMapByChartId[selectedNode.parentChartId]]
      }
    },
    targetDataset (state, getters) {
      const selectedNode = getters.selectedNode
      if (!selectedNode) {
        return
      }
      if (state.datasetMapByChartId[selectedNode.chartId]) {
        return state.datasetEntries[state.datasetMapByChartId[selectedNode.chartId]]
      }
    }
  },
  mutations: {
    buildTree (state, nodes) {
      state.nodeEntries = genEntries(nodes)
      state.tree = genTree(nodes)
      if (!state.selectedNodeId && state.tree && state.tree.children) {
        if (state.tree.children[0] && state.tree.children[0].children && state.tree.children[0].children.length) {
          state.selectedNodeId = state.tree.children[0].children[0].id
        }
      }
    },
    setSectionItems (state, items) {
      state.sectionItems = items
    },
    unset (state) {
      state.sectionItems = null
      state.selectedNodeId = null
      state.tree = null
      state.nodeEntries = {}
    },
    setMode (state, {id, mode}) {
      const node = state.nodeEntries[id]
      if (!node) {
        return
      }
      Vue.set(node, 'mode', mode)
    },
    selectNode (state, id) {
      state.selectedNodeId = id
    },
    removeNode (state, id) {
      const node = state.nodeEntries[id]
      if (!node) {
        return
      }

      if (state.selectedNodeId === node.id) {
        state.selectedNodeId = null
      }

      function removeNode (node) {
        Vue.delete(state.nodeEntries, node.id)
        if (node.children && Array.isArray(node.children)) {
          for (const child of node.children) {
            removeNode(child)
          }
        }
      }

      if (node.parent && node.parent.children) {
        const index = _.findIndex(node.parent.children, child => child.id === node.id)
        if (index !== -1) {
          node.parent.children.splice(index, 1)
        }
      }
      removeNode(node)
    },
    addNode (state, {parentId, children}) {
      const parent = state.nodeEntries[parentId]
      if (!parent) {
        return
      }
      if (!parent.children) {
        Vue.set(parent, 'children', [])
      }
      for (const node of children) {
        Vue.set(node, 'parent', parent)
        Vue.set(state.nodeEntries, node.id, node)
        parent.children.push(node)
      }
    },
    setNodeName (state, {id, name}) {
      const node = state.nodeEntries[id]
      if (node) {
        Vue.set(node, 'name', name)
      }
    },
    setDataset (state, {chartId, dataset}) {
      Vue.set(state.datasetMapByChartId, chartId, dataset.id)
      Vue.set(state.datasetEntries, dataset.id, dataset)
    },
    setNodeRelations (state, {id, fields, fieldRelations}) {
      const node = state.nodeEntries[id]
      if (node) {
        Vue.set(node, 'fieldRelations', fieldRelations)
        Vue.set(node, 'fields', fields)
      }
    },
    removeFieldRelation (state, {id, relationId}) {
      const node = state.nodeEntries[id]
      if (node) {
        const fieldRelations = node.fieldRelations
        if (fieldRelations) {
          const index = _.findIndex(fieldRelations, (relation) => relation.id === relationId)
          if (index !== -1) {
            node.fieldRelations.splice(index, 1)
          }
        }
      }
    },
    setFieldIds (state, {id, fieldIds}) {
      const node = state.nodeEntries[id]
      if (node) {
        Vue.set(node, 'fieldIds', fieldIds)
      }
    }
  },
  actions: {
    saveNodeName ({commit, state}, {id, name}) {
      const node = state.nodeEntries[id]
      if (!node) {
        throw new Error(`没有找到节点${id}`)
      }
      return saveNodeName(node, name).then(() => {
        commit('setNodeName', {id, name})
      })
    },
    deleteNode ({commit}, id) {
      return deleteNode(id).then(() => {
        commit('removeNode', id)
      })
    },
    addNode ({dispatch, getters}, {parent, children, mode}) {
      if (!getters.root) {
        throw new Error('根节点不存在')
      }
      return addNode(getters.root, parent, children, mode).then(() => {
        return dispatch('fetchTree', {id: getters.root.chartId, type: getters.root.ldlx})
        // commit('addNode', {parent, children})
      })
    },
    fetchSectionItems ({commit}, {chartId, onlySelfSection}) {
      return fetchSectionItems(chartId, onlySelfSection).then((items) => {
        commit('setSectionItems', items)
      })
    },
    fetchTree ({commit}, {id, type}) {
      return fetchTree(id, type).then((nodes) => {
        commit('buildTree', nodes)
      })
    },
    saveMode ({commit, state}, {id, mode}) {
      const node = state.nodeEntries[id]
      if (!node) {
        throw new Error(`没有找到节点${id}`)
      }
      return saveMode(node, mode).then(() => {
        commit('setMode', {id, mode})
      })
    },
    fetchDataset ({commit}, chartId) {
      return fetchDataset(chartId).then((dataset) => {
        if (dataset) {
          commit('setDataset', {chartId, dataset})
        }
      })
    },
    fetchNodeRelation ({commit}, id) {
      return fetchNodeRelation(id).then(({fields, fieldRelations}) => {
        commit('setNodeRelations', {id, fields, fieldRelations})
      })
    },
    saveFieldRelation ({dispatch}, {
      id,
      linkageId,
      sourceDatasetId,
      sourceFieldId,
      targetDatasetId,
      targetFieldId
    }) {
      return saveFieldRelation({
        id,
        linkageId,
        sourceDatasetId,
        sourceFieldId,
        targetDatasetId,
        targetFieldId
      }).then(() => {
        dispatch('fetchNodeRelation', linkageId)
      })
    },
    deleteFieldRelation ({commit}, {id, relationId}) {
      return deleteFieldRelation(relationId).then(() => {
        commit('removeFieldRelation', {id, relationId})
      })
    },
    deleteField ({commit, state, dispatch}, {id, fieldId}) {
      const node = state.nodeEntries[id]
      if (!node) {
        throw new Error(`没有找到节点${id}`)
      }
      const newFieldIds = node.fieldIds.slice()
      const index = newFieldIds.indexOf(fieldId)
      if (index !== -1) {
        newFieldIds.splice(index, 1)
      }
      return saveFields(node, newFieldIds).then(() => {
        commit('setFieldIds', {id, fieldIds: newFieldIds})
        dispatch('fetchNodeRelation', id)
      })
    },
    addFields ({commit, state, dispatch}, {id, fieldIds}) {
      const node = state.nodeEntries[id]
      if (!node) {
        throw new Error(`没有找到节点${id}`)
      }
      const newFieldIds = node.fieldIds.slice()
      for (const fieldId of fieldIds) {
        if (newFieldIds.indexOf(fieldId) === -1) {
          newFieldIds.push(fieldId)
        }
      }
      return saveFields(node, newFieldIds).then(() => {
        commit('setFieldIds', {id, fieldIds: newFieldIds})
        dispatch('fetchNodeRelation', id)
      })
    }
  }
}
