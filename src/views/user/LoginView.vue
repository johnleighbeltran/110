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
const showPassword = ref(false)

const router = useRouter()


const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Login Function
const login = async (e) => {
  e.preventDefault()

  if (!email.value || !password.value) {
    alert('Please fill in both fields')
    return
  }

  loading.value = true

  try {
    // Check if admin is selected
    if (selectedRole.value === 'admin') {
      if (email.value === 'admin@gmail.com' && password.value === '1234') {
        localStorage.setItem('isAdmin', 'true') // Save admin flag
        alert('Welcome Admin!')
        router.push('/admindashboard')
        return // 🚨 Important: STOP here if admin login succeeds
      } else {
        alert('Invalid admin credentials.')
        return // 🚨 STOP here if admin login fails
      }
    }

    // Check if user is selected
    if (selectedRole.value === 'user') {
      localStorage.setItem('isAdmin', 'false') // Save user flag

      // ✅ Normal user login via Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })

      if (error) {
        console.error('Error during login:', error.message)
        alert('Error: ' + error.message)
      } else {
        console.log('Login successful:', data)
        alert('Login successful!')
        router.push('/dashboard')
      }
      return // 🚨 Always add return after user login
    }

    // If none of the roles matched
    alert('Invalid role selected. Please try again.')
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
    <v-container class="d-flex justify-center align-center" >
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4">
          
          <!-- Logo -->
          <!-- <v-img
            src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
            alt="Logo"
            max-width="140"
            class="mb-6"
          ></v-img> -->

          <!-- Login Card -->
          <v-card class="pa-6 login-card" elevation="10">
            <v-card-title class="text-center mb-4">
              <h3 class="font-weight-bold mb-2">Welcome Back</h3>
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
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              required
              outlined
              dense
              class="mb-1"
            >
              <template #append-inner>
                <v-icon @click="togglePasswordVisibility" class="cursor-pointer">
                  {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </template>
            </v-text-field>

              <!-- Forgot Password -->
              <div class="text-right mb-3">
                <v-btn text small color="orange-darken-1" @click="sendPasswordReset">
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
            <v-row class="mt-3" justify="center">
              <v-col class="text-center">
                <small>Don't have an account?
                  <v-btn text color="orange-darken-1" @click="router.push('/register')">Sign up</v-btn>
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
  background: #FFCC80;
  display: flex;
  align-items: center;
}

.login-card {
  border-radius: 16px;
  background-color: #FFF3E0;
  width: 100%;
}

.primary-btn {
  background-color: #FB8C00;
  color: white;
  font-weight: bold;
  border-radius: 12px;
  padding: 12px 0;
  margin-top: 10px;
}

.primary-btn:hover {
  background-color: #E65100;
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

