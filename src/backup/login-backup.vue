<template>
  <v-container class="github-login-container">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <!-- <div class="text-center mb-6">
          <v-icon size="64" color="grey-darken-3">mdi-login</v-icon>
        </div> -->

        <v-card class="github-card elevation-0 rounded-lg">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-card-text class="pa-6">
                <h2 class="text-center text-h5 font-weight-medium mb-6">
                  Sign in to your account
                </h2>
                <v-alert
                  class="mb-4"
                  v-model="alert"
                  border="start"
                  variant="tonal"
                  closable
                  type="error"
                  v-if="error"
                >
                  {{ error }}
                </v-alert>
                <v-form @submit.prevent="onLogin">
                  <label class="github-label">Email address</label>
                  <v-text-field
                    v-model="loginEmail"
                    density="compact"
                    variant="outlined"
                    class="github-input mb-4"
                    hide-details
                  ></v-text-field>

                  <div class="d-flex justify-space-between align-center">
                    <label class="github-label">Password</label>
                    <a
                      class="text-caption text-decoration-none github-link"
                      href="#"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <v-text-field
                    v-model="loginPassword"
                    density="compact"
                    variant="outlined"
                    :type="visible ? 'text' : 'password'"
                    @click:append-inner="visible = !visible"
                    class="github-input mb-6"
                    hide-details
                  >
                    <template #append-inner>
                      <v-icon @click="visible = !visible">{{ visible ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                    </template>
                  </v-text-field>

                  <v-btn
                    block
                    size="large"
                    class="github-button github-button-primary text-white"
                    :loading="loading"
                    type="submit"
                  >
                    Sign in
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-window-item>

            <v-window-item :value="2">
              <v-card-text class="pa-6">
                <h2 class="text-center text-h5 font-weight-medium mb-6">
                  Create your account
                </h2>
                <v-alert
                  class="mb-4"
                  v-model="alert"
                  border="start"
                  variant="tonal"
                  closable
                  type="error"
                  v-if="error"
                >
                  {{ error }}
                </v-alert>
                <v-form @submit.prevent="onSignUp">
                  <label class="github-label">Username</label>
                  <v-text-field
                    v-model="username"
                    density="compact"
                    variant="outlined"
                    class="github-input mb-4"
                    hide-details
                  ></v-text-field>

                  <label class="github-label">Email address</label>
                  <v-text-field
                    v-model="email"
                    density="compact"
                    variant="outlined"
                    class="github-input mb-4"
                    hide-details
                  ></v-text-field>

                  <label class="github-label">Password</label>
                  <v-text-field
                    v-model="password"
                    density="compact"
                    variant="outlined"
                    :type="visible ? 'text' : 'password'"
                    @click:append-inner="visible = !visible"
                    class="github-input mb-4"
                    hide-details
                  >
                    <template #append-inner>
                      <v-icon @click="visible = !visible">{{ visible ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                    </template>
                  </v-text-field>

                  <label class="github-label">Confirm Password</label>
                  <v-text-field
                    v-model="password1"
                    density="compact"
                    variant="outlined"
                    :type="visible ? 'text' : 'password'"
                    @click:append-inner="visible = !visible"
                    class="github-input mb-6"
                    hide-details
                  >
                    <template #append-inner>
                      <v-icon @click="visible = !visible">{{ visible ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                    </template>
                  </v-text-field>

                  <v-btn
                    block
                    size="large"
                    class="github-button github-button-primary text-white"
                    :loading="loading"
                    type="submit"
                  >
                    Sign up
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>

        <v-card class="github-card-alt elevation-0 rounded-lg mt-4">
          <v-card-text class="text-center text-body-2">
            <span v-if="step === 1">
              New to this site?
              <a
                class="text-decoration-none github-link"
                @click="step++"
              >
                Create an account.
              </a>
            </span>
            <span v-else>
              Already have an account?
              <a
                class="text-decoration-none github-link"
                @click="step--"
              >
                Sign in.
              </a>
            </span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { LOGIN_ACTION, SIGNUP_ACTION } from '@/store/storeconstant';

const store = useStore();
const router = useRouter();

const visible = ref(false);
const loading = ref(false);
const step = ref(1);
const alert = ref(false);
const loginEmail = ref('');
const loginPassword = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const password1 = ref('');
const error = ref('');

const onLogin = async () => {
  loading.value = true;
  try {
    await store.dispatch(`auth/${LOGIN_ACTION}`, {
      email: loginEmail.value,
      password: loginPassword.value,
    });
    router.push('/');
  } catch (err) {
    error.value = (err as Error).message;
    alert.value = true;
  } finally {
    loading.value = false;
  }
};

const onSignUp = async () => {
  loading.value = true;
  if (password.value !== password1.value) {
    error.value = 'Password does not match';
    alert.value = true;
    loading.value = false;
    return;
  }

  try {
    await store.dispatch(`auth/${SIGNUP_ACTION}`, {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    router.push('/');
  } catch (err) {
    error.value = (err as Error).message;
    alert.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.github-login-container {
  background-color: #f6f8fa;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.github-card {
  border: 1px solid #d8dee4;
  box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04);
}

.github-card-alt {
  background-color: #f6f8fa;
  border: 1px solid #d8dee4;
  box-shadow: none;
}

.github-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #24292e;
}

.github-input.v-text-field {
  background-color: #ffffff;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
}

.github-input.v-text-field:focus-within {
  border-color: #0366d6;
  box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075), 0 0 0 0.2em rgba(3, 102, 214, 0.3);
  outline: none;
}

.github-input.v-text-field .v-input__control {
  border-radius: 6px;
}

.github-input.v-text-field .v-field__input {
  padding: 8px 12px;
  min-height: unset;
}

.github-button {
  background-color: #2ea44f !important;
  border: 1px solid rgba(27, 31, 35, 0.15) !important;
  box-shadow: 0 1px 0 rgba(27, 31, 35, 0.1) !important;
  color: #ffffff !important;
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  appearance: none;
}

.github-button:hover {
  background-color: #2c974b !important;
  border-color: rgba(27, 31, 35, 0.15) !important;
}

.github-button:active {
  background-color: #2ea44f !important;
  box-shadow: inset 0 1px 0 rgba(27, 31, 35, 0.15) !important;
}

.github-button-primary {
  background-color: #2ea44f !important;
}

.github-link {
  color: #0366d6;
}

.github-link:hover {
  text-decoration: underline !important;
}
</style>