<template>
  <div class="modern-login">
    <!-- Animated Background Shapes -->
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>

    <v-container class="fill-height position-relative">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          
          <!-- Animated Logo -->
          <div class="text-center mb-8 logo-container">
            <div class="logo-wrapper">
              <v-icon
                icon="mdi-rocket-launch-outline"
                size="60"
                class="logo-icon"
                color="white"
              ></v-icon>
            </div>
            <h1 class="text-h4 font-weight-bold text-white mt-4 title-shadow">Aplikasi Gas</h1>
          </div>

          <v-card class="glass-card rounded-xl overflow-hidden" elevation="10">
            <v-window v-model="step" class="window-container">
              
              <!-- Sign In Form -->
              <v-window-item :value="1">
                <v-card-text class="pa-8">
                  <h2 class="text-center text-h5 font-weight-bold mb-2 card-title">Welcome Back!</h2>
                  <p class="text-center text-subtitle-1 text-medium-emphasis mb-8">Sign in to your account</p>

                  <v-expand-transition>
                    <div v-if="validationShowError" class="mb-6">
                      <v-alert
                        class="aesthetic-error glass-error"
                        density="comfortable"
                        rounded="lg"
                        closable
                        elevation="0"
                        @click:close="validationShowError = false"
                      >
                        <template v-slot:prepend>
                          <div class="error-icon-wrapper mr-3">
                            <v-icon icon="mdi-alert-octagon-outline" color="#EF4444" size="24"></v-icon>
                          </div>
                        </template>
                        
                        <div class="text-subtitle-2 font-weight-bold text-red-darken-3 mb-1">
                          Authentication Failed
                        </div>
                        
                        <div class="text-body-2 text-red-darken-2" style="line-height: 1.4;">
                          <ul v-if="validationErrorMessages.length > 1" class="pl-4">
                            <li v-for="(msg, i) in validationErrorMessages" :key="i">{{ msg }}</li>
                          </ul>
                          <span v-else>{{ validationErrorMessages[0] }}</span>
                        </div>
                      </v-alert>
                    </div>
                  </v-expand-transition>

                  <v-form @submit.prevent="onLogin">
                    <label class="form-label">Email address</label>
                    <v-text-field
                      v-model="loginForm.email"
                      density="comfortable"
                      variant="outlined"
                      class="mb-4 aesthetic-input"
                      hide-details="auto"
                      placeholder="name@example.com"
                      prepend-inner-icon="mdi-email-outline"
                    ></v-text-field>

                    <label class="form-label">Password</label>
                    <password-input v-model="loginForm.password" class="aesthetic-input" placeholder="••••••••">
                    </password-input>
                    
                    <div class="d-flex justify-end mt-2">
                        <a class="text-caption text-decoration-none form-link" href="#" rel="noopener noreferrer">
                          Forgot password?
                        </a>
                    </div>

                    <v-btn
                      block
                      size="large"
                      class="form-button mt-8"
                      :loading="loading"
                      type="submit"
                      elevation="4"
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
                  <p class="text-center text-subtitle-1 text-medium-emphasis mb-8">Sign up for new account</p>

                  <v-expand-transition>
                    <div v-if="validationShowError" class="mb-6">
                      <v-alert
                        class="aesthetic-error glass-error"
                        density="comfortable"
                        rounded="lg"
                        closable
                        elevation="0"
                        @click:close="validationShowError = false"
                      >
                        <template v-slot:prepend>
                          <div class="error-icon-wrapper mr-3">
                            <v-icon icon="mdi-alert-circle-outline" color="#EF4444" size="24"></v-icon>
                          </div>
                        </template>
                        
                        <div class="text-subtitle-2 font-weight-bold text-red-darken-3 mb-1">
                          Registration failed
                        </div>
                        
                        <div class="text-body-2 text-red-darken-2" style="line-height: 1.4;">
                          <ul v-if="validationErrorMessages.length > 1" class="pl-4">
                            <li v-for="(msg, i) in validationErrorMessages" :key="i">{{ msg }}</li>
                          </ul>
                          <span v-else>{{ validationErrorMessages[0] }}</span>
                        </div>
                      </v-alert>
                    </div>
                  </v-expand-transition>

                  <v-form @submit.prevent="onSignUp">
                    <label class="form-label">Username</label>
                    <v-text-field
                      v-model="signupForm.username"
                      density="comfortable"
                      variant="outlined"
                      class="mb-4 aesthetic-input"
                      hide-details="auto"
                      placeholder="spacewalker"
                      prepend-inner-icon="mdi-account-outline"
                    ></v-text-field>

                    <label class="form-label">Email address</label>
                    <v-text-field
                      v-model="signupForm.email"
                      density="comfortable"
                      variant="outlined"
                      class="mb-4 aesthetic-input"
                      hide-details="auto"
                      placeholder="name@example.com"
                      prepend-inner-icon="mdi-email-outline"
                    ></v-text-field>

                    <label class="form-label">Password</label>
                    <password-input v-model="signupForm.password" class="mb-4 aesthetic-input" placeholder="••••••••" />
                    
                    <label class="form-label">Confirm Password</label>
                    <password-input v-model="signupForm.confirmPassword" class="aesthetic-input" placeholder="••••••••" />

                    <v-btn
                      block
                      size="large"
                      class="form-button mt-8"
                      :loading="loading"
                      type="submit"
                      elevation="4"
                    >
                      Sign up
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-window-item>
            </v-window>
            
            <div class="py-6 bg-grey-lighten-4 text-center">
                <v-fade-transition mode="out-in">
                    <div v-if="step === 1" key="signup">
                        <span class="text-body-2 text-medium-emphasis">New here? </span>
                        <a class="text-body-2 font-weight-bold text-decoration-none form-link ml-1" @click="switchView(2)">Create an account</a>
                    </div>
                    <div v-else key="signin">
                         <span class="text-body-2 text-medium-emphasis">Already have an account? </span>
                        <a class="text-body-2 font-weight-bold text-decoration-none form-link ml-1" @click="switchView(1)">Sign in</a>
                    </div>
                </v-fade-transition>
            </div>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useGlobal } from '@/composables/useGlobal';
