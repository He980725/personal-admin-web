import { createRouter, createWebHistory } from 'vue-router'
import routers from './routers'
import Token from '@/utils/token'
import { useAccountStore } from '@/stores/account'

const router = createRouter({
  history: createWebHistory(),
  routes: routers,
})

// 全局前置守卫：路由跳转前检查
router.beforeEach(async (to, from, next) => {
  const accountStore = useAccountStore()
  const token = Token.get()
  const noNeedPermissionPath = ['/', '/404', '/login']

  if (!!token) {
    if (to.path === '/login') {
      next(from.fullPath || '/')
      return
    }
    //是否有访问权限
    // debugger
    if (!noNeedPermissionPath.includes(to.path) && !accountStore.hasRouterPermission(to.path)) {
      next('/404')
      return
    }

    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach((to) => {
  const accountStore = useAccountStore()
  to.meta.pageReadonly = accountStore.hasPagePermission(to.path)
})

export default router
