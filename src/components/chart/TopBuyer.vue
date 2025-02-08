<template>
  <!-- <v-card variant="tonal"> -->
   <v-toolbar flat color="rgba(0,0,0,0)" class="mt-n5">
    <v-toolbar-title class="text-center text-teal text-lg-h5 font-weight-bold">Top 7 Customer</v-toolbar-title>
  </v-toolbar>
  <v-card height="" flat color="transparent" class="mt-n5">
  <PolarArea 
    :data="data" 
    :options="options"
    :width="width"
    height="300px"
    :css-classes="cssClasses"
    :styles="styles"
    :plugins="plugins"
  />
</v-card>
<!-- </v-card> -->
</template>

<script>
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { PolarArea } from 'vue-chartjs'
import * as chartConfig from '../../chart/PolarChart.js'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

export default {
  name: 'App',
  components: {
    PolarArea
  },
  props: {
      width: {
        type: Number,
        default: 400,
      },
      height: {
        type: Number,
        default: 100,
      },
      cssClasses: {
        default: "",
        type: String,
      },
      styles: {
        type: Object,
        default: () => {},
      },
      plugins: {
        type: Array,
        default: () => {},
      },
    },
  data() {
    return chartConfig
  }
}
</script>
