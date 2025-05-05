<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '@/supabase'; // Your supabase setup
import { createClient } from '@supabase/supabase-js'
import { useRouter, useRoute } from 'vue-router';

// State
const reportItems = ref([]);
const claims = ref([]);
const selectedStatus = ref('All');
const loading = ref(true);
const selectedClaim = ref(null); // Store the selected claim
const approvalNotes = ref(''); // Store the approval/rejection notes
const users = ref([])
const menu = ref(false) // For the avatar menu
const router = useRouter(); 
  

async function logout() {
  menu.value = false
  localStorage.removeItem('isAdmin')
  router.push('/')
}


const mostReportedItems = computed(() => {
  const itemCount = {}
  reportItems.value.forEach(item => {
    if (item.name) {
      itemCount[item.name] = (itemCount[item.name] || 0) + 1
    }
  })

  const sorted = Object.entries(itemCount).sort((a, b) => b[1] - a[1])
  return sorted.slice(0, 5) // Top 5 most reported items
})

const frequentLocations = computed(() => {
  const locationCount = {}
  reportItems.value.forEach(item => {
    if (item.location) {
      locationCount[item.location] = (locationCount[item.location] || 0) + 1
    }
  })

  const sorted = Object.entries(locationCount).sort((a, b) => b[1] - a[1])
  return sorted.slice(0, 5) // Top 5 locations
})

const totalClaimsProcessed = computed(() => {
  return claims.value.length
})



// --- Set up Supabase admin client ---
const supabaseAdmin = createClient(
  'https://bzijoejabwuaazggftcm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6aWpvZWphYnd1YWF6Z2dmdGNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTYzOTk1NiwiZXhwIjoyMDYxMjE1OTU2fQ.iHtRB76C8-I3VtkY21Qd_En2-AXymmj8pLxThfpRrOQ'  // make sure this key is hidden if using server side!
)


async function fetchAllUsers() {
  loading.value = true
  const { data, error } = await supabaseAdmin.auth.admin.listUsers()
  
  if (error) {
    console.error('Error fetching users:', error)
  } else {
    users.value = data.users
  }
  loading.value = false
}


async function deleteUser(userId) {
  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (error) {
    console.error('Error deleting user:', error)
  } else {
    console.log('User deleted!', data)
  }
}

// Fetch all report items
const fetchReportItems = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase.from('reportitems').select('*');
    if (error) throw error;
    reportItems.value = data;
  } catch (err) {
    console.error('Error fetching report items:', err);
  } finally {
    loading.value = false;
  }
};

