import { supabase } from '@/supabase'

// Guard for pages requiring login
export async function authGuard(to, from, next) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    next()
  } else {
    next('/login')
  }
}

// Guard for login/register (guests only)
export async function guestGuard(to, from, next) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    next('/dashboard')
  } else {
    next()
  }
}

// Guard for admin-only route (email check only)
export function adminGuard(to, from, next) {
  const isAdmin = localStorage.getItem('isAdmin')

  if (isAdmin === 'true') {
    next()
  } else {
    alert('Access denied: Admins only.')
    next('/login')
  }
}

