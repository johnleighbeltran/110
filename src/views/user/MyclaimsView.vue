<script setup>
import { ref, onMounted, computed } from 'vue'; // For managing state and lifecycle hooks
import { supabase } from '@/supabase'; // Import your Supabase client

const currentTab = ref(0); // Default to "Claims" (index 0)
const reportItems = ref([]); // State to hold all report items fetched from Supabase
const editableReport = ref(null); // State to hold the report being edited
const dialog = ref(false); // Control visibility of the edit dialog

const claimedItems = computed(() => {
  return reportItems.value.filter(item => item.status === 'claimed');
});

// Fetch all report items from Supabase
const fetchAllReportItems = async () => {
  try {
    const { data, error } = await supabase
      .from('reportitems')
      .select('*');  // '*' selects all columns

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    reportItems.value = data; // Store the fetched data in the reportItems variable
  } catch (error) {
    console.error('Error fetching report items:', error);
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchAllReportItems();
});

// Methods to handle Edit and Delete actions
const editReport = (id) => {
  const reportToEdit = reportItems.value.find(report => report.id === id);
  editableReport.value = { ...reportToEdit }; // Copy the report to editableReport
  dialog.value = true; // Open the dialog for editing
};

const updateReport = async () => {
  try {
    // Update the report in Supabase
    const { data, error } = await supabase
      .from('reportitems')
      .update(editableReport.value)  // Send the updated report data
      .eq('id', editableReport.value.id); // Update based on report ID

    if (error) {
      console.error('Error updating report:', error.message);
    } else {
      console.log('Report updated successfully!', data);
      dialog.value = false; // Close the dialog after update
      fetchAllReportItems(); // Refresh the list after update
    }
  } catch (error) {
    console.error('Error updating report:', error);
  }
};

const deleteReport = async (id) => {
  try {
    const { error } = await supabase
      .from('reportitems')
      .delete()
      .eq('id', id); // Delete the report item based on its ID

    if (error) {
      console.error('Error deleting item:', error.message);
    } else {
      console.log('Item deleted successfully!');
      fetchAllReportItems(); // Refresh the list after deletion
    }
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};

</script>

<template>
  <v-container fluid>
    <!-- Header with logo -->
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col class="text-left">
        <v-img :src="logo" height="40px" />
      </v-col>
    </v-row>

    <!-- Tab Navigation Section: Custom Clickable Tabs -->
    <v-row>
      <!-- Claims Tab -->
      <v-col>
        <v-btn 
          block 
          :color="currentTab === 0 ? 'orange-darken-4' : 'orange-lighten-5'" 
          @click="currentTab = 0">
          Claims
        </v-btn>
      </v-col>

      <!-- Reports Tab -->
      <v-col>
        <v-btn 
          block 
          :color="currentTab === 1 ? 'orange-darken-4' : 'orange-lighten-5'" 
          @click="currentTab = 1">
          Reports
        </v-btn>
      </v-col>
    </v-row>

    <!-- Content Section based on currentTab value -->
    <v-window v-model="currentTab" class="mt-5">
      <!-- Claims Content Section -->
      <v-window-item>
        <v-card class="bg-orange-lighten-5">
          <v-card-title>Claims</v-card-title>
          <v-card-text v-for="(item, index) in claimedItems" :key="index">
            <v-card-title>{{ item.name }}</v-card-title>
            <v-img
              :src="item.item_img" 
              height="100px"
            ></v-img>
            <v-card-text>{{ item.location }}</v-card-text>
            <v-card-text>{{ item.date }}</v-card-text>
            <v-row class="px-4" justify="space-between">
              <v-col>
                <v-chip :color="item.status === 'Approved' ? 'green' : 'orange'" dark>{{ item.status }}</v-chip>
              </v-col>
            </v-row>
            <!-- Feedback (only show if there is feedback) -->
            <v-row v-if="item.description" class="mt-2">
              <v-col>
                <v-card-text><strong>Description:</strong> {{ item.description }}</v-card-text>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Reports Content Section -->
      <v-window-item>
        <v-card class="bg-orange-lighten-5">
          <v-card-title>Reports</v-card-title>
          <v-card-text>
            <v-row v-for="(report, index) in reportItems" :key="index">
              <v-col>
                <v-card-title>{{ report.name }}</v-card-title>
                <v-img
                  :src="report.item_img"
                  height="100px"
                ></v-img>
                <v-card-text>{{ report.location }}</v-card-text>
                <v-card-text>{{ report.date }}</v-card-text>
                <v-card-text>{{ report.report_type }}</v-card-text>
                <v-row class="px-4" justify="space-between">
                  <v-col>
                    <v-chip :color="report.status === 'Approved' ? 'green' : 'orange'" dark>{{ report.status }}</v-chip>
                  </v-col>
                  <!-- Edit and Delete buttons -->
                  <v-col class="text-right">
                    <v-btn small @click="editReport(report.id)">Edit</v-btn>
                    <v-btn small @click="deleteReport(report.id)">Delete</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Edit Report Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>Edit Report</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field 
              v-model="editableReport.name"
              label="Name"
              required
            ></v-text-field>
            <v-text-field 
              v-model="editableReport.location"
              label="Location"
              required
            ></v-text-field>
            <v-text-field 
              v-model="editableReport.date"
              label="Date"
              required
            ></v-text-field>
            <v-textarea 
              v-model="editableReport.description"
              label="Description"
            ></v-textarea>
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
.v-card {
  margin-bottom: 20px;
}
.v-chip {
  font-size: 14px;
}
.v-btn {
  font-size: 12px;
  margin-left: 8px;
}
</style>
