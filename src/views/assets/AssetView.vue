<template>
    <Asset />
</template>
  
  <script>
  import { defineComponent } from 'vue';
  
  // Components
import Asset from '@/components/assets/Asset.vue';
  
  export default defineComponent({
    name: 'AssetView',
  
    components: {
        Asset,
    },
  });
  </script>