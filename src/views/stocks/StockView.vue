<template>
    <Stock />
</template>
  
  <script>
  import { defineComponent } from 'vue';
  
  // Components
  import Stock from '@/components/stocks/Stock.vue';
  
  export default defineComponent({
    name: 'StockView',
  
    components: {
      Stock,
    },
  });
  </script>