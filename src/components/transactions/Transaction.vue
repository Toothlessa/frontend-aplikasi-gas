<template>
  <v-container>
  <v-spacer></v-spacer>
    <v-row>
      <v-col
        xs="12"
      >
      <v-card 
        class="elevation-12 text-left" 
        width="280" 
        color="white" 
        variant="elevated"
      >
        <v-card-title 
          class="text-h5 font-weight-regular bg-teal-lighten-1"
        >
        <v-icon>mdi-chart-gantt</v-icon>
          Input Transaction
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
                    label="Customer"
                    v-model="selectedCustomer"
                    variant="outlined"       
                    :items="customers"
                    :disabled="!fieldDisabled"
                    item-title="customer_name"
                    item-value="id"
                    color="blue-grey"
                  >
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :subtitle="item.raw.nik"
                      :title="item.raw.customer_name"
                    ></v-list-item>
                  </template>
                </v-autocomplete>
                  <v-number-input
                    label="Qty"
                    type="number"
                    v-model="editedItem.quantity"
                    :disabled="!fieldDisabled"
                    variant="outlined"
                    color="blue-grey"
                    :reverse="false"
                    controlVariant="split"
                    @keyup.enter='save'
                  ></v-number-input>
                  <v-textarea
                    label="Description"
                    v-model="this.editedItem.description"
                    variant="outlined"       
                    :disabled="!fieldDisabled"
                    color="blue-grey"
                  >
                </v-textarea>
                  <v-autocomplete
                    v-model="editedItem.amount"
                    variant="outlined"
                    :items="harga"
                    item-title="name"
                    item-value="value"
                    :label="`Price — ${isEditAmt ? 'Editable' : 'Saved'}`"
                    :hint="!isEditAmt ? 'Click the icon to edit' : 'Click the icon to save'"
                    :readonly="!isEditAmt"
                    :disabled="!fieldDisabled"
                    persistent-hint
                    color="blue-grey"
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
                    color="orange"
                    v-model="hasSaved"
                    :timeout="2000"
                    location="top center"
                  >
                  Data have been saved
                  </v-snackbar>
                <v-row>
                  <v-col>
                    <v-checkbox
                      label="Send?"
                      v-model="isSend"
                      color="blue-grey"
                      @click="checkIsSend"
                      :disabled="!fieldDisabled"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn
                      class="text-white"
                      variant="elevated"
                      size="large"
                      rounded="lg"
                      color="blue-grey"
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
            <v-card-title class="text-h5 font-weight-regular bg-teal-lighten-1">
            <v-icon>mdi-chart-timeline</v-icon>
              Pick The Item
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
                :disabled="!fieldDisabled"
                prepend-icon="mdi-tooltip-edit-outline"
                persistent-hint
                color="blue-grey"
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
          <v-card class="elevation-12 font-weight-regular" width="mx-auto" color="white" variant="elevated">
            <v-card-title class="d-flex align-center pe-2 bg-teal-lighten-1" color="cyan-lighten-2">
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
          <!-- <v-divider class="mt-1"></v-divider> -->
          <v-dialog v-model="dialog" max-width="400px">
            <template v-slot:activator="{ props }">
                <v-btn class="text-white mb-2" color="blue-grey" variant="text" icon v-bind="props">
                  <v-icon size="30">mdi-calendar</v-icon>
                </v-btn>&nbsp;{{ dateTitle }} 
             </template>
            <v-container>
              <v-row justify="space-around">
                <v-date-picker
                  v-model="pickDate"
                  color="blue-grey"
                  min="2025-01-01"
                  @keyup.enter="getTransactionByDate(); close()"
                >
                </v-date-picker>
              </v-row>
            </v-container>
          </v-dialog>
                <v-data-table 
                  class="text-black"
                  v-model:search="search" 
                  :filter-keys="['description']" 
                  :headers="headers"
                  :items="transactions"
                  loading-text="Loading... Please wait"
                  :loading="loadingData"
                  hide-default-footer
                >
                <template v-slot:[`item.description`]="{ value }">
                  <v-chip 
                  :color="getColorByDescription(value)"
                  >
                    {{ value }}
                  </v-chip>
                </template>
                <template v-slot:[`item.input`]></template>
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-icon class="me-2" size="small" @click="editItem(item)"> 
                      mdi-pencil-outline
                     </v-icon>
                  </template>
                </v-data-table>
                <v-dialog
                  v-model="dialogUpdate"
                  transition="dialog-top-transition"
                >
                <v-card  
                  width="280" 
                  color="white" 
                  variant="elevated"
                >
                  <v-card-title 
                    class="text-h5 font-weight-regular bg-teal-lighten-1"
                  >
                  <v-icon>mdi-chart-gantt</v-icon>
                    Update Transaction
                  </v-card-title>
                    <v-card-item>
                      <v-alert 
                          class="text-teal"
                          v-model="alert"
                          variant="tonal"
                          closable
                          v-if="error"
                          > 
                          {{ error }} 
                      </v-alert>
                        <v-divider class="mt-1"></v-divider>
                            <v-autocomplete
                              label="Customer"
                              v-model="updateTrx.customer_id"
                              variant="outlined"       
                              :items="customers"
                              :disabled="!fieldDisabled"
                              item-title="customer_name"
                              item-value="id"
                              color="blue-grey"
                              @keyup.enter="save"
                            >
                            <template v-slot:item="{ props, item }">
                              <v-list-item
                                v-bind="props"
                                :subtitle="item.raw.nik"
                                :title="item.raw.customer_name"
                              ></v-list-item>
                            </template>
                          </v-autocomplete>
                            <v-number-input
                              label="Qty"
                              type="number"
                              v-model="updateTrx.quantity"
                              :disabled="!fieldDisabled"
                              variant="outlined"
                              color="blue-grey"
                              :reverse="false"
                              controlVariant="split"
                              @keyup.enter="save"
                            ></v-number-input>
                            <v-textarea
                              label="Description"
                              v-model="this.updateTrx.description"
                              variant="outlined"       
                              :disabled="!fieldDisabled"
                              color="blue-grey"
                            >
                          </v-textarea>
                            <v-autocomplete
                              v-model="updateTrx.amount"
                              variant="outlined"
                              :items="harga"
                              item-title="name"
                              item-value="value"
                              :label="`Price — ${isEditAmt ? 'Editable' : 'Saved'}`"
                              :hint="!isEditAmt ? 'Click the icon to edit' : 'Click the icon to save'"
                              :readonly="!isEditAmt"
                              :disabled="!fieldDisabled"
                              persistent-hint
                              color="blue-grey"
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
                          <v-row>
                            <v-col>
                              <v-checkbox
                                label="Send?"
                                v-model="isSend"
                                color="blue-grey"
                                @click="checkIsSend"
                                :disabled="!fieldDisabled"
                              >
                              </v-checkbox>
                            </v-col>
                            <v-col class="text-right">
                              <v-btn
                                class="text-white"
                                variant="elevated"
                                size="large"
                                rounded="lg"
                                color="blue-grey"
                                :disabled="isUpdateDisabled"
                                :loading="loadingButton"
                                @click="save"
                              >
                                  Update
                              </v-btn>
                            </v-col>
                          </v-row>
                      </v-card-item>
                    </v-card>
              </v-dialog>
              </v-card>
          </v-col>
          <v-spacer></v-spacer>
  </v-row>
