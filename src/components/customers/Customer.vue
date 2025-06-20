<template>
  <v-container fluid>

    <!-- Toolbar Actions -->
    <v-toolbar 
      class="bg-pink-lighten-1 text-white"  
      rounded="lg"
    >
      <v-btn 
        style="color: white;"
        rounded="xl" 
        icon
        @click="openCreateDialog = true, this.editedItem = {}, this.error = '', this.editedIndex = -1;"
      >
          <v-icon>mdi-new-box</v-icon>
      </v-btn>

      <v-btn
        style="color: white;" 
        rounded="xl" 
        icon
        @click="dialogUploadCustomer = true, this.error = ''"
      >
        <v-icon>mdi-cloud-upload</v-icon>
      </v-btn>

      <v-spacer />

      <v-text-field
        v-model="search"
        label="Search by customer name"
        variant="solo-filled"
        class="mr-4"
        style="max-width: 500px;"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        flat
      />
    </v-toolbar>

    <!-- Error Snackbar -->
     <v-snackbar
        v-model="showError"
        :timeout="5000"
        color="red-darken-2"
        location="top center"
        multi-line
        elevation="6"
      >
        <ul class="pl-4 list-disc">
          <li v-for="(e, i) in error" :key="i">{{ e }}</li>
        </ul>
        <template #actions>
          <v-btn variant="text" icon @click="showError = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="hasSaved"
      :timeout="5000"
      color="green-accent-3"
      location="top center"
      multi-line
      elevation="6"
    >
      Data saved successfully!
    </v-snackbar>

    <!-- Customers Data Table -->
    <v-data-table-virtual
      :headers="headers"
      :items="customers"
      class="elevation-12 bg-pink-lighten-5 text-black"
      v-model:search="search" 
      :filter-keys="['customer_name']" 
      :loading="loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:[`item.active_flag`]="{ item }">
        <v-chip :color="item.active_flag ? 'green' : 'black'" size="small" label>
          {{ item.active_flag ? 'Active' : 'Inactive' }}
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon size="small" class="mr-2" @click="editItem(item)">mdi-pencil-outline</v-icon>
        <v-icon size="small" @click="updateStatusCustomer(item)">mdi-radioactive</v-icon>
      </template>
    </v-data-table-virtual>

    <!-- Create/Edit Customer Dialog -->
    <v-dialog v-model="openCreateDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 font-weight-regular bg-pink-lighten-1">
          <v-icon size="40">{{ formIcon }}</v-icon> {{ formTitle }}
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col v-for="field in fields" :key="field.model" cols="12" sm="6">
              <v-text-field
                v-model="editedItem[field.model]"
                :label="field.label"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="pink-lighten-1" variant="elevated" @click="openCreateDialog = false">Cancel</v-btn>
          <v-btn color="pink-lighten-1" variant="elevated" @click="onCreateCustomer">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete/Deactivate Customer Dialog -->
    <v-dialog v-model="dialogDeactivate" max-width="500px">
      <v-card class="elevation-12" variant="elevated">
        <v-card-title class="bg-pink-lighten-1 text-h5 text-center">
          Change Customer Status?
        </v-card-title>

        <v-card-actions class="justify-center">
          <v-btn icon color="pink-lighten-1" variant="text" @click="close">
            <v-icon size="30">mdi-cancel</v-icon>
          </v-btn>

          <v-btn icon color="pink-lighten-1" variant="text" @click="onDeactivateCustomer">
            <v-icon size="30">mdi-pokeball</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Upload CSV Dialog -->
    <v-dialog v-model="dialogUploadCustomer" max-width="500px">
      <v-card class="elevation-12 bg-pink-lighten-5" variant="elevated">
        <v-card-title class="bg-pink-lighten-1 text-white text-h5">
          Upload Customers
        </v-card-title>
        <v-card-text>
          <v-file-upload 
            title="Drag and Drop Here"
            browse-text="Local Filesystem"
            divider-text="Csv File Only"
            color="pink-lighten-5"
            icon="mdi-upload"
            accept=".csv"
          >
          </v-file-upload>
          <v-progress-linear
            v-if="uploading"
            indeterminate
            color="primary"
          ></v-progress-linear>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="pink-lighten-1" @click="dialogUploadCustomer = false, this.csvFile = null">Cancel</v-btn>
          <v-btn color="pink-lighten-1" @click="onUploadCustomer">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
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
        fields: [
          { model: 'customer_name', label: 'Customer Name' },
          { model: 'type', label: 'Type' },
          { model: 'nik', label: 'NIK' },
          { model: 'email', label: 'E-mail' },
          { model: 'address', label: 'Address' },
          { model: 'phone', label: 'Phone Number' },
        ],
        editedItem: {},
        editedIndex: -1,
        search: '',
        openCreateDialog: false,
        dialogDeactivate: false,
        dialogUploadCustomer: false,
        error: '',
        showError: false,
        //csv
        csvFile: null,
        uploading: false,
        }
      },

    created() {
      this.loadCustomer();
    },

    computed: {
      ...mapState('customer', ['customers', 'loading', 'error', 'hasSaved',]),

      formIcon() {return this.editedIndex === -1 ? 'mdi-new-box ' : 'mdi-update ';},
      formTitle() {return this.editedIndex === -1 ? 'Create Customer' : 'Edit Customer';},
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
      this.openCreateDialog = true;
    },

    close() {
      this.openCreateDialog = false;
      this.dialogDeactivate = false;
      this.editedItem = {};
      this.editedIndex = -1;
    },

    updateStatusCustomer(item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDeactivate = true
    },

    async onCreateCustomer() {
      this.error = "";
      try {
        await this.createCustomer(this.editedItem);
        this.openCreateDialog = false;
      } catch (error) {
        this.showError = true;
        this.error = error;
      }
    },

    async onDeactivateCustomer() {
      try {
        await this.deactivateCustomer(this.editedItem.id);
        this.dialogDeactivate = false;
      } catch (error) {
        this.showError = true;
        this.error = error;
      }
    },

     async onUploadCustomer() {
      if (!this.csvFile) return this.showError = true, this.error = ['Please select a CSV file to upload.'] ;
      this.uploading = true;
      try {
        await this.uploadCustomer(this.csvFile);
        this.dialogUploadCustomer = false;
        this.csvFile = null;
      } catch (e) {
        this.showError = true;
        this.error = Array.isArray(e) ? e : [e];
      } finally {
          this.uploading = false;
      }
    },

  },
}
</script>