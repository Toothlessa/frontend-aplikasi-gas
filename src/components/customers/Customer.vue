<template>
  <v-container fluid>

    <!-- Toolbar Actions -->
     <ToolbarSimple
      title="Manage Customers"
      icon="mdi-new-box"
      :color="'bg-pink-darken-2'"
      :search="search"
      :showUploadButton="true"
      @update:search="search = $event"
      @create="
        DialogOpenCreate = true;
        // resetEditedItem();
        error = '';
        editedIndex = -1;
      "
    />

    <!-- Error Snackbar -->
     <SnackbarError :messages="Array.isArray(error) ? error : [error]" v-model="showError" :timeout="4000" />
     
    <!-- Success Snackbar -->
     <SnackbarSuccess v-model="hasSaved" message="Item has been saved successfully!" />

      <!-- Master Item Table -->
     <TableSimple
      :headers="headersLocal"
      :items="customers"
      :search="search"
      :loading="loading"
      :bgcolor="'bg-pink-lighten-5'"
      @edit="editItem"
      @submit="onCreateItem"
      @deactivate="deactivateItem"
    />
</v-container>
</template>

<script setup lang="ts">
import { SnackbarError, SnackbarSuccess, ToolbarSimple, TableSimple } from '@/components/globalComponent';
import store from '@/store/store';
import { computed, onMounted, ref } from 'vue';
import { 
  LOAD_CUSTOMER_DATA,
  SET_HASSAVED,
} from '@/store/storeconstant';
import { Customer, HeadersCustomer } from '@/types';

//Variable
const headersLocal = HeadersCustomer; // Use the imported headers directly
const search = ref<string>('');
const editedIndex = ref(-1);

const hasSaved = computed({
  get: () => store.state.customer.hasSaved,
  set: (val: boolean) => {
    store.commit(`Customer/${SET_HASSAVED}`, val);
  },
});

const error = ref<string | string[]>('');
const showError = ref<boolean>(false);

//DIalog
const DialogOpenCreate = ref<boolean>(false);

//computed
const customers = computed<Customer[]>(() => store.state.customer.customers);
const loading = computed<Customer[]>(() => store.state.customer.loading);

const loadCustomerData = () => store.dispatch(`customer/${LOAD_CUSTOMER_DATA}`);

onMounted(() => {
  loadCustomerData();
});

// import { 
//   LOAD_CUSTOMER_DATA,
//   CREATE_CUSTOMER,
//   DEACTIVATE_CUSTOMER,
//   UPLOAD_CUSTOMER,
// } from '@/store/storeconstant';
// import { 
//   mapActions,
//   mapState,
// } from 'vuex';

//     export default {
//     data() {
//       return {
//         headers: [
//           { title: 'Customer Name', align: 'start', key: 'customer_name' },
//           { title: 'Type', align: 'start', key: 'type' },
//           { title: 'NIK', align: 'start', key: 'nik' },
//           { title: 'E-mail', align: 'start', key: 'email' },
//           { title: 'Address', align: 'start', key: 'address' },
//           { title: 'Handphone', align: 'center', key: 'phone'},
//           { title: 'Status', align: 'center', key: 'active_flag'},
//           { title: 'Actions', key: 'actions', sortable: false },
//         ],
//         fields: [
//           { model: 'customer_name', label: 'Customer Name' },
//           { model: 'type', label: 'Type' },
//           { model: 'nik', label: 'NIK' },
//           { model: 'email', label: 'E-mail' },
//           { model: 'address', label: 'Address' },
//           { model: 'phone', label: 'Phone Number' },
//         ],
//         editedItem: {},
//         editedIndex: -1,
//         search: '',
//         openCreateDialog: false,
//         dialogDeactivate: false,
//         dialogUploadCustomer: false,
//         error: '',
//         showError: false,
//         //csv
//         csvFile: null,
//         uploading: false,
//         }
//       },

//     created() {
//       this.loadCustomer();
//     },

//     computed: {
//       ...mapState('customer', ['customers', 'loading', 'error', 'hasSaved',]),

//       formIcon() {return this.editedIndex === -1 ? 'mdi-new-box ' : 'mdi-update ';},
//       formTitle() {return this.editedIndex === -1 ? 'Create Customer' : 'Edit Customer';},
//     },   

//     methods: 
//     {
//       ...mapActions('customer', {
//           loadCustomer : LOAD_CUSTOMER_DATA,
//           createCustomer: CREATE_CUSTOMER,
//           deactivateCustomer: DEACTIVATE_CUSTOMER,
//           uploadCustomer: UPLOAD_CUSTOMER,
//      }),

//     editItem(item) {
//       this.editedIndex = this.customers.indexOf(item);
//       this.editedItem = { ...item };
//       this.openCreateDialog = true;
//     },

//     close() {
//       this.openCreateDialog = false;
//       this.dialogDeactivate = false;
//       this.editedItem = {};
//       this.editedIndex = -1;
//     },

//     updateStatusCustomer(item) {
//       this.editedIndex = this.customers.indexOf(item)
//       this.editedItem = Object.assign({}, item)
//       this.dialogDeactivate = true
//     },

//     async onCreateCustomer() {
//       this.error = "";
//       try {
//         await this.createCustomer(this.editedItem);
//         this.openCreateDialog = false;
//       } catch (error) {
//         this.showError = true;
//         this.error = error;
//       }
//     },

//     async onDeactivateCustomer() {
//       try {
//         await this.deactivateCustomer(this.editedItem.id);
//         this.dialogDeactivate = false;
//       } catch (error) {
//         this.showError = true;
//         this.error = error;
//       }
//     },

//      async onUploadCustomer() {
//       if (!this.csvFile) return this.showError = true, this.error = ['Please select a CSV file to upload.'] ;
//       this.uploading = true;
//       try {
//         await this.uploadCustomer(this.csvFile);
//         this.dialogUploadCustomer = false;
//         this.csvFile = null;
//       } catch (e) {
//         this.showError = true;
//         this.error = Array.isArray(e) ? e : [e];
//       } finally {
//           this.uploading = false;
//       }
//     },

//   },
// }
</script>