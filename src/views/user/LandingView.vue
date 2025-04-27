<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase' // Import Supabase client
import Layout from '@/components/AuthLayout.vue' // Import Layout component

// Reactive variables to hold fetched data and selected category
const places = ref([])
const hotels = ref([])
const selectedCategory = ref('places') // Default category is 'places'

// Fetch data from Supabase when the component is mounted
onMounted(async () => {
  // Fetch places
  const { data: placesData, error: placesError } = await supabase.from('places').select('*')
  if (placesError) {
    console.error('Error fetching places:', placesError)
    return
  }
  places.value = placesData // Store places data

  // Fetch hotels (assuming they are stored in a separate table)
  const { data: hotelsData, error: hotelsError } = await supabase.from('hotels').select('*')
  if (hotelsError) {
    console.error('Error fetching hotels:', hotelsError)
    return
  }
  hotels.value = hotelsData // Store hotel data
})
</script>

<template>
  <Layout>
    <v-container fluid class="py-5">
      <!-- Welcome Section -->
      <v-row justify="center" class="mb-5">
        <v-col cols="12" md="8" class="text-center">
          <v-img src="@/assets/images/logo.png" max-width="200" alt="Lost&Found Logo" />
          <v-btn @click="selectedCategory = 'places'" :color="selectedCategory === 'places' ? 'primary' : 'grey'" class="mx-2">
            Places
          </v-btn>
          <v-btn @click="selectedCategory = 'hotels'" :color="selectedCategory === 'hotels' ? 'primary' : 'grey'" class="mx-2">
            Hotels
          </v-btn>
        </v-col>
      </v-row>

      <!-- Carousel for Places or Hotels -->
      <v-row v-if="selectedCategory" justify="center">
        <v-col cols="12" md="8">
          <v-carousel cycle>
            <!-- Display Images Based on Selected Category -->
            <v-carousel-item
              v-for="(item, index) in selectedCategory === 'places' ? places : hotels"
              :key="index"
            >
              <v-img
                :src="item.image"
                :alt="selectedCategory + ' Image'"
                height="500px"
                class="rounded-lg shadow-2xl"
              ></v-img>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>

      <!-- Welcome Text -->
      <v-row justify="center" class="my-5">
        <v-col cols="12" md="8" class="text-center">
          <v-typography variant="h3" class="mb-2">Welcome to Butuan City</v-typography>
          <v-typography variant="subtitle1" class="mb-5">Discover the best places and hotels in Butuan City.</v-typography>
        </v-col>
      </v-row>
    </v-container>
  </Layout>
</template>

<style scoped>
.v-btn {
  text-transform: none;
  font-weight: bold;
}

.v-carousel-item {
  display: flex;
  justify-content: center;
}

.v-img {
  border: 2px solid #06202b;
}

.v-typography {
  color: #333;
}
</style>
