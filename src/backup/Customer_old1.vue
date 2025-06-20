<template>
  <v-card 
    class="elevation-12"  
    color="white" 
    variant="elevated"
  >
    <v-card-title class="bg-cyan-darken-2 text-white d-flex align-center pe-2">
      <v-icon icon="mdi-face-agent"></v-icon> &nbsp; Customer
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field 
        v-model="search" 
        density="compact" 
        label="search by name" 
        prepend-inner-icon="mdi-magnify" 
        variant="solo-filled" 
        flat 
      >
      </v-text-field>
      <v-snackbar
        class="text-center"
        v-model="this.hasSaved"
        location="top center"
      >
      Data telah tesimpan
      </v-snackbar>
    </v-card-title>
  <v-divider class="mt-1"></v-divider>
        <v-row>
          <div class="text-left pa-2 ma-2">
            <v-btn class="text-white mb-2" color="cyan-darken-2" variant="elevated" @click="dialog=true, this.editedItem = {}, this.error = ''">
              <v-icon size="40">mdi-new-box</v-icon>
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <div class="text-end pa-2 ma-2">
            <v-btn class="text-white mb-2" color="cyan-darken-2" variant="elevated" @click="dialogUploadCustomer=true, this.error = ''">
              <v-icon size="40">mdi-cloud-upload</v-icon>
            </v-btn>
          </div>
      </v-row>
      <v-dialog v-model="dialogUploadCustomer">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
              <v-card>
                <v-card-title text-center>Upload CSV</v-card-title>
                 <v-alert
                    v-if="error"
                    type="error"
                    class="text-cyan-darken-2"
                    v-model="alert"
                    border="start"
                    variant="tonal"
                    closable
                  >
                    {{ error }}
                  </v-alert>
                  <v-alert
                    v-if="successMessage"
                    type="success"
                    class="text-cyan-darken-2"
                    v-model="successCsv"
                    border="start"
                    variant="tonal"
                    closable
                  >
                    {{ successMessage }}
                  </v-alert>
                <v-card-text>
                  <v-file-upload 
                    scrim="primary"
                    v-model="csvFile"
                    accept=".csv"
                    @change="onUploadCustomer"
                  >
                  </v-file-upload>
                  <v-progress-linear
                    v-if="uploading"
                    indeterminate
                    color="primary"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-dialog>
    <v-dialog 
      v-model="dialog" 
      max-width="500px">
      <v-card
        class="elevation-12"
        variant="elevated"
      >
        <v-card-title class="text-h5 font-weight-regular bg-cyan-darken-2">
          <v-icon size="40">{{ formTitle }}</v-icon>
        </v-card-title>
          <v-card-text>
            <v-alert 
              class="text-cyan-darken-2"
              v-model="alert"
              border="start"
              variant="tonal"
              closable
              v-if="error"
            >
              <ul class="pl-4 list-disc">
                <li v-for="(e, i) in error" :key="i">{{ e }}</li>
              </ul>
            </v-alert>
            <v-container>
              <v-text-field
                v-model="editedItem.customer_name"
                label="Customer Name"
                variant="outlined"
                @keyup.enter="onCreateCustomer"
              >
              </v-text-field>
              <v-row>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field
                    v-model="editedItem.type"
                    label="Type"
                    variant="outlined"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field
                    v-model="editedItem.nik"
                    label="NIK"
                    variant="outlined"
                  >
                  </v-text-field>
                </v-col>
              </v-row> 
              <v-row>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field
                    v-model="editedItem.email"
                    label="E-mail"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                <v-text-field
                    v-model="editedItem.phone"
                    label="Handphone"
                    variant="outlined"
                    @keyup.enter="onCreateCustomer"
                  ></v-text-field>
                </v-col>
              </v-row>
                <v-textarea
                    v-model="editedItem.address"
                    label="Address"
                    variant="outlined"
                  >
                  </v-textarea>
            </v-container>
            </v-card-text>
              <v-card-actions>
                <v-btn class="text-white mb-2" color="cyan-darken-2" variant="elevated" 
                @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn class="text-white mb-2" color="cyan-darken-2" variant="elevated" 
                @click.prevent="onCreateCustomer">
                  Save
                </v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card
            class="elevation-12"
            variant="elevated"
          >
            <v-card-title 
              class="bg-cyan-darken-2 text-h5"
            >Change the status of this cutomer?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="blue-darken-2" 
                variant="text" 
                @click="close"
              >
              <v-icon size="30">mdi-cancel</v-icon>
              </v-btn
              >
              <v-btn
                color="blue-darken-2"
                variant="text"
                @click="onDeactivateCustomer"
              >
              <v-icon size="30">mdi-pokeball</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
      </v-dialog>
    <v-data-table 
      v-model:search="search" 
      :filter-keys="['customer_name']" 
      :headers="headers"
      :items="customers"
      loading-text="Loading... Please wait"
      :loading="loading"
    >
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
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon size="small" @click="editItem(item)"> mdi-pencil-outline </v-icon>
        <v-icon size="small" @click="updateStatusCustomer(item)"> mdi-radioactive </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { 
  LOAD_CUSTOMER_DATA,
  CREATE_CUSTOMER,
  DEACTIVATE_CUSTOMER,
  UPLOAD_CUSTOMER,
} from '@/store/storeconstant';
import { 
  mapActions,
  mapState,
} from 'vuex';

    export default {
    data() {
      return {
        headers: [
          { title: 'Customer Name', align: 'start', key: 'customer_name' },
          { title: 'Type', align: 'start', key: 'type' },
          { title: 'NIK', align: 'start', key: 'nik' },
          { title: 'E-mail', align: 'start', key: 'email' },
          { title: 'Address', align: 'start', key: 'address' },
          { title: 'Handphone', align: 'center', key: 'phone'},
          { title: 'Status', align: 'center', key: 'active_flag'},
          { title: 'Actions', key: 'actions', sortable: false },
        ],
        editedItem: {
          customer_name: '',
          type: '',
          nik: 0,
          email: '',
          address: '',
          phone: 0,
          active_flag: '',
        },
        editedIndex: -1,
        search: '',
        dialog: false,
        dialogDelete: false,
        dialogUploadCustomer: false,
        alert: true,
        successCsv: true,
        error: '',
        //hasSaved: false,
        //csv
        csvFile: null,
        uploading: false,
        uploadError: null,
        uploadSuccess: null,
        }
      },

    created() {
      this.loadCustomer();
    },

    computed: {
      ...mapState('customer', ['customers', 'loading', 'error', 'successMessage', 'hasSaved',]),

      formTitle() {return this.editedIndex === -1 ? 'mdi-new-box' : 'mdi-update'},
    },   
    
    watch: {
      // Watch for changes in the customers array
      customers: {
        handler(newVal) {
          //console.log("Customers updated:", newVal);
        },
        deep: true, // Deep watch to catch changes in nested objects
      },
    },

    methods: 
    {
      ...mapActions('customer', {
          loadCustomer : LOAD_CUSTOMER_DATA,
          createCustomer: CREATE_CUSTOMER,
          deactivateCustomer: DEACTIVATE_CUSTOMER,
          uploadCustomer: UPLOAD_CUSTOMER,
     }),

    editItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.dialogDelete = false;
      this.editedItem = {};
      this.editedIndex = -1;
    },

    async onCreateCustomer() {
      this.error = "";
      try {
        await this.createCustomer(this.editedItem);
        this.dialog = false;
      } catch (error) {
        this.alert = true;
        this.error = error;
      }
    },

     updateStatusCustomer(item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async onDeactivateCustomer() {
      try {
        await this.deactivateCustomer(this.editedItem.id);
        this.dialogDelete = false;
      } catch (err) {
        // Handle error message if needed
      }
    },

     async onUploadCustomer() {
      try {
        await this.uploadCustomer(this.csvFile);
        this.successCsv = true;
      } catch (error) {
        //console.log('Error uploading CSV:', error);
        this.successCsv = false;
        this.alert = true;
        this.error = error;
      } 
    },

  },
}
</script>