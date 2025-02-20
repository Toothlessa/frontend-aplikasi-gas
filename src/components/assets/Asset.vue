<template>
    <v-container class="bg-">
      <v-card>
        <v-card-title
           class="text-h5 font-weight-regular bg-blue-darken-1"
        >
        <v-row no-gutters>
        <v-icon>mdi-google-earth</v-icon>&nbsp; Assets
          <v-spacer></v-spacer>
          <v-btn
            class="pa-2 ma-2 text-center bg-orange-lighten-4"
            prepend-icon="mdi-account-plus"
            @click="dialogOwner=true"
          >
          Owner
          </v-btn>
          <v-snackbar
            class="text-center"
            v-model="hasSaved"
            :timeout="1000"
            location="top center"
          >
          Data telah tesimpan
          </v-snackbar>
        </v-row>
        </v-card-title>
        <v-row no-gutters>
          <v-col order="1">
            <v-autocomplete 
              class="pa-2 ma-2"
              label="Owner"
              v-model="assets.owner_id"
              variant="solo-inverted"
              :items="assetOwners"
              item-title="name"
              item-value="id"
            >
            </v-autocomplete>
          </v-col>
          <v-col order="2">
            <v-text-field 
              class="pa-2 ma-2"
              label="Asset Name"
              v-model="assets.asset_name"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="3">
            <v-text-field 
              class="pa-2 ma-2"
              label="Qty"
              v-model="assets.quantity"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="4">
            <v-text-field 
              class="pa-2 ma-2"
              label="Harga Beli"
              v-model="assets.cogs"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="5">
            <v-text-field 
              class="pa-2 ma-2"
              label="Harga Jual"
              v-model="assets.selling_price"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="6">
            <v-text-field 
              class="pa-2 ma-2"
              label="Description"
              v-model="assets.description"
              variant="solo-inverted"
              @keyup.enter="loading = !loading;createAsset"
            >
            </v-text-field>
          </v-col>
        </v-row>
          <v-col class="text-center">
            <v-btn
              class="pa-2 ma-2 text-center bg-blue-darken-1"
              prepend-icon="mdi-check-circle"
              :loading="loading"
              @click="createAsset()"
            >
              Submit
              <template v-slot:prepend>
                <v-icon color="success"></v-icon>
              </template>
              <template v-slot:loader>
                <v-progress-linear indeterminate></v-progress-linear>
              </template>
            </v-btn>
          </v-col>
      </v-card>
      <v-divider></v-divider>
      <v-card>
        <v-card-title
           class="text-h5 font-weight-regular bg-blue-lighten-1"
        >
        <v-icon>mdi-format-list-bulleted-type</v-icon>
          List of Asset
        </v-card-title>
          <v-data-table
            :headers="headers"
            :items="assetSummary"
            hide-default-footer
          >
            <template v-slot:[`item.number`]="{item, index}">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{item.id}}</td>
              </tr>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon class="me-2" size="small" @click="editItem(item)"> 
                mdi-developer-board
              </v-icon>
            </template>
          </v-data-table>
      </v-card>
      <v-dialog
        v-model="dialogOwner"
        transition="dialog-bottom-transition"
        width="auto"
      >
        <v-card
          class="elevation-12"
          variant="elevated"
        > 
          <v-card-title class="text-h6 font-weight-regular bg-blue-darken-1">
            <v-icon size="30" >mdi-account-circle</v-icon>&nbsp; Owners
            <v-alert 
            class="text-red"
            v-model="alert"
            border="start"
            variant="tonal"
            closable
            v-if="error"
            > 
            {{ error }} 
          </v-alert>
          </v-card-title>
            <v-text-field 
              class="pa-2 ma-2"
              v-model="ownerName"
              label="Owner Name"
              variant="solo-inverted"
              @keyup.enter="createOwner"
            >
            </v-text-field>
            <div class="text-center">
              <v-btn
                class="bg-blue-darken-1"
                prepend-icon="mdi-copyright"
                text="Create"
                variant="outlined"
                @click="createOwner"
              >
              </v-btn>
              <v-btn
                class="bg-blue-darken-1"
                prepend-icon="mdi-close-circle-outline"
                text="Close"
                variant="outlined"
                @click="dialogOwner=false"
              >
              </v-btn>
            </div>
            <v-divider></v-divider>
              <v-col>
                <v-data-table
                  :headers="ownerHeaders"
                  :items="assetOwners"
                >
                  <template v-slot:[`item.number`]="{ index}">
                    <tr>
                      <td>{{index + 1}}</td>
                    </tr>
                  </template>
                  <template v-slot:[`item.actions`]="{ item }">
                    <div class="text-end">
                      <v-icon size="small" @click="editOwner(item)"> mdi-pencil-outline </v-icon>
                      <v-icon size="small" @click="updateStatusOwner(item)"> mdi-radioactive </v-icon>
                    </div>
                  </template>
                  <template v-slot:[`item.active_flag`]="{ item }">
                  <div class="text-center">
                    <v-chip
                      :color="item.active_flag ? 'green' : 'black'"
                      :text="item.active_flag ? 'Active' : 'Inactive'"
                      class="text-uppercase"
                      size="small"
                      label
                    ></v-chip>
                  </div>
                </template>
                </v-data-table>
              </v-col>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialogUpdateOwner"
        transition="dialog-bottom-transition"
        width="auto"
      >
      <v-card
          class="elevation-12"
          variant="elevated"
        > 
          <v-card-title class="text-h6 font-weight-regular bg-blue-darken-1">
            <v-icon size="30" >mdi-sync</v-icon>&nbsp; Update Owner
            <v-alert 
              class="text-red"
              v-model="alert"
              border="start"
              variant="tonal"
              closable
              v-if="error"
            > 
              {{ error }} 
            </v-alert>
          </v-card-title>
          <v-text-field 
              class="pa-2 ma-2"
              v-model="updateOwners.name"
              label="Owner Name"
              variant="solo-inverted"
              @keyup.enter="createOwner"
            >
            </v-text-field>
            <div class="text-center">
              <v-btn
                class="bg-blue-darken-1"
                prepend-icon="mdi-update"
                text="Update"
                variant="outlined"
                @click="updateOwner"
              >
              </v-btn>
            </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogInactive" max-width="500px">
          <v-card
            class="elevation-12"
            variant="elevated"
          >
            <v-card-title 
              class="bg-cyan-darken-2 text-h5"
            >Change the status of Owner?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="blue-darken-2" 
                variant="text" 
                @click="dialogInactive=false"
              >
              <v-icon size="30">mdi-cancel</v-icon>
              </v-btn
              >
              <v-btn
                color="blue-darken-2"
                variant="text"
                @click="inactiveOwner"
              >
              <v-icon size="30">mdi-check</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
      </v-dialog>
    </v-container>
  </template>

