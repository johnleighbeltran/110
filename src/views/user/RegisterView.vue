<script setup>
import { ref } from 'vue'
import { supabase } from '../../supabase'  // Import Supabase client
import { useRouter } from 'vue-router'  // Import the router
import Layout from '@/components/AuthLayout.vue'  // Import Layout component

// Define ref variables for form inputs
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')

// Define the router
const router = useRouter()

// Password validation function
const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|-]).{8,}$/
  return regex.test(password)
}

// Handle the form submission
const registeration = async (e) => {
  e.preventDefault()

  // Simple validation for matching passwords
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  // Password validation
  if (!validatePassword(password.value)) {
    errorMessage.value = 'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long.'
    return
  }

  try {
    // Sign up the user with email and password
    const { user, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    // Check for error from Supabase
    if (error) {
      console.error('Error during registration:', error.message)
      errorMessage.value = error.message // Display error message
    } else {
      console.log('Registration successful:', user)
      successMessage.value = 'Registration successful! Please check your email to confirm.'
      alert(successMessage.value)
      router.push('/login')  // Redirect to login page after successful registration
    }
  } catch (error) {
    // Handle any additional errors
    errorMessage.value = error.message
    console.error('Error:', error)
  }
}
</script>

<template>
  <Layout>
    <v-container class="d-flex justify-center align-center" style="height: 100vh;">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4">
          <v-card class="pa-6" elevation="10" rounded>
            <v-card-title class="text-center">
              <h2 class="font-weight-bold mb-2">Register</h2>
              <p class="subtitle">Create your account</p>
            </v-card-title>

            <!-- Registration Form -->
            <v-form @submit="registeration">
              <!-- Full Name Input -->
              <v-text-field
                v-model="name"
                label="Full Name"
                type="text"
                outlined
                dense
                class="mb-4"
                required
              ></v-text-field>

              <!-- Email Input -->
              <v-text-field
                v-model="email"
                label="Email Address"
                type="email"
                outlined
                dense
                class="mb-4"
                required
              ></v-text-field>

              <!-- Password Input -->
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                outlined
                dense
                class="mb-4"
                required
              ></v-text-field>

              <!-- Confirm Password Input -->
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                type="password"
                outlined
                dense
                class="mb-4"
                required
              ></v-text-field>

              <!-- Error Message -->
              <v-alert v-if="errorMessage" type="error" class="mb-4" border="left" colored-border>
                <small>{{ errorMessage }}</small>
              </v-alert>

              <!-- Success Message -->
              <v-alert v-if="successMessage" type="success" class="mb-4" border="left" colored-border>
                <small>{{ successMessage }}</small>
              </v-alert>

              <!-- Register Button -->
              <v-btn
                type="submit"
                color="primary"
                block
                large
                class="rounded-lg font-weight-bold mb-2"
              >
                Register
              </v-btn>

              <!-- Login Link -->
              <v-row justify="center" class="mt-3">
                <v-col class="text-center">
                  <small>
                    Already have an account?
                    <RouterLink to="/login" class="text-primary font-weight-bold">Login</RouterLink>
                  </small>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </Layout>
</template>

<style scoped>
.v-container {
  background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
  min-height: 100vh;
  padding-top: 40px;
}

/* Card Styles */
.v-card {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.08);
  padding: 32px;
}

/* Card Title */
.v-card-title {
  margin-bottom: 16px;
}

.v-card-title h2 {
  font-size: 28px;
  font-weight: bold;
  color: #6a1b9a;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-top: 4px;
}

/* Form Fields */
.v-text-field,
.v-select {
  font-size: 16px;
  margin-bottom: 20px;
}

/* Buttons */
.v-btn {
  font-size: 16px;
  font-weight: bold;
  text-transform: none;
  border-radius: 12px;
  padding: 14px 0;
  transition: background-color 0.3s ease;
}

.v-btn:hover {
  background-color: #4a148c !important;
}

/* Alert Boxes */
.v-alert {
  font-size: 14px;
  border-radius: 12px;
}

/* Link Text */
.text-primary {
  color: #6a1b9a !important;
}

.text-primary:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .v-card {
    padding: 24px;
  }

  .v-card-title h2 {
    font-size: 24px;
  }

  .v-btn {
    font-size: 15px;
  }
}
</style>