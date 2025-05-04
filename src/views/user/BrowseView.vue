<script setup> 
// Import necessary Vue Composition API functions and utilities
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabase' // Supabase client instance
import { useRouter } from 'vue-router' // For programmatic navigation

// Initialize router for navigation
const router = useRouter()

// Search and filter state variables
const searchQuery = ref('')               // Search bar input
const selectedCategory = ref(null)        // Selected category filter
const selectedDate = ref('')              // Selected date filter
const selectedLocation = ref(null)        // Selected location filter
const selectedReportType = ref(null)      // Selected report type (Lost/Found)
const dateMenu = ref(false)               // Boolean to control the date picker menu

// Main data collections
const reportItems = ref([])               // All report items fetched from Supabase
const categories = ref([])                // Unique categories extracted from items
const locations = ref([])                 // Unique locations extracted from items

// Fetch all report items from Supabase and extract unique categories and locations
const fetchAllReportItems = async () => {
  try {
    const { data, error } = await supabase.from('reportitems').select('*')
    if (error) {
      console.error('Error fetching data:', error)
      return
    }

    reportItems.value = data

    // Extract unique categories and locations for filter dropdowns
    categories.value = [...new Set(data.map((item) => item.category))]
    locations.value = [...new Set(data.map((item) => item.location))]
  } catch (error) {
    console.error('Error fetching report items:', error)
  }
}

// Call fetch on mount to load initial data
onMounted(() => {
  fetchAllReportItems()
})

// Computed property that filters the report items based on all user inputs
const filteredItems = computed(() => {
  return reportItems.value.filter((item) => {
    // Match text in name, description, location, or date
    const matchesSearchQuery =
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.date.includes(searchQuery.value)

    // Match dropdown filters
    const matchesCategory = !selectedCategory.value || item.category === selectedCategory.value
    const matchesLocation = !selectedLocation.value || item.location === selectedLocation.value
    const matchesDate = !selectedDate.value || item.date === selectedDate.value
    const matchesReportType = !selectedReportType.value || item.report_type === selectedReportType.value

    // Return true only if all filters match
    return matchesSearchQuery && matchesCategory && matchesLocation && matchesDate && matchesReportType
  })
})

// Handles claiming an item by navigating to the claims page
const claimItem = (item) => {
  if (item.status === 'claimed') {
    alert('This item has already been claimed.')
    return
  }

  // Navigate to claims view with item ID in route params
  router.push({ name: 'claims', params: { itemId: item.id } })
}
</script>

<template>
  <v-container fluid>
    <!-- Search Bar -->
    <v-row justify="center" class="mb-5">
      <v-col cols="12" sm="8" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Search (Keyword, Location, Date)"
          prepend-icon="mdi-magnify"
          clearable
          outlined
          @click:clear="searchQuery = ''"
        />
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row justify="center" class="mb-5" align="stretch" no-gutters>
      <!-- Category Filter -->
      <v-col cols="12" sm="6" md="3" class="pa-3">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Category"
          outlined
          clearable
        />
      </v-col>

      <!-- Date Filter -->
      <v-col cols="12" sm="6" md="3" class="pa-3">
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="selectedDate"
              label="Select Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
            />
          </template>
          <v-date-picker v-model="selectedDate" @input="dateMenu = false" />
        </v-menu>
      </v-col>

      <!-- Location Filter -->
      <v-col cols="12" sm="6" md="3" class="pa-3">
        <v-select
          v-model="selectedLocation"
          :items="locations"
          label="Location"
          outlined
          clearable
        />
      </v-col>

      <!-- Report Type Filter (Lost/Found) -->
      <v-col cols="12" sm="6" md="3" class="pa-3">
        <v-select
          v-model="selectedReportType"
          :items="['Lost', 'Found']"
          label="Report Type"
          outlined
          clearable
        />
      </v-col>
    </v-row>

    <!-- Item Cards Section -->
    <v-row justify="center" v-if="filteredItems.length">
      <v-col v-for="(item, index) in filteredItems" :key="index" cols="12" sm="8" md="4" lg="5">
        <v-card>
          <v-img :src="item.item_img" height="200px" />
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle><strong>Category:</strong> {{ item.category }}</v-card-subtitle>
          <v-card-subtitle><strong>Location:</strong> {{ item.location }}</v-card-subtitle>
          <v-card-subtitle><strong>Date:</strong> {{ item.date }}</v-card-subtitle>
          <v-card-subtitle><strong>Report Type:</strong> {{ item.report_type }}</v-card-subtitle>
          <v-card-text><strong>Description:</strong> {{ item.description }}</v-card-text>

          <!-- Action Row for Item (Location Label and Claim Button) -->
          <v-row class="px-4" justify="space-between">
            <v-col>
              <v-chip color="info" dark>Location: {{ item.location }}</v-chip>
            </v-col>
            <v-col class="text-center">
              <!-- Claim Button with conditional styling and action -->
              <v-btn
                :color="item.status === 'claimed' ? 'black' : 'orange-darken-1'"
                :disabled="item.status === 'claimed'"
                @click="item.status !== 'claimed' && claimItem(item)"
              >
                {{ item.status === 'claimed' ? 'Claimed' : 'Claim' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- No Results -->
    <v-row justify="center" v-if="!filteredItems.length">
      <v-col cols="12" class="text-center">
        <v-alert type="error" color="red">No items found matching your criteria.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-container {
  padding-top: 40px;
  background: linear-gradient(135deg, #fff3e0 0%, #e2d1c3 100%);
  min-height: 100vh;
}

.v-row {
  margin-bottom: 1.5rem;
}

/* Input & Select Font */
.v-text-field input,
.v-select input {
  font-size: 16px;
  padding: 12px;
}

.v-input__control {
  font-size: 16px;
}

.v-col.pa-3 {
  padding: 12px !important;
}

.v-label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

/* Cards */
.v-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  background: #fff3e0;
  margin-bottom: 30px;
  padding: 16px;
  min-height: 450px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-10px);
  box-shadow: 0px 14px 28px rgba(0, 0, 0, 0.15);
}

.v-card-title {
  font-size: 24px;
  font-weight: bold;
  color: #5f5f5f;
  margin-bottom: 10px;
}

.v-card-subtitle {
  font-size: 16px;
  color: #131212;
  margin-bottom: 6px;
}

.v-card-text {
  font-size: 15px;
  color: #060606;
  margin-top: 6px;
}

.v-img {
  height: 260px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
  background-color: #ffe0b2;
  margin-bottom: 16px;
  border-radius: 14px;
}

.v-chip {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 12px;
}

.v-btn {
  font-size: 15px;
  font-weight: bold;
  text-transform: none;
  border-radius: 10px;
  padding: 10px 18px;
}

.v-btn.primary {
  background-color: #6a1b9a;
  color: #ffffff;
}

.v-btn.primary:hover {
  background-color: #4a148c;
}

.v-alert {
  border-radius: 16px;
  font-size: 16px;
  margin-top: 2rem;
}

/* Responsive Enhancements */
@media (max-width: 600px) {
  .v-col {
    padding: 8px !important;
  }

  .v-card {
    min-height: 400px;
  }

  .v-img {
    height: 200px;
  }
}
</style>
