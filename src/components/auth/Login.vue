<template class="">
   <v-divider color="white" class="mt-10" dark></v-divider>
   <v-divider color="white" class="mt-10" dark></v-divider>
<v-container>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="10" md="10">
      <v-card class="elevation-12 mx-auto" width="560" color="white" variant="tonal">
        <v-window v-model="step">
          <v-window-item :value="1">
          <v-card-text class="mt-12">
            <h2 class="text-center text-teal">
              Sign In
            </h2>
            <v-alert 
              class="text-teal"
              v-model="alert"
              border="start"
              variant="tonal"
              closable
               v-if="error"
               > 
               {{ error }} 
            </v-alert>
            <v-divider></v-divider>
            <v-form>
              <v-text-field
              label="Email"
              v-model="email"
              density="compact"
              variant="solo"
              clearable
              prepend-inner-icon="mdi-email-outline"
              >
              <!-- :rules="[rules.required]" -->
              </v-text-field>
            
              <a
                  class="text-caption text-decoration-none text-teal"
                  href="#"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Forgot your password?
                </a>
              
              <v-text-field
                label="Password"
                v-model="password"
                placeholder="Enter your password"
                density="compact"
                variant="solo"
                clearable
                counter
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                @click:append-inner="visible = !visible"
                prepend-inner-icon="mdi-lock-outline"
                >
              </v-text-field>
              <v-row >
                <v-col cols="12" sm="7">
                  <v-btn
                        rounded
                        class="mb-8"
                        color="teal"
                        size="large"
                        variant="flat"
                        :loading="loading"
                        @click.prevent="onLogin()"
                        @click=load
                        >
                      LOGIN
                    </v-btn>
                </v-col>
                <v-col class="text-right" cols="12" sm="5">
                  <a
                    class="text-caption text-decoration-none text-teal"
                    @click="step++"
                    rel="noopener noreferrer"
                    target="_blank"
                    >
                    Don't have account yet?,<br> please register!
                  </a>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
    
            <v-card-actions>
            </v-card-actions>
          </v-window-item>
          <v-window-item :value="2">
          <v-card-text class="mt-12">
            <h2 class="text-center text-teal">
              Sign up
            </h2>
            <v-divider></v-divider>
            <v-alert 
              class="text-teal"
              v-model="alert"
              border="start"
              variant="tonal"
              closable
               v-if="error"
               > 
               {{ error }} 
            </v-alert>
            <v-form>
              <v-text-field
              v-model="username"
              label="Username"
              density="compact"
              variant="solo"
              clearable
              prepend-inner-icon="mdi-account-outline"
              >
              </v-text-field>

              <v-text-field
              v-model="email"
              label="Email"
              density="compact"
              variant="solo"
              clearable
              prepend-inner-icon="mdi-email-outline"
              >
              </v-text-field>
              
              <v-text-field
                v-model="password"
                placeholder="Enter your password"
                label="Password"
                density="compact"
                variant="solo"
                clearable
                counter
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                @click:append-inner="visible = !visible"
                prepend-inner-icon="mdi-lock-outline"
                >
              </v-text-field>

              <v-text-field
                v-model="password1"
                placeholder="re-Type your password"
                label="Password"
                density="compact"
                variant="solo"
                clearable
                counter
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                @click:append-inner="visible = !visible"
                prepend-inner-icon="mdi-lock-outline"
                >
              </v-text-field>
              
              <v-row >
                <v-col cols="12" sm="7">
                  <v-btn
                        class="mb-8"
                        color="teal"
                        size="large"
                        variant="flat"
                        icon="mdi-arrow-left"
                        @click="step--"
                        >
                      </v-btn>
                </v-col>
                <v-col class="text-right" cols="12" sm="5">
                  <v-btn
                        rounded
                        class="mb-8"
                        color="teal"
                        size="large"
                        variant="flat"
                        :loading="loading"
                        @click.prevent="onSignUp()"
                        @click=load
                        >
                      SIGNUP
                    </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
            <v-card-actions>
            </v-card-actions>
          </v-window-item>
        </v-window>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import { LOGIN_ACTION, SIGNUP_ACTION } from '@/store/storeconstant';
import { mapActions } from 'vuex';

export default{
  data: () => ({
      rules: {
        required: value => !!value || 'Field is required',
      },
      visible: false,
      loading: false,
      step: 1,
      alert: true,
      username: '',
      email: '',
      password: '',
      password1: '',
      errors: [],
      error: '',
    }),

    methods: {
      ...mapActions('auth', {
      login: LOGIN_ACTION,
    }),

    ...mapActions('auth', {
      signup : SIGNUP_ACTION,
    }),

    async onLogin() {
      try{
        await this.login({
          email: this.email,
          password: this.password,
        })
      } catch (error) {
        this.error = error;
        this.alert= true;
      }
      this.$router.push('/');
    },

    async onSignUp() {
      if(this.password != this.password1){
        this.error = 'Password does not match';
      }

      try{
        await this.signup({
          username: this.username,
          email: this.email,
          password: this.password,
        })
      } catch (error) {
        this.error = error;
        this.alert= true;
      }
      this.$router.push('/');
    },

      load () {
        this.loading = true
        setTimeout(() => (this.loading = false), 500)
      },
    },
}
</script>

<style scoped>
.body {
  background-color: lightblue;
}

.a {
  text-align: right;
}
</style>