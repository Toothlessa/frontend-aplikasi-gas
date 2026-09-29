<template>
  <v-container fluid
    :class="isDark ? 'pa-4 dashboard-container-dark' : 'pa-4 dashboard-container-light'">
    <v-toolbar flat color="transparent" class="mt-n2 mb-4">
      <v-toolbar-title
        :class="isDark ? 'text-h5 font-weight-bold text-white' : 'text-h5 font-weight-bold text-grey-darken-4'">
        Dashboard Overview
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(list, index) in lists" :key="index">

        <!-- LOADING -->
        <template v-if="loading">
          <v-card class="rounded-xl pa-4" :class="isDark ? 'dashboard-metric-card-dark' : 'dashboard-metric-card'">
            <v-skeleton-loader type="heading, text" />
          </v-card>
        </template>

        <!-- NORMAL CARD -->
        <template v-else>
          <v-card
            :class="isDark ? 'dashboard-metric-card-dark rounded-xl' : 'dashboard-metric-card rounded-xl'">
            <v-card-text class="d-flex align-center justify-space-between pa-5">
              <div>
                <div
                  :class="isDark ? 'text-subtitle-2 text-grey-lighten-1 font-weight-medium' : 'text-subtitle-2 text-grey-darken-1 font-weight-medium'">
                  {{ list.title }}
                </div>
                <div
                  :class="isDark ? 'text-h4 font-weight-bold text-teal-accent-3 mt-2' : 'text-h4 font-weight-bold text-teal-darken-1 mt-2'">
                  {{ list.count }}
                </div>
              </div>
              <div :class="isDark ? 'icon-badge-dark' : 'icon-badge-light'">
                <v-icon :color="isDark ? 'teal-accent-3' : 'teal-darken-1'" size="32">
                  {{ list.icon }}
                </v-icon>
              </div>
            </v-card-text>
          </v-card>
        </template>

      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="8">
        <v-card :class="isDark ? 'dashboard-card-dark rounded-xl pa-4' : 'dashboard-card rounded-xl pa-4'">
          <template v-if="loading">
            <v-skeleton-loader type="heading, text" />
          </template>
          <template v-else>
            <SalesData />
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card :class="isDark ? 'dashboard-card-dark rounded-xl pa-4' : 'dashboard-card rounded-xl pa-4'">
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
        <v-card :class="isDark ? 'dashboard-card-dark rounded-xl pa-4' : 'dashboard-card rounded-xl pa-4'">
          <template v-if="loading">
            <v-skeleton-loader type="heading, text" />
          </template>
          <template v-else>
            <TableOutstandingTrx />
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" sm="5">
        <v-card :class="isDark ? 'dashboard-card-dark rounded-xl pa-4' : 'dashboard-card rounded-xl pa-4'">
          <template v-if="loading">
            <v-skeleton-loader type="heading, text" />
          </template>
          <template v-else>
            <TableDebt />
          </template>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error & Success Snackbars -->
    <SnackbarError :messages="validationErrorMessages" v-model="validationShowError" :timeout="2000" />
    <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" :timeout="2000" />

  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import SalesData from "@/components/chart/SalesData.vue";
import TableDebt from "@/components/chart/TableDebt.vue";
import TableOutstandingTrx from "@/components/chart/TableOutstandingTrx.vue";
import TopBuyer from "@/components/chart/TopBuyer.vue";
import { useStock } from '@/composables/useStock';
import { useDashboard } from '@/composables/useDashboard';
import { useTheme } from 'vuetify/lib/framework.mjs';
import { useGlobal } from '@/composables/useGlobal';
import { SnackbarError, SnackbarSuccess } from '@/components/globalComponent';

  /* -------------------------------------------------------*
   * 📌 COMPOSABLES                                         *
   * -------------------------------------------------------*/
  const { 
    validationError,
    validationShowError,
    validationErrorMessages,
  } = useGlobal();

  const {
    loading,
    hasSaved,

    loadDisplayStock,
  } = useStock();

  const {
    lists,
  } = useDashboard();

  const{
      stockDisplay,
    } = useStock();

  /* ------------------------------------------------------*
   * 📌 HOOKS                                               *
   * -------------------------------------------------------*/
onMounted(async () => {
  await onLoadDisplayStock();
  await fetchDataDisplayStock();
});

  /* -------------------------------------------------------*
   * 📌 CONSTANTS                                          *
   * -------------------------------------------------------*/
  const theme = useTheme();
  const isDark = computed(() => theme.global.current.value.dark);

  /* -------------------------------------------------------*
   * 📌 LOCAL FUNCTIONS                                     *
   * -------------------------------------------------------*/
  const onLoadDisplayStock = async () => {
    try {
      await loadDisplayStock();
    } catch (e) {
      validationError(e);
    }
  };

  const fetchDataDisplayStock = async () => {
    lists.value[0].count = stockDisplay.value?.running_stock ?? 0;
    lists.value[1].count = stockDisplay.value?.yesterday_stock ?? 0;
    lists.value[2].count = stockDisplay.value?.empty_gas ?? 0;
    lists.value[3].count = stockDisplay.value?.gas_owned ?? 0;
  };

</script>

<style scoped>
.dashboard-container-light {
  background-color: #f8fafc;
  min-height: 100vh;
}

.dashboard-container-dark {
  background-color: #121214;
  min-height: 100vh;
}

/* Metric Cards */
.dashboard-metric-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dashboard-metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.dashboard-metric-card-dark {
  background-color: #1e1e24;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dashboard-metric-card-dark:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  border-color: rgba(46, 191, 175, 0.3);
}

/* Icon Badges */
.icon-badge-light {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background-color: #e6fffa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-badge-dark {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background-color: rgba(46, 191, 175, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main Dashboard Cards */
.dashboard-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.25s ease;
}

.dashboard-card-dark {
  background-color: #1e1e24;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: box-shadow 0.25s ease;
}
</style>
