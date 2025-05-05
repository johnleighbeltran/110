<script setup>
// Import necessary Vue Composition API functions and Supabase client
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase'; // Import the Supabase client instance

// Reactive variables to store the count of found, lost, and pending items, as well as recent item data
const foundItems = ref(0); // Stores the count of found items
const lostItems = ref(0); // Stores the count of lost items
const pendingItems = ref(0); // Stores the count of pending items
const recentItems = ref([]); // Stores the list of recent items fetched from Supabase
const loading = ref(true); // Tracks loading state, initially true to show loading indicator

// Function to fetch all report items from Supabase and update the reactive variables
const fetchAllReportItems = async () => {
  try {
    // Query the 'reportitems' table in Supabase to get all data
    const { data, error } = await supabase
      .from('reportitems')
      .select('*');

    if (error) {
      // Log any error that occurs during the data fetching
      console.error('Error fetching data:', error);
      return;
    }

    if (data) {
      // If data is retrieved successfully, assign it to 'recentItems'
      recentItems.value = data;
      // Count the number of found, lost, and pending items by filtering the data
      foundItems.value = data.filter(item => item.report_type === 'Found').length;
      lostItems.value = data.filter(item => item.report_type === 'Lost').length;
      pendingItems.value = data.filter(item => item.status === 'pending').length;
    }
  } catch (err) {
    // Log any unexpected errors during the fetch process
    console.error('Unexpected error fetching data:', err);
  } finally {
    // Set loading to false once the data fetching is complete
    loading.value = false;
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchAllReportItems();
});
</script>

<template>
  <v-container fluid>
    <v-row>
      <!-- Found Items Card -->
      <v-col cols="12" sm="4">
        <v-card class="pa-4 found-card">
          <v-card-title class="text-h5">Found Items</v-card-title>
          <v-card-text class="text-h4 font-weight-bold">{{ foundItems }}</v-card-text>
          <v-card-subtitle class="text-caption">Items marked as Found</v-card-subtitle>
          <v-card-actions>
            <!-- Button to navigate to browse page with 'Found' filter applied -->
            <v-btn color="white" :to="{ path: '/browse', query: { filter: 'Found' } }" text>View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Lost Items Card -->
      <v-col cols="12" sm="4">
        <v-card class="pa-4 lost-card">
          <v-card-title class="text-h5">Lost Items</v-card-title>
          <v-card-text class="text-h4 font-weight-bold">{{ lostItems }}</v-card-text>
          <v-card-subtitle class="text-caption">Items reported Lost</v-card-subtitle>
          <v-card-actions>
            <!-- Button to navigate to browse page with 'Lost' filter applied -->
            <v-btn color="white" :to="{ path: '/browse', query: { filter: 'Lost' } }" text>View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Pending Items Card -->
      <v-col cols="12" sm="4">
        <v-card class="pa-4 pending-card">
          <v-card-title class="text-h5">Pending Items</v-card-title>
          <v-card-text class="text-h4 font-weight-bold">{{ pendingItems }}</v-card-text>
          <v-card-subtitle class="text-caption">Items awaiting status</v-card-subtitle>
          <v-card-actions>
            <!-- Button to navigate to browse page with 'Pending' filter applied -->
            <v-btn color="white" :to="{ path: '/browse', query: { filter: 'Pending' } }" text>View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Item Activity Table Section -->
    <v-row class="mt-5">
      <v-col cols="12">
        <v-card >
          <v-card-title class="text-h5">Recent Item Activity</v-card-title>

          <!-- Progress bar shown while loading the data -->
          <v-progress-linear
            v-if="loading"
            indeterminate
            color="primary"
          ></v-progress-linear>

          <!-- Data table to display the recent items when loading is complete -->
          <v-data-table
            v-else
            :headers="[ // Define the headers for the table
              { text: 'Title', value: 'name' },
              { text: 'Category', value: 'category' },
              { text: 'Status', value: 'status' },
              { text: 'Date', value: 'created_at' }
            ]"
            :items="recentItems" 
            item-key="id" 
            class="elevation-1"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* General styles for cards */
.v-card {
  margin-bottom: 20px; /* Space between cards */
  border-radius: 16px; /* Rounded corners for the cards */
  background-color: rgb(0, 85, 254);
  color: white;
}

/* Found items card background and text styles */
.found-card {
  background: linear-gradient(135deg, #4CAF50, #81C784); /* Green gradient for Found items */
  color: white;
}

/* Lost items card background and text styles */
.lost-card {
  background: linear-gradient(135deg, #F44336, #E57373); /* Red gradient for Lost items */
  color: white;
}

/* Pending items card background and text styles */
.pending-card {
  background: linear-gradient(135deg, #FFC107, #FFD54F); /* Yellow gradient for Pending items */
  color: white;
}

/* Button styles */
.v-btn {
  font-size: 12px; /* Smaller font size for buttons */
  margin-top: 10px; /* Space between the card text and button */
}
</style>
