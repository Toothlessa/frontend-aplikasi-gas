<template>
  <v-toolbar color="transparent" class="mt-n5" rounded-t-xl>
    <v-toolbar-title class="text-teal text-lg-h5 font-weight-bold">Gas Sales data</v-toolbar-title>
  </v-toolbar>
  <v-divider></v-divider>
  <v-card rounded="xl" elevation="4" class="mt-n5">
    <Line 
      :data="data" 
      width="100px"
      height="200px"
      :css-classes="cssClasses"
      :styles="styles"
      :plugins="plugins"
      :options="options" 
      />
    </v-card>
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import * as chartConfig from '../../chart/LineChart.ts'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'App',
  width: {
        type: Number,
        default: 100,
      },
      height: {
        type: Number,
        default: 50,
      },
      cssClasses: {
        default: "",
        type: String,
      },
      styles: {
        type: Object,
        // default: () => {},
      },
      plugins: {
        type: Array,
        // default: () => {},
      },
  components: {
    Line
  },
  data() {
    return chartConfig
  }
}
</script>
