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
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ props }">
          <v-btn class="text-white mb-2" color="cyan-darken-2" variant="elevated" v-bind="props">
            <v-icon size="40">mdi-new-box</v-icon>
          </v-btn>
      </template>
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
            >Apa anda yakin ingin menghapus item ini?</v-card-title
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
                @click="deleteItemConfirm"
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
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)"> mdi-pencil-outline </v-icon>
        <v-icon size="small" @click="deleteItem(item)"> mdi-delete-outline </v-icon>
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
                { title: 'Actions', key: 'actions', sortable: false },
            ],
            editedItem: {
                customer_name: '',
                nik: '',
                email: '',
                address: '',
                phone: 0,
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

    mounted() 
    {
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
                this.getAllData(response.data.data);

            if(response.status == 200){
              this.loadingData = false
            }
        });
    },

    methods: 
    {
        getAllData(customers) {
            for(let key in customers) {
                this.customers.push({ ...customers[key]})
            }
        },

        editItem(item) {
            this.editedIndex = this.customers.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.customers.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async deleteItemConfirm() {
          try{ 
                await AxiosInstance
                .delete('http://127.0.0.1:8000/api/customers/'+this.editedItem.id,
                    {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    },
                })

                this.customers.splice(this.editedIndex, 1)
                console.log('renanS')
                } catch (error) {
                this.error = Validations.getErrorMessageFromCode(
                    error.response.data.errors[0],
                this.alert = true
                );
                }
            this.closeDelete()
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

        async save() {
            if (this.editedIndex > -1) {
              let postData = this.editedItem;

              try{ 
              
              let response = '';
                
              response = await AxiosInstance
                .put('http://127.0.0.1:8000/api/customers/'+this.editedItem.id, postData,
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
                }
                // console.log(this.editedItem.id)
                } catch (error) {
                this.error = Validations.getErrorMessageFromCode(
                    error.response.data.errors[0],
                this.alert = true
                );
                }
            } else {
            let postData = this.editedItem;

                try{ 
                let response = '';
                response = await AxiosInstance
                .post('http://127.0.0.1:8000/api/customers', postData,
                    {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    },
                })

                if (response.status == 201) {
                  this.customers.push(this.editedItem)
                  this.close()
                  this.hasSaved = true
                }
                } catch (error) {
                this.error = Validations.getErrorMessageFromCode(
                    error.response.data.errors[0],
                this.alert = true
                );
                }
            }
        },
    },
}
</script>