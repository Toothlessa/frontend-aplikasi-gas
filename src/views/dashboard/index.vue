<template>
  <v-container fluid :class="theme.global.current.value.dark ? 'pa-4 dashboard-container-dark' : 'pa-4 dashboard-container-light'">
    <v-toolbar flat color="transparent" class="mt-n2 mb-4">
      <v-toolbar-title :class="theme.global.current.value.dark ? 'text-h5 font-weight-bold text-white' : 'text-h5 font-weight-bold text-grey-darken-4'">Dashboard Overview</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(list, index) in lists" :key="index">
        <v-card :class="theme.global.current.value.dark ? 'dashboard-metric-card-dark rounded-xl' : 'dashboard-metric-card rounded-xl'">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div :class="theme.global.current.value.dark ? 'text-subtitle-1 text-teal' : 'text-subtitle-1 text-grey-darken-1'">{{ list.title }}</div>
              <div :class="theme.global.current.value.dark ? 'text-h4 font-weight-bold text-teal mt-1' : 'text-h4 font-weight-bold text-teal-darken-1 mt-1'">{{ list.count }}</div>
            </div>
            <v-icon :color="theme.global.current.value.dark ? 'teal' : 'teal-lighten-1'" size="48">{{ list.icon }}</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="7">
        <v-card class="dashboard-card rounded-xl pa-4">
          <SalesData />
        </v-card>
      </v-col>
      <v-col cols="12" sm="5">
        <v-card class="dashboard-card rounded-xl pa-4 transparent-dashboard-card">
          <TopBuyer />
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" sm="7">
        <v-card class="dashboard-card rounded-xl pa-4">
          <TableOutstandingTrx />
        </v-card>
      </v-col>
      <v-col cols="12" sm="5">
        <v-card class="dashboard-card rounded-xl pa-4">
          <TableDebt />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SalesData from "@/components/chart/SalesData";
import TableDebt from "@/components/chart/TableDebt.vue";
import TableOutstandingTrx from "@/components/chart/TableOutstandingTrx.vue";
import TopBuyer from "@/components/chart/TopBuyer";
import AxiosInstance from "@/services/AxiosInstance";

import { useTheme } from 'vuetify';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';

interface StockDisplay {
  running_stock: string;
  yesterday_stock: string;
  empty_gas: string;
  empty_gas_owned: string;
}

const theme = useTheme();

const lists = ref([
  {
    icon: "mdi-gas-cylinder",
    title: "Running Stock",
    count: '',
  },
  {
    icon: "mdi-calendar-check",
    title: "Yesterday Stock",
    count: '',
  },
  {
    icon: "mdi-gas-station-off",
    title: "Empty Gas",
    count: '',
  },
  {
    icon: "mdi-account-hard-hat",
    title: "Owned Gas",
    count: '',
  },
]);

const getDisplayStock = async () => {
  try {
    const response = await AxiosInstance.get<StockDisplay>('/stockitems/displaystock');

    if (response.status === 200) {
      lists.value[0].count = response.data.running_stock;
      lists.value[1].count = response.data.yesterday_stock;
      lists.value[2].count = response.data.empty_gas;
      lists.value[3].count = response.data.empty_gas_owned;
    }
  } catch (error: any) {
    console.error("Error fetching stock data:", error?.response?.data || error.message);
  }
};


// const getDisplayStock = async () => {
//   try {
//     const response = await AxiosInstance.get<StockDisplay>(`http://127.0.0.1:8000/api/stockitems/displaystock`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
//       },
//     });

//     if (response.status === 200) {
//       lists.value[0].count = response.data.running_stock;
//       lists.value[1].count = response.data.yesterday_stock;
//       lists.value[2].count = response.data.empty_gas;
//       lists.value[3].count = response.data.empty_gas_owned;
//     }
//   } catch (error) {
//     // console.error("Error fetching stock data:", Validations.getErrorMessageFromCode(error.response.data.errors[0]));
//   }
// };

onMounted(() => {
  getDisplayStock();
});
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
  background-color: rgba(255, 255, 255, 0.8) !important; /* White with 80% opacity */
}
</style>
