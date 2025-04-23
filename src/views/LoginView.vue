<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase'; // Import supabase client
import { useRouter } from 'vue-router'; // Import Vue Router

// Define ref variables for form inputs
let email = ref('');
let password = ref('');

// Use the router for redirection
const router = useRouter();

// Handle login
const login = async (e) => {
  e.preventDefault(); // Prevent default form submission

  // Simple validation for empty fields
  if (!email.value || !password.value) {
    alert('Please fill in both fields');
    return;
  }

  try {
    // Attempt to sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      console.error('Error during login:', error.message);
      alert('Error during login: ' + error.message);
    } else {
      console.log('Login successful:', data);
      // Redirect to home or dashboard after successful login
      router.push('/home');
      alert('Login successful!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
};
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg p-4">
          <h3 class="text-center mb-4">Sign In</h3>
          <!-- Login form -->
          <form @submit="login">
            <!-- Email Input -->
            <div class="form-floating mb-3">
              <input
                type="email"
                class="form-control"
                id="email"
                placeholder="name@example.com"
                required
                v-model="email"
              />
              <label for="email">Email address</label>
            </div>

            <!-- Password Input -->
            <div class="form-floating mb-3">
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Password"
                required
                v-model="password"
              />
              <label for="password">Password</label>
            </div>

            <!-- Submit Button -->
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary">Sign In</button>
            </div>
          </form>

          <!-- Sign up link -->
          <div class="mt-3 text-center">
            <small>Don't have an account? <RouterLink to="/register">Sign up</RouterLink></small>
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
