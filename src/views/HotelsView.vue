<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase'; // Import Supabase client
import LayoutView from '@/components/HomeLayout.vue';

const hotels = ref([]); // Array to store hotel data
const activeIndex = ref(0); // To manage the active carousel slide

// Fetch hotels from Supabase when component is mounted
onMounted(async () => {
  const { data, error } = await supabase.from('hotels').select('*');
  if (error) {
    console.error('Error fetching hotels:', error);
    return;
  }
  hotels.value = data; // Store fetched hotel data into the hotels array
});

// Save hotel interaction to Supabase
const saveToSupabase = async (hotel) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log('No user logged in');
    return;
  }

  try {
    const { data: recommendationData, error: recommendationError } = await supabase
      .from('recommendations')
      .insert([
        {
          created_at: new Date().toISOString(),
          target_type: 'hotel',
          user_id: user.id,
          target_spot: hotel.id,
        }
      ]);

    if (recommendationError) {
      console.error('Error saving recommendation:', recommendationError);
    } else {
      console.log('Recommendation saved:', recommendationData);
    }
  } catch (err) {
    console.error('Error:', err);
  }
};
</script>

<template>
  <LayoutView>
    <h1 class="p-4 text-center">Hotel Reviews</h1>

    <!-- Carousel -->
    <div id="carouselExampleCaptions" class="carousel slide">
      <div class="carousel-indicators">
        <button 
          v-for="(hotel, index) in hotels" 
          :key="index" 
          type="button" 
          :data-bs-target="'#carouselExampleCaptions'" 
          :data-bs-slide-to="index" 
          :class="{ active: activeIndex === index }" 
          aria-current="index === activeIndex" 
          aria-label="'Slide ' + (index + 1)">
        </button>
      </div>
      <div class="carousel-inner">
        <div 
          v-for="(hotel, index) in hotels" 
          :key="index" 
          :class="{ 'carousel-item': true, active: activeIndex === index }">
          <img :src="hotel.image" class="d-block w-100" alt="Hotel image">
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ hotel.name }}</h5>
            <p class="text-shadow">{{ hotel.review }}</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- Hotel Reviews -->
    <div class="hotel-reviews mt-5">
      <h2>Hotel Reviews</h2>
      <div class="row">
        <div v-for="(hotel, index) in hotels" :key="index" class="col-md-4">
          <div class="card">
            <img :src="hotel.image" class="card-img-top" alt="Hotel image">
            <div class="card-body">
              <h5 class="card-title">{{ hotel.name }}<i @click="saveToSupabase(hotel)" class="p-4 bi bi-heart"></i></h5>
              <div class="rating">
                <span v-for="n in 5" :key="n" :class="{'text-warning': n <= hotel.rating, 'text-muted': n > hotel.rating}">★</span>
              </div>
              <p class="card-text">{{ hotel.review }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutView>
</template>

<style scoped>
.carousel-caption {
  background-color: rgba(0, 0, 0, 0.5); /* Transparent background with slight darkening */
  color: white; /* White text for contrast */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6); /* Adding text shadow for readability */
}

.text-shadow {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7); /* Optional: enhances the contrast and readability of the text */
}

.hotel-reviews {
  padding: 20px;
}

.card {
  margin-bottom: 20px;
}

.rating {
  font-size: 1.5rem;
  color: gold;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.bi-heart {
  cursor: pointer;
  color: red;
}

.bi-heart:hover {
  color: darkred;
}
</style>
