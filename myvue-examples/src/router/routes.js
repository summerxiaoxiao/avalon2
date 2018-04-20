import AppTest from '@/views/test'
import YkqkMain from '@/views/ykqk/ykqk'
import Zyyszb01 from '@/views/zyyszb01/index'

export default [
  {
    path: '/test',
    component: AppTest
  },
  {
    path: '/ykqk',
    component: YkqkMain,
    name: 'ykqk'
  },
  {
    path: '/zbkb01',
    component: Zyyszb01,
    name: 'zbkb01'
  }
]
