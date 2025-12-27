<template>
  <nav>
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
      :location="drawerLocation"
      :class="theme.global.current.value.dark ? 'modern-drawer-dark' : 'modern-drawer'"
      :style="{ borderRadius: '24px', margin: '12px' }"
    >
      <!-- Profile Section -->
      <v-list-item
        nav
        lines="two"
        class="user-profile-section"
        prepend-icon="mdi-account-circle"
        :title="userData.username"
        :subtitle="userData.email"
        @click="rail = false"
      />

      <v-divider class="my-3" />

      <!-- Navigation List -->
      <v-list dense nav class="mt-2">
        <v-list-item
          prepend-icon="mdi-view-dashboard-outline"
          title="Dashboard"
          to="/"
          class="nav-item"
          rounded="xl"
        />
        <v-list-item
          prepend-icon="mdi-file-document-outline"
          title="Transaction"
          to="/transaction"
          class="nav-item"
          rounded="xl"
        />

        <!-- Master Group -->
        <v-list-group value="Master" class="nav-group">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Master"
              prepend-icon="mdi-database-outline"
              class="nav-item"
              rounded="xl"
            />
          </template>

          <v-list-item
            v-for="([icon, title, to], i) in masterPageChild"
            :key="i"
            :prepend-icon="icon"
            :title="title"
            :to="to"
            class="nav-subitem"
            rounded="xl"
          />
        </v-list-group>

        <!-- Other Items -->
        <v-list-item
          v-for="(item, i) in pages"
          :key="i"
          :to="item.to"
          class="nav-item"
          rounded="xl"
          
        >
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Theme Toggle -->
      <v-list-item class="px-4">
        <v-switch
          v-model="isDarkTheme"
          hide-details
          inset
          :label="`Dark Theme: ${isDarkTheme ? 'On' : 'Off'}`"
          color="primary"
        ></v-switch>
      </v-list-item>

      <!-- Logout -->
      <template #append>
        <v-divider class="mx-4 my-2" />
        <v-list-item
          prepend-icon="mdi-logout-variant"
          title="Logout"
          class="nav-item logout-item"
          rounded="xl"
          @click="DialogLogout = true"
        />
      </template>
    </v-navigation-drawer>

    <v-app-bar
      app
      flat
      floating
      :class="theme.global.current.value.dark ? 'app-bar-modern-dark' : 'app-bar-modern'"
      :style="appBarStyles"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-btn icon @click="toggleDrawerLocation" class="mr-2">
        <v-icon>mdi-swap-horizontal</v-icon>
      </v-btn>

      <v-toolbar-title class="font-weight-bold text-h6">Dashboard</v-toolbar-title>

      <v-spacer />

      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        rounded="xl"
        :class="theme.global.current.value.dark ? 'search-field-appbar-dark' : 'search-field-appbar'"
      />

      <v-btn icon class="mx-1">
        <v-badge content="3" color="red-accent-2">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <v-btn icon class="mx-1">
        <v-badge content="5" color="blue-accent-2">
          <v-icon>mdi-email-outline</v-icon>
        </v-badge>
      </v-btn>

      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-btn icon v-bind="props" class="mx-1">
            <v-avatar color="grey-lighten-3" size="40">
              <v-icon size="30" color="grey-darken-2">mdi-account-circle-outline</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list elevation="5" rounded="xl">
          <v-list-item title="Profile" prepend-icon="mdi-account-outline" />
          <v-list-item title="Settings" prepend-icon="mdi-cog-outline" />
          <v-divider />
          <v-list-item title="Logout" prepend-icon="mdi-logout-variant" @click="DialogLogout = true" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-dialog v-model="DialogLogout" max-width="450px" persistent transition="dialog-top-transition">
      <v-card class="rounded-xl elevation-12">
        <v-card-title class="bg-red-darken-2 text-white text-h6 font-weight-bold justify-center py-4">
          <v-icon size="32" start class="mr-2">mdi-logout</v-icon>
          Confirm Logout
        </v-card-title>

        <v-card-text class="text-body-1 text-medium-emphasis text-center pt-6 px-6">
          Are you sure you want to log out of your account?
        </v-card-text>

        <v-card-actions class="justify-end px-6 pb-4">
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            @click="DialogLogout = false"
            class="rounded-pill"
          >
            <v-icon start>mdi-cancel</v-icon>
            Cancel
          </v-btn>

          <v-btn
            variant="elevated"
            color="red-darken-2"
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
import { onMounted, watch } from 'vue';
import { useUser } from '@/composables/useUser';
import { useNavigation } from '@/composables/useNavigation';
import router from '@/router';

  /*================================================================*
  * COMPOSABLES                                                     *
  * ================================================================*/