import PasswordInput from './PasswordInput.vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

  /* -----------------------------------------------------*
   * CONSTANTS                                          *
   * ---------------------------------------------------- */
  const router = useRouter();

  /* -----------------------------------------------------*
   * COMPOSABLES                                          *
   * ---------------------------------------------------- */
  const {
    //validation helpers
    validationErrorMessages,
    validationShowError,
    validationError,
  } = useGlobal();

  const {
    // state
      step,

      // computed
      loading,

      // forms
      loginForm,
      signupForm,

      // methods
      login,
      signUp,
  } = useAuth();

  /* -----------------------------------------------------*
   * FUNCTIONS                                            *
   * ---------------------------------------------------- */
  const switchView = (newStep: number) => {
    validationShowError.value = false;
    validationErrorMessages.value = [];
    step.value = newStep;
  };

  const onLogin = async () => {
    try {
      await login();
      router.push("/");
    }catch(e) {
      validationError(e);
    }
  };

  const onSignUp = async () => {
    try {
      await signUp();
      router.push("/");
    }catch(e) {
      validationError(e);
    }
  };
</script>

<style scoped>
.modern-login {
  min-height: 100vh;
  position: relative;
  background-color: #0f172a;
  overflow: hidden;
}

/* Animated Background Shapes */
.shape {
    position: absolute;
    filter: blur(100px);
    opacity: 0.6;
    animation-duration: 20s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}

.shape-1 {
    top: -10%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: #10B981;
    animation-name: float-1;
}

.shape-2 {
    bottom: -10%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: #3B82F6;
    animation-name: float-2;
    animation-duration: 25s;
}

.shape-3 {
    top: 40%;
    left: 40%;
    width: 300px;
    height: 300px;
    background: #8B5CF6;
    animation-name: float-3;
    animation-duration: 18s;
}

@keyframes float-1 {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(100px, 100px) rotate(20deg); }
}

@keyframes float-2 {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(-100px, -50px) rotate(-15deg); }
}

@keyframes float-3 {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(50px, -50px) scale(1.2); }
    100% { transform: translate(0, 0) scale(1); }
}

/* Glass Card */
.glass-card {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
}

/* Logo Animation */
.logo-container {
    perspective: 1000px;
}

.logo-wrapper {
    display: inline-flex;
    padding: 20px;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    border-radius: 24px;
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
    animation: float-logo 6s ease-in-out infinite;
}

@keyframes float-logo {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.title-shadow {
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.card-title {
  color: #1E293B;
  letter-spacing: -0.5px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  color: #334155;
  margin-left: 2px;
}

.form-link {
  color: #10B981;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.form-link:hover {
  color: #059669;
}

.form-button {
  background: linear-gradient(135deg, #10B981 0%, #047857 100%);
  color: white !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: 12px !important;
  box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.5) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none;
  font-size: 1rem;
}

.form-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.6) !important;
}

/* Input Styles */
:deep(.v-field) {
    border-radius: 12px !important;
    transition: all 0.3s ease;
}

:deep(.v-field__outline) {
    --v-field-border-opacity: 0.15;
}

:deep(.v-field--focused) {
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

:deep(.v-text-field .v-input__control .v-field) {
  background-color: rgba(241, 245, 249, 0.5) !important;
}

:deep(.v-field:hover) {
    background-color: rgba(241, 245, 249, 0.8) !important;
}

/* Error Alert Styles */
.aesthetic-error {
  border: 1px solid rgba(239, 68, 68, 0.2) !important;
  background: linear-gradient(to right, rgba(254, 242, 242, 0.95), rgba(255, 245, 245, 0.9)) !important;
}

.glass-error {
  backdrop-filter: blur(8px);
}

.error-icon-wrapper {
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>