// Fetch claims with associated items
const fetchClaimsWithItems = async () => {
  try {
    const { data, error } = await supabase.rpc('fetch_claims_with_items');
    if (error) {
      console.error('Error fetching claims with items:', error);
      alert('Failed to fetch claims.');
    } else {
      claims.value = data;
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong.');
  }
};

// Select a claim to view details
const selectClaim = (claim) => {
  selectedClaim.value = claim;
  approvalNotes.value = ''; // Reset approval notes
};

// Approve or Reject claim
const updateClaimStatus = async (status) => {
  const updatedClaim = {
    id: selectedClaim.value.claim_id,
    status,
    notes: approvalNotes.value,
  };

  console.log('Updating claim status:', updatedClaim);
  const { error } = await supabase
    .from('claims')
    .update({ claim_status: status, notes: approvalNotes.value })
    .eq('claim_id', updatedClaim.id);

  if (error) {
    console.error('Error updating claim status:', error);
    alert('Failed to update claim status');
  } else {
    // Update the associated report item status
    const itemStatus = status === 'approved' ? 'claimed' : 'rejected';
    await updateItemStatus(selectedClaim.value.item_id, itemStatus);

    // Simulate sending a notification (replace with actual notification logic)
    alert(`Claim ${status} successfully!`);
    
    // Close the dialog and reset state
    selectedClaim.value = null;
    approvalNotes.value = '';
    fetchClaimsWithItems(); // Refresh claims list
  }
};

// Update the status of the associated report item
const updateItemStatus = async (itemId, status) => {
  const { error } = await supabase
    .from('reportitems')
    .update({ status })
    .eq('id', itemId);

  if (error) {
    console.error('Error updating item status:', error);
    alert('Failed to update item status');
  }
};

// Filter report items based on status
const filteredItems = computed(() => {
  if (selectedStatus.value === 'All') {
    return reportItems.value;
  }
  return reportItems.value.filter(item => item.status === selectedStatus.value.toLowerCase());
});

// Fetch data on mount
onMounted(() => {
  fetchAllUsers()
  fetchReportItems();
  fetchClaimsWithItems();
  deleteUser('user_id'); // Replace with actual user ID to delete
});
</script>

<template>
  <v-container fluid class="bg-orange-lighten-2">
<v-row class="mb-4" align="center">
  <!-- Centered heading -->
  <v-col cols="auto" class="d-flex justify-center">
    <v-typography class="text-h4 font-weight-bold">Admin Dashboard</v-typography>
  </v-col>
  
  <v-spacer></v-spacer>
  <!-- Avatar and Dropdown Menu -->
  <v-col cols="auto" class="d-flex justify-end">
 <v-menu
    v-model="menu"
    offset-y
    transition="slide-y-reverse-transition"
  >
    <template #activator="{ props }">
      <v-avatar
        size="40"
        class="cursor-pointer"
        v-bind="props"
      >
        <v-img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Avatar" />
      </v-avatar>
    </template>

    <v-list>
      <v-list-item @click="logout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  </v-col>
</v-row>

    <!-- Dashboard Statistic Cards -->
    <v-row>
      <v-col cols="12" sm="4">
        <v-card color="green lighten-4" class="pa-4">
          <v-card-title class="text-h5">Total Items</v-card-title>
          <v-card-subtitle>{{ reportItems.length }} Items</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="blue lighten-4" class="pa-4">
          <v-card-title class="text-h5">Lost Items</v-card-title>
          <v-card-subtitle>{{ reportItems.filter(i => i.status === 'lost').length }} Items</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="yellow lighten-4" class="pa-4">
          <v-card-title class="text-h5">Found Items</v-card-title>
          <v-card-subtitle>{{ reportItems.filter(i => i.status === 'found').length }} Items</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Claims Table -->
    <v-row class="my-5">
      <v-col>
        <v-card>
          <v-card-title class="text-h5">Managing Claims</v-card-title>
          <v-data-table
            :headers="[{ text: 'Claim ID', value: 'claim_id' }, { text: 'Claimant Name', value: 'claimnant_name' }, { text: 'Item Name', value: 'item_id' }, { text: 'Claim Status', value: 'claim_status' }, { text: 'Actions', value: 'actions', sortable: false }]"
            :items="claims"
            item-key="claim_id"
          >
            <template #item.actions="{ item }">
              <v-btn color="blue" size="small" @click="selectClaim(item)">View Details</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Selected Claim Details Modal -->
    <v-dialog v-model="selectedClaim" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">Claim Details</v-card-title>
        <v-card-subtitle>Name: {{ selectedClaim?.claimnant_name }} Date: {{selectedClaim?.claim_date}} </v-card-subtitle>
        <v-img
          :src="reportItems.find(item => item.id === selectedClaim?.item_id)?.item_img"
          height="200px"
        ></v-img>
        <v-card-text>
          <v-row>
            <v-col>
              <strong>Claim ID:</strong> {{ selectedClaim?.claim_id }}
            </v-col>
            <v-col>
              <strong>Status:</strong> {{ selectedClaim?.claim_status }}
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <strong>Item ID:</strong> {{ selectedClaim?.item_id }}
            </v-col>
            <v-col>
              <strong>Item Name:</strong> {{ reportItems.find(item => item.id === selectedClaim?.item_id)?.name }}
            </v-col>
          </v-row>

          <!-- Notes for Approving/Rejection -->
          <v-textarea
            v-model="approvalNotes"
            label="Approval/Rejection Notes"
            rows="4"
            clearable
          ></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-btn color="green" @click="updateClaimStatus('approved')">Approve</v-btn>
          <v-btn color="red" @click="updateClaimStatus('rejected')">Reject</v-btn>
          <v-btn color="grey" @click="selectedClaim = null">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- Users Table -->
    <v-row class="my-5">
      <v-col>
        <v-card>
        <v-card-title class="text-h5">Manage Users</v-card-title>
         <v-data-table
            :headers="[
              { text: 'User ID', value: 'id' },
              { text: 'Email', value: 'email' },
              { text: 'Actions', value: 'actions', sortable: false }
            ]"
            :items="users"
            item-key="id"
          >
            <template #item.actions="{ item }">
              <v-btn color="red" size="small" @click="deleteUser(item.id)">Delete</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    
    <!-- System Report Table -->
    <v-row class="my-5">
      <v-col>
        <v-card>
          <v-card-title class="text-h5">System Report</v-card-title>
          <v-row>
      <v-col cols="12" md="4">
        <v-sheet class="pa-4">
          <h3 class="text-lg font-semibold mb-2">Top Reported Items</h3>
          <ul>
            <li v-for="(item, index) in mostReportedItems" :key="index">
              {{ item[0] }} ({{ item[1] }} reports)
            </li>
          </ul>
        </v-sheet>
      </v-col>

      <v-col cols="12" md="4">
        <v-sheet class="pa-4">
          <h3 class="text-lg font-semibold mb-2">Frequent Locations</h3>
          <ul>
            <li v-for="(loc, index) in frequentLocations" :key="index">
              {{ loc[0] }} ({{ loc[1] }} times)
            </li>
          </ul>
        </v-sheet>
      </v-col>

      <v-col cols="12" md="4">
        <v-sheet class="pa-4">
          <h3 class="text-lg font-semibold mb-2">Total Claims Processed</h3>
          <p class="text-2xl font-bold">{{ totalClaimsProcessed }}</p>
        </v-sheet>
      </v-col>

      </v-row> 
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* --- Overall Card Layout --- */
.v-card {
  border-radius: 18px;
  background: #FFF3E0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0);
  margin-bottom: 28px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* sub-title */
.v-card-subtitle {
  color: #000000;
  font-weight: 600;
}

/* --- Card Title (Section Headers) --- */
.v-card-title {
  font-size: 24px;
  font-weight: 700;
  background: #000000;
  color: white;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 18px 18px 0 0;
}

/* --- Dashboard Statistic Cards --- */
.statistic-card {
  background: linear-gradient(135deg, #d58330 0%, #0f0e0e 100%);
  color: #000000;
  text-align: center;
  padding: 24px;
}

.statistic-card h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.statistic-card p {
  font-size: 28px;
  font-weight: bold;
  color: #000000;
}

/* --- v-sheet for Sub Reports (System Report Section) --- */
.v-sheet {
  background: #FFF3E0;

  border-radius: 12px;
  padding: 20px;
  transition: background 0.3s;
}

.v-sheet:hover {
  background: #f0f0f0;
}

/* --- Lists inside Reports --- */
ul {
  padding-left: 1.2rem;
  list-style: disc;
}

li {
  font-size: 14px;
  margin-bottom: 6px;
}

/* --- Buttons --- */
.v-btn {
  font-weight: bold;
  text-transform: none;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* --- Data Tables --- */
.v-data-table {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
}
 
/* --- Avatar Menu --- */
.v-avatar {
  border: 2px solid #ffffff;
}

.v-data-table {
  background-color: #FFF3E0;
}
</style>

