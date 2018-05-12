import Vue from 'vue'
import Router from 'vue-router'

import Report from '@/views/report/Report'
import ReportList from '@/views/report/ReportList'
import DatasetList from '@/views/DatasetList'
import ReportTemplateList from '@/views/ReportTemplateList'
import Linkage from '@/views/Linkage'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: {name: 'reports'} },
    { path: '/bbyth', redirect: {name: 'reports'} },
    { path: '/bbyth/reports/new', component: Report, name: 'reportNew', props: (route) => ({ mode: 'new' }) },
    { path: '/bbyth/reports/edit/:id', component: Report, name: 'reportEdit', props: (route) => ({ id: route.params.id, mode: 'edit' }) },
    { path: '/bbyth/reports/view/:id', component: Report, name: 'reportView', props: (route) => ({ id: route.params.id, mode: 'view' }) },
    { path: '/bbyth/reports/:parentId?', component: ReportList, name: 'reports', props: (route) => ({parentId: route.params.parentId}) },
    { path: '/bbyth/templates/view/:id', component: Report, name: 'reportTemplateView', props: (route) => ({ id: route.params.id, mode: 'template' }) },
    { path: '/bbyth/templates', component: ReportTemplateList, name: 'reportTemplates' },
    { path: '/bbyth/dataset/:parentId?', component: DatasetList, name: 'datasetList', props: (route) => ({parentId: route.params.parentId}) },
    { path: '/bbyth/penetration/:id', component: Linkage, name: 'penetration', props: (route) => ({id: route.params.id, type: 'penetration'}) },
    { path: '/bbyth/relation/:id', component: Linkage, name: 'relation', props: (route) => ({id: route.params.id, type: 'relation'}) },
    { path: '/bbyth/driver', name: 'qmys', component: (resolve) => require(['@/views/qmys/driver'], resolve) }
  ]
})
