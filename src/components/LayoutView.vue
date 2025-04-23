<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // Import Vue Router
import { supabase } from '../supabase'; // Import Supabase client
import logo from '@/assets/images/logo.png'; // Import image for the login page

// Define the router and route
const router = useRouter();
const route = useRoute(); // Get the current route

// Define ref for user session
const user = ref(null);

// Check user session on mounted
onMounted(async () => {
  const { data: session } = await supabase.auth.getSession();  // Correct way to get session
  user.value = session?.user;  // Assign the user data to the ref
});
</script>

<template>
  <div>
    <!-- Conditionally render the layout (Navbar, Slot, Footer) for specific routes -->
    <div v-if="route.name === 'landing' || route.name === 'login' || route.name === 'register'" class="background-color">
      <!-- Navbar -->
      <nav class="navbar bg-body-tertiary fixed-top shadow-sm">
        <div class="container-fluid">
          <h1 class="navbar-brand" href="#">Explora Butuan</h1>
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li class="nav-item">
                  <RouterLink class="nav-link active" aria-current="page" to="/">Home</RouterLink>
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
      <div class="container py-5">
        <div class="col-sm-12 text-center">
          <img id="logo" :src="logo" width="50%" height="5%" alt="Logo" />
          <h1 class="fst-italic">Explora Butuan</h1>
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

    <!-- For the Home route (and other routes), render only the content -->
    <div v-else>
      <slot></slot> <!-- The slot will be replaced with the content of the route -->
    </div>
  </div>
</template>

<style scoped>
/* Navbar Styles */
.background-color {
  background: repeating-linear-gradient(45deg, #BBD8A3, #BBD8A3 33%, #fb653c 33%, #f6c96e 66%, #f6c96e 66%);
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-link {
  color: #000000;
}

.offcanvas-body {
  background-color: #FFF6E0;
}

/* Home View Styles */
.container {
  max-width: 1200px;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #333;
}

p.lead {
  font-size: 1.25rem;
  color: #555;
}

img {
  border-radius: 10px;
  cursor: pointer; /* Make the logo clickable for the hover effect */
}

/* Bottom Navbar Styles */
.fixed-bottom {
  background-color: #343a40;
}

.fixed-bottom .text-light {
  color: #f8f9fa !important;
}

.fixed-bottom .text-light:hover {
  color: #007bff !important;
}

.text-center {
  font-size: 0.9rem;
}

@keyframes popUp {
  0% {
    transform: scale(0.5); /* Start smaller */
    opacity: 0; /* Start invisible */
  }
  50% {
    transform: scale(1.2); /* Grow slightly larger */
    opacity: 0.7; /* Make slightly visible */
  }
  100% {
    transform: scale(1); /* Return to normal size */
    opacity: 1; /* Fully visible */
  }
}

/* Apply the pop-up animation to the navbar-brand */
.fst-italic {
  animation: popUp 1s ease-out; /* Apply animation with 1-second duration */
}

/* Reduce the width of the offcanvas menu */
.offcanvas-end {
  width: 200px; /* Change to any value you prefer */
}

/* Adjust the opacity of the backdrop */
.offcanvas-backdrop {
  opacity: 0.5; /* Reduce the overlay intensity */
}

/* Optionally, add more spacing or padding adjustments */
.offcanvas-body {
  padding: 20px;
}

.nav-item {
  border: 2px solid #FFEDD8; /* Border color */
  background-color: #FFA559;
  padding: 10px 20px; /* Add padding to create space inside the item */
  border-radius: 30px; /* Rounded corners for a modern look */
  margin-bottom: 10px; /* Spacing between nav items */
  display: flex;
  align-items: center; /* Center the content */
  justify-content: center; /* Space out any elements inside */
  transition: background-color 0.3s ease, transform 0.3s ease; /* Smooth transition on hover */
}
</style>
