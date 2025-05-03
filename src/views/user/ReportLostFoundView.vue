<template>
  <v-container class="my-5" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-6" elevation="4" rounded>
          <v-card-title class="text-center">
            <h3>Report Item</h3>
          </v-card-title>

          <!-- Form for reporting lost item -->
          <v-form @submit.prevent="submitReport">
            <v-file-input
              v-model="file"
              label="Upload Photo"
              placeholder="Choose a file"
              outlined
              dense
              prepend-icon="mdi-upload"
              class="custom-file-input"
              required
              @change="previewImage"
            ></v-file-input>

            <!-- Image Preview -->
            <v-img 
              v-if="imageUrl"
              :src="imageUrl"
              max-width="300"
              class="my-4"
            ></v-img>

            <v-text-field
              v-model="itemname"
              label="Item Name"
              type="text"
              required
              outlined
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="category"
              label="Category"
              type="text"
              required
              outlined
              class="mb-4"
            ></v-text-field>

            <v-textarea
              v-model="description"
              label="Description"
              required
              outlined
              class="mb-4"
              rows="4"
              auto-grow
            ></v-textarea>

            <v-text-field
              v-model="location"
              label="Location"
              type="text"
              required
              outlined
              class="mb-4"
            ></v-text-field>

            <!-- Status Dropdown -->
            <v-select
              v-model="status"
              :items="statusOptions"
              label="Report Type"
              outlined
              class="mb-4"
              required
            ></v-select>

            <v-menu v-model="menu" :close-on-content-click="false" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Select Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                  class="custom-input"
                  @click="toggleMenu"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                @input="menu = false"
                :max="maxDate"
                class="justify-center"
              ></v-date-picker>
            </v-menu>

            <v-btn type="submit" color="primary" block large>Submit</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { supabase } from '../../supabase';  // Import Supabase client
import { ref, onMounted } from 'vue';

export default {
  setup() {
    // Form Data
    const itemname = ref('');
    const category = ref('');
    const description = ref('');
    const location = ref('');
    const date = ref('');
    const file = ref(null);
    const imageUrl = ref('');
    const status = ref('found');  // Default status is 'pending'

    // Max Date (Prevent Future Dates)
    const maxDate = ref(new Date().toISOString().substr(0, 10));

    // Control Date Picker Visibility
    const menu = ref(false);

    // Authenticated user reference
    const user = ref(null);

    // Status options for the dropdown
    const statusOptions = ref(['Lost', 'Found']);

    // Fetch authenticated user data on mount
    onMounted(async () => {
      try {
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Error fetching user data:', authError);
          return;
        }
        user.value = currentUser;
        console.log('Authenticated user:', user.value);
      } catch (error) {
        console.error('Error during authentication check:', error);
      }
    });

    // Toggle Date Picker Menu
    const toggleMenu = () => {
      menu.value = !menu.value;
    };

    // Preview Image After Upload
    const previewImage = () => {
      if (file.value) {
        const reader = new FileReader();
        reader.onload = () => {
          imageUrl.value = reader.result;
        };
        reader.readAsDataURL(file.value);
      }
    };

    const submitReport = async () => {
      if (!user.value) {
        alert('Please log in to submit the report.');
        return;
      }

      // Ensure file is selected
      if (!file.value) {
        alert('Please upload a file.');
        return;
      }

      try {
        // Generate a unique file name using a timestamp
        const uniqueFileName = `${new Date().toISOString()}_${file.value.name}`;

        // Upload the file to Supabase storage
        const { data, error } = await supabase.storage
          .from('reportimage')
          .upload(`${uniqueFileName}`, file.value);

        if (error) {
          console.error('Error uploading file:', error);
          alert('Error uploading file. Please try again.');
          return;
        }

        const filePath = data.path; // Get the file path from the upload response
        console.log('File uploaded successfully:', filePath);

        const baseURL = 'https://bzijoejabwuaazggftcm.supabase.co';
        const publicURL = `${baseURL}/storage/v1/object/public/reportimage/${filePath}`;

        // Insert or update the report data in the database
        const { error: upsertError, data: upsertData } = await supabase
          .from('reportitems')
          .upsert({
            name: itemname.value,
            category: category.value,
            description: description.value,
            location: location.value,
            date: date.value,
            item_img: publicURL, // Store the public URL of the uploaded image
            status: "pending", // Use the selected status
            report_type: status.value, // Use the selected status as report type
            user_id: user.value.id,
          });

        if (upsertError) {
          console.error('Error inserting/updating report:', upsertError);
          alert('An error occurred while saving the report. Please try again.');
          return;
        }

        console.log('Report submitted successfully:', upsertData);
        alert('Your report has been submitted successfully.');
      } catch (error) {
        console.error('Error submitting report:', error);
        alert('An error occurred while submitting the report. Please try again.');
      }
    };

    return {
      itemname,
      category,
      description,
      location,
      date,
      file,
      imageUrl,
      maxDate,
      menu,
      user,
      status,
      statusOptions,
      toggleMenu,
      submitReport,
      previewImage,
    };
  },
};
</script>

<style scoped>
/* Container */
.v-container {
  background: #FFCC80;
  min-height: 100vh;
  padding-top: 40px;
}

/* Card */
.v-card {
  border-radius: 20px;
  background-color: #FFF3E0;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.08);
}

/* Card Title */
.v-card-title {
  font-size: 24px;
  font-weight: bold;
  color: rgb(40, 39, 39);
  margin-bottom: 20px;
}

/* Input Fields */
.v-text-field,
.v-textarea,
.v-select,
.v-file-input {
  margin-bottom: 20px;
  font-size: 16px;
}

/* Submit Button */
.v-btn {
  font-size: 16px;
  font-weight: bold;
  padding: 14px 0;
  border-radius: 12px;
  background-color: #FB8C00 !important;
  color: #fff;
  letter-spacing: 1px;
  transition: background-color 0.3s ease;
}

.v-btn:hover {
  background-color: #c1761b;
}

/* File Upload and Image Preview */
.v-img {
  margin-top: 12px;
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

/* Custom Input Adjustments */
.custom-input {
  font-size: 16px;
}

.custom-file-input {
  font-size: 14px;
}

/* Date Picker Menu */
.v-menu__content {
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.12);
}

/* Center the Form on Mobile */
@media (max-width: 600px) {
  .v-card {
    padding: 20px;
  }
}
</style>

