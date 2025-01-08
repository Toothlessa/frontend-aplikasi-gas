<template>
  <v-app>
      <TheNavigation v-if="!$route.meta.hideTheNavigation" />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import TheNavigation from '@/components/sidebar/TheNavigation.vue';
import { AUTO_LOGIN_ACTION } from './store/storeconstant';

export default {
  name: 'App',
  components: {
    TheNavigation,
  },
  created() {
    this.$store.dispatch(`auth/${AUTO_LOGIN_ACTION}`);
  },
}
</script>
