<template>
  <div class="container-fluid">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top bg-light shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <img :src="logo" alt="Explora Butuan" width="40" height="auto" class="me-2">
          <span class="fw-bold">Explora Butuan</span>
        </a>
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
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <button class="nav-link" @click="logout">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
</div>
<br></br>

<div class="container mt-5">
    <slot></slot>
</div>

<!-- Bottom Navbar -->
<div class="fixed-bottom bg-dark border-top">
  <div class="container d-flex justify-content-around py-2 px-3">

    <RouterLink to="/home" class="text-center text-decoration-none text-light">
      <i class="bi bi-house-check-fill"></i>
      <div>Home</div>
    </RouterLink>

    <RouterLink to="/hotels" class="text-center text-decoration-none text-light">
      <i class="bi bi-buildings-fill"></i>
      <div>Hotels</div>
    </RouterLink>

    <RouterLink to="/places" class="text-center text-decoration-none text-light">
     <i class="bi bi-backpack2"></i>
      <div>Places</div>
    </RouterLink>
  </div>
</div>
</template>

<script setup>
import { useRouter } from 'vue-router'; // Importing the router instance for navigation
import { supabase } from '@/supabase'; // Ensure the Supabase client is properly initialized
import logo from '@/assets/images/logo.png'; // Import your logo image

// Get access to the router instance
const router = useRouter();

// Logout function
const logout = async () => {
  try {
    // Sign out the user with Supabase
    await supabase.auth.signOut();
    console.log('Logged out successfully');
    
    // Redirect to the login page after logout
    router.push('/login');
    alert('You have been logged out.');
  } catch (error) {
    console.error('Error during logout:', error.message);
    alert('Error during logout: ' + error.message);
  }
};
</script>

<style scoped>
/* Map Container Styling (smaller size for mobile) */
.map-container {
  height: 300px; /* Set the map height to a smaller value */
  width: 100%; /* Full width */
  margin-top: 20px; /* Add some margin to space it out from the content */
}

/* Navbar Styling */
.navbar {
  background-color: #f8f9fa;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar-brand img {
  width: 40px;
  height: auto;
}

.navbar-toggler {
  border: none;
}

.navbar-nav .nav-link {
  font-size: 1rem;
  font-weight: 500;
}

.navbar-nav .nav-link:hover {
  color: #007bff;
}

.offcanvas-body {
  background-color: #f1f1f1;
}

.offcanvas-header {
  border-bottom: 1px solid #e0e0e0;
}

/* Main Content Styling */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.main-content h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}

/* Search Form Styling */
.form-control {
  border-radius: 50px;
  padding: 0.75rem;
  font-size: 1rem;
}

.btn-outline-primary {
  border-radius: 50px;
  padding: 0.75rem;
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

.text-decoration-none {
  text-decoration: none;
}

.bi {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

/* Flexbox container to center the button */
.button-container {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  margin-top: 50px;
}

/* Button styling */
.explora-button {
  text-decoration: none;
  background-color: #16C47F; /* Blue background */
  color: white; /* White text */
  font-size: 24px; /* Larger font size */
  font-weight: 600; /* Semi-bold text */
  padding: 15px 30px; /* Padding for button size */
  text-transform: uppercase; /* Uppercase text */
  border: none; /* Remove border */
  border-radius: 50px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s ease, box-shadow 0.3s ease; /* Smooth transition */
}

/* Button hover effect */
.explora-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3); /* Shadow effect */
}


</style>
