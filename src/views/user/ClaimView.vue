<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';  // Import Supabase client
import { useRoute } from 'vue-router';

export default {
  setup() {
    // Form Data
    const reason = ref('');
    const file = ref(null);
    const imageUrl = ref('');
    const user = ref(null);  // To store authenticated user data

    // Access the itemId route parameter
    const route = useRoute();


    const itemId = route.params.itemId;

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

    // Submit claim function
    const submitClaim = async () => {
      try {
        // Check if reason is provided
        if (!reason.value) {
          alert('Please provide a reason for claiming the item.');
          return;
        }

        // Get user ID from the authenticated user
        const userId = user.value?.id;
        if (!userId) {
          alert('You must be logged in to submit a claim.');
          return;
        }

        // Prepare file for upload (if exists)
        let fileUrl = '';
        if (file.value) {
          // Generate unique file name using a timestamp
          const uniqueFileName = `${new Date().toISOString()}_${file.value.name}`;

          // Upload the file to Supabase storage
          const { data, error } = await supabase.storage
            .from('claimproofs')
            .upload(uniqueFileName, file.value);

          if (error) {
            console.error('Error uploading proof:', error);
            alert('Error uploading proof. Please try again.');
            return;
          }

          const filePath = data.path;  // Get the file path from the upload response
          
          // Construct the public URL for the uploaded image
          const baseURL = 'https://bzijoejabwuaazggftcm.supabase.co';
          fileUrl = `${baseURL}/storage/v1/object/public/claimproofs/${filePath}`;
        }

        // Insert claim data into the claims table
        const { error: insertError } = await supabase
          .from('claims')
          .insert([
            {
              item_id: itemId,  // Example item_id, you need to set this dynamically
              user_id: userId,  // Use dynamic user ID from the authenticated user
              reason: reason.value,
              proof_url: fileUrl || null,  // Include file URL if uploaded
              claim_status: 'Pending',
              claim_date: new Date(),
              claimnant_name: user.value.user_metadata.full_name || user.value.email,  // Use full name or email as fallback
            }
          ]);

        if (insertError) {
          console.error('Error submitting claim:', insertError);
          alert('An error occurred while submitting your claim. Please try again.');
          return;
        }

        alert('Claim submitted successfully!');
        reason.value = '';  // Reset reason field
        file.value = null;  // Reset file input
        imageUrl.value = ''; // Reset image preview
      } catch (error) {
        console.error('Error submitting claim:', error);
        alert('An error occurred. Please try again.');
      }
    };

    // Preview image after file is selected
    const previewImage = () => {
      if (file.value) {
        const reader = new FileReader();
        reader.onload = () => {
          imageUrl.value = reader.result;
        };
        reader.readAsDataURL(file.value);
      }
    };

    return {
      itemId,
      reason,
      file,
      imageUrl,
      submitClaim,
      previewImage,
      user,
    };
  },
};
</script>

<template>
  <v-container class="my-5" fluid >
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6 bg-orange-lighten-5" elevation="4" rounded>
          <v-card-title class="text-center">
            <h3>Claim Item</h3>
          </v-card-title>

          <!-- Claim Form -->
          <v-form @submit.prevent="submitClaim">
            <!-- Reason for Claiming -->
            <p>Claiming item with ID: {{ itemId }}</p>

            <v-textarea
              v-model="reason"
              label="Reason for Claiming"
              required
              outlined
              class="mb-4"
              rows="4"
              auto-grow
            ></v-textarea>

            <!-- Upload Proof -->
            <v-file-input
              v-model="file"
              label="Upload Proof (Optional)"
              outlined
              dense
              prepend-icon="mdi-upload"
              class="custom-file-input"
              @change="previewImage"
            ></v-file-input>

            <!-- Image Preview -->
            <v-img 
              v-if="imageUrl"
              :src="imageUrl"
              max-width="300"
              class="my-4"
            ></v-img>

            <!-- Submit Button -->
            <v-btn type="submit" color="orange-lighten-1" block large>Submit Claim</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>



<style scoped>
.custom-file-input {
  font-size: 14px;
}

</style>
