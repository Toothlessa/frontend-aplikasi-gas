<template>
  <div>
    <v-toolbar color="transparent" density="compact" class="px-0">
      <v-toolbar-title :class="isDark ? 'text-deep-orange-accent-2 text-h6 font-weight-bold' : 'text-deep-orange-darken-1 text-h6 font-weight-bold'">
        <v-icon start size="22" :color="isDark ? 'deep-orange-accent-2' : 'deep-orange-darken-1'">mdi-chart-pie</v-icon>
        Top 10 Customers
      </v-toolbar-title>
    </v-toolbar>

    <v-divider class="my-2" :style="isDark ? 'border-color: rgba(255,255,255,0.08);' : ''" />

    <div class="chart-container">
      <PolarArea :data="data" :options="polarOptions" />
    </div>

    <!-- Snackbars -->
    <SnackbarError :messages="validationErrorMessages" v-model="validationShowError" :timeout="2000" />
    <!-- <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" :timeout="2000" /> -->

  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "vue-chartjs";
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);
import { onMounted, computed } from "vue";
import { useCustomer } from "@/composables/useCustomer";
import { usePolarChart } from "@/composables/chart/usePolarChart";
import { useGlobal } from "@/composables/useGlobal";
import { useTheme } from "vuetify/lib/framework.mjs";
import { 
         SnackbarError, 
        //SnackbarSuccess 
        } from "@/components/globalComponent";

 /* ------------------------------------------------------*
   * COMPOSABLES                                            *
   * ---------------------------------------------------- */
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const { validationError, 
        validationErrorMessages, 
        validationShowError 
      } = useGlobal();
const { //hasSaved, 
        labels, 
        totals, 
        loadTopCustomerTransaction 
      } = useCustomer();
const { createPolarChartData } = usePolarChart();

 /* ------------------------------------------------------*
   * LIFECYCLE                                            *
   * ---------------------------------------------------- */
onMounted(() => {
  onloadTopCustomerTransaction();
});

 /* ------------------------------------------------------*
   * FUNCTIONS                                            *
   * ---------------------------------------------------- */
const polarOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: isDark.value ? '#cbd5e1' : '#334155',
        boxWidth: 12,
        padding: 10,
        font: {
          family: 'inherit',
          size: 11,
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
    r: {
      grid: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      },
      angleLines: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      },
      ticks: {
        color: isDark.value ? '#94a3b8' : '#64748b',
        backdropColor: 'transparent',
      },
    },
  },
}));

const data = computed(() => {
  const chartData = createPolarChartData(labels.value, totals.value);
  if (chartData.datasets && chartData.datasets[0]) {
    chartData.datasets[0].backgroundColor = isDark.value ? "rgba(46, 191, 175, 0.25)" : "rgba(46, 191, 175, 0.2)";
    chartData.datasets[0].borderColor = "#2EBFAF";
    chartData.datasets[0].borderWidth = 2;
  }
  return chartData;
});

const onloadTopCustomerTransaction = async () => {
  try{
    await loadTopCustomerTransaction();
  }catch(e){
    validationError(e);
  }
};

</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 250px;
  margin: 0 auto;
  padding: 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

:deep(canvas) {
  max-width: 100% !important;
  max-height: 250px !important;
}
</style>
