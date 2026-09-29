<template>
  <div class="login-page">

    <!-- Background Decoration -->
    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>
    <div class="grid-pattern"></div>

    <v-container class="fill-height position-relative">
      <v-row
        justify="center"
        align="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="5"
          lg="4"  
          xl="3"
        >

          <!-- BRAND -->
          <div class="brand">
            <div class="logo">
              <v-icon
                icon="mdi-gas-cylinder"
                size="30"
              />
            </div>

            <div class="brand-name">
              Aplikasi Gas
            </div>

            <div class="brand-tagline">
              Manage your business smarter
            </div>
          </div>


          <!-- LOGIN CARD -->
          <v-card
            class="login-card"
            elevation="0"
          >

            <v-window
              v-model="step"
              class="auth-window"
            >

              <!-- ================= LOGIN ================= -->
              <v-window-item :value="1">

                <v-card-text class="auth-content">

                  <div class="heading">
                    <h2>Welcome back</h2>

                    <p>
                      Sign in to continue to your account
                    </p>
                  </div>


                  <!-- ERROR -->
                  <v-alert
                    v-if="validationShowError"
                    type="error"
                    variant="tonal"
                    density="comfortable"
                    rounded="lg"
                    closable
                    class="error-alert"
                    @click:close="validationShowError = false"
                  >
                    <div
                      v-if="validationErrorMessages.length > 1"
                    >
                      <ul class="pl-4">
                        <li
                          v-for="(msg, i) in validationErrorMessages"
                          :key="i"
                        >
                          {{ msg }}
                        </li>
                      </ul>
                    </div>

                    <div v-else>
                      {{ validationErrorMessages[0] }}
                    </div>
                  </v-alert>


                  <v-form @submit.prevent="onLogin">

                    <!-- EMAIL -->
                    <div class="field">
                      <label>Email address</label>

                      <v-text-field
                        v-model="loginForm.email"
                        variant="outlined"
                        density="comfortable"
                        placeholder="name@example.com"
                        prepend-inner-icon="mdi-email-outline"
                        hide-details="auto"
                        class="modern-input"
                      />
                    </div>


                    <!-- PASSWORD -->
                    <div class="field password-field">
                      <label>Password</label>

                      <password-input
                        v-model="loginForm.password"
                        placeholder="Enter your password"
                        class="modern-input"
                      />
                    </div>


                    <div class="forgot-row">
                      <a
                        href="#"
                        @click.prevent
                      >
                        Forgot password?
                      </a>
                    </div>


                    <v-btn
                      block
                      size="large"
                      type="submit"
                      :loading="loading"
                      class="submit-button"
                    >
                      <span>Sign in</span>

                      <v-icon
                        icon="mdi-arrow-right"
                        size="20"
                      />
                    </v-btn>

                  </v-form>

                </v-card-text>

              </v-window-item>


              <!-- ================= REGISTER ================= -->
              <v-window-item :value="2">

                <v-card-text class="auth-content">

                  <div class="heading">
                    <h2>Create account</h2>

                    <p>
                      Get started with your new account
                    </p>
                  </div>


                  <!-- ERROR -->
                  <v-alert
                    v-if="validationShowError"
                    type="error"
                    variant="tonal"
                    density="comfortable"
                    rounded="lg"
                    closable
                    class="error-alert"
                    @click:close="validationShowError = false"
                  >
                    <div
                      v-if="validationErrorMessages.length > 1"
                    >
                      <ul class="pl-4">
                        <li
                          v-for="(msg, i) in validationErrorMessages"
                          :key="i"
                        >
                          {{ msg }}
                        </li>
                      </ul>
                    </div>

                    <div v-else>
                      {{ validationErrorMessages[0] }}
                    </div>
                  </v-alert>


                  <v-form @submit.prevent="onSignUp">

                    <!-- USERNAME -->
                    <div class="field">
                      <label>Username</label>

                      <v-text-field
                        v-model="signupForm.username"
                        variant="outlined"
                        density="comfortable"
                        placeholder="spacewalker"
                        prepend-inner-icon="mdi-account-outline"
                        hide-details="auto"
                        class="modern-input"
                      />
                    </div>


                    <!-- EMAIL -->
                    <div class="field">
                      <label>Email address</label>

                      <v-text-field
                        v-model="signupForm.email"
                        variant="outlined"
                        density="comfortable"
                        placeholder="name@example.com"
                        prepend-inner-icon="mdi-email-outline"
                        hide-details="auto"
                        class="modern-input"
                      />
                    </div>


                    <!-- PASSWORD -->
                    <div class="field">
                      <label>Password</label>

                      <password-input
                        v-model="signupForm.password"
                        placeholder="Create a password"
                        class="modern-input"
                      />
                    </div>


                    <!-- CONFIRM PASSWORD -->
                    <div class="field">
                      <label>Confirm password</label>

                      <password-input
                        v-model="signupForm.confirmPassword"
                        placeholder="Confirm your password"
                        class="modern-input"
                      />
                    </div>


                    <v-btn
                      block
                      size="large"
                      type="submit"
                      :loading="loading"
                      class="submit-button"
                    >
                      <span>Create account</span>

                      <v-icon
                        icon="mdi-arrow-right"
                        size="20"
                      />
                    </v-btn>

                  </v-form>

                </v-card-text>

              </v-window-item>

            </v-window>


            <!-- SWITCH LOGIN / REGISTER -->
            <div class="switch-area">

              <template v-if="step === 1">

                <span>
                  Don't have an account?
                </span>

                <button
                  type="button"
                  @click="switchView(2)"
                >
                  Create account
                </button>

              </template>


              <template v-else>

                <span>
                  Already have an account?
                </span>

                <button
                  type="button"
                  @click="switchView(1)"
                >
                  Sign in
                </button>

              </template>

            </div>

          </v-card>


          <!-- FOOTER -->
          <div class="footer">
            <span>© {{ new Date().getFullYear() }} Aplikasi Gas</span>

            <span class="dot">•</span>

            <span>All rights reserved</span>
          </div>

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

