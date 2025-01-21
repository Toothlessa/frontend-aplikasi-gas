<template>
  <v-divider></v-divider>
    <v-card 
      class="elevation-12 mx-auto" 
      variant="elevated"
      color="white"
      max-width="400"
    >
      <v-toolbar color="cyan" flat>
        <v-btn 
          class="text-white"
          icon="mdi-odnoklassniki"
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
            <v-icon class="text-white" v-else>mdi-pencil-lock</v-icon>
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
      <v-card-text>
        <div class="text-subtitle-1 text-medium-emphasis">Username</div>
          <v-text-field
            v-model="result.username"
            variant="outlined"
            :disabled="!isEditing"
          >
          </v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis">Email</div>
          <v-text-field
              v-model="result.email"
              variant="outlined"
              :disabled="!isEditing"
            > 
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            label="Save" 
            color="grey-darken-2" 
            variant="outlined"
            :disabled="!isEditing" 
            @click="save()" 
            @click.prevent="onUpdate()" 
          > 
            <v-icon size="30">mdi-content-save</v-icon> 
          </v-btn>
        </v-card-actions>
        <v-snackbar
          v-model="hasSaved"
          :timeout="2000"
          location="top center"
          attach
        >
          Your profile has been updated
        </v-snackbar>
    </v-card>
  </template>
  
<script>
import AxiosInstance from '@/services/AxiosInstance';
import Validations from '@/services/Validations';
// import Validations from '@/services/Validations';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';

    export default {
      data: () => ({
        hasSaved: false,
        alert: true,
        isEditing: null,
        result: {
          username:'',
          email:'',
        },
        error:'',
      }),
      
      created() { 
        this.userLoad();
      },  
  
      methods: {

      userLoad(){
        AxiosInstance
          .get('http://127.0.0.1:8000/api/users/current',
           {
            headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            }
          }
        )
          .then((response) => {
            this.result = response.data.data;
            });
          },

      async onUpdate(){
        let postData = {
            username: this.result.username,
            email: this.result.email,
        };

        let userDataString = localStorage.getItem('userData');
        let userData = JSON.parse(userDataString);

        console.log(userData.username);

        if(postData.username == this.result.username &&
           postData.email == this.result.email
        ){
              this.error = 'No update for this user';
              this.hasSaved = false;
              this.alert = true;

          } else {

            try{ 
            await AxiosInstance
              .patch('http://127.0.0.1:8000/api/users/current', postData,
                {
                headers: {
                  'Content-Type': 'application/json', 
                  'Accept': 'application/json',
                  'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                },
              });
            } catch (error) {
              this.error = Validations.getErrorMessageFromCode(
                error.response.data.errors[0],
            );
              this.alert = true;
            }

            this.userLoad();
          }
        },

        save() {
          this.isEditing = !this.isEditing
          this.hasSaved = true 
        }
      },
    }
  </script>
  