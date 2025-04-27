<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';

const foundItems = ref(0);
const lostItems = ref(0);
const pendingItems = ref(0);
const recentItems = ref([]);
const loading = ref(true);

const fetchAllReportItems = async () => {
  try {
    const { data, error } = await supabase
      .from('reportitems')
      .select('*');

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    if (data) {
      recentItems.value = data;
      foundItems.value = data.filter(item => item.report_type === 'found').length;
      lostItems.value = data.filter(item => item.report_type === 'lost').length;
      pendingItems.value = data.filter(item => item.status === 'pending').length;
    }
  } catch (err) {
    console.error('Unexpected error fetching data:', err);
  } finally {
    loading.value = false;
  }
};

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
            <v-btn color="white" text>View Details</v-btn>
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
            <v-btn color="white" text>View Details</v-btn>
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
            <v-btn color="white" text>View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Item Activity Table Section -->
    <v-row class="mt-5">
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">Recent Item Activity</v-card-title>

          <v-progress-linear
            v-if="loading"
            indeterminate
            color="primary"
          ></v-progress-linear>

          <v-data-table
            v-else
            :headers="[
              { text: 'Title', value: 'name' },
              { text: 'Category', value: 'category' },
              { text: 'Status', value: 'status' },
              { text: 'Date', value: 'created_at' }
            ]"
            :items="recentItems"
            item-key="id"
            class="elevation-1"
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card {
  margin-bottom: 20px;
  border-radius: 16px;
}

.found-card {
  background: linear-gradient(135deg, #4CAF50, #81C784);
  color: white;
}

.lost-card {
  background: linear-gradient(135deg, #F44336, #E57373);
  color: white;
}

.pending-card {
  background: linear-gradient(135deg, #FFC107, #FFD54F);
  color: white;
}

.v-btn {
  font-size: 12px;
  margin-top: 10px;
}
</style>
