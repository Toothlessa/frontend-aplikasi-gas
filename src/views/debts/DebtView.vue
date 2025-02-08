<template>
    <Debt />
</template>
  
  <script>
  import { defineComponent } from 'vue';
  
  // Components
import Debt from '@/components/debts/Debt.vue';
  
  export default defineComponent({
    name: 'DebtView',
  
    components: {
      Debt,
    },
  });
  </script>