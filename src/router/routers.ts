const routers = [
  {
    path: '/',
    redirect: { path: '/dashboard/home' },
    component: () => import('@/layout/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: '数据看板',
        redirect: { path: '/dashboard/home' },
        children: [
          {
            path: 'home',
            name: 'Home',
            component: () => import('@/views/Dashboard/Home/HomeIndex.vue'),
          },
        ],
      },
      {
        path: 'system',
        name: '系统管理',
        redirect: { path: '/system/router-management' },
        children: [
          {
            path: 'router-management',
            name: '路由管理',
            component: () => import('@/views/SystemManagement/RouterPage/MenuIndex.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/indexView.vue'),
  },
  // 404路由配置
  {
    path: '/404',
    component: () => import('@/layout/MainLayout.vue'),
    children: [
      {
        path: '',
        name: '404',
        component: () => import('@/views/Error/404View.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]
export default routers
