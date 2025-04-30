<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/supabase'; // Assuming you have Supabase client set up


import { useRouter } from 'vue-router'; // Import useRouter to navigate

const router = useRouter(); // Initialize router

// Data for search, categories, and locations
const searchQuery = ref('');
const selectedCategory = ref(null);
const selectedDate = ref('');
const selectedLocation = ref(null);
const dateMenu = ref(false);

// State for fetched report items
const reportItems = ref([]);
const categories = ref([]);
const locations = ref([]);

// Fetch all report items from Supabase
const fetchAllReportItems = async () => {
  try {
    const { data, error } = await supabase
      .from('reportitems') // Replace with your actual table name
      .select('*');

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    reportItems.value = data; // Store the fetched data in the reportItems variable

    // Extract unique categories and locations from fetched data
    categories.value = [...new Set(data.map(item => item.category))];
    locations.value = [...new Set(data.map(item => item.location))];

  } catch (error) {
    console.error('Error fetching report items:', error);
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchAllReportItems();
});

// Computed property for filtered items
const filteredItems = computed(() => {
  return reportItems.value.filter((item) => {
    const matchesSearchQuery =
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.date.includes(searchQuery.value);

    const matchesCategory = !selectedCategory.value || item.category === selectedCategory.value;
    const matchesLocation = !selectedLocation.value || item.location === selectedLocation.value;
    const matchesDate = !selectedDate.value || item.date === selectedDate.value;

    return (
      matchesSearchQuery && matchesCategory && matchesLocation && matchesDate
    );
  });
});

// Claim item function that navigates to the claims page with itemId
const claimItem = (item) => {
  // Navigate to the claims page with item id as a route parameter
  if(item.status === "claimed"){
    alert("This item has already been claimed.");
    return;
  }
  console.log('Claiming item:', item.id);
  router.push({ name: 'claims', params: { itemId: item.id } });
};

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
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Filters Section -->
    <v-row justify="center" class="mb-5">
      <v-col cols="12" sm="4" md="3">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Category"
          outlined
        ></v-select>
      </v-col>
      <v-col cols="12" sm="4" md="3">
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
            ></v-text-field>
          </template>
          <v-date-picker v-model="selectedDate" @input="dateMenu = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <v-select
          v-model="selectedLocation"
          :items="locations"
          label="Location"
          outlined
        ></v-select>
      </v-col>
    </v-row>

    <!-- Cards Section -->
    <v-row justify="center" v-if="filteredItems.length">
      <v-col
        v-for="(item, index) in filteredItems"
        :key="index"
        cols="12" sm="8" md="4" lg="5"
      >
        <v-card>
          <v-img
            :src="item.item_img"
            height="200px"
          ></v-img>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle>catergory: {{ item.category }}</v-card-subtitle>
          <v-card-subtitle>location: {{ item.location }}</v-card-subtitle>
          <v-card-subtitle>date: {{ item.date }}</v-card-subtitle>
          <v-card-text>
            description: {{ item.description }}
          </v-card-text>

          <!-- Found Location -->
          <v-row class="px-4" justify="space-between">
            <v-col>
              <v-chip color="info" dark>location: {{ item.location }}</v-chip>
            </v-col>
            <!-- Claim Button -->
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

    <!-- No results message -->
    <v-row justify="center" v-if="!filteredItems.length">
      <v-col cols="12" class="text-center">
        <v-alert type="info">No items found matching your criteria.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Container padding */
.v-container {
  padding-top: 40px;
  background: linear-gradient(135deg, #FFF3E0 0%, #e2d1c3 100%);
  min-height: 100vh;
}

/* Spacing for search/filter rows */
.v-row {
  margin-bottom: 1.5rem;
}

/* Text Fields and Selects */
.v-text-field,
.v-select {
  font-size: 16px;
  margin-bottom: 12px;
}

/* Search Field */
.v-text-field input {
  font-size: 16px;
}

/* Cards */
.v-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: #FFF3E0;
  margin-bottom: 30px;
  padding: 16px;
  min-height: 450px; /* Bigger card body */
}

.v-card:hover {
  transform: translateY(-10px);
  box-shadow: 0px 14px 28px rgba(0, 0, 0, 0.15);
}

/* Card Title and Subtitles */
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

/* Card Text */
.v-card-text {
  font-size: 15px;
  color: #060606;
  margin-top: 6px;
}

/* Image inside Card */
.v-img {
  height: 260px; /* Bigger Image */
  object-fit: cover;
  border-bottom: 1px solid #eee;
  background-color: #FFE0B2;
  margin-bottom: 16px;
  border-radius: 14px;
}

/* Chips */
.v-chip {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 12px;
}

/* Buttons */
.v-btn {
  font-size: 15px;
  font-weight: bold;
  text-transform: none;
  border-radius: 10px;
  padding: 10px 18px;
}

/* Claim Button */
.v-btn.primary {
  background-color: #6a1b9a;
  color: #ffffff;
}

.v-btn.primary:hover {
  background-color: #4a148c;
}

/* Alert Message */
.v-alert {
  border-radius: 16px;
  font-size: 16px;
  margin-top: 2rem;
}

/* Responsive Fix */
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