const {
  userData,
  userLoad,
} = useUser();

const {
  DialogLogout,
    
  theme,
  isDarkTheme,
  
  pages,
  masterPageChild,
  
  search,
  drawer,
  rail,
  drawerLocation,

  appBarStyles,

  toggleDrawerLocation,
  logout,
} = useNavigation();

  /*================================================================*
  * LIFECYCLE & HOOKS                                               *
  * ================================================================*/
onMounted(() => {
  userLoad();
});

  /*================================================================*
  * METHODS                                                         *
  * ================================================================*/
  const onLogout = async() => {
    try {
      await logout();
      router.push(`/login`)
    }catch(error){
      console.error('Logout faiiled', error);
    }
  }


// Watch for theme changes and persist
watch(isDarkTheme, (newVal) => {
  theme.global.name.value = newVal ? 'dark' : 'light';
  localStorage.setItem('theme', newVal ? 'dark' : 'light');
});

</script>

<style scoped>
.modern-drawer {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.modern-drawer-dark {
  background-color: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  color: #eee;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.user-profile-section {
  padding: 20px 16px;
  transition: background-color 0.3s ease;
}

.user-profile-section:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.modern-drawer-dark .user-profile-section:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-item {
  margin: 6px 12px;
  color: #555;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.modern-drawer-dark .nav-item {
  color: #bbb;
}

.nav-item:hover {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2E7D32;
}

.modern-drawer-dark .nav-item:hover {
  background-color: rgba(76, 175, 80, 0.2);
  color: #66BB6A;
}

.modern-drawer:not(.v-navigation-drawer--is-rail) .nav-item.v-list-item--active {
  background-color: #4CAF50 !important;
  color: white !important;
  font-weight: 700;
}

.modern-drawer-dark:not(.v-navigation-drawer--is-rail) .nav-item.v-list-item--active {
  background-color: #4CAF50 !important;
  color: white !important;
}

.nav-subitem {
  padding-left: 56px !important;
  font-size: 0.875rem;
  color: #777;
  transition: color 0.2s ease;
}

.modern-drawer-dark .nav-subitem {
  color: #999;
}

.nav-subitem:hover {
  color: #2E7D32;
}

.modern-drawer-dark .nav-subitem:hover {
  color: #66BB6A;
}

.modern-drawer:not(.v-navigation-drawer--is-rail) .nav-subitem.v-list-item--active {
  color: #4CAF50 !important;
  font-weight: 600;
}

.modern-drawer-dark:not(.v-navigation-drawer--is-rail) .nav-subitem.v-list-item--active {
  color: #4CAF50 !important;
}

.logout-item {
  color: #C62828 !important;
}

.logout-item:hover {
  background-color: rgba(198, 40, 40, 0.1) !important;
  color: #B71C1C !important;
}

.app-bar-modern {
  background-color: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  width: auto;
  left: 16px;
  right: 16px;
}

.app-bar-modern-dark {
  background-color: rgba(30, 30, 30, 0.85) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
  width: auto;
  left: 16px;
  right: 16px;
}

.search-field-appbar {
  background-color: rgba(238, 238, 238, 0.8);
  transition: background-color 0.3s ease;
}

.search-field-appbar:focus-within {
  background-color: white;
}

.search-field-appbar-dark {
  background-color: rgba(60, 60, 60, 0.8);
  transition: background-color 0.3s ease;
}

.search-field-appbar-dark:focus-within {
  background-color: #424242;
}

.search-field-appbar .v-field__input,
.search-field-appbar .v-label {
  color: #424242;
}

.search-field-appbar-dark .v-field__input,
.search-field-appbar-dark .v-label {
  color: #eee;
}

.search-field-appbar .v-icon {
  color: #757575;
}

.search-field-appbar-dark .v-icon {
  color: #bbb;
}
</style>