<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { supabase } from '@/supabase'
import logo from '@/assets/images/logo.png'

// Responsive breakpoint
const display = useDisplay()
const isSmallScreen = computed(() => display.smAndDown)

// Auth state
const user = ref(null)
const isEmailConfirmed = ref(false)

// Router
const route = useRoute()
const router = useRouter()

// UI controls
const drawer = ref(false)
const showProfileDialog = ref(false)
const showLogoutConfirm = ref(false)

// Avatar upload state
const profileImageUrl = ref('')
const uploading = ref(false)
const uploadError = ref(null)

// Computed avatar URL
const avatarUrl = computed(() => user.value?.user_metadata?.avatar_url || profileImageUrl.value)

// Fetch current user and set email confirmation
async function getCurrentUser() {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (currentUser) {
    user.value = currentUser
    isEmailConfirmed.value = currentUser.email_confirmed_at !== null
  }
}

// Toggle sidebar drawer
function toggleDrawer() {
  drawer.value = !drawer.value
}

// Navigate to dashboard
function navigateDashboard() {
  router.push('/dashboard')
}

// Open profile modal
function openProfileModal() {
  showProfileDialog.value = true
}

// Show logout confirmation
function confirmLogout() {
  showLogoutConfirm.value = true
}

// Perform logout and reset state
async function logout() {
  await supabase.auth.signOut()
  user.value = null
  isEmailConfirmed.value = false
  drawer.value = false
  showProfileDialog.value = false
  showLogoutConfirm.value = false
  router.push('/login')
}

// Force refresh dashboard on mount if already there
async function forceDashboardRefresh() {
  if (route.name === 'dashboard' && isEmailConfirmed.value) {
    await router.replace({ path: '/redirect-temp' })
    router.replace({ path: '/dashboard' })
  }
}

// Lifecycle hook: init and listen to auth changes
onMounted(async () => {
  await getCurrentUser()
  await forceDashboardRefresh()
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      user.value = session.user
      isEmailConfirmed.value = !!session.user.email_confirmed_at
    } else {
      user.value = null
      isEmailConfirmed.value = false
    }
  })
})

// Trigger file input click
function triggerFileInput() {
  fileInput.value.click()
}

// Upload avatar image
const fileInput = ref(null)
async function uploadImage(event) {
  const file = event.target.files[0]
  if (!file) return
  uploading.value = true
  uploadError.value = null
  try {
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('avatars').upload(fileName, file)
    if (error) {
      uploadError.value = 'Failed to upload image.'
      return
    }
    const publicURL = `https://bzijoejabwuaazggftcm.supabase.co/storage/v1/object/public/avatars/${data.path}`
    profileImageUrl.value = publicURL
    await supabase.auth.updateUser({ data: { avatar_url: publicURL } })
    if (user.value) user.value.user_metadata.avatar_url = publicURL
  } catch {
    uploadError.value = 'An unexpected error occurred.'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <v-app>
    <!-- Show nav only on authenticated routes and after email confirmation -->
    <template v-if="
      route.name !== 'landing' &&
      route.name !== 'admindashboard' &&
      route.name !== 'login' &&
      route.name !== 'register' &&
      isEmailConfirmed
    ">
      <v-navigation-drawer app v-model="drawer" permanent clipped width="250" color="orange lighten-2">
        <v-list dense>
          <v-list-item @click="navigateDashboard">
            <v-list-item-content class="text-center">
              <img :src="logo" alt="Logo" class="logo" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/dashboard" router-link>
            <v-list-item-content><v-list-item-title>Dashboard</v-list-item-title></v-list-item-content>
          </v-list-item>
          <v-list-item to="/foundlost" router-link>
            <v-list-item-content><v-list-item-title>Report Found/Lost Item</v-list-item-title></v-list-item-content>
          </v-list-item>
          <v-list-item to="/browse" router-link>
            <v-list-item-content><v-list-item-title>Browse Items</v-list-item-title></v-list-item-content>
          </v-list-item>
          <v-list-item to="/claimsReport" router-link>
            <v-list-item-content><v-list-item-title>My Claims & Reports</v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app color="orange-darken-2 text-black" dark>
        <v-app-bar-nav-icon @click="toggleDrawer" />
        <v-toolbar-title class="text-h5 font-weight-black">ClaimPoint</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="openProfileModal">
          <template v-if="avatarUrl">
            <v-avatar size="50"><v-img :src="avatarUrl"/></v-avatar>
          </template>
          <template v-else>
            <v-icon size="50">mdi-account-circle</v-icon>
          </template>
        </v-btn>

        <v-dialog v-model="showProfileDialog" max-width="500">
          <v-card class="diaglog-background">
            <v-card-title class="headline text-center">Profile</v-card-title>
            <v-card-text class="text-center">
              <div v-if="user">
                <v-avatar size="100" class="mx-auto mb-3">
                  <template v-if="avatarUrl"><v-img :src="avatarUrl"/></template>
                  <template v-else><v-icon size="100">mdi-account-circle</v-icon></template>
                </v-avatar>
                <div class="my-3">
                  <v-btn small color="orange-darken-3" @click="triggerFileInput" :loading="uploading">Upload New Photo</v-btn>
                  <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="uploadImage"/>
                </div>
                <div v-if="uploadError" class="error-message red--text text-caption">{{ uploadError }}</div>
                <p class="mt-4"><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>User ID:</strong> {{ user.id }}</p>
              </div>
              <div v-else><p>Loading profile...</p></div>
            </v-card-text>
            <v-card-actions>
  <!-- Align logout button slightly from the right -->
  <v-btn
    icon
    color="error"
    @click="confirmLogout"
    class="ml-auto mr-4"
  >
    <v-icon>mdi-logout</v-icon>
    Log Out
  </v-btn>
</v-card-actions>
            <v-dialog v-model="showLogoutConfirm" max-width="400">
              <v-card>
                <v-card-title class="headline">Confirm Logout</v-card-title>
                <v-card-text>Are you sure you want to logout?</v-card-text>
                <v-card-actions><v-spacer />
                  <v-btn text @click="showLogoutConfirm=false">Cancel</v-btn>
                  <v-btn color="error" text @click="logout">Logout</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>
        </v-dialog>
      </v-app-bar>

      <v-main>
        <v-container fluid class="pa-4">
          <v-row justify="center">
            <!-- Wide layout like code2 but full-width on medium to avoid elongation -->
            <v-col cols="12" sm="10" md="12" lg="9">
              <v-card class="elevation-10 bg-orange-lighten-4" outlined>
                <v-card-text class="bg-orange-lighten-4"><router-view/></v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </template>
    <!-- Render only route content if not authenticated or unconfirmed -->
    <v-main v-else><slot/></v-main>
  </v-app>
</template>

<style scoped>
.v-app-bar { border-bottom:1px solid #ef6c00; }
.diaglog-background { background-color:#DF9755; }
.v-main { background-color:#ffa726; }
.v-container { background-color:#ffa726; padding:20px; border-radius:20px; }
.v-card { box-shadow:0px 4px 8px rgba(255,145,0,0.5); padding:16px; }
.logo { display:block; margin:0 auto; width:30%; height:auto; }
@media(max-width:600px){ .logo{width:40%;} .v-main{margin-left:0;} }
</style>
