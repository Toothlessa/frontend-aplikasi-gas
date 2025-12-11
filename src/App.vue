<template>
  <v-app>
    <TheNavigation v-if="!$route.meta.hideTheNavigation" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import TheNavigation from '@/components/sidebar/TheNavigation.vue';
import { AUTO_LOGIN_ACTION } from './store/storeconstant';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { RootState } from './store/types';

export default defineComponent({
  name: 'App',

  components: {
    TheNavigation,
  },

  setup() {
    const store = useStore<RootState>();
    const router = useRouter();

    const autoLogout = store.state.auth.autoLogout;

    watch(
      () => store.state.auth.autoLogout,
      (newValue, oldValue) => {
        if (newValue && newValue !== oldValue) {
          router.replace('/login');
        }
      }
    );

    // auto login
    store.dispatch(`auth/${AUTO_LOGIN_ACTION}`);

    return {
      autoLogout,
    };
  },
});
</script>
