<template>
  <div class="modern-login">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          <div class="text-center mb-8">
            <v-icon
              icon="mdi-rocket-launch-outline"
              size="80"
              color="#10B981"
            ></v-icon>
          </div>

          <v-card class="glass-card rounded-xl">
            <v-window v-model="step">
              <!-- Sign In Form -->
              <v-window-item :value="1">
                <v-card-text class="pa-8">
                  <h2 class="text-center text-h5 font-weight-bold mb-2 card-title">Welcome Back!</h2>
                  <p class="text-center text-medium-emphasis mb-8">Sign in to continue</p>

                  <v-alert
                    v-if="error"
                    class="mb-4"
                    density="compact"
                    border="start"
                    variant="tonal"
                    closable
                    type="error"
                    @update:model-value="error = ''"
                  >
                    {{ error }}
                  </v-alert>

                  <v-form @submit.prevent="login">
                    <label class="form-label">Email address</label>
                    <v-text-field
                      v-model="loginForm.email"
                      density="compact"
                      variant="outlined"
                      class="mb-4"
                      hide-details="auto"
                      prepend-inner-icon="mdi-email-outline"
                    ></v-text-field>

                    <password-input v-model="loginForm.password">
                      <template #forgot-password>
                        <a class="text-caption text-decoration-none form-link" href="#" rel="noopener noreferrer">
                          Forgot password?
                        </a>
                      </template>
                    </password-input>

                    <v-btn
                      block
                      size="large"
                      class="form-button mt-6"
                      :loading="loading"
                      type="submit"
                    >
                      Sign in
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-window-item>

              <!-- Sign Up Form -->
              <v-window-item :value="2">
                <v-card-text class="pa-8">
                  <h2 class="text-center text-h5 font-weight-bold mb-2 card-title">Create Account</h2>
                  <p class="text-center text-medium-emphasis mb-8">Get started with us</p>

                  <v-alert
                    v-if="error"
                    class="mb-4"
                    density="compact"
                    border="start"
                    variant="tonal"
                    closable
                    type="error"
                    @update:model-value="error = ''"
                  >
                    {{ error }}
                  </v-alert>

                  <v-form @submit.prevent="signUp">
                    <label class="form-label">Username</label>
                    <v-text-field
                      v-model="signupForm.username"
                      density="comfortable"
                      variant="outlined"
                      class="mb-4"
                      hide-details="auto"
                      prepend-inner-icon="mdi-account-outline"
                    ></v-text-field>

                    <label class="form-label">Email address</label>
                    <v-text-field
                      v-model="signupForm.email"
                      density="comfortable"
                      variant="outlined"
                      class="mb-4"
                      hide-details="auto"
                      prepend-inner-icon="mdi-email-outline"
                    ></v-text-field>

                    <password-input v-model="signupForm.password" class="mb-2" />
                    <password-input v-model="signupForm.confirmPassword" label="Confirm Password" />

                    <v-btn
                      block
                      size="large"
                      class="form-button mt-6"
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

          <div class="text-center mt-6">
            <span v-if="step === 1" class="text-medium-emphasis">
              New to our platform?
              <a class="font-weight-bold text-decoration-none form-link" @click="step++">Create an account.</a>
            </span>
            <span v-else class="text-medium-emphasis">
              Already have an account?
              <a class="font-weight-bold text-decoration-none form-link" @click="step--">Sign in.</a>
            </span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import PasswordInput from './PasswordInput.vue';
import { useAuth } from '@/composables/useAuth';

const {
  // state
    step,
    error,

    // computed
    loading,

    // forms
    loginForm,
    signupForm,

    // methods
    login,
    signUp,
} = useAuth();

</script>

<style scoped>
.modern-login {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f1f5f9, #e2e8f0); /* Subtle Slate Gradient */
  background-size: cover;
  background-position: center;
}

.glass-card {
  background-color: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
}

.card-title {
  color: #1E293B; /* A darker slate color */
}

.form-label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  font-size: 0.875rem;
  color: #475569; /* A medium slate color */
}

.form-link {
  color: #10B981; /* Emerald Green */
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.form-link:hover {
  color: #059669; /* Darker Emerald Green */
  text-decoration: underline !important;
}

.form-button {
  background: linear-gradient(45deg, #10B981, #059669); /* Emerald Green Gradient */
  color: white !important;
  font-weight: bold;
  border-radius: 8px !important;
  box-shadow: 0 4px 15px 0 rgba(16, 185, 129, 0.5) !important;
  transition: all 0.3s ease;
}

.form-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 rgba(16, 185, 129, 0.6) !important;
}

/* Style for filled text fields */
:deep(.v-text-field.v-input--density-comfortable .v-field__input) {
    padding-top: 10px;
    padding-bottom: 10px;
}

:deep(.v-text-field .v-input__control .v-field) {
  background-color: rgba(230, 230, 230, 0.6) !important;
  box-shadow: none !important;
}
</style>