<template>
  <v-spacer></v-spacer>
    <v-card class="mx-auto" color="white" max-width="500">
      <v-toolbar color="indigo" flat>
        <v-btn icon="mdi-account"></v-btn>
  
        <v-toolbar-title class="font-weight-light">
          User Profile
        </v-toolbar-title>
  
        <v-spacer></v-spacer>
  
        <v-btn icon @click="isEditing = !isEditing">
          <v-fade-transition leave-absolute>
            <v-icon v-if="isEditing">mdi-close</v-icon>
  
            <v-icon v-else>mdi-pencil</v-icon>
          </v-fade-transition>
        </v-btn>
      </v-toolbar>

      <v-alert type="error" variant="tonal" v-if="error"> {{ error }} </v-alert>
  
      <v-card-text>

    <div class="text-subtitle-1 text-medium-emphasis">Username</div>

        <v-text-field
          v-model="result.username"
          :disabled="!isEditing"
          base-color="black"
        >
        </v-text-field>
    
    <div class="text-subtitle-1 text-medium-emphasis">Email</div>
    
      <v-text-field
          v-model="result.email"
          :disabled="!isEditing"
          base-color="white"
        > 
      </v-text-field>
  
      </v-card-text>
  
      <v-divider></v-divider>
  
      <v-card-actions>
        <v-spacer></v-spacer>
  
        <v-btn :disabled="!isEditing" @click="save()" @click.prevent="onUpdate()" > Save </v-btn>
      </v-card-actions>
  
      <v-snackbar
        v-model="hasSaved"
        :timeout="2000"
        location="bottom left"
        position="absolute"
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

        if(postData.username == userData.username &&
           postData.email == userData.email
        ){
              this.error = 'No update for this user';

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
  