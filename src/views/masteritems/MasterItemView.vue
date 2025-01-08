<template>
    <MasterItem />
</template>
  
  <script>
  import { defineComponent } from 'vue';
  
  // Components
  import MasterItem from '@/components/masteritems/MasterItem.vue';
  
  export default defineComponent({
    name: 'LoginView',
  
    components: {
      MasterItem,
    },
  });
  </script>