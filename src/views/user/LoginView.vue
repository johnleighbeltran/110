<script setup>
import { ref } from 'vue'
import { supabase } from '../../supabase'
import { useRouter } from 'vue-router'
import Layout from '@/components/AuthLayout.vue'

let email = ref('')
let password = ref('')
let loading = ref(false)
let forgotPasswordEmail = ref('')
let selectedRole = ref('user') // Default role is 'user'

const router = useRouter()

// Login Function
const login = async (e) => {
  e.preventDefault()

  if (!email.value || !password.value) {
    alert('Please fill in both fields')
    return
  }

  loading.value = true
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      console.error('Error during login:', error.message)
      alert('Error: ' + error.message)
    } else {
      console.log('Login successful:', data)

      if (selectedRole.value === 'admin') {
        router.push('/admindashboard')
      } else {
        router.push('/dashboard')
      }

      alert('Login successful!')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('An error occurred. Please try again.')
  } finally {
    loading.value = false
  }
}

// Forgot Password Function
const sendPasswordReset = async () => {
  if (!forgotPasswordEmail.value && !email.value) {
    alert('Please enter your email to reset password.')
    return
  }

  const resetEmail = forgotPasswordEmail.value || email.value

  const { data, error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
    redirectTo: 'http://localhost:3000/update-password', // Replace with your production URL
  })

  if (error) {
    alert('Error: ' + error.message)
  } else {
    alert('Password reset link sent! Please check your email.')
  }
}
</script>

<template>
  <Layout>
    <v-container class="login-container" fluid>
      <v-row justify="center">
        <v-col cols="12" md="5" class="d-flex flex-column align-center">
          
          <!-- Logo -->
          <v-img
            src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
            alt="Logo"
            max-width="140"
            class="mb-6"
          ></v-img>

          <!-- Login Card -->
          <v-card class="pa-6 login-card" elevation="8">
            <v-card-title class="text-center mb-4">
              <h3>Welcome Back</h3>
              <p class="subtitle">Login to your account</p>
            </v-card-title>

            <v-form @submit="login">
              <!-- Email Field -->
              <v-text-field
                v-model="email"
                label="Email address"
                type="email"
                required
                outlined
                dense
                class="mb-3"
              ></v-text-field>

              <!-- Password Field -->
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
                outlined
                dense
                class="mb-1"
              ></v-text-field>

              <!-- Forgot Password -->
              <div class="text-right mb-3">
                <v-btn text small color="primary" @click="sendPasswordReset">
                  Forgot Password?
                </v-btn>
              </div>

              <!-- Role Selector -->
              <v-select
                v-model="selectedRole"
                :items="['user', 'admin']"
                label="Login as"
                outlined
                dense
                class="mb-4"
                required
              ></v-select>

              <!-- Sign In Button -->
              <v-btn :disabled="loading" type="submit" block class="primary-btn">
                <v-icon v-if="loading" class="mr-2">mdi-loading</v-icon>
                Sign In
              </v-btn>
            </v-form>

            <!-- Sign Up Link -->
            <v-row class="mt-5" justify="center">
              <v-col class="text-center">
                <small>Don't have an account?
                  <v-btn text @click="router.push('/register')">Sign up</v-btn>
                </small>
              </v-col>
            </v-row>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </Layout>
</template>

<style scoped>
.login-container {
  min-height: 90vh;
  background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
  display: flex;
  align-items: center;
}

.login-card {
  border-radius: 16px;
  background-color: #fff;
  width: 100%;
}

.primary-btn {
  background-color: #6a1b9a;
  color: white;
  font-weight: bold;
  border-radius: 12px;
  padding: 12px 0;
  margin-top: 10px;
}

.primary-btn:hover {
  background-color: #4a148c;
}

.v-icon {
  animation: spin 1s infinite linear;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}
</style>
