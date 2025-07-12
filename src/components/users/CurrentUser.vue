<template>
  <v-container fluid class="pa-4">
    <v-card
      class="user-profile-card rounded-xl elevation-8 mx-auto"
      max-width="450"
    >
      <v-toolbar class="user-profile-toolbar" flat>
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
      <v-alert
        color="red-lighten-4"
        v-model="alert"
        type="error"
        variant="flat"
        closable
        v-if="error"
      >
        {{ error }}
      </v-alert>
      <v-card-text class="pa-6">
        <div class="text-subtitle-1 text-medium-emphasis mb-2">Username</div>
        <v-text-field
          v-model="result.username"
          variant="outlined"
          :disabled="!isEditing"
          color="blue"
          class="mb-4"
        >
        </v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis mb-2">Email</div>
        <v-text-field
          v-model="result.email"
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
          @click="save()"
          @click.prevent="onUpdate()"
          class="text-white"
        >
          <v-icon start>mdi-content-save</v-icon>
          Save
        </v-btn>
      </v-card-actions>
      <v-snackbar
        v-model="hasSaved"
        :timeout="2000"
        location="top center"
        attach
        color="success"
      >
        Your profile has been updated
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import AxiosInstance from '@/services/AxiosInstance';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';

interface User {
  username: string;
  email: string;
}

const hasSaved = ref(false);
const alert = ref(false);
const isEditing = ref(false);
const result = reactive<User>({
  username: '',
  email: '',
});
const error = ref('');

const userLoad = async () => {
  try {
    const response = await AxiosInstance.get<{ data: User }>('http://127.0.0.1:8000/api/users/current', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
      },
    });
    result.username = response.data.data.username;
    result.email = response.data.data.email;
  } catch (err) {
    const axiosError = err as { response?: { data?: { errors?: string[] } } };
    error.value = Validations.getErrorMessageFromCode(axiosError.response?.data?.errors?.[0]);
    alert.value = true;
  }
};

const onUpdate = async () => {
  const postData = {
    username: result.username,
    email: result.email,
  };

  const userDataString = localStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : {};

  if (postData.username === userData.username && postData.email === userData.email) {
    error.value = 'No update for this user';
    hasSaved.value = false;
    alert.value = true;
  } else {
    try {
      await AxiosInstance.patch('http://127.0.0.1:8000/api/users/current', postData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        },
      });
      userLoad();
      hasSaved.value = true;
      alert.value = false; // Clear any previous error alerts
    } catch (err) {
      const axiosError = err as { response?: { data?: { errors?: string[] } } };
      error.value = Validations.getErrorMessageFromCode(axiosError.response?.data?.errors?.[0]);
      alert.value = true;
      hasSaved.value = false;
    }
  }
};

const save = () => {
  isEditing.value = !isEditing.value;
};

onMounted(() => {
  userLoad();
});
</script>

<style scoped>
.user-profile-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(0,0,0,0.2) !important;
  background: #FFFFFF;
}

.user-profile-toolbar {
  background: linear-gradient(to right, #2196F3, #64B5F6); /* Blue gradient */
  color: white;
  border-radius: 16px 16px 0 0;
}

.v-text-field :deep(.v-field__outline) {
  border-color: #90CAF9 !important; /* Light Blue outline */
}

.v-text-field :deep(.v-label) {
  color: #424242 !important;
}

.v-text-field :deep(.v-input__control) {
  border-radius: 8px;
}

.v-btn.text-white {
  color: white !important;
}
</style>