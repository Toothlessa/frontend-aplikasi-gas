<template>
    <div>
      <v-toolbar color="transparent" class="mt-n5" rounded-t-xl>
        <v-toolbar-title class=" text-cyan text-lg-h5 font-weight-bold">Outstanding Transaction</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card rounded="xl" elevation="4" class="mt-n5">
        <v-data-table-virtual
          :headers="outsTrxTable"
          :items="outsTransaction"
           class="modern-table text-black mt-n2"
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
        persistent
        transition="dialog-top-transition"
      >
      <v-card
        class="elevation-12"
        rounded="xl"
        style="opacity: 0.9;"
      >
        <v-card-title class="text-h5 font-weight-regular bg-cyan-darken-2">
          <v-icon size="30"> mdi-unity </v-icon>&nbsp; Change Status
        </v-card-title>
        <v-card-text>
          <v-textarea
            label="Description"
            v-model="updateOutsTrx.description"
            class="pa-1 ma-1"
            row-height="20"
            rows="2"
            variant="outlined"
            auto-grow
            @keyup.enter="updateDescription()"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="pa-2 text-end">
          <v-spacer></v-spacer>
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
          <v-btn
            class="text-none"
            color="cyan-darken-2"
            min-width="92"
            variant="elevated"
            rounded
            @click="updateDescription()"
          >
            Change
          </v-btn>
        </v-card-actions>
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
        if (error.response && error.response.data) {
          this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
        } else {
          this.error = "An unexpected error occurred.";
        }
        this.alert = true;
      }
    },

  }

  }
  </script>
  
  <style scoped>
.modern-table {
  border-radius: 12px; /* Inherit from card, but good to be explicit */
  overflow: hidden; /* Ensures rounded corners are applied to content */
}

.modern-table .v-data-table-header {
  background-color: #f5f5f5; /* Light grey header */
  color: #333;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table .v-data-table__tr:hover {
  background-color: #e0f7fa !important; /* Light cyan on hover */
}

/* General table cell padding */
.modern-table .v-data-table-header th,
.modern-table .v-data-table__td {
  padding: 12px 16px;
}

/* Make the table rows slightly rounded if possible, though v-data-table-virtual might not fully support this directly on rows */
.modern-table .v-data-table__tr {
  border-bottom: 1px solid #eee; /* Subtle row divider */
}

.modern-table .v-data-table__tr:last-child {
  border-bottom: none; /* No border on the last row */
}
  </style>