<template>
    <MasterItem />
</template>
  
  <script>
  import { defineComponent } from 'vue';
  
  // Components
  import MasterItem from '@/components/masteritem/MasterItem.vue';
  
  export default defineComponent({
    name: 'MasterItemView',
  
    components: {
      MasterItem,
    },
  });
  </script>