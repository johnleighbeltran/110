<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabase'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const filter = computed(() => route.query.filter)

const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedDate = ref('')
const selectedLocation = ref(null)
const selectedReportType = ref(null)
const dateMenu = ref(false)

const reportItems = ref([])
const categories = ref([])
const locations = ref([])

const fetchFilteredItems = async () => {
  let query = supabase.from('reportitems').select('*')

  if (filter.value === 'Found' || filter.value === 'Lost') {
    query = query.eq('report_type', filter.value)
  } else if (filter.value === 'Pending') {
    query = query.eq('status', 'pending')
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching filtered items:', error)
    return
  }

  reportItems.value = data
  categories.value = [...new Set(data.map(item => item.category))]
  locations.value = [...new Set(data.map(item => item.location))]
}

let subscription

onMounted(async () => {
  await fetchFilteredItems()

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
        await fetchFilteredItems()
      }
    )
    .subscribe()
})

onUnmounted(() => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})

const filteredItems = computed(() => {
  return reportItems.value.filter((item) => {
    const search = searchQuery.value.toLowerCase()
    const matchesSearchQuery =
      item.name.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.location.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) || // ✅ category search added
      item.date.includes(search)

    const matchesCategory = !selectedCategory.value || item.category === selectedCategory.value
    const matchesLocation = !selectedLocation.value || item.location === selectedLocation.value
    const matchesDate = !selectedDate.value || item.date === selectedDate.value
    const matchesReportType = !selectedReportType.value || item.report_type === selectedReportType.value

    return matchesSearchQuery && matchesCategory && matchesLocation && matchesDate && matchesReportType
  })
})

const claimItem = (item) => {
  if (item.status === 'claimed') {
    alert('This item has already been claimed.')
    return
  }
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
          label="Search (Name, Description, Category, Location, Date)"
          prepend-icon="mdi-magnify"
          clearable
          outlined
          @click:clear="searchQuery = ''"
        />
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row justify="center" class="mb-5" align="stretch" no-gutters>
      <v-col cols="12" sm="6" md="3" class="pa-3">
        <v-select v-model="selectedCategory" :items="categories" label="Category" outlined clearable />
      </v-col>

      <v-col cols="12" sm="6" md="3" class="pa-3">
        <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
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

      <v-col cols="12" sm="6" md="3" class="pa-3">
        <v-select v-model="selectedLocation" :items="locations" label="Location" outlined clearable />
      </v-col>

      <v-col cols="12" sm="6" md="3" class="pa-3">
        <v-select v-model="selectedReportType" :items="['Lost', 'Found']" label="Report Type" outlined clearable />
      </v-col>
    </v-row>

    <!-- Items -->
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

.v-alert {
  border-radius: 16px;
  font-size: 16px;
  margin-top: 2rem;
}
</style>
