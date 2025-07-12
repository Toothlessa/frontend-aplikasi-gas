<template>
    <div>
      <v-toolbar color="transparent" class="mt-n5" rounded-t-xl>
        <v-toolbar-title class=" text-deep-orange text-lg-h5 font-weight-bold">Top 5 Buyer</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card rounded="xl" elevation="4" class="mt-n5">
        <PolarArea
          :data="data"
          :options="options"
          :css-classes="cssClasses"
          :styles="styles"
          :plugins="plugins"
        />
      </v-card>
    </div>
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
import * as chartConfig from '../../chart/PolarChart.ts'

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
        // default: () => {},
      },
      plugins: {
        type: Array,
        // default: () => {},
      },
    },
  data() {
    return chartConfig
  }
}
</script>
  
  <style>
  
  </style>
