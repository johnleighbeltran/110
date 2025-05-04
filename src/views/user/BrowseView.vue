<script setup>
// Import necessary Vue Composition API functions and utilities
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabase' // Import Supabase client instance
import { useRouter, useRoute } from 'vue-router' // For handling navigation and route

// Initialize router and route for programmatic navigation and route handling
const router = useRouter()
const route = useRoute()

// Define computed property to extract the 'filter' query parameter from the URL
const filter = computed(() => route.query.filter)

// Declare reactive variables for search and filter criteria
const searchQuery = ref('') // Stores the search query input
const selectedCategory = ref(null) // Stores selected category for filtering
const selectedDate = ref('') // Stores selected date for filtering
const selectedLocation = ref(null) // Stores selected location for filtering
const selectedReportType = ref(null) // Stores selected report type for filtering (Lost/Found)
const dateMenu = ref(false) // Controls the date picker visibility

// Declare reactive variables for report items and filter options
const reportItems = ref([]) // Array of report items fetched from Supabase
const categories = ref([]) // Array to store unique categories from fetched data
const locations = ref([]) // Array to store unique locations from fetched data

// Function to fetch filtered items based on the query parameter 'filter' from URL
const fetchFilteredItems = async () => {
  let query = supabase.from('reportitems').select('*') // Initialize query to fetch all report items

  // Apply filters based on the 'filter' query parameter
  if (filter.value === 'Found' || filter.value === 'Lost') {
    query = query.eq('report_type', filter.value) // Filter by 'report_type'
  } else if (filter.value === 'Pending') {
    query = query.eq('status', 'pending') // Filter by 'status' if it's 'Pending'
  }

  // Execute the query and handle response
  const { data, error } = await query

  if (error) {
    console.error('Error fetching filtered items:', error) // Log error if query fails
    return
  }

  // Set the fetched data to the reportItems and update categories and locations
  reportItems.value = data
  categories.value = [...new Set(data.map(item => item.category))] // Get unique categories
  locations.value = [...new Set(data.map(item => item.location))] // Get unique locations
}

// Realtime subscription to listen for changes in the 'reportitems' table
let subscription

onMounted(async () => {
  // Fetch initial data when the component is mounted
  await fetchFilteredItems()

  // Subscribe to changes in the reportitems table for real-time updates
  subscription = supabase
    .channel('reportitems-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reportitems'
      },
      async () => {
        console.log('Change detected in reportitems — refetching...')
        await fetchFilteredItems() // Refetch data when changes are detected
      }
    )
    .subscribe()
})

onUnmounted(() => {
  // Cleanup the subscription when the component is unmounted
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})

// Computed property to filter the fetched report items based on the selected filters and search query
const filteredItems = computed(() => {
  return reportItems.value.filter((item) => {
    // Check if the item matches the search query
    const matchesSearchQuery =
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.date.includes(searchQuery.value)

    // Check if the item matches selected category, location, date, and report type
    const matchesCategory = !selectedCategory.value || item.category === selectedCategory.value
    const matchesLocation = !selectedLocation.value || item.location === selectedLocation.value
    const matchesDate = !selectedDate.value || item.date === selectedDate.value
    const matchesReportType = !selectedReportType.value || item.report_type === selectedReportType.value

    // Return the item if it matches all the selected filters and search query
    return matchesSearchQuery && matchesCategory && matchesLocation && matchesDate && matchesReportType
  })
})

// Action to claim an item, which redirects to the claim page if available
const claimItem = (item) => {
  if (item.status === 'claimed') {
    alert('This item has already been claimed.') // Alert if the item is already claimed
    return
  }

  // Navigate to the claim page with the item's id
  router.push({ name: 'claims', params: { itemId: item.id } })
}
</script>

<template>
  <v-container fluid>
    <!-- Search Bar Section -->
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

    <!-- Filters Section -->
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

          <!-- Claim Button Section -->
          <v-row class="px-4" justify="space-between">
            <v-col>
              <v-chip color="info" dark>Location: {{ item.location }}</v-chip>
            </v-col>
            <v-col class="text-center">
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

    <!-- No Results Section -->
    <v-row justify="center" v-if="!filteredItems.length">
      <v-col cols="12" class="text-center">
        <v-alert type="error" color="red">No items found matching your criteria.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* General Styling for the container */
.v-container {
  padding-top: 40px;
  background: linear-gradient(135deg, #fff3e0 0%, #e2d1c3 100%);
  min-height: 100vh;
}

.v-row {
  margin-bottom: 1.5rem;
}

/* Styling for text fields and selects */
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

/* Styling for cards */
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

/* Styling for card title, subtitles, and text */
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

/* Styling for images */
.v-img {
  height: 260px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
  background-color: #ffe0b2;
  margin-bottom: 16px;
  border-radius: 14px;
}

/* Styling for chips */
.v-chip {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 12px;
}

/* Styling for buttons */
.v-btn {
  font-size: 15px;
  font-weight: bold;
  text-transform: none;
  border-radius: 10px;
  padding: 10px 18px;
}

/* Styling for the alert box */
.v-alert {
  border-radius: 16px;
  font-size: 16px;
  margin-top: 2rem;
}
</style>
