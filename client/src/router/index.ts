import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import useGetUserStore from '@/hooks/useGetUserStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: (to) => {
        // reject the navigation
        const { currentUser } = useGetUserStore()
        if (currentUser && to.name !== 'login') return { name: 'home' }
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue'),
      beforeEnter: (to) => {
        // reject the navigation

        const { currentUser } = useGetUserStore()
        if (currentUser && to.name !== 'signup') return { name: 'home' }
      }
    },
    {
      path: '/:id',
      name: 'currentUser',
      component: () => import('../views/UserProfileView.vue')
    }
  ]
})

export default router
