import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/user/LandingView.vue'
import LoginView from '@/views/user/LoginView.vue'
import RegisterView from '@/views/user/RegisterView.vue'
import UserHomeView from '../views/user/DashboardView.vue'
import ReportfoundlostView from '@/views/user/ReportLostFoundView.vue'
import BrowseView from '@/views/user/BrowseView.vue'
import ClaimsReportView from '@/views/user/MyclaimsView.vue'
import DashboardView from '@/views/user/DashboardView.vue'
import ClaimView from '@/views/user/ClaimView.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'

// Mock authentication status (replace this with actual authentication logic)
const isAuthenticated = false // Change this to true if the user is logged in

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
      path: '/userhome',
      name: 'userhome',
      component: UserHomeView,
    },
    {
      path: '/foundlost',
      name: 'foundlost',
      component: ReportfoundlostView,
    },
    {
      path: '/browse',
      name: 'browse',
      component: BrowseView,
    },
    {
      path: '/claimsReport',
      name: 'claimsReport',
      component: ClaimsReportView,
    },
    {
      path: '/claims/:itemId',
      name: 'claims',
      component: ClaimView,
      props: true,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/admindashboard',
      name: 'admindashboard',
      component: AdminDashboard,
    },
  ],
})

export default router
