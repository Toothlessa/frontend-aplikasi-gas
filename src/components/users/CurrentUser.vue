<template>
  <div :class="isDark ? 'user-page-dark' : 'user-page-light'">
    <v-container fluid class="pa-4">
      <v-card
        class="user-profile-card rounded-xl elevation-8 mx-auto"
        :class="isDark ? 'user-profile-card-dark' : 'user-profile-card-light'"
        max-width="450"
      >
        <v-toolbar class="user-profile-toolbar" :class="isDark ? 'toolbar-dark' : 'toolbar-light'" flat>
          <v-btn
            icon="mdi-account-circle"
            color="white"
          >
          </v-btn>
          <v-toolbar-title
            class="text-white"
          >
            User Profile
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="isEditing = !isEditing"
          >
            <v-fade-transition leave-absolute>
              <v-icon class="text-white" v-if="isEditing">mdi-close-outline</v-icon>
              <v-icon class="text-white" v-else>mdi-pencil-outline</v-icon>
            </v-fade-transition>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-6">
          <div class="text-subtitle-1 mb-2 field-label" :class="isDark ? 'field-label-dark' : 'field-label-light'">Username</div>
          <v-text-field
            v-model="userData.username"
            variant="outlined"
            :disabled="!isEditing"
            color="blue"
            class="mb-4"
          >
          </v-text-field>
          <div class="text-subtitle-1 mb-2 field-label" :class="isDark ? 'field-label-dark' : 'field-label-light'">Email</div>
          <v-text-field
            v-model="userData.email"
            variant="outlined"
            :disabled="!isEditing"
            color="blue"
            class="mb-4"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn
            label="Save"
            color="blue-darken-1"
            variant="elevated"
            :disabled="!isEditing"
            :loading="loadingButtonUpdate"
            @click.prevent="onUpdate()"
            class="text-white"
          >
            <v-icon start>mdi-content-save</v-icon>
            Save
          </v-btn>
        </v-card-actions>
        <v-snackbar
          v-model="hasSaved"
          location="top right"
          attach
          color="success"
        >
          Your profile has been updated
        </v-snackbar>
      </v-card>
    </v-container>

    <!-- Error & Success Snackbars -->
    <SnackbarError :messages="validationErrorMessages" v-model="validationShowError" :timeout="2000" />
    <SnackbarSuccess v-model="hasSaved" message="Action completed successfully!" :timeout="2000" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { useUser } from '@/composables/useUser';
import { useGlobal } from '@/composables/useGlobal';
import { SnackbarError, SnackbarSuccess } from '@/components/globalComponent';

const{
  validationError,
  validationShowError,
  validationErrorMessages
} = useGlobal();

const {
  // State
  hasSaved,
  loadingButtonUpdate,
  isEditing,
  userData,

  // Computed
  user,

  // Actions
  loadUser,
  updateUser,
} = useUser();

  /* -----------------------------------------------------*
   * THEME                                                *
   * ---------------------------------------------------- */
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

onMounted(() => {
  onLoadUser();
});

  const onLoadUser = async () => {
    try {
      await loadUser();

      userData.username = user.value?.username;
      userData.email = user.value?.email;
    } catch (e) {
      validationError(e);
    }
  };

  const onUpdate = async () => {
    try {
      await updateUser();
      isEditing.value = false;
    } catch (e) {
      validationError(e);
    }
  };
</script>

<style scoped>
.user-page-light {
  background-color: #f8fafc;
  min-height: 100vh;
}

.user-page-dark {
  background-color: #121214;
  min-height: 100vh;
}

/* Card */
.user-profile-card-light {
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2) ;
  background-color: #ffffff ;
  border: 1px solid #e2e8f0 ;
}

.user-profile-card-dark {
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5) ;
  background-color: #1e1e24 ;
  border: 1px solid rgba(255, 255, 255, 0.08) ;
}

/* Toolbar */
.toolbar-light {
  background: linear-gradient(to right, #2196F3, #64B5F6);
  color: white;
  border-radius: 16px 16px 0 0;
}

.toolbar-dark {
  background: linear-gradient(to right, #0D47A1, #1976D2);
  color: white;
  border-radius: 16px 16px 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Labels */
.field-label-light {
  color: #64748b ;
}

.field-label-dark {
  color: #94a3b8 ;
}

/* Text field outline */
.user-profile-card-light :deep(.v-field__outline) {
  color: #90CAF9 ;
}

.user-profile-card-dark :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.18) ;
}

.user-profile-card-dark :deep(.v-field--focused .v-field__outline) {
  color: #2196F3 ;
}

.user-profile-card-dark :deep(.v-field__input) {
  color: #ffffff ;
}

.user-profile-card-dark :deep(.v-label) {
  color: #94a3b8 ;
}

.user-profile-card-dark :deep(.v-field--disabled) {
  opacity: 0.6;
}

.v-text-field :deep(.v-input__control) {
  border-radius: 8px;
}

.v-btn.text-white {
  color: white ;
}
</style>