import Vue from 'vue'
import Router from 'vue-router'

import NotFoundComponent from '@/views/error'
import contentView from './routes'

Vue.use(Router)
let defaultRouteName = 'zbkb01'
let mainContent = [
    { path: '/', redirect: {name: defaultRouteName}, name: 'root' },
    { path: '*', component: NotFoundComponent }
]
let allView = mainContent.concat(contentView)

export default new Router({
  routes: allView
})