</v-container>
</template>
<script>
import AxiosInstance from '@/services/AxiosInstance';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';
import { VNumberInput } from 'vuetify/lib/labs/components.mjs';
  
export default {
  data() {
        return {
            search: '',
            headers: [
                { title: 'Customer', align: 'start', key: 'customer_name'},
                { title: 'NIK', align: 'center', key: 'nik' },
                { title: 'Description', align: 'center', key: 'description'},
                { title: 'Qty', align: 'center', key: 'quantity' },
                { title: 'Price', align: 'start', key: 'amount' },
                { title: 'Total', align: 'start', key: 'total' },
                { title: 'Created', aligh: 'start', key: 'created_at'},
                { title: 'Actions', align: 'center', key: 'actions', sortable: false },
            ],
            // load data
            transactions: [],
            customers: [],
            mItems: [],
            //date
            pickDate : new Date(),
            dateTitle: '',
            //disable
            fieldDisabled: true,
            //dialog
            dialogUpdate: false,
            dialog: false,
            //field
            selectedCustomer:[],
            selectedItem:[],
            isEditAmt: false,
            isEditing: false,
            isSend: false,     
            //etc
            hasSaved: false,
            loadingButton: false,
            loadingData: true,
            alert: true,
            error:'',
            //
            updateTrx: [],
            editedIndex: -1,
            editedItem: {
                customer_id: null,
                customer_name: null,
                nik: null,
                description: null,
                quantity: null,
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
    
    components: {
      VNumberInput,
    },

    computed: {

      isSaveDisabled(){
        // return !(this.selectedCustomer && this.editedItem.quantity && this.editedItem.description)
        return !(this.selectedCustomer && this.editedItem.quantity)
      },

      isUpdateDisabled(){
        return !(this.updateTrx.customer_id && this.updateTrx.quantity && this.updateTrx.description)
      },

    },

    watch: {
      dialog(val) {
        val || this.close()
      },
    },

    created() {
      this.getCustomer();
      this.getTransactionByDate();
      this.getMasterItem();

      this.selectedItem = 1;
      this.editedItem.amount = 19000;
    },
    

    methods: {

        editItem(item) {
          console.log(item);
          this.editedIndex = this.transactions.indexOf(item);
          this.updateTrx = Object.assign({}, item);
          this.dialogUpdate = true;
        },

        close() {
            this.dialog = false;
        },

        checkIsSend() {
            if (!this.isSend){
            this.editedItem.amount = 20000;
          } else if(this.isSend) {
              this.editedItem.amount = 19000;
          }
        },

        getDateOptions(dateConv){
          let date = dateConv;
          let month = '' + (dateConv.getMonth()+1);
          let day = '' + (dateConv.getDate());
          let year = dateConv.getFullYear();

          if (month.length < 2) 
              month = '0' + month;
          if (day.length < 2) 
              day = '0' + day;

            date =  [year, month, day].join('-');

            return date;
          },


        getColorByDescription (description) {
          if(description == null)
            return 'white'
              
            if (description.toLowerCase().substring(0, 5) == "kirim") 
                return 'cyan'
            else if (description.toLowerCase().substring(0, 5) == "titip")
               return 'orange'
            else if (description.toLowerCase().substring(0, 5) == "pisah")
               return 'deep-purple'
            else if (description.toLowerCase().substring(0, 4) == "uang")
               return 'orange'
            else return 'green'
        },

        async getMasterItem() {

          try {
          await AxiosInstance.get(`http://127.0.0.1:8000/api/masteritems/itemtype/` + 'ITEM',
            {
                headers: {
                  'Content-Type': 'application/json', 
                  'Accept': 'application/json',
                  'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                }
              })
                .then((response) => {
                  this.mItems = response.data.data;
            });
          } catch(error) {
            this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
              this.alert = true;
          }
        },

        async getCustomer() {

            try{
            await AxiosInstance.get(`http://127.0.0.1:8000/api/customers/all`,
            {
                headers: {
                  'Content-Type': 'application/json', 
                  'Accept': 'application/json',
                  'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                }
              })
                .then((response) => {
                    this.customers = response.data.data
            });
            } catch(error) {
              this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
              this.alert = true;
            }
        },

        async save() {
          if (this.editedIndex > -1) {
            let postData = {
              customer_id: this.updateTrx.customer_id,
              quantity: this.updateTrx.quantity,
              description: this.updateTrx.description,
              amount: this.updateTrx.amount,
              total: this.updateTrx.amount * this.updateTrx.quantity,
          };

          try{ 

            let response = ''
            response = await AxiosInstance
              .patch('http://127.0.0.1:8000/api/transactions/'+this.updateTrx.id, postData,
                  {
                  headers: {
                  'Content-Type': 'application/json', 
                  'Accept': 'application/json',
                  'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                  },
              })
              if (response.status == 200) {
                this.getTransactionByDate();
                this.hasSaved = true;
                this.editedIndex = -1;
                this.dialogUpdate =false;
              }

              } catch (error) {
              this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
              this.alert = true;
              }
          } else {

            if (this.editedItem.quantity == null) {
              this.editedItem.quantity = 1;
            }

            if (this.editedItem.description == null) {
              this.editedItem.description = 'Umum';
            }

            let postData = {
              quantity: this.editedItem.quantity,
              description: this.editedItem.description,
              amount: this.editedItem.amount,
              total: this.editedItem.amount * this.editedItem.quantity,
            };

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
                this.getTransactionByDate();
                this.hasSaved = true
                this.selectedCustomer= null
                this.editedItem.quantity = null
                this.editedItem.description = null
              }
              } catch (error) {
              this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
              this.alert = true
              }
            }
            this.loadingButton = true;
            setTimeout(() => (this.loadingButton = false), 500);
            this.editedItem.amount = 19000;
        },

        getTransactionByDate() {
          
          try {
            AxiosInstance.get(`http://127.0.0.1:8000/api/transactions/today/`+ this.getDateOptions(this.pickDate),
              {
                headers: {
                  'Content-Type': 'application/json', 
                  'Accept': 'application/json',
                  'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                }
              })
              .then((response) => {
                    this.transactions = response.data.data;
                
                if(response.status == 200){
                    this.loadingData = false
                    
                const options = { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                };
                    
                this.dateTitle = this.pickDate.toLocaleDateString('id-ID', options);
                
                if(this.getDateOptions(new Date()) != this.getDateOptions(this.pickDate))  {
                    this.fieldDisabled = false;
                  } else {
                    this.fieldDisabled = true;
                  }
                }
            });
          } catch(error) {
            this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
            this.alert = true
          }
      },

    },
}
  </script>