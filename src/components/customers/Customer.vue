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
          <v-btn class="text-white mb-2" color="cyan-darken-2" variant="elevated" @click="dialog=true">
            <v-icon size="40">mdi-new-box</v-icon>
          </v-btn>
    <v-dialog v-model="dialog" max-width="500px">
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
            label="Nama Customer"
            variant="outlined"
          >
          </v-text-field>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="editedItem.nik"
                label="NIK"
                variant="outlined"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="editedItem.email"
                label="E-mail"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
              <v-text-field
                v-model="editedItem.address"
                label="Alamat"
                variant="outlined"
              >
            </v-text-field>
              <v-text-field
                v-model="editedItem.phone"
                label="Handphone"
                variant="outlined"
              ></v-text-field>
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
    <v-data-table 
      v-model:search="search" 
      :filter-keys="['customer_name']" 
      :headers="headers"
      :items="customers"
      loading-text="Loading... Please wait"
      :loading="loadingData"
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
import AxiosInstance from '@/services/AxiosInstance';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';

    export default {
    data() {
      return {
        headers: [
          { title: 'Nama Customer', align: 'start', key: 'customer_name' },
          { title: 'NIK', align: 'start', key: 'nik' },
          { title: 'E-mail', align: 'start', key: 'email' },
          { title: 'Alamat', align: 'start', key: 'address' },
          { title: 'Handphone', align: 'center', key: 'phone'},
          { title: 'Status', align: 'center', key: 'active_flag'},
          { title: 'Actions', key: 'actions', sortable: false },
        ],
        editedItem: {
          customer_name: '',
          nik: 0,
          email: '',
          address: '',
          phone: 0,
          active_flag: '',
        },
        editedIndex: -1,
        search: '',
        customers: [],
        dialog: false,
        dialogDelete: false,
        alert: true,
        hasSaved: false,
        loadingData: true,
        error:'',
        }
      },
    
    created() {
      this.getCustomerAll();
    },

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'mdi-new-box' : 'mdi-update'
        },
    },

    watch: {
      dialog(val) {
        val || this.close()
      },
      dialogDelete(val) {
        val || this.closeDelete()
      },
    },

    methods: 
    {

      editItem(item) {
        this.editedIndex = this.customers.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      updateStatusCustomer(item) {
        this.editedIndex = this.customers.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        })
      },

      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        })
      },

      async getCustomerAll() {

        try {
          AxiosInstance.get(`http://127.0.0.1:8000/api/customers/all`,
          {
              headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
              }
            })
              .then((response) => {

                if(response.status == 200){
                  for(let i=0; i<response.data.data.length; i++) {
                    if(response.data.data[i].active_flag =='N') {
                      response.data.data[i].active_flag = null;
                    }
                    this.customers = response.data.data[i];
                }
                this.customers = response.data.data;
                this.loadingData = false
              }
          });
        }catch(error) {
          this.error = Validations.getErrorMessageFromCodeCustomer(error.response.data.errors[0],);
          this.alert = true
        }
      },

      async updateStatusCustomerConfirm() {
        try{ 
          await AxiosInstance
          .patch('http://127.0.0.1:8000/api/customers/inactive/'+this.editedItem.id, [],
            {
              headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
              },
          })
          .then((response) => {

            if(response.status == 200){
              this.getCustomerAll();
            }
          })

          this.customers.splice(this.editedIndex, 1)
        } catch (error) {
        this.error = Validations.getErrorMessageFromCodeCustomer(error.response.data.errors[0],);
        this.alert = true
        }
        
        this.closeDelete()
      },

      async save() {
        if (this.editedIndex > -1) {
          let postData = {
            customer_name: this.editedItem.customer_name,
            nik: this.editedItem.nik,
            email: this.editedItem.email,
            address: this.editedItem.address,
            phone: this.editedItem.phone,
          }
          try{ 
          let response = '';
          response = await AxiosInstance.put('http://127.0.0.1:8000/api/customers/'+this.editedItem.id, postData,
            {
            headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            },
          });
          
          if(response.status == 200){
            Object.assign(this.customers[this.editedIndex], this.editedItem);
            this.close();
            this.hasSaved = true;
            this.getCustomerAll();
            }
            
          } catch (error) {
            this.error = Validations.getErrorMessageFromCodeCustomer(error.response.data.errors[0],);
            this.alert = true
            }
          } else {
            let postData = {
              customer_name: this.editedItem.customer_name,
              nik: this.editedItem.nik,
              email: this.editedItem.email,
              address: this.editedItem.address,
              phone: this.editedItem.phone,
            }
            try{ 
              let response = '';
              response = await AxiosInstance.post('http://127.0.0.1:8000/api/customers', postData,
                {
                headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                },
            })

              if (response.status == 201) {
                this.getCustomerAll();
                this.hasSaved = true
                this.close()
              }
              } catch (error) {
              this.error = Validations.getErrorMessageFromCodeCustomer(error.response.data.errors);
              this.alert = true
              }
        }
      },
    },
}
</script>