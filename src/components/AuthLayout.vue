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
      <div
        v-if="route.name === 'aboutus' || route.name === 'login' || route.name === 'register'"
        class="background-color"
      >
        <!-- Navbar -->
        <nav class="navbar bg-body-tertiary fixed-top shadow-sm text-black">
          <div class="container-fluid d-flex align-items-center justify-start">
            <button
              class="navbar-toggler me-2"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <h1 class=" mb-0 ms-2 text-h5 font-weight-black">ClaimPoint</h1>
          
            <div
              class="offcanvas offcanvas-start"
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
                    <RouterLink class="nav-link active" aria-current="page" to="/"
                      >About Us</RouterLink
                    >
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
        <div class="container py-4 mt-5">
          <div class="col-sm-12 text-center">
            <img id="logo" :src="logo" width="50%" height="5%" alt="Logo" />
          </div>
          <!-- Content Slot -->
          <slot></slot>
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
  background: linear-gradient(135deg, #ffcc80, #ffcc80);
  min-height: 100vh;
}

/* Navbar Styles */
.navbar {
  background: #ffa726 !important;
  padding: 0.8rem 1.2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.navbar-brand {
  font-weight: 700;
  font-size: 1.8rem;
  color: #333;
  letter-spacing: 1px;
}

.nav-link {
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #e65100;
}

/* Offcanvas Styles */
.offcanvas-body {
  background: #ffcc80;
}

.offcanvas-header {
  background: #ffa726;
  border-bottom: 0px solid #ddd;
}

.offcanvas-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.nav-item {
  background-color: #ffa726;
  padding: 10px 16px;
  border-radius: 24px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.nav-item:hover {
  background-color: #ffe0b2;
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
/* .fixed-bottom {
  background-color: #e65100;
  padding: 10px 0;
}

.fixed-bottom .text-light {
  color: #ffffff !important;
  font-weight: 500;
}

.fixed-bottom .text-light:hover {
  color: #ffcc80 !important;
} */

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
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
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
