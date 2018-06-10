
export default [
  { path: '/app' },
  { path: '/test' }, // 指标看板--仪表盘
  { path: '/zbkb' }, // 指标看板--仪表盘
  { path: '/fxbb' }, // 分析报表-- 报表
  {
    path: '/main',
    component: (resolve) => require(['@/views/main/main'], resolve),
    name: 'main'
  },
  {
    path: '/zbkb/index',
    component: (resolve) => require(['@/views/zbkb/Index'], resolve),
    name: 'zbkbIndex'
  },
  {
    path: '/zbkb/01',
    component: (resolve) => require(['@/views/zbkb/zyyszb01'], resolve),
    name: 'zbkb01'
  },
  {
    path: '/zbkb/02',
    component: (resolve) => require(['@/views/zbkb/ykfy02'], resolve),
    name: 'zbkb02'
  },
  {
    path: '/zbkb/07',
    component: (resolve) => require(['@/views/zbkb/xmysfx07'], resolve),
    name: 'zbkb07'
  },
  {
    path: '/fxbb/01',
    component: (resolve) => require(['@/views/fxbb/zyyszb01'], resolve),
    name: 'fxbb01'
  },
  {
    path: '/fxbb/08',
    component: (resolve) => require(['@/views/fxbb/lrysmx08'], resolve),
    name: 'fxbb08'
  },
  {
    path: '/test/testybp',
    component: (resolve) => require(['@/views/test/index'], resolve),
    name: 'testybp'
  },
  {
    path: '/test/testbb',
    component: (resolve) => require(['@/views/test/bb'], resolve),
    name: 'testbb'
  }
]
