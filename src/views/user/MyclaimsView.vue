<script setup>
// Import necessary functions from Vue
import { ref, onMounted, computed } from 'vue'

// Import the Supabase client configured in your project
import { supabase } from '@/supabase'

// Reactive reference to track the currently selected tab
// 0 = Claims, 1 = Reports
const currentTab = ref(0)

// Reactive array to store all report items fetched from Supabase
const reportItems = ref([])

// Reactive object for the report item that is currently being edited
const editableReport = ref(null)

// Boolean ref to control the visibility of the edit dialog
const dialog = ref(false)

// Computed property to filter out claimed items from all report items
const claimedItems = computed(() => {
  return reportItems.value.filter((item) => item.status === 'claimed')
})

// Function to fetch all report items from Supabase
const fetchAllReportItems = async () => {
  try {
    const { data, error } = await supabase
      .from('reportitems') // Target the "reportitems" table
      .select('*') // Select all columns

    if (error) {
      console.error('Error fetching data:', error)
      return
    }

    // Store the fetched data into the reactive reportItems array
    reportItems.value = data
  } catch (error) {
    console.error('Error fetching report items:', error)
  }
}

// Fetch the report items when the component is first mounted
onMounted(() => {
  fetchAllReportItems()
})

// Function to open the edit dialog with the selected report's data
const editReport = (id) => {
  // Find the report by ID
  const reportToEdit = reportItems.value.find((report) => report.id === id)

  // Make a shallow copy of the report and store it in editableReport
  editableReport.value = { ...reportToEdit }

  // Show the edit dialog
  dialog.value = true
}

// Function to update the currently edited report in Supabase
const updateReport = async () => {
  try {
    const { data, error } = await supabase
      .from('reportitems') // Target the table
      .update(editableReport.value) // Send updated fields
      .eq('id', editableReport.value.id) // Match report by ID

    if (error) {
      console.error('Error updating report:', error.message)
    } else {
      console.log('Report updated successfully!', data)

      // Close the dialog after successful update
      dialog.value = false

      // Refresh the list to reflect changes
      fetchAllReportItems()
    }
  } catch (error) {
    console.error('Error updating report:', error)
  }
}

// Function to delete a report item by ID
const deleteReport = async (id) => {
  try {
    const { error } = await supabase
      .from('reportitems') // Target the table
      .delete() // Delete operation
      .eq('id', id) // Match report by ID

    if (error) {
      console.error('Error deleting item:', error.message)
    } else {
      console.log('Item deleted successfully!')

      // Refresh the list to remove the deleted item
      fetchAllReportItems()
    }
  } catch (error) {
    console.error('Error deleting item:', error)
  }
}
</script>

<template>
  <v-container fluid>
    <!-- Header -->
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col class="text-left">
        <v-img :src="logo" height="40px" />
      </v-col>
    </v-row>

    <!-- Tabs -->
    <v-row>
      <v-col>
        <v-btn
          block
          :color="currentTab === 0 ? 'orange-darken-4' : 'orange-lighten-5'"
          @click="currentTab = 0"
        >
          Claims
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          block
          :color="currentTab === 1 ? 'orange-darken-4' : 'orange-lighten-5'"
          @click="currentTab = 1"
        >
          Reports
        </v-btn>
      </v-col>
    </v-row>

        <!-- Window for Tabs -->
    <v-window v-model="currentTab" class="mt-10">
      <!-- CLAIMS TAB -->
      <v-window-item>
        <v-container fluid>
          <v-card-title>Claims</v-card-title>
          <v-row>
            <v-col
              v-for="(item, index) in claimedItems"
              :key="index"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card class="pa-4 mb-4 border" elevation="2">
                <v-img :src="item.item_img" height="100px" class="mb-2"></v-img>
                <v-card-title>{{ item.name }}</v-card-title>
                <v-card-subtitle><strong>Category:</strong> {{ item.category }}</v-card-subtitle>
                <v-card-subtitle><strong>Location:</strong> {{ item.location }}</v-card-subtitle>
                <v-card-subtitle><strong>Date:</strong> {{ item.date }}</v-card-subtitle>
                <v-card-subtitle><strong>Report Type:</strong> {{ item.report_type }}</v-card-subtitle>

                <v-card-text v-if="item.description">
                  <strong>Description:</strong> {{ item.description }}
                </v-card-text>

                <v-row class="px-4 mt-2" justify="space-between">
                  <v-col>
                    <v-chip :color="item.status === 'Approved' ? 'green' : 'orange'" dark>
                      {{ item.status }}
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <!-- REPORTS TAB -->
      <v-window-item>
        <v-container fluid>
          <v-card-title>Reports</v-card-title>
          <v-row>
            <v-col
              v-for="(report, index) in reportItems"
              :key="index"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card class="pa-4 mb-4 border" elevation="2">
                <v-img :src="report.item_img" height="100px" class="mb-2"></v-img>
                <v-card-title>{{ report.name }}</v-card-title>
                <v-card-subtitle><strong>Category:</strong> {{ report.category }}</v-card-subtitle>
                <v-card-subtitle><strong>Location:</strong> {{ report.location }}</v-card-subtitle>
                <v-card-subtitle><strong>Date:</strong> {{ report.date }}</v-card-subtitle>
                <v-card-subtitle><strong>Report Type:</strong> {{ report.report_type }}</v-card-subtitle>

                <v-card-text v-if="report.description">
                  <strong>Description:</strong> {{ report.description }}
                </v-card-text>

                <v-row class="px-4 mt-2" justify="space-between">
                  <v-col>
                    <v-chip :color="report.status === 'Approved' ? 'green' : 'orange'" dark>
                      {{ report.status }}
                    </v-chip>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn small @click="editReport(report.id)">Edit</v-btn>
                    <v-btn small @click="deleteReport(report.id)">Delete</v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>


    <!-- Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>Edit Report</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="editableReport.name" label="Name" required />
            <v-text-field v-model="editableReport.location" label="Location" required />
            <v-text-field v-model="editableReport.date" label="Date" required />
            <v-textarea v-model="editableReport.description" label="Description" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="updateReport">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.border {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.v-chip {
  font-size: 14px;
}
.v-btn {
  font-size: 12px;
  margin-left: 8px;
}
</style>
