<template>
  <nav>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      @click="rail = false"
      permanent
      app
      class="custom-drawer"
    >

      <!-- Profile Section -->
       <v-list-item
        nav
        lines="two"
        class="user-info"
        prepend-icon="mdi-face-profile"
        :title="result.username"
        :subtitle="result.email"
        @click="rail = false"
      >


        <template #append>
          <v-btn
            icon
            variant="text"
            color="white"
            @click.stop="rail = !rail"
          >
            <v-icon>{{ rail ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
          </v-btn>
        </template>
      </v-list-item>

      <v-divider class="my-2" />

      <!-- Navigation List -->
      <v-list dense nav class="mt-2">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          to="/"
          class="nav-item"
        />
        <v-list-item
          prepend-icon="mdi-file-document"
          title="Transaction"
          to="/transaction"
          class="nav-item"
        />

        <!-- Master Group -->
        <v-list-group value="Master" class="nav-group">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Master"
              prepend-icon="mdi-folder-cog"
              class="nav-item"
            />
          </template>

          <v-list-item
            v-for="([icon, title, to], i) in masters"
            :key="i"
            :prepend-icon="icon"
            :title="title"
            :to="to"
            class="nav-subitem"
          />
        </v-list-group>

        <!-- Other Items -->
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          class="nav-item"
          @click="actionClickNav(item.action)"
        >
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Logout -->
      <template #append>
        <v-divider class="mx-4 my-2" />
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          class="text-red-lighten-2 font-weight-bold"
          @click.prevent="actionClickNav('logout')"
        />
      </template>
    </v-navigation-drawer>


  <v-app-bar
    app
    color="white"
    class="shadow-sm"
  >
    <!-- Search Field -->
    <v-text-field
      v-model="search"
      variant="solo-filled"
      density="comfortable"
      hide-details
      flat
      rounded
      prepend-inner-icon="mdi-magnify"
      placeholder="Search..."
      class="bg-white rounded-lg"
      style="max-width: 350px;"
    />

    <v-spacer />

    <!-- Icon Buttons -->
    <v-btn icon variant="text" class="mx-1">
      <v-icon color="grey-darken-1">mdi-bell-outline</v-icon>
    </v-btn>

    <v-btn icon variant="text" class="mx-1">
      <v-icon color="grey-darken-1">mdi-email-outline</v-icon>
    </v-btn>

    <v-menu location="bottom end">
      <template #activator="{ props }">
        <v-btn icon v-bind="props" variant="text" class="mx-1">
          <v-avatar color="grey-lighten-3" size="32">
            <v-icon size="24" color="grey-darken-2">mdi-face-profile</v-icon>
          </v-avatar>
        </v-btn>
      </template>

      <v-list elevation="3">
        <v-list-item title="Profile" prepend-icon="mdi-account" />
        <v-list-item title="Settings" prepend-icon="mdi-cog" />
        <v-divider />
        <v-list-item title="Logout" prepend-icon="mdi-logout" @click="dialogLogout = true" />
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-dialog v-model="dialogLogout" max-width="400px" persistent transition="dialog-top-transition">
    <v-card class="rounded-xl elevation-12 pa-4 bg-blue-lighten">
      <!-- Icon + Title -->
      <div class="d-flex align-center justify-center mb-3">
        <v-icon size="28" color="blue-darken-2" class="mr-2">mdi-logout</v-icon>
        <div class="text-h6 font-weight-bold">Logout</div>
      </div>
      <div class="text-body-2 text-medium-emphasis text-center">
        Are you sure you want to logout?
      </div>


      <!-- Actions -->
      <v-card-actions class="mt-6 justify-end">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          @click="dialogLogout = false"
          class="rounded-pill"
        >
          <v-icon start>mdi-close</v-icon>
          Cancel
        </v-btn>

        <v-btn
          variant="elevated"
          color="blue-darken-2"
          class="text-white rounded-pill"
          @click="onLogout"
        >
          <v-icon start>mdi-logout</v-icon>
          Logout
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  </nav>
</template>
  
<script setup lang="ts">
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';

import { GET_USER_TOKEN_GETTER, LOGOUT_ACTION } from '@/store/storeconstant';

// Vuex store and router
const store = useStore();
const router = useRouter();

// UI state
const selectedItem = ref<number>(0);
const drawer = ref<boolean>(true);
const rail = ref<boolean>(true);
const dialogLogout = ref<boolean>(false);

// User info
const result = reactive({
  username: '0',
  email: '0',
});

// Sidebar items
const items = [
  { icon: 'mdi-basket-fill', text: 'Stocks', to: '/stock' },
  { icon: 'mdi-cash', text: 'Debt', to: '/debt' },
  { icon: 'mdi-odnoklassniki', text: 'Users', to: '/users' },
];

const masters = [
  ['mdi-blur-linear', 'Master Item', '/masteritem'],
  ['mdi-face-agent', 'Customers', '/customer'],
  ['mdi-football-helmet', 'Asset', '/asset'],
];

// Get token from store (optional use)
const userToken = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];

// Load user info from localStorage
onMounted(() => {
  const userDataString = localStorage.getItem('userData');
  if (userDataString) {
    try {
      const userData = JSON.parse(userDataString);
      result.username = userData.username;
      result.email = userData.email;
    } catch (error) {
      console.warn('Failed to parse user data:', error);
    }
  }
});

// Actions
function actionClickNav(action: string) {
  if (action === 'logout') {
    dialogLogout.value = true;
  }
}

async function onLogout() {
  try {
    await store.dispatch(`auth/${LOGOUT_ACTION}`);
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
</script>

<style scoped>
.custom-drawer {
  background-color: #ffffff;
  color: #212121;
  border-right: 1px solid #e0e0e0;
}

.user-info {
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 8px;
  padding: 8px;
}

.nav-item {
  border-radius: 10px;
  margin: 4px 8px;
  color: #212121;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: #e3f2fd;
}

.nav-subitem {
  padding-left: 32px;
  font-size: 0.9rem;
  color: #424242;
}

.v-list-item--active {
  background-color: #bbdefb !important;
  font-weight: 600;
  color: #0d47a1 !important;
}

.v-list-group__header .v-list-item-title {
  font-weight: 500;
  color: #0d47a1;
}
</style>