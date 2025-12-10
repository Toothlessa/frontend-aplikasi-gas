<template>
  <v-container fluid
    :class="theme.global.current.value.dark ? 'pa-4 dashboard-container-dark' : 'pa-4 dashboard-container-light'">
    <v-toolbar flat color="transparent" class="mt-n2 mb-4">
      <v-toolbar-title
        :class="theme.global.current.value.dark ? 'text-h5 font-weight-bold text-white' : 'text-h5 font-weight-bold text-grey-darken-4'">Dashboard
        Overview</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(list, index) in lists" :key="index">

        <!-- LOADING -->
        <template v-if="loading">
          <v-card class="rounded-xl pa-4">
            <v-skeleton-loader type="heading, text" />
          </v-card>
        </template>

        <!-- NORMAL CARD -->
        <template v-else>
          <v-card
            :class="theme.global.current.value.dark ? 'dashboard-metric-card-dark rounded-xl' : 'dashboard-metric-card rounded-xl'">
            <v-card-text class="d-flex align-center justify-space-between">
              <div>
                <div
                  :class="theme.global.current.value.dark ? 'text-subtitle-1 text-teal' : 'text-subtitle-1 text-grey-darken-1'">
                  {{ list.title }}</div>
                <div
                  :class="theme.global.current.value.dark ? 'text-h4 font-weight-bold text-teal mt-1' : 'text-h4 font-weight-bold text-teal-darken-1 mt-1'">
                  {{ list.count }}
                </div>
              </div>
              <v-icon :color="theme.global.current.value.dark ? 'teal' : 'teal-lighten-1'" size="48">
                {{ list.icon }}
              </v-icon>
            </v-card-text>
          </v-card>
        </template>

      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="8">
        <v-card class="dashboard-card rounded-xl pa-4">
          <template v-if="loading">
            <v-skeleton-loader type="heading, text" />
          </template>
          <template v-else>
            <SalesData />
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="dashboard-card rounded-xl pa-4 transparent-dashboard-card">
          <template v-if="loading">
            <v-skeleton-loader type="heading, text" />
          </template>
          <template v-else>
            <TopBuyer />
          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" sm="7">
        <v-card class="dashboard-card rounded-xl pa-4">
          <template v-if="loading">
            <v-skeleton-loader type="heading, text" />
          </template>
          <template v-else>
            <TableOutstandingTrx />
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" sm="5">
        <v-card class="dashboard-card rounded-xl pa-4">
          <template v-if="loading">
            <v-skeleton-loader type="heading, text" />
          </template>
          <template v-else>
            <TableDebt />
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import SalesData from "@/components/chart/SalesData.vue";
import TableDebt from "@/components/chart/TableDebt.vue";
import TableOutstandingTrx from "@/components/chart/TableOutstandingTrx.vue";
import TopBuyer from "@/components/chart/TopBuyer.vue";
import { useStock } from '@/composables/useStock';
import { useGlobal } from '@/composables/useGlobal';
import { useDashboard } from '@/composables/useDashboard';
import { useTheme } from 'vuetify/lib/framework.mjs';

onMounted(async () => {
  await loadDisplayStock();  // 1️⃣ Ambil data dulu
  fetchDataDisplayStock();         // 2️⃣ Baru isi UI
});

const theme = useTheme();

// const {
//   theme,
// } = useGlobal();

const {
  loading,
  loadDisplayStock,
} = useStock();

const {
  lists,
  fetchDataDisplayStock,
} = useDashboard();

</script>

<style scoped>
.dashboard-container-light {
  background-color: #f0f2f5;
  min-height: 100vh;
}

.dashboard-container-dark {
  background-color: #282828;
  min-height: 100vh;
}

.dashboard-metric-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dashboard-metric-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.dashboard-metric-card-dark {
  background-color: #1a1a1a;
  border: 1px solid #424242;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dashboard-metric-card-dark:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.dashboard-card {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.text-grey-darken-4 {
  color: #424242 !important;
}

.text-teal-darken-1 {
  color: #00897B !important;
}

.text-grey-darken-1 {
  color: #757575 !important;
}

.text-teal-lighten-1 {
  color: #26A69A !important;
}

.text-white {
  color: #ffffff !important;
}

.text-grey-lighten-1 {
  color: #bdbdbd !important;
}

.transparent-dashboard-card {
  background-color: rgba(255, 255, 255, 0.8) !important;
  /* White with 80% opacity */
}
</style>