const router = useRouter();

const {
  validationErrorMessages,
  validationShowError,
  validationError,
} = useGlobal();

const {
  step,
  loading,
  loginForm,
  signupForm,
  login,
  signUp,
} = useAuth();


const switchView = (newStep: number) => {
  validationShowError.value = false;
  validationErrorMessages.value = [];
  step.value = newStep;
};


const onLogin = async () => {
  try {
    await login();
    router.push("/");
  } catch (e) {
    validationError(e);
  }
};


const onSignUp = async () => {
  try {
    await signUp();
    router.push("/");
  } catch (e) {
    validationError(e);
  }
};

</script>


<style scoped>

/* =====================================================
   PAGE
===================================================== */

.login-page {
  min-height: 100vh;

  position: relative;

  overflow: hidden;

  background:
    linear-gradient(
      135deg,
      #f8fafc 0%,
      #f1f5f9 100%
    );

  color: #0f172a;
}


/* =====================================================
   BACKGROUND
===================================================== */

.bg-glow {
  position: absolute;

  width: 420px;
  height: 420px;

  border-radius: 50%;

  filter: blur(90px);

  pointer-events: none;
}


.glow-1 {
  top: -220px;
  left: -180px;

  background: rgba(16, 185, 129, 0.16);
}


.glow-2 {
  right: -220px;
  bottom: -220px;

  background: rgba(59, 130, 246, 0.10);
}


.grid-pattern {
  position: absolute;

  inset: 0;

  opacity: 0.35;

  background-image:
    linear-gradient(
      rgba(148, 163, 184, 0.08) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(148, 163, 184, 0.08) 1px,
      transparent 1px
    );

  background-size: 32px 32px;

  mask-image:
    linear-gradient(
      to bottom,
      black,
      transparent 70%
    );

  pointer-events: none;
}


/* =====================================================
   BRAND
===================================================== */

.brand {
  text-align: center;

  margin-bottom: 28px;

  animation: fade-up 0.6s ease;
}


.logo {
  width: 58px;
  height: 58px;

  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border-radius: 17px;

  background:
    linear-gradient(
      145deg,
      #34d399,
      #059669
    );

  box-shadow:
    0 12px 25px rgba(16, 185, 129, 0.25);

  transition: all 0.3s ease;
}


.logo:hover {
  transform: translateY(-3px) rotate(-3deg);

  box-shadow:
    0 16px 30px rgba(16, 185, 129, 0.30);
}


.brand-name {
  margin-top: 14px;

  font-size: 1.45rem;

  font-weight: 750;

  letter-spacing: -0.6px;
}


.brand-tagline {
  margin-top: 4px;

  font-size: 0.82rem;

  color: #64748b;
}


