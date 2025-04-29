import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard, adminGuard } from './Authguard'

import AboutUsView from '../views/user/AboutUsView.vue'
import LoginView from '@/views/user/LoginView.vue'
import RegisterView from '@/views/user/RegisterView.vue'
import UserHomeView from '../views/user/DashboardView.vue'
import ReportfoundlostView from '@/views/user/ReportLostFoundView.vue'
import BrowseView from '@/views/user/BrowseView.vue'
import ClaimsReportView from '@/views/user/MyclaimsView.vue'
import DashboardView from '@/views/user/DashboardView.vue'
import ClaimView from '@/views/user/ClaimView.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'aboutus',
      component: AboutUsView,
      beforeEnter: guestGuard,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: guestGuard,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: guestGuard,
    },

    // 🛡️ Protected Routes
    {
      path: '/userhome',
      name: 'userhome',
      component: UserHomeView,
      beforeEnter: authGuard,
    },
    {
      path: '/foundlost',
      name: 'foundlost',
      component: ReportfoundlostView,
      beforeEnter: authGuard,
    },
    {
      path: '/browse',
      name: 'browse',
      component: BrowseView,
      beforeEnter: authGuard,
    },
    {
      path: '/claimsReport',
      name: 'claimsReport',
      component: ClaimsReportView,
      beforeEnter: authGuard,
    },
    {
      path: '/claims/:itemId',
      name: 'claims',
      component: ClaimView,
      props: true,
      beforeEnter: authGuard,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      beforeEnter: authGuard,
    },
    {
      path: '/admindashboard',
      name: 'admindashboard',
      component: AdminDashboard,
      beforeEnter: adminGuard,
    },
  ],
})

export default router

