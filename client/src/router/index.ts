import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '../stores/userStore'
import useGetToken from '@/composables/useGetToken'
import getSession from '@/api/getSession'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue')
    },
    {
      path: '/:id',
      name: 'currentUser',
      component: () => import('../views/UserProfileView.vue')
    }
  ]
})

// Prevent force navigation to the home page
router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth) {
    if (userStore.currentUser.firstName) {
      // User is authenticated, allow navigation
      next()
    } else {
      const jwtToken = useGetToken()

      if (!jwtToken) {
        // No JWT token, not authenticated, redirect to login
        next('/login')
      } else {
        // Attempt to get the user session with the token
        const user = await getSession()

        if (!user) {
          // User session does not have the required data, not authenticated
          next('/login') // Redirect to a login page
        } else {
          // User session retrieved successfully, set the user in the store
          userStore.setCurrentUser(user)
          next()
        }
      }
    }
  } else {
    // This route does not require authentication, allow navigation
    next()
  }
})

export default router