/* =====================================================
   CARD
===================================================== */

.login-card {
  overflow: hidden;

  border: 1px solid rgba(226, 232, 240, 0.9);

  border-radius: 20px !important;

  background: rgba(255, 255, 255, 0.94) !important;

  box-shadow:
    0 25px 50px -15px rgba(15, 23, 42, 0.12) !important;

  backdrop-filter: blur(12px);

  animation: fade-up 0.7s ease;
}


.auth-window {
  overflow: hidden;
}


.auth-content {
  padding: 30px !important;
}


/* =====================================================
   HEADING
===================================================== */

.heading {
  margin-bottom: 26px;
}


.heading h2 {
  margin: 0;

  font-size: 1.45rem;

  font-weight: 750;

  letter-spacing: -0.7px;

  color: #0f172a;
}


.heading p {
  margin-top: 6px;

  font-size: 0.87rem;

  color: #64748b;
}


/* =====================================================
   ERROR
===================================================== */

.error-alert {
  margin-bottom: 20px;

  font-size: 0.82rem;
}


/* =====================================================
   FORM
===================================================== */

.field {
  margin-bottom: 18px;
}


.field label {
  display: block;

  margin-bottom: 7px;
  margin-left: 2px;

  font-size: 0.82rem;

  font-weight: 650;

  color: #334155;
}


.password-field {
  margin-bottom: 0;
}


/* =====================================================
   INPUT
===================================================== */

:deep(.modern-input .v-field) {
  min-height: 46px;

  border-radius: 11px !important;

  background: #ffffff;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}


:deep(.modern-input .v-field:hover) {
  border-color: #94a3b8;
}


:deep(.modern-input .v-field--focused) {
  border-color: #10b981;

  box-shadow:
    0 0 0 3px rgba(16, 185, 129, 0.10);
}


:deep(.modern-input .v-field__input) {
  font-size: 0.9rem;
}


/* =====================================================
   FORGOT
===================================================== */

.forgot-row {
  display: flex;

  justify-content: flex-end;

  margin-top: 9px;
}


.forgot-row a {
  font-size: 0.78rem;

  font-weight: 650;

  color: #059669;

  text-decoration: none;

  transition: color 0.2s ease;
}


.forgot-row a:hover {
  color: #047857;

  text-decoration: underline;
}


/* =====================================================
   BUTTON
===================================================== */

.submit-button {
  height: 47px !important;

  margin-top: 26px;

  border-radius: 11px !important;

  background:
    linear-gradient(
      135deg,
      #10b981,
      #059669
    );

  color: white !important;

  font-size: 0.9rem;

  font-weight: 700;

  text-transform: none;

  letter-spacing: 0;

  box-shadow:
    0 8px 18px rgba(16, 185, 129, 0.22) !important;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}


.submit-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 12px 24px rgba(16, 185, 129, 0.30) !important;
}


.submit-button :deep(.v-icon) {
  margin-left: 8px;

  transition: transform 0.2s ease;
}


.submit-button:hover :deep(.v-icon) {
  transform: translateX(3px);
}


/* =====================================================
   SWITCH
===================================================== */

.switch-area {
  padding: 17px 20px;

  border-top: 1px solid #f1f5f9;

  background: #fafafa;

  text-align: center;

  font-size: 0.8rem;

  color: #64748b;
}


.switch-area button {
  margin-left: 5px;

  padding: 0;

  border: none;

  background: transparent;

  color: #059669;

  font-size: 0.8rem;

  font-weight: 700;

  cursor: pointer;

  transition: color 0.2s ease;
}


.switch-area button:hover {
  color: #047857;

  text-decoration: underline;
}


/* =====================================================
   FOOTER
===================================================== */

.footer {
  display: flex;

  justify-content: center;
  align-items: center;

  gap: 8px;

  margin-top: 20px;

  font-size: 0.7rem;

  color: #94a3b8;
}


.dot {
  color: #cbd5e1;
}


/* =====================================================
   ANIMATION
===================================================== */

@keyframes fade-up {

  from {
    opacity: 0;

    transform: translateY(10px);
  }

  to {
    opacity: 1;

    transform: translateY(0);
  }

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 600px) {

  .auth-content {
    padding: 25px !important;
  }

  .login-card {
    border-radius: 17px !important;
  }

  .brand {
    margin-bottom: 22px;
  }

  .footer {
    margin-bottom: 10px;
  }

}

</style>