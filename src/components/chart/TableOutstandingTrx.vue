<template>
    <div>
      <v-toolbar flat color="rgba(0,0,0,0)" class="mt-n5">
        <v-toolbar-title class=" text-cyan text-lg-h5 font-weight-bold">Outstanding Transaction</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card height="" flat color="transparent" class="mt-n5">
        <v-data-table-virtual
          :headers="outsTrxTable"
          :items="outsTransaction"
           class="transparent text-black mt-n2 bg-cyan-lighten-3"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="me-2" size="small" @click="editOutsTrx(item)"> 
              mdi-pencil-outline
            </v-icon>
          </template>
        </v-data-table-virtual>
      </v-card>
      <v-dialog
        v-model="dialogDesc"
        max-width="400"
      >
      <v-card
        class="elevation-12"
        variant="outlined"
      >
        <v-card-title class="text-h5 font-weight-regular bg-cyan-darken-2">
          <v-icon size="30"> mdi-unity </v-icon>&nbsp; Change Status
        </v-card-title>
        <v-textarea
          label="Description"
          v-model="updateOutsTrx.description"
          class="pa-2 ma-2"
          row-height="25"
          rows="3"
          variant="outlined"
          auto-grow
          @keyup.enter="updateDescription()"
        ></v-textarea>
        <div class="pa-4 text-end">
          <v-btn
            class="text-none pa-2 ma-2"
            color="medium-emphasis"
            min-width="92"
            variant="outlined"
            rounded
            @click="updateDescription()"
          >
            Change
          </v-btn>
          <v-btn
            class="text-none"
            color="medium-emphasis"
            min-width="92"
            variant="outlined"
            rounded
            @click="dialogDesc = false"
          >
            Close
          </v-btn>
        </div>
      </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
import AxiosInstance from '@/services/AxiosInstance';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';

  export default {
  data : () => ({
    outsTrxTable: [
      { title: 'Name', align: 'center', key: 'customer_name' },
      { title: 'Qty', align: 'center', key: 'quantity'},
      { title: 'Description', align: 'center', key: 'description' },
      { title: 'Total', align: 'start', key: 'total'},
      { title: 'Date', align: 'start', key: 'created_at'},
      { title: 'Action', align: 'start', key: 'actions'},
      { align: ' d-none', key: 'stock_id'},
    ],
      outsTransaction: [],
      updateOutsTrx: [],
      alert: false,
      dialogDesc: false,
  }),

  created() {

    this.getOutstandingTrx();
  },

  methods: {

    editOutsTrx(item) {
      this.updateOutsTrx = Object.assign({}, item);
      this.dialogDesc = true;
    },

    async updateDescription() {

      // let postData = this.updateOutsTrx;
      let postData = {
              //stock
              stock_id: this.updateOutsTrx.stock_id,
              stock: -this.updateOutsTrx.quantity,
              //transaction
              customer_id: this.updateOutsTrx.customer_id,
              quantity: this.updateOutsTrx.quantity,
              description: this.updateOutsTrx.description,
              amount: this.updateOutsTrx.amount,
              total: this.updateOutsTrx.total,
          };

      try {
        let response = ''
          response = await AxiosInstance.patch('http://127.0.0.1:8000/api/transactions/'+this.updateOutsTrx.id, postData,
            {
              headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
              },
            })
            if (response.status == 200) {
              this.getOutstandingTrx();
              this.dialogDesc = false;
            }
      } catch (error) {2
        this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0], );
        this.alert = true;
      }
    },

    async getOutstandingTrx() {

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