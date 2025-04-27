<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router' // Import Vue Router
import { supabase } from '../supabase' // Import Supabase client
import logo from '@/assets/images/logo.png' // Import image for the login page

// Define the router and route
const router = useRouter()
const route = useRoute() // Get the current route

// Define ref for user session
const user = ref(null)

// Check user session on mounted
onMounted(async () => {
  const { data: session } = await supabase.auth.getSession() // Correct way to get session
  user.value = session?.user // Assign the user data to the ref
})
</script>

<template>
  <v-app>
    <div>
      <!-- Conditionally render the layout for 'landing', 'login', and 'register' routes -->
      <div v-if="route.name === 'landing' || route.name === 'login' || route.name === 'register'" class="background-color">
        <!-- Navbar -->
        <nav class="navbar bg-body-tertiary fixed-top shadow-sm">
          <div class="container-fluid">
            <h1 class="navbar-brand" href="#">LOst&Found</h1>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div
              class="offcanvas offcanvas-end"
              tabindex="-1"
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
            >
              <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div class="offcanvas-body">
                <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                  <li class="nav-item">
                    <RouterLink class="nav-link active" aria-current="page" to="/">About Us</RouterLink>
                  </li>
                  <li class="nav-item">
                    <RouterLink class="nav-link" to="/login">Login</RouterLink>
                  </li>
                  <li class="nav-item">
                    <RouterLink class="nav-link" to="/register">Register</RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <!-- Main Content -->
        <div class="container py-5 mt-10">
          <div class="col-sm-12 text-center">
            <img id="logo" :src="logo" width="50%" height="5%" alt="Logo" />
          </div>
          <!-- Content Slot -->
          <slot></slot>
        </div>

        <!-- Bottom Navbar -->
        <div class="fixed-bottom bg-dark border-top">
          <div class="container d-flex justify-content-around py-2 px-3">
            <RouterLink to="/login" class="text-center text-decoration-none text-light">
              <i class="bi bi-box-arrow-in-right"></i>
              <div>Login</div>
            </RouterLink>

            <RouterLink to="/register" class="text-center text-decoration-none text-light">
              <i class="bi bi-person-plus"></i>
              <div>Register</div>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- For other routes, render only the content -->
      <div v-else>
        <slot></slot>
        <!-- The slot will be replaced with the content of the route -->
      </div>
    </div>
  </v-app>
</template>

<style scoped>
/* Background & Layout */
.background-color {
  background: linear-gradient(135deg, #e0f7fa, #e1bee7);
  min-height: 100vh;
}

/* Navbar Styles */
.navbar {
  background: #ffffff !important;
  padding: 0.8rem 1.2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.navbar-brand {
  font-weight: 700;
  font-size: 1.8rem;
  color: #673ab7;
  letter-spacing: 1px;
}

.nav-link {
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #6a1b9a;
}

/* Offcanvas Styles */
.offcanvas-body {
  background: #fafafa;
}

.offcanvas-header {
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.offcanvas-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.nav-item {
  background-color: #e1bee7;
  padding: 10px 16px;
  border-radius: 24px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.nav-item:hover {
  background-color: #ce93d8;
  transform: translateY(-2px);
}

/* Logo Styles */
#logo {
  width: 180px;
  max-width: 100%;
  height: auto;
  margin: 30px auto;
  display: block;
  animation: fadeIn 1s ease;
  cursor: pointer;
}

/* Footer (Bottom Navbar) */
.fixed-bottom {
  background-color: #6a1b9a;
  padding: 10px 0;
}

.fixed-bottom .text-light {
  color: #ffffff !important;
  font-weight: 500;
}

.fixed-bottom .text-light:hover {
  color: #ffcc80 !important;
}

/* Typography */
h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

p.lead {
  font-size: 1.2rem;
  color: #666;
}

.text-center {
  text-align: center;
  font-size: 1rem;
}

/* Animations */
@keyframes popUp {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.fst-italic {
  animation: popUp 1.2s ease-out;
}

/* Adjust Offcanvas */
.offcanvas-end {
  width: 200px;
}

.offcanvas-backdrop {
  opacity: 0.4;
}

.offcanvas-body {
  padding: 20px;
}
</style>
