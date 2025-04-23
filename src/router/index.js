import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import MapView from '../components/Map.vue'
import HotelsView from '../views/HotelsView.vue'
import PlacesView from '../views/PlacesView.vue'
import { supabase } from '../supabase' // Import your supabase client for authentication

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
    },
    {
      path: '/hotels',
      name: 'hotels',
      component: HotelsView,
      beforeEnter: async (to, from, next) => {
        try {
          // Get the current user session
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (!user) {
            // If no user, redirect to login page
            next({ name: 'login' })
          } else {
            // If user is logged in, allow navigation
            next()
          }
        } catch (error) {
          console.error('Error during authentication check:', error)
          next({ name: 'login' }) // Redirect to login page if an error occurs
        }
      },
    },
    {
      path: '/places',
      name: 'places',
      component: PlacesView,
      beforeEnter: async (to, from, next) => {
        try {
          // Get the current user session
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (!user) {
            // If no user, redirect to login page
            next({ name: 'login' })
          } else {
            // If user is logged in, allow navigation
            next()
          }
        } catch (error) {
          console.error('Error during authentication check:', error)
          next({ name: 'login' }) // Redirect to login page if an error occurs
        }
      },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      beforeEnter: async (to, from, next) => {
        try {
          // Get the current user session
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (!user) {
            // If no user, redirect to login page
            next({ name: 'login' })
          } else {
            // If user is logged in, allow navigation
            next()
          }
        } catch (error) {
          console.error('Error during authentication check:', error)
          next({ name: 'login' }) // Redirect to login page if an error occurs
        }
      },
    },
  ],
})

export default router
