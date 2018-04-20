import AppTest from '@/views/test'

export default [
  {
    path: '/test',
    component: AppTest
  },
  {
    path: '/ykqk',
    component: resolve => require(['@/views/ykqk/ykqk'], resolve),
    name: 'ykqk',
    children: [
      // {
      //   path: '/ykqk/main',
      //   component: YkqkContent,
      //   name: 'ykqk_content',
      //   props: (route) => ({ mode: 'detailview' })
      // }
    ]
  }
]
