<template>
  <v-container class="bg-blue-lighten-5">
    <v-divider></v-divider>
    <v-row no-gutters>
    <v-col>
      <v-card 
        class="elevation-12" 
        width="280" 
        color="white" 
        variant="elevated"
      >
        <v-card-title 
          class="text-h5 font-weight-regular bg-blue-grey"
        >
        <v-icon>mdi-chart-gantt</v-icon>
          Input Transaksi
        </v-card-title>
          <v-card-item>
            <v-alert 
                class="text-teal"
                v-model="alert"
                border="start"
                variant="tonal"
                closable
                v-if="error"
                > 
                {{ error }} 
            </v-alert>
              <v-divider class="mt-1"></v-divider>
                  <v-autocomplete
                    label="Pelanggan"
                    v-model="selectedCustomer"
                    variant="outlined"       
                    :items="customers"
                    item-title="customer_name"
                    item-value="id"
                    color="light-blue-darken-4"
                    clearable
                  >
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :subtitle="item.raw.nik"
                      :title="item.raw.customer_name"
                    ></v-list-item>
                  </template>
                </v-autocomplete>
                  <v-text-field
                    label="Qty"
                    type="number"
                    v-model="editedItem.quantity"
                    variant="outlined"
                    color="cyan-lighten-2"
                  ></v-text-field>
                  <v-text-field
                    label="Deskripsi"
                    v-model="editedItem.description"
                    variant="outlined"
                    :items="status" 
                    item-title="name" 
                    color="cyan-lighten-2"
                    clearable                    
                  >
                  </v-text-field>
                  <v-autocomplete
                    v-model="editedItem.amount"
                    variant="outlined"
                    :items="harga"
                    item-title="name"
                    item-value="value"
                    :label="`Harga — ${isEditAmt ? 'Editable' : 'Saved'}`"
                    :hint="!isEditAmt ? 'Click the icon to edit' : 'Click the icon to save'"
                    :readonly="!isEditAmt"
                    persistent-hint
                  >
                  <template v-slot:append>
                  <v-slide-x-reverse-transition mode="out-in">
                    <v-icon
                      :key="`icon-${isEditAmt}`"
                      :color="isEditAmt ? 'success' : 'info'"
                      :icon="isEditAmt ? 'mdi-check-outline' : 'mdi-circle-edit-outline'"
                      @click="isEditAmt = !isEditAmt"
                    ></v-icon>
                  </v-slide-x-reverse-transition>
                </template>
                  </v-autocomplete>
                  <v-snackbar
                    class="text-center"
                    v-model="hasSaved"
                    :timeout="2000"
                    location="top left"
                  >
                  Data telah tesimpan
                  </v-snackbar>
                <v-row>
                  <v-col>
                    <v-checkbox
                      label="Kirim"
                      v-model="isSend"
                      @click="checkIsSend"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn
                      class="text-white"
                      variant="elevated"
                      size="large"
                      rounded="lg"
                      color="cyan-lighten-2"
                      :disabled="isSaveDisabled"
                      :loading="loadingButton"
                      @click="save"
                    >
                        Save
                      <!-- <v-icon size="30">mdi-content-save</v-icon> -->
                    </v-btn>
                  </v-col>
                </v-row>
            </v-card-item>
          </v-card>
          <v-divider></v-divider>
          <v-card width="280" >
            <v-card-title class="text-h5 font-weight-regular bg-blue-grey">
            <v-icon>mdi-chart-timeline</v-icon>
              Pilih Item
            </v-card-title>

            <v-card-text>
              <div class="text-caption pa-3"></div>

              <v-autocomplete
                v-model="selectedItem"
                :items="mItems"
                item-title="item_name"
                item-value="id"
                :label="`Item — ${isEditing ? 'Editable' : 'Saved'}`"
                :readonly="!isEditing"
                :hint="!isEditing ? 'Click the icon to edit' : 'Click the icon to save'"
                prepend-icon="mdi-tooltip-edit-outline"
                persistent-hint
              >
                <template v-slot:append>
                  <v-slide-x-reverse-transition mode="out-in">
                    <v-icon
                      :key="`icon-${isEditing}`"
                      :color="isEditing ? 'success' : 'info'"
                      :icon="isEditing ? 'mdi-check-outline' : 'mdi-circle-edit-outline'"
                      @click="isEditing = !isEditing"
                    ></v-icon>
                  </v-slide-x-reverse-transition>
                </template>
              </v-autocomplete>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="elevation-12 font-weight-regular bg-blue-grey" width="810" color="white" variant="elevated">
            <v-card-title class="d-flex align-center pe-2" color="cyan-lighten-2">
              <v-icon icon="mdi-book-open" color="black"></v-icon> &nbsp; Data Transaksi
            <v-spacer></v-spacer>
            <v-text-field 
                v-model="search" 
                density="compact" 
                label="search by description" 
                prepend-inner-icon="mdi-magnify" 
                variant="solo-filled" 
                flat 
                >
            </v-text-field>
          </v-card-title>
                <v-data-table 
                  class="text-cyan-darken-4"
                  v-model:search="search" 
                  :filter-keys="['description']" 
                  :headers="headers"
                  :items="transactions"
                  loading-text="Loading... Please wait"
                  :loading="loadingData"
                >
                <template v-slot:[`item.input`]></template>
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-icon class="me-2" size="small" @click="editItem(item)"> mdi-pencil-outline </v-icon>
                  </template>
                </v-data-table>
              </v-card>
          </v-col>
  </v-row>
