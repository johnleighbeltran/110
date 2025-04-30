<script setup>
import Layout from '@/components/AuthLayout.vue'
</script>

<template>
  <Layout>
    <div class="about-wrapper">
      <v-container fluid class="py-10">

        <!-- Logo and Title -->
        <v-row justify="center" class="mb-8">
          <v-col cols="12" md="6" class="text-center">
            <v-img 
              src="@/assets/images/logo.png" 
              max-width="200" 
              alt="Lost & Found Logo" 
              class="mb-6"
            />
            <h1 class="about-title">About Us</h1>
            <p class="about-subtitle">
              Reuniting people with what matters most.
            </p>
          </v-col>
        </v-row>

        <!-- About Section Split into Two Columns -->
        <v-row justify="center">
          <v-col cols="12" md="10">
            <v-card elevation="2" class="pa-8 about-card">
              <v-row>
                <!-- Left Column -->
                <v-col cols="12" md="6">
                  <h2 class="section-heading">Our Mission</h2>
                  <p class="section-text">
                    At Claimpoint, our mission is simple: to help individuals recover their misplaced belongings and give honest finders a way to return them.
                    We believe that honesty, trust, and community collaboration can make the world a better place — one lost item at a time.
                  </p>

                  <h2 class="section-heading mt-6">What We Do</h2>
                  <p class="section-text">
                    We provide a platform where people can report lost or found items quickly and easily. Our system helps match found items to lost item reports
                    and connects users to arrange safe, respectful returns.
                  </p>
                </v-col>

                <!-- Right Column -->
                <v-col cols="12" md="6">
                  <h2 class="section-heading">Why It Matters</h2>
                  <p class="section-text">
                    Whether it’s a wallet, a phone, or something deeply personal, we know how valuable your possessions are. That’s why we created a trusted digital
                    space that makes doing the right thing easier and more rewarding.
                  </p>

                  <h2 class="section-heading mt-6">Our Vision</h2>
                  <p class="section-text">
                    Our vision is a world where lost belongings find their way back to their owners, fostering a more honest and caring community. With your help,
                    we are one step closer to making that vision a reality every day.
                  </p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Bottom Illustration -->
        <v-row justify="center" class="mt-10">
          <v-col cols="12" md="6" class="text-center">
            <v-img
              src="https://illustrations.popsy.co/gray/community-reconnect.svg"
              max-height="300"
              contain
              alt="Community Illustration"
            />
          </v-col>
        </v-row>

      </v-container>
    </div>
  </Layout>
</template>

<style scoped>
.about-wrapper {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #FFA726, #FFA726);
  padding-bottom: 40px;
}

.about-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
}

.about-subtitle {
  font-size: 18px;
  color: #555;
  margin-top: 10px;
}

.about-card {
  background-color: #FFE0B2;
  border-radius: 12px;
}

.section-heading {
  font-size: 24px;
  font-weight: 600;
  color: #222;
}

.section-text {
  font-size: 16px;
  color: #444;
  line-height: 1.7;
  margin-top: 10px;
}
</style>
