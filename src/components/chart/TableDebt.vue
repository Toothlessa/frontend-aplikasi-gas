<template>
    <div>
      <v-toolbar flat color="rgba(0,0,0,0)" class="mt-n5">
        <v-toolbar-title class=" text-teal text-lg-h5 font-weight-bold">Outstanding Debt</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card height="" flat color="transparent" class="mt-n5">
        <v-data-table-virtual
          :headers="debtsTable"
          :items="outsDebts"
          class="transparent text-black mt-n2 bg-cyan-lighten-5"
        > 
        </v-data-table-virtual>
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
    debtsTable: [
      { title: 'Name', align: 'center', key: 'customer_name' },
      { title: 'Total Pay', align: 'center', key: 'total_pay'},
      { title: 'Total', align: 'center', key: 'total_debt' },
      { title: 'Debt Left', align: 'start', key: 'debt_left'},
    ],
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