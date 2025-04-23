<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase'; // Import supabase client
import { useRouter } from 'vue-router'; // Import Vue Router

// Define ref variables for form inputs
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// Define a ref for storing errors
const errorMessage = ref('');

// Define the router
const router = useRouter();

// Handle the form submission
const registeration = async (e) => {
  e.preventDefault(); // Prevent default form submission

  // Simple validation for matching passwords
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  try {
    // Sign up the user with email and password
    const { user, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    // Check for error from Supabase
    if (error) {
      console.error('Error during registration:', error.message);
      errorMessage.value = error.message; // Display error message
    } else {
      console.log('Registration successful:', user);
      alert('Registration successful! Please check your email to confirm.');
    }
  } catch (error) {
    // Handle any additional errors
    errorMessage.value = error.message;
    console.error('Error:', error);
  }
};

// Handle auth state changes, including email confirmation
onMounted(() => {
  // Listen for auth state changes (e.g., user confirmed email)
  const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session.user) {
      if (session.user.email_confirmed_at) {
        // If email is confirmed, redirect to home page
        router.push('/home');
      }
    }
  });

  // Cleanup listener when the component is unmounted
  onBeforeUnmount(() => {
    authListener?.unsubscribe();
  });
});
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg p-4">
          <h3 class="text-center mb-4">Register</h3>
          <form @submit="registeration">
            <!-- Name Input -->
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="floatingName"
                placeholder="Your Name"
                v-model="name"
                required
              />
              <label for="floatingName">Full Name</label>
            </div>

            <!-- Email Input -->
            <div class="form-floating mb-3">
              <input
                type="email"
                class="form-control"
                id="floatingEmail"
                placeholder="name@example.com"
                v-model="email"
                required
              />
              <label for="floatingEmail">Email address</label>
            </div>

            <!-- Password Input -->
            <div class="form-floating mb-3">
              <input
                type="password"
                class="form-control"
                id="floatingPassword"
                placeholder="Password"
                v-model="password"
                required
              />
              <label for="floatingPassword">Password</label>
            </div>

            <!-- Confirm Password Input -->
            <div class="form-floating mb-3">
              <input
                type="password"
                class="form-control"
                id="floatingConfirmPassword"
                placeholder="Confirm Password"
                v-model="confirmPassword"
                required
              />
              <label for="floatingConfirmPassword">Confirm Password</label>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="text-danger text-center mb-3">
              <small>{{ errorMessage }}</small>
            </div>

            <!-- Submit Button -->
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary">Register</button>
            </div>
          </form>
          <div class="mt-3 text-center">
            <small>Already have an account? <RouterLink to="/login">Login</RouterLink></small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .card {
    border-radius: 10px;
  }
  .btn-primary {
    background-color: #007bff;  
    border-color: #007bff;
  }
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
</style>
