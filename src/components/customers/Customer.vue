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
        v-model="hasSaved"
        :timeout="2000"
        location="top center"
      >
      Data telah tesimpan
      </v-snackbar>
    </v-card-title>
  <v-divider class="mt-1"></v-divider>
        <v-row>
          <div class="text-left pa-2 ma-2">
            <v-btn class="text-white mb-2" color="cyan-darken-2" variant="elevated" @click="dialog=true">
              <v-icon size="40">mdi-new-box</v-icon>
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <div class="text-end pa-2 ma-2">
            <v-btn class="text-white mb-2" color="cyan-darken-2" variant="elevated" @click="dialogUploadCustomer=true">
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
                <v-card-text>
                  <v-file-upload 
                    scrim="primary"
                    v-model="csvFile"
                    accept=".csv"
                    @change="uploadFile"
                  >
                  </v-file-upload>
                  <v-progress-linear
                    v-if="uploading"
                    indeterminate
                    color="primary"
                  ></v-progress-linear>
                  <v-alert
                    v-if="uploadError"
                    type="error"
                    dismissible
                  >
                    {{ uploadError }}
                  </v-alert>
                  <v-alert
                    v-if="uploadSuccess"
                    type="success"
                    dismissible
                  >
                    {{ uploadSuccess }}
                  </v-alert>
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
              {{ error }} 
            </v-alert>
            <v-container>
              <v-text-field
                v-model="editedItem.customer_name"
                label="Customer Name"
                variant="outlined"
                @keyup.enter="save"
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
                    @keyup.enter="save"
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
                <v-btn class="text-white mb-2" color="cyan-darken-2" variant="elevated" @click="close">
                  Cancel
                </v-btn>
                <v-btn class="text-white mb-2" color="cyan-darken-2" variant="elevated" @click.prevent="save">
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
                @click="closeDelete"
              >
              <v-icon size="30">mdi-cancel</v-icon>
              </v-btn
              >
              <v-btn
                color="blue-darken-2"
                variant="text"
                @click="updateStatusCustomerConfirm"
              >
              <v-icon size="30">mdi-pokeball</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
      </v-dialog>
      <!-- Dialog add category -->
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
import { LOAD_CUSTOMER_DATA } from '@/store/storeconstant';
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
        hasSaved: false,
        error:'',
        //csv
        csvFile: null,
        uploading: false,
        uploadError: null,
        uploadSuccess: null,
        }
      },


    created() {
      this.loadCustomer();
      console.log("created");
    },

    computed: {
      ...mapState('customer', ['customers', 'loading', 'error', 'successMessage']),

      formTitle() {return this.editedIndex === -1 ? 'mdi-new-box' : 'mdi-update'},
    },

    methods: 
    {
        ...mapActions('customer', {
      loadCustomer : LOAD_CUSTOMER_DATA
    }),
  },
}
</script>