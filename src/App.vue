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
import { mapState } from 'vuex';

export default {
  name: 'App',
  computed: {
        ...mapState({
            autoLogout: (state) => state.auth.autoLogout,
        }),
    },

    watch: {
        autoLogout(curValue, oldValue) {
            if (curValue && curValue != oldValue) {
                this.$router.replace('/login');
            }
        },
    },

  components: {
    TheNavigation,
  },

  created() {
    this.$store.dispatch(`auth/${AUTO_LOGIN_ACTION}`);
  },
}
</script>
