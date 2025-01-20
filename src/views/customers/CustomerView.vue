<template>
    <Customer />
</template>
  
  <script>
  import { defineComponent } from 'vue';
  
  // Components
  import Customer from '@/components/customers/Customer.vue';
  
  export default defineComponent({
    name: 'CustomerView',
  
    components: {
        Customer,
    },
  });
  </script>