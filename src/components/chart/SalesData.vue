<template>
  <div>
    <v-toolbar color="transparent" density="compact" class="px-0">
      <v-toolbar-title :class="isDark ? 'text-teal-accent-3 text-h6 font-weight-bold' : 'text-teal text-h6 font-weight-bold'">
        <v-icon start size="22" :color="isDark ? 'teal-accent-3' : 'teal'">mdi-chart-line</v-icon>
        Gas Sales Data
      </v-toolbar-title>
    </v-toolbar>

    <v-divider class="my-2" :style="isDark ? 'border-color: rgba(255,255,255,0.08);' : ''" />

    <div class="chart-wrapper mt-3">
      <Line
        :data="data"
        :options="chartOptions"
        :css-classes="cssClasses"
        :styles="styles"
        :plugins="plugins"
      />
    </div>

    <!-- Snackbars -->
    <SnackbarError :messages="validationErrorMessages" v-model="validationShowError" :timeout="2000" />
   <!-- <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" :timeout="2000" />-->
  </div>
</template>

<script setup lang="ts">
/* -----------------------------------------------------*
  * IMPORT CHART.JS & VUE-CHARTJS                          *
  * ---------------------------------------------------- */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

  /* -----------------------------------------------------*
  * IMPORT LOGIC                                         *
  * ---------------------------------------------------- */
import { computed, onMounted, watch } from "vue";
import { useTransaction } from "@/composables/useTransaction";
import { useLineChart } from "@/composables/chart/useLineChart";
import { useGlobal } from "@/composables/useGlobal";
import { useTheme } from "vuetify/lib/framework.mjs";
import { 
        SnackbarError, 
        //SnackbarSuccess 
      } from "@/components/globalComponent";

  /* -----------------------------------------------------*
  * COMPOSABLE                                           *
  * ---------------------------------------------------- */
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const {
  //validation helpers
  validationErrorMessages,
  validationShowError,
  validationError,
} = useGlobal();

const {
  //hasSaved,

  last30DaysTransaction, 
  fetchLast30DaysSale 
} = useTransaction();

const {
  data,
  cssClasses,
  styles,
  plugins,
} = useLineChart();

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: isDark.value ? '#cbd5e1' : '#334155',
        font: {
          family: 'inherit',
          weight: 500,
        },
      },
    },
    tooltip: {
      backgroundColor: isDark.value ? '#2a2a32' : '#ffffff',
      titleColor: isDark.value ? '#ffffff' : '#0f172a',
      bodyColor: isDark.value ? '#cbd5e1' : '#334155',
      borderColor: isDark.value ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
      borderWidth: 1,
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        color: isDark.value ? '#94a3b8' : '#64748b',
      },
    },
    y: {
      grid: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        color: isDark.value ? '#94a3b8' : '#64748b',
      },
    },
  },
}));

  /* -----------------------------------------------------*
   * ON MOUNTED                                           *
   * ---------------------------------------------------- */
onMounted(() => {
  onFetchLast30DaysSale();
});

  /* -----------------------------------------------------*
   * WATCHERS                                             *
   * ---------------------------------------------------- */
const updateChartData = (val: typeof last30DaysTransaction.value) => {
  if (!Array.isArray(val) || val.length === 0) {
    data.value = { labels: [], datasets: [] };
    return;
  }

  const labels = val.map((d) => d.day);
  const totals = val.map((d) => Number(d.total));
  const monthLabel = val[0]?.month || "Sales";

  data.value = {
    labels,
    datasets: [
      {
        label: monthLabel,
        backgroundColor: isDark.value ? "rgba(46, 191, 175, 0.2)" : "#2EBFAF",
        borderColor: "#2EBFAF",
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#2EBFAF",
        pointBorderColor: isDark.value ? "#1e1e24" : "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        data: totals,
      },
    ],
  };
};

watch(
  [last30DaysTransaction, isDark],
  () => {
    updateChartData(last30DaysTransaction.value);
  },
  { immediate: true }
);

  /* -----------------------------------------------------*
   * FUNCTIONS                                            *
   * ---------------------------------------------------- */
   const onFetchLast30DaysSale = async () => {
    try {
      fetchLast30DaysSale();
    } catch (e) {
      validationError(e);
    }
   };

</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 250px;
  width: 100%;
}
</style>
