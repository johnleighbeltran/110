<script setup>
import { ref } from 'vue';

// Importing images correctly
import GoHotels from '@/assets/images/GoHotels.jpg';
import GrandPalace from '@/assets/images/GrandPalace.jpg';
import Oazis from '@/assets/images/Oazis.jpg';
import Watergate from '@/assets/images/watergate.jpg';

// Use ref to define the images array
const images = ref([GoHotels, Watergate, GoHotels, Watergate]);
</script>



<template>
    
<v-app>
    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <!-- Loop through the images array using v-for -->
      <div 
        v-for="(image, index) in images" 
        :key="index" 
        class="carousel-item" 
        :class="{ active: index === 0 }" 
        :data-bs-interval="index === 0 ? 10000 : 2000">
        <img :src="image" class="images d-block w-100 p-4 shadow-lg mb-5 rounded" alt="Hotel Image">
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
<br></br>
<div class="container-welcome">
        <h1 class="text-center">Welcome to Butuan City</h1>
        <p class="text-center">Discover the best hotels and accommodations in Butuan City.</p>
</div>
</v-app>

</template>

<style scoped>

.carousel-control-prev-icon, .carousel-control-next-icon{
    background-color: #181C14;
    border-radius: 50%;
}
.images{
    border: 2px solid #06202B;
    background-color: antiquewhite;
}

</style>
