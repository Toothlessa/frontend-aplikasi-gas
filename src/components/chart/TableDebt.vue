<template>
    <div>
      <v-toolbar flat color="rgba(0,0,0,0)" class="mt-n5">
        <v-toolbar-title class=" text-teal text-lg-h5 font-weight-bold">Outstanding Debt</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card height="" flat color="transparent" class="mt-n5">
        <v-table class="bg-teal mt-n2">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">#</th>
                <th class="text-left">Nama</th>
                <th class="text-left">Total Bayar</th>
                <th class="text-left">Total Hutang</th>
                <th class="text-left">Sisa Hutang</th>
              </tr>
            </thead>
            <tbody class="bg-teal-lighten-4">
              <tr v-for="(item, index) in outsDebts" :key="item.customer_id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.customer_name }}</td>
                <td>{{ item.total_pay }}</td>
                <td>{{ item.total_debt }}</td>
                <td>{{ item.debt_left }}</td>
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
    outsDebts: [],
    alert: false,
  }),

  created() {

    this.getOutstandingDebt();
  },

  methods: {

    async getOutstandingDebt() {

      try {
        await AxiosInstance
          .get('http://127.0.0.1:8000/api/debts/outstanding', 
          {
            headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            },
          }).then((response) => {
              this.outsDebts = response.data.data;
              console.log(this.outsDebts);
          })
      } catch(error) {
        this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0], );
        this.alert = true;
      }
    },
  },

  }
  </script>
  
  <style>
  
  </style>