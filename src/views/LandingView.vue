<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase'; // Import Supabase client

// Reactive variables to hold fetched data and selected category
const places = ref([]);
const hotels = ref([]);
const selectedCategory = ref('places'); // Default category is 'places'

// Fetch data from Supabase when the component is mounted
onMounted(async () => {
  // Fetch places
  const { data: placesData, error: placesError } = await supabase.from('places').select('*');
  if (placesError) {
    console.error('Error fetching places:', placesError);
    return;
  }
  places.value = placesData; // Store places data
  
  // Fetch hotels (assuming they are stored in a separate table)
  const { data: hotelsData, error: hotelsError } = await supabase.from('hotels').select('*');
  if (hotelsError) {
    console.error('Error fetching hotels:', hotelsError);
    return;
  }
  hotels.value = hotelsData; // Store hotel data
});
</script>

<template>
  <v-app>
    <!-- Category Selector -->
    <div class="category-selector text-center">
      <button @click="selectedCategory = 'places'" :class="{ active: selectedCategory === 'places' }" class="btn btn-primary">Places</button>
      <button @click="selectedCategory = 'hotels'" :class="{ active: selectedCategory === 'hotels' }" class="btn btn-secondary">Hotels</button>
    </div>

    <!-- Carousel for Places or Hotels -->
    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <!-- Display Images Based on Selected Category -->
        <div v-for="(item, index) in (selectedCategory === 'places' ? places : hotels)" :key="index" class="carousel-item" :class="{ active: index === 0 }" :data-bs-interval="index === 0 ? 10000 : 2000">
          <img :src="item.image" class="images d-block w-100 p-4 shadow-lg mb-5 rounded" :alt="selectedCategory + ' Image'">
        </div>
      </div>

      <!-- Carousel controls -->
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- Welcome Text -->
    <div class="container-welcome">
      <h1 class="text-center">Welcome to Butuan City</h1>
      <p class="text-center">Discover the best places and hotels in Butuan City.</p>
    </div>
  </v-app>
</template>

<style scoped>
.category-selector {
  margin-bottom: 20px;
}

.category-selector button {
  margin: 0 10px;
}

.category-selector .active {
  font-weight: bold;
  background-color: #334347;
  color: white;
}

.carousel-control-prev-icon, .carousel-control-next-icon {
  background-color: #181C14;
  border-radius: 50%;
}

.images {
  border: 2px solid #06202B;
  background-color: antiquewhite;
}

.container-welcome {
  margin-top: 20px;
}
</style>
