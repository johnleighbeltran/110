<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify' // Use the correct composable for breakpoints
import { supabase } from '@/supabase' // Import Supabase client
import logo from '@/assets/images/logo.png' // Import logo image

// Computed property to check if the screen is small
const display = useDisplay()
const isSmallScreen = computed(() => display.smAndDown)

// User state
const user = ref(null)
const isEmailConfirmed = ref(false)
// Get the current route from Vue Router
const route = useRoute()
const router = useRouter()
const showProfileDialog = ref(false) // New ref to control profile modal
const drawer = ref(false) // Toggle for navigation drawer (mobile drawer state)
const profileImageUrl = ref('') // Profile Image URL
const uploading = ref(false)
const uploadError = ref(null)
const showLogoutConfirm = ref(false)

function openProfileModal() {
  showProfileDialog.value = true
}

function confirmLogout() {
  showLogoutConfirm.value = true
}

async function logout() {
  await supabase.auth.signOut()
  router.push('/login') // Redirect to login page after logout
}

// Fetch user information from Supabase when the component is mounted
onMounted(async () => {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  if (currentUser) {
    user.value = currentUser
    // Check if email is confirmed
    isEmailConfirmed.value = currentUser.email_confirmed_at !== null
  }
})

// Upload image using user's preferred setup
const uploadImage = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  uploadError.value = null

  try {
    const fileName = `${Date.now()}-${file.name}`

    // Upload the image
    const { data, error: uploadErrorResult } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)

    if (uploadErrorResult) {
      uploadError.value = 'Error uploading image.'
      console.error('Upload error:', uploadErrorResult)
      return
    }

    // Build public URL manually
    const filePath = data.path
    const baseURL = 'https://bzijoejabwuaazggftcm.supabase.co'
    const publicURL = `${baseURL}/storage/v1/object/public/avatars/${filePath}`

    profileImageUrl.value = publicURL

    // Update user's profile metadata in Supabase
    await supabase.auth.updateUser({
      data: {
        avatar_url: publicURL,
      },
    })

    // Update local user metadata too to reflect new image immediately
    if (user.value) {
      user.value.user_metadata = {
        ...user.value.user_metadata,
        avatar_url: publicURL,
      }
    }
  } catch (err) {
    console.error('Unexpected upload error:', err)
    uploadError.value = 'Unexpected error occurred.'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <v-app>
    <!-- Conditionally render the layout components for specific routes -->
    <template
      v-if="
        route.name !== 'landing' &&
        route.name !== 'admindashboard' &&
        route.name !== 'login' &&
        route.name !== 'register' &&
        isEmailConfirmed
      "
    >
      <!-- Navigation Drawer -->
      <v-navigation-drawer app v-model="drawer" permanent width="250" clipped>
        <v-list dense>
          <!-- Logo Item -->
          <v-list-item @click="changeContent('dashboard')">
            <v-list-item-content class="text-center">
              <img :src="logo" alt="Logo" class="logo" />
            </v-list-item-content>
          </v-list-item>

          <!-- Other Menu Items -->
          <v-list-item to="/dashboard" router-link>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/foundlost" router-link>
            <v-list-item-content>
              <v-list-item-title>Report Found or Lost Item</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/browse" router-link>
            <v-list-item-content>
              <v-list-item-title>Browse Found Item</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/claimsReport" router-link>
            <v-list-item-content>
              <v-list-item-title>My Claims & Reports</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- App Bar -->
      <v-app-bar app color="orange-darken-2" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Claimpoint</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="openProfileModal">
          <template v-if="user?.user_metadata?.avatar_url || profileImageUrl">
            <v-avatar size="32">
              <v-img
                :src="user?.user_metadata?.avatar_url || profileImageUrl"
                alt="Profile Picture"
              />
            </v-avatar>
          </template>
          <template v-else>
            <v-icon size="32">mdi-account-circle</v-icon>
          </template>
        </v-btn>

        <v-dialog v-model="showProfileDialog" max-width="500">
          <v-card>
            <v-card-title class="headline text-center">Profile</v-card-title>

            <v-card-text class="text-center">
              <div v-if="user">
                <!-- Profile Image -->
                <v-avatar size="100" class="mx-auto mb-3">
                  <template v-if="user?.user_metadata?.avatar_url || profileImageUrl">
                    <v-img
                      :src="user?.user_metadata?.avatar_url || profileImageUrl"
                      alt="Profile Picture"
                    />
                  </template>
                  <template v-else>
                    <v-icon size="100">mdi-account-circle</v-icon>
                  </template>
                </v-avatar>

                <!-- Upload Button -->
                <div class="my-3">
                  <v-btn
                    small
                    color="primary"
                    @click="$refs.fileInput.click()"
                    :loading="uploading"
                  >
                    Upload New Photo
                  </v-btn>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="d-none"
                    @change="uploadImage"
                  />
                </div>

                <!-- Upload Error Message -->
                <div v-if="uploadError" class="error-message red--text text-caption">
                  {{ uploadError }}
                </div>

                <p class="mt-4"><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>User ID:</strong> {{ user.id }}</p>
              </div>
              <div v-else>
                <p>Loading profile...</p>
              </div>
            </v-card-text>

            <!-- Bottom Logout Icon -->

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon color="error" @click="confirmLogout">
                <v-icon>mdi-logout</v-icon>
              </v-btn>
            </v-card-actions>

            <v-dialog v-model="showLogoutConfirm" max-width="400">
              <v-card>
                <v-card-title class="headline">Confirm Logout</v-card-title>
                <v-card-text>Are you sure you want to logout?</v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="showLogoutConfirm = false">Cancel</v-btn>
                  <v-btn color="error" text @click="logout">Logout</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>
        </v-dialog>
      </v-app-bar>

      <!-- Main Content -->
      <v-main>
        <v-container fluid class="pa-4">
          <v-row justify="center">
            <v-col cols="12" sm="10" md="20" lg="9">
              <v-card class="elevation-2" outlined>
                <v-card-title class="text-center">
                  <!-- Dynamic title based on current content -->
                  <span v-if="route.name === 'dashboard'"></span>
                  <span v-if="route.name === 'foundlost'"></span>
                  <span v-if="route.name === 'browse'"></span>
                  <span v-if="route.name === 'claimsReport'"></span>
                  <span v-if="route.name === 'claims'"></span>
                </v-card-title>

                <v-card-text>
                  <!-- Dynamic content based on current route -->
                  <router-view></router-view>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <!-- Bottom Navigation Bar (visible on small screens) -->
      <v-bottom-navigation v-if="isSmallScreen" app color="primary" dark>
        <v-btn to="/dashboard" router-link text>
          <span class="mdi mdi-view-dashboard"></span>
        </v-btn>
        <v-btn to="/foundlost" router-link text>
          <span class="mdi mdi-check-circle-outline"></span>
          <span class="mdi mdi-alert-circle-outline"></span>
        </v-btn>
        <v-btn to="/browse" router-link text>
          <span class="mdi mdi-note-search"></span>
        </v-btn>
        <v-btn to="/claimsReport" router-link text>
          <span class="mdi-file-document-outline"></span>
        </v-btn>
      </v-bottom-navigation>
    </template>

    <!-- For routes other than landing, login, or register, render only the content -->
    <v-main v-else>
      <slot></slot>
      <!-- Render slot for the content of the current route -->
    </v-main>
  </v-app>
</template>

<style scoped>
/* Styling for the app bar and navigation drawer */
.v-app-bar {
  border-bottom: 1px solid #ef6c00;
}

/* Add custom styling for the content area */
.v-main {
  background-color: #ffa726;
}

.v-container {
  background-color: #ffa726;
  padding: 20px;
  border-radius: 20px; /* Updated border-radius */
}

.v-card {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

/* Resize logo and center it */
.logo {
  display: block; /* Center the logo */
  margin: 0 auto; /* Center the logo */
  max-width: 100%;
  height: auto; /* Maintain aspect ratio */
  width: 30%; /* Adjust logo size */
}

/* Adjusting navigation drawer behavior on small screens */
@media (max-width: 600px) {
  .v-app-bar-nav-icon {
    display: block;
  }

  /* Logo Size for Mobile */
  .logo {
    width: 40%; /* Further reduce logo size on mobile */
  }

  .v-main {
    margin-left: 0; /* No space when the drawer is hidden */
  }
}
</style>
