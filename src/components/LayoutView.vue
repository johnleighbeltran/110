<script setup>
import { useRoute } from 'vue-router' // Import useRoute to access current route
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify' // Use the correct composable for breakpoints
import { supabase } from '@/supabase' // Import Supabase client
import logo from '@/assets/images/logo.png' // Import logo image

const drawer = ref(false) // Toggle for navigation drawer (mobile drawer state)

// Get the current route from Vue Router
const route = useRoute()

// Computed property to check if the screen is small
const display = useDisplay()
const isSmallScreen = computed(() => display.smAndDown)

// User state
const user = ref(null)
const isEmailConfirmed = ref(false)

// Fetch user information from Supabase when the component is mounted
onMounted(async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (currentUser) {
    user.value = currentUser
    // Check if email is confirmed
    isEmailConfirmed.value = currentUser.email_confirmed_at !== null
  }
})
</script>

<template>
  <v-app>
    <!-- Conditionally render the layout components for specific routes -->
    <template v-if="route.name !== 'landing' && route.name !=='admindashboard' && route.name !== 'login' && route.name !== 'register' && isEmailConfirmed">
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

          <v-list-item to="/claims" router-link>
            <v-list-item-content>
              <v-list-item-title>My Claims</v-list-item-title>
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
      <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>LostFound</v-toolbar-title>
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
        <v-btn to="/claims" router-link text>
          <span class="mdi-file-document-outline"></span>
        </v-btn>
          <v-btn to="/claimsReport" router-link text>
          <span class="mdi-file-document-outline"></span>
        </v-btn>
        
  
      </v-bottom-navigation>
    </template>

    <!-- For routes other than landing, login, or register, render only the content -->
    <v-main v-else>
      <slot></slot> <!-- Render slot for the content of the current route -->
    </v-main>
  </v-app>
</template>


<style scoped>
/* Styling for the app bar and navigation drawer */
.v-app-bar {
  border-bottom: 1px solid #e0e0e0;
}

/* Add custom styling for the content area */
.v-main {
  background-color: #f5f5f5;
}

.v-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
}

.v-card {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

/* Resize logo and center it */
.logo {
  width: 50%; /* Resize logo to 50% of the available width */
  height: auto; /* Maintain aspect ratio */
  margin: 20px auto; /* Center logo with margin */
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
