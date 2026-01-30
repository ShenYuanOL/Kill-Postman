import { createRouter, createWebHashHistory } from 'vue-router'
// 导入组件时需要使用动态导入语法或者直接导入
const routes = [
  {
    path: '/',
    name: 'API',
    component: () => import('../layout/ApiControl.vue'), // 修改这里
    meta: { title: '接口' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../layout/Settings.vue'), // 修改这里
    meta: { title: '设置' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(), // 使用 hash 模式，适用于 Electron 应用
  routes
})

// 路由守卫 - 可根据需要启用
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta?.title ? `${to.meta.title} - KPAPI` : 'KPAPI'

  // 简单的认证检查示例
  const isAuthenticated = localStorage.getItem('authenticated') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.name === 'Login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router