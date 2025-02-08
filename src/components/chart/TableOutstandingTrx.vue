<template>
    <div>
      <v-toolbar flat color="rgba(0,0,0,0)" class="mt-n5">
        <v-toolbar-title class=" text-cyan text-lg-h5 font-weight-bold">Outstanding Transaction</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card height="" flat color="transparent" class="mt-n5">
        <v-table class="transparent text-black mt-n2 bg-cyan" color="transparent">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">No</th>
                <th class="text-left">Nama</th>
                <th class="text-left">Deskripsi</th>
                <th class="text-left">Total</th>
                <th class="text-left">Tanggal</th>
              </tr>
            </thead>
            <tbody class="bg-cyan-lighten-5 text-black">
              <tr v-for="(item, index) in outsTransaction" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.customer_name }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.total }}</td>
                <td>{{ item.created_at }}</td>
              </tr>
            </tbody>
          </template>
        </v-table>
      </v-card>
    </div>
  </template>
  
  <script>
import AxiosInstance from '@/services/AxiosInstance';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';

  export default {
  data : () => ({
      outsTransaction: [],
      alert: false,
  }),

  created() {

    this.getOutstandingDebt();
  },

  methods: {

    async getOutstandingDebt() {

      try {
        await AxiosInstance
          .get('http://127.0.0.1:8000/api/transactions/outstanding', 
          {
            headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            },
          }).then((response) => {
              this.outsTransaction = response.data.data;
              console.log(this.outsTransaction);
          })
      } catch(error) {
        this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0], );
        this.alert = true;
      }
    },

  }

  }
  </script>
  
  <style>
  
  </style>