</v-container>
</template>
<script>
import AxiosInstance from '@/services/AxiosInstance';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';
  
export default {
  data() {
        return {
            search: '',
            headers: [
                { title: 'Pelanggan', align: 'start', key: 'customer_name'},
                { title: 'NIK', align: 'center', key: 'nik' },
                { title: 'Deskripsi', align: 'center', key: 'description'},
                { title: 'Qty', align: 'center', key: 'quantity' },
                { title: 'Harga', align: 'start', key: 'amount' },
                { title: 'Total', align: 'start', key: 'total' },
                { title: 'Created', aligh: 'start', key: 'created_at'},
                { title: 'Actions', align: 'center', key: 'actions', sortable: false },
            ],
            transactions: [],
            customers: [],
            mItems: [],
            selectedCustomer:[],
            selectedItem:[],
            isEditAmt: false,
            isEditing: false,
            alert: true,
            error:'',
            hasSaved: false,
            isSend: false,
            loadingButton: false,
            loadingData: true,
            editedIndex: -1,
            editedItem: {
                customer_name: '',
                nik: '',
                description: '',
                quantity: '',
                amount: 0,
                total: 0,
                created_at: '',
            },
            harga: [
              {
                name: "Rp.16.000",
                value: 16000,
              },
              {
                name: "Rp.17.000",
                value: 17000,
              },
              {
                name: "Rp.18.000",
                value: 18000,
              },
              {
                name: "Rp.19.000",
                value: 19000,
              },
              {
                name: "Rp.20.000",
                value: 20000,
              },
            ],
            }
        },

    computed: {
      // formTitle() {
      //   return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      // },

      isSaveDisabled(){
        return !(this.selectedCustomer && this.editedItem.quantity && this.editedItem.description)
      }
    },
    
    mounted() 
    {
        //get today transactions
        AxiosInstance.get(`http://127.0.0.1:8000/api/transactions/today`,
        {
            headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            }
          }
        )
            .then((response) => {
                this.getAllData(response.data.data);
            
            if(response.status == 200){
                this.loadingData = false
            }
        });
       
        //get all customer data
        AxiosInstance.get(`http://127.0.0.1:8000/api/customers/all`,
        {
            headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            }
          }
        )
            .then((response) => {
                this.getCustData(response.data.data);
        });

        //get all item data
        AxiosInstance.get(`http://127.0.0.1:8000/api/masteritems/all`,
        {
            headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            }
          }
        )
            .then((response) => {
                this.getMItemData(response.data.data);
        });
         //set default value
         this.editedItem.amount = 19000;
         this.selectedItem = 284;
    },

    methods: 
    {

        getAllData(transactions) {
            for(let key in transactions) {
                this.transactions.push({ ...transactions[key]})
            }
        },

        getCustData(customers) {
            for(let key in customers) {
                this.customers.push({ ...customers[key],})
            }
        },

        getMItemData(mItems) {
            for(let key in mItems) {
                this.mItems.push({ ...mItems[key],})
            }
        },

        editItem(item) {
            this.editedIndex = this.transactions.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.selectedCustomer = Object.assign({}, item) 
        },

        async save() {
            if (this.editedIndex > -1) {
              let postData = {
                quantity: this.editedItem.quantity,
                description: this.editedItem.description,
                amount: this.editedItem.amount,
                total: this.editedItem.amount * this.editedItem.quantity,
              };

              try{ 

              let response = ''
              response = await AxiosInstance
                .patch('http://127.0.0.1:8000/api/transactions/'+this.editedItem.id, postData,
                    {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    },
                })
                if (response.status == 200) {
                  Object.assign(this.transactions[this.editedIndex], this.editedItem)
                  this.hasSaved = true
                  this.selectedCustomer= null
                  this.editedItem.quantity = null
                  this.editedItem.description = null
                }

                } catch (error) {
                this.error = Validations.getErrorMessageFromCode(
                    error.response.data.errors[0],
                );
                }
            } else {
              let postData = {
                quantity: this.editedItem.quantity,
                description: this.editedItem.description,
                amount: this.editedItem.amount,
                total: this.editedItem.amount * this.editedItem.quantity,
              };
                console.log(this.selectedItem);
                console.log(this.selectedCustomer);

              try{ 

              let response =''
              response = await AxiosInstance
                .post('http://127.0.0.1:8000/api/transactions/'+this.selectedItem+'/customer/'+this.selectedCustomer, postData,
                    {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    },
                })

                if (response.status == 201) {
                  // this.editedItem.created_at = response.data.data.created_at//new Date().toLocaleTimeString()
                  this.transactions.push(response.data.data)
                  this.hasSaved = true
                  this.selectedCustomer= null
                  this.editedItem.quantity = null
                  this.editedItem.description = null
                }
                } catch (error) {
                this.error = Validations.getErrorMessageFromCode(
                    error.response.data.errors[0],
                );
                this.alert = true
                }
              }
              this.loadingButton = true
              setTimeout(() => (this.loadingButton = false), 500)
            },

            checkIsSend() {
              if (!this.isSend){
               this.editedItem.amount = 20000;
            } else if(this.isSend) {
                this.editedItem.amount = 19000;
            }
            }
          },
        }
  </script>