<script>
import AxiosInstance from '@/services/AxiosInstance';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';

export default {
  data: () => ({
    loading: false,
    assets: {
      owner_id: '',
      asset_name: '',
      quantity: '',
      cogs: '',
      selling_price: '',
      description: '',
    },
    assetOwners: [],
    updateOwners: [],
    assetSummary: [],
    dialogOwner: false,
    dialogUpdateOwner: false,
    dialogInactive: false,
    ownerName: '',
    search: '',
    hasSaved: false,
    alert: false,
    error:'',
    ownerHeaders: [
      { title: 'No', align: 'start', key: 'number'},
      { title: 'Owner', align: 'start', key: 'name'},
      { title: 'Status', align: 'center', key: 'active_flag' },
      { title: 'Action', align: 'end', key: 'actions' },
    ],
    headers: [
      { title: 'No', align: 'start', key: 'number'},
      { title: 'Owner', align: 'start', key: 'owner_name'},
      { title: 'Asset Name', align: 'start', key: 'asset_name' },
      { title: 'Quantity', align: 'center', key: 'quantity' },
      { title: 'Buying Price', align: 'center', key: 'cogs' },
      { title: 'Selling Price', align: 'center', key: 'selling_price' },
      { title: 'Action', align: 'end', key: 'actions' },
    ],
  }),

  created() {
    this.assetOwnerLoad();
    this.assetSummaryLoad();
  },

  watch: {
      loading (val) {
        if (!val) return

        setTimeout(() => (this.loading = false), 500)
      },
    },

  methods: {

    editOwner(item) {
        this.updateOwners = item;
        this.dialogUpdateOwner = true
    }, 

    updateStatusOwner(item) {
      this.updateOwners = item;
      this.dialogInactive = true;
    },

    async assetOwnerLoad() {

      try {
          await AxiosInstance.get(`http://127.0.0.1:8000/api/assetowners/all`,
          {
              headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
          }
      })
      .then((response) => { //this.assetOwners = response.data.data; 

        if(response.status == 200){
          for(let i=0; i<response.data.data.length; i++) {
            if(response.data.data[i].active_flag =='N') {
              response.data.data[i].active_flag = null;
            }
            this.assetOwners = response.data.data[i];
          }
            this.assetOwners = response.data.data;
      }
      });

      } catch(error) {
          this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
          this.alert = true
      }
    },

    async assetSummaryLoad() {

      try {
          await AxiosInstance.get(`http://127.0.0.1:8000/api/assets/summary`,
          {
              headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
          }
      })
      .then((response) => { this.assetSummary = response.data.data; });

      } catch(error) {
          this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
          this.alert = true
      }
    },

    async createOwner() {

      let postData = {
        name: this.ownerName,
      }

      try {
          await AxiosInstance.post(`http://127.0.0.1:8000/api/assetowners`, postData,
          {
              headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
          }
      })
      .then((response) => { //this.assetOwners = response.data.data; 

        if(response.status == 201) {
          this.hasSaved = true;
          this.dialogOwner = false;
          this.ownerName = null;
          this.assetOwnerLoad();
        }
      });

      } catch(error) {
          this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
          this.alert = true
      }
    },
  
  async updateOwner() {

    let postData = {
      name: this.updateOwners.name,
    }

    try {
        await AxiosInstance.patch(`http://127.0.0.1:8000/api/assetowners/` +this.updateOwners.id, postData,
        {
            headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        }
    })
    .then((response) => { 

      if(response.status == 200) {
        this.hasSaved = true;
        this.dialogUpdateOwner = false;
        this.assetOwnerLoad();
      }
    });

    } catch(error) {
        this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
        this.alert = true
    }
  },

  async inactiveOwner() {

    try {
        await AxiosInstance.patch(`http://127.0.0.1:8000/api/assetowners/inactive/` +this.updateOwners.id, [],
        {
            headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        }
    })
    .then((response) => { 

      if(response.status == 200) {
        this.hasSaved = true;
        this.dialogInactive = false;
        this.assetOwnerLoad();
      }
    });

    } catch(error) {
        this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
        this.alert = true
    }
  },

  async createAsset() {

      let postData = this.assets;

      try {
          await AxiosInstance.post(`http://127.0.0.1:8000/api/assets`, postData,
          {
              headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
          }
      })
      .then((response) => {

        if(response.status == 201) {
          this.assets = [];
          this.hasSaved = true;
          this.assetSummaryLoad();
        }
      });

      } catch(error) {
          this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
          this.alert = true
      }
    },
  }
}
</script>