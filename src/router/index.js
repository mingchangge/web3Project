import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/web3',
      name: 'web3',
      component: () => import('../views/webThree.vue')
    },
    {
      path: '/excelTable',
      name: 'excelTable',
      component: () => import('../views/excelTable.vue')
    },
    {
      path: '/EncryptedERC20',
      name: 'EncryptedERC20',
      component: () => import('../views/EncryptedERC20.vue')
    },
    {
      path: '/EncryptedERC20-simple',
      name: 'EncryptedERC20Simple',
      component: () => import('../views/EncryptedERC20_simple.vue')
    }
  ]
})

export default router
