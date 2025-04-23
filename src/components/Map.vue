<template>
  <div class="container-fluid">
    <!-- Map Container -->
    <div id="map" class="map-container"></div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import L from 'leaflet';  // Import Leaflet

// Define props to receive data from parent (HomeView.vue)
const props = defineProps({
  hotels: Array,
  places: Array
});

let map = null;

onMounted(() => {
  // Initialize the map and set the default view
  map = L.map('map').setView([8.9492, 125.5435], 13);  // Default center for Butuan

  // Add a tile layer from OpenStreetMap
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Add markers for hotels and places when the component is mounted
  addMarkers();
});

// Watch for changes to hotels and places props
watch([() => props.hotels, () => props.places], () => {
  // Remove all existing markers before adding new ones
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Add markers for hotels
  addMarkers();
});

const addMarkers = () => {
  // Add hotel markers
  props.hotels.forEach(hotel => {
    L.marker([hotel.lat, hotel.lng])
      .addTo(map)
      .bindPopup(`<b>${hotel.name}</b><br>Location: ${hotel.lat}, ${hotel.lng}`);
  });

  // Add place markers
  props.places.forEach(place => {
    L.marker([place.lat, place.lng])
      .addTo(map)
      .bindPopup(`<b>${place.name}</b><br>Location: ${place.lat}, ${place.lng}`);
  });
};
</script>

<style scoped>
/* Ensure the map container has proper size */
#map {
  width: 100%;
  height: 30vh; /* Adjust the height as needed */
}
</style>
