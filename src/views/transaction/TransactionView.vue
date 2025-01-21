<template>
    <Transacation />
</template>
  
  <script>
  import { defineComponent } from 'vue';
  
  // Components
  import Transacation from '@/components/transactions/Transaction.vue';
  
  export default defineComponent({
    name: 'TransacationView',
  
    components: {
      Transacation,
    },
  });
  </script>