<template>
    <v-card flat>
        <v-card-title class="text-teal d-flex align-center pe-2">
            <v-icon icon="mdi-face-agent"></v-icon> &nbsp; Customer

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
        </v-card-title>
        <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
         <v-spacer></v-spacer>
         <div class="text-right">
        <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ props }">
                    <v-btn class="text-teal mb-2" variant="tonal" v-bind="props">
                        customer baru
                    </v-btn>
                </template>
                <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
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
              <v-container>
                <!-- <v-row> -->
                  <!-- <v-col cols="12" md="4" sm="6"> -->
                    <v-text-field
                      v-model="editedItem.customer_name"
                      label="Nama Customer"
                    ></v-text-field>
                  <!-- </v-col> -->
                  <!-- <v-col cols="12" md="4" sm="6"> -->
                    <v-text-field
                      v-model="editedItem.nik"
                      label="NIK"
                    ></v-text-field>
                  <!-- </v-col> -->
                  <!-- <v-col cols="12" md="4" sm="6"> -->
                    <v-text-field
                      v-model="editedItem.email"
                      label="E-mail"
                    ></v-text-field>
                  <!-- </v-col> -->
                  <!-- <v-col cols="12" md="4" sm="6"> -->
                    <v-text-field
                      v-model="editedItem.address"
                      label="Alamat"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.phone"
                      label="Handphone"
                    ></v-text-field>
                  <!-- </v-col> -->
                <!-- </v-row> -->
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click.prevent="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
         </v-dialog>
         <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </div>

        <v-divider></v-divider>
        <v-data-table 
        v-model:search="search" 
        :filter-keys="['customer_name']" 
        :headers="headers"
        :items="customers">

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
            search: '',
            headers: [
                { title: 'Nama Customer', align: 'start', key: 'customer_name' },
                { title: 'NIK', align: 'start', key: 'nik' },
                { title: 'E-mail', align: 'start', key: 'email' },
                { title: 'Alamat', align: 'start', key: 'address' },
                { title: 'Handphone', align: 'center', key: 'phone'},
                { title: 'Actions', key: 'actions', sortable: false },
            ],
            customers: [],
            dialog: false,
            dialogDelete: false,
            error:'',
            editedIndex: -1,
            editedItem: {
                customer_name: '',
                nik: '',
                email: '',
                address: '',
                phone: 0,
            },
            defaultItem: {
              customer_name: '',
                nik: '',
                email: '',
                address: '',
                phone: 0,
            },
            }
        },
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
                await AxiosInstance
                .put('http://127.0.0.1:8000/api/customers/'+this.editedItem.id, postData,
                    {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    },
                })

                Object.assign(this.customers[this.editedIndex], this.editedItem)
                this.close()
                // console.log(this.editedItem.id)
                // console.log('renanS')
                } catch (error) {
                this.error = Validations.getErrorMessageFromCode(
                    error.response.data.errors[0],
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
                  this.getAllData()
                  this.close()
                }
                } catch (error) {
                this.error = Validations.getErrorMessageFromCode(
                    error.response.data.errors[0],
                );
                }
            }
        },
    },
}
</script>