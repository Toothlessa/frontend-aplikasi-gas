<template>
    <User />
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  // Components
import User from '@/components/users/CurrentUser.vue';
  
  export default defineComponent({
    name: 'UserView',
  
    components: {
      User,
    },
  });
  </script>