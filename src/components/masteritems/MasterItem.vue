<template>
  <v-card
    class="elevation-12"  
    color="white" 
    variant="elevated"
  >
    <v-card-title class="text-white bg-grey-darken-2 d-flex align-center pe-2">
      <v-icon icon="mdi-blur-linear"></v-icon>  &nbsp; Master Item
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
        location="center"
      >
      Data have been saved
      </v-snackbar>
    </v-card-title>
    <v-divider class="mt-1"></v-divider>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ props }">
            <v-btn class="text-white mb-2" color="grey-darken-2" variant="elevated" v-bind="props">
              <v-icon size="40">mdi-new-box</v-icon>
            </v-btn>
        </template>
        <v-card
          class="elevation-12"  
          color="white" 
          variant="elevated"
        >
          <v-card-title class="text-h5 font-weight-regular bg-grey-darken-2">
            <v-icon size="40">{{ formTitle }}</v-icon>
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
              <v-text-field
                v-model="editedItem.item_name"
                label="Item Name"
                variant="outlined"
              ></v-text-field>
            <v-row>
              <v-col cols="12" md="6" sm="6">
              <v-autocomplete
                label="Item Type"
                v-model="this.editedItem.item_type"
                variant="outlined"       
                :items="item_type"
                item-title="name"
              >
              </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" sm="6">
              <v-autocomplete
                label="Category"
                v-model="this.editedItem.category_id"
                variant="outlined"       
                :items="categoryItems"
                item-title="name"
                item-value="id"
              >
              </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  v-model="editedItem.cost_of_goods_sold"
                  label="Cost of Goods"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  v-model="editedItem.selling_price"
                  label="Selling Price"
                  variant="outlined"
                  @keyup.enter="save"
                ></v-text-field>
              </v-col>
            </v-row>
            </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn prepend-icon="mdi-shape-plus" label="Save" color="grey-darken-2" variant="outlined" @click="dialogCategory=true">
                  Add Category
                </v-btn>
                <v-btn color="grey-darken-2" variant="outlined" @click="close">
                  <v-icon size="30">mdi-cancel</v-icon>
                </v-btn>
                <v-btn label="Save" color="grey-darken-2" variant="outlined" @click.prevent="save">
                  <v-icon size="30">mdi-content-save</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogUpdateItem" max-width="500px">
            <v-card
            class="elevation-12"
            variant="elevated"
          >
            <v-card-title 
              class="bg-grey-darken-2 text-h5"
            >Are you sure to change the status of this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="grey" 
                variant="text" 
                @click="closeUpdateStatus"
              >
              <v-icon size="30">mdi-cancel</v-icon>
              </v-btn
              >
              <v-btn
                color="grey"
                variant="text"
                @click="updateStatusItem"
              >
              <v-icon size="30">mdi-pokeball</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogCategory"
          transition="dialog-bottom-transition"
          max-width="400px"
        >
          <v-card
            class="elevation-12"
            variant="elevated"
          > 
            <v-card-title class="text-h6 font-weight-regular bg-grey-darken-2">
              <v-icon size="30" >mdi-shape-plus</v-icon>&nbsp; Categories
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
                v-model="categoryData.name"
                label="Category"
                variant="outlined"
                @keyup.enter="createCategory"
              >
              </v-text-field>
              <div class="text-center">
                <v-btn
                  class="bg-grey-darken-2"
                  prepend-icon="mdi-copyright"
                  text="Create"
                  variant="outlined"
                  @click="createCategory"
                >
                </v-btn>
                <v-btn
                  class="bg-grey-darken-2"
                  prepend-icon="mdi-close-circle-outline"
                  text="Close"
                  variant="outlined"
                  @click="dialogCategory=false"
                >
                </v-btn>
              </div>
              <v-divider></v-divider>
                <v-col>
                  <v-data-table
                    :headers="categoryHeaders"
                    :items="categoryItems"
                    hide-default-footer
                  >
                    <template v-slot:[`item.number`]="{ index}">
                      <tr>
                        <td>{{index + 1}}</td>
                      </tr>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                      <div class="text-end">
                        <v-icon size="small" @click="editCategories(item)"> mdi-pencil-outline </v-icon>
                        <v-icon size="small" @click="updateStatusCategory(item)"> mdi-radioactive </v-icon>
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
         <!-- Dialog Update Category -->
      <v-dialog
        v-model="dialogEditCategory"
        transition="dialog-bottom-transition"
        width="auto"
      >
      <v-card
          class="elevation-12"
          variant="elevated"
        > 
          <v-card-title class="text-h6 font-weight-regular bg-grey-darken-2">
            <v-icon size="30" >mdi-shape-plus</v-icon>&nbsp; Add Category
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
              v-model="editCategory.name"
              label="Category"
              variant="outlined"
              @keyup.enter="updateCategory"
            >
            </v-text-field>
            <div class="text-center">
              <v-btn
                class="bg-grey-darken-2"
                prepend-icon="mdi-shape-plus"
                text="Update"
                variant="outlined"
                @click="updateCategory"
              >
              </v-btn>
            </div>
        </v-card>
      </v-dialog>
      <!-- Dialog Inactive Category -->
      <v-dialog v-model="dialogInactive" max-width="500px">
          <v-card
            class="elevation-12"
            variant="elevated"
          >
            <v-card-title 
              class="bg-grey-darken-2 text-h5"
            >Change the status of this category?</v-card-title
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
                @click="updateStatusCategoryConfirm"
              >
              <v-icon size="30">mdi-check</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
      </v-dialog>
           <!-- </div> -->
    <v-data-table 
      v-model:search="search" 
      :filter-keys="['item_name']" 
      :headers="headers"
      :items="masterItems"
      loading-text="Loading... Please wait"
      :loading="loadingData"
      color="blue"
    >
      <template v-slot:[`item.in_stock`]="{ item }">
        <div class="text-center">
          <v-chip
            :color="item.in_stock ? 'green' : 'red'"
            :text="item.in_stock ? 'In stock' : 'Out of stock'"
            class="text-uppercase"
            size="small"
            label
          ></v-chip>
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
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)"> mdi-pencil-outline </v-icon>
        <v-icon size="small" @click="updateItem(item)">mdi-radioactive</v-icon>
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
          { title: 'Item Name', align: 'start', key: 'item_name' },
          { title: 'Item Code', align: 'start', key: 'item_code' },
          { title: 'Item Type', align: 'start', key: 'item_type' },
          { title: 'Category', align: 'start', key: 'category' },
          { title: 'Cost of Goods', align: 'center', key: 'cost_of_goods_sold' },
          { title: 'Selling Price', align: 'center', key: 'selling_price'},
          { title: 'Stock', align: 'center', key: 'in_stock'},
          { title: 'Status', align: 'center', key: 'active_flag'},
          { title: 'Actions', key: 'actions', sortable: false },
        ],
        categoryHeaders: [
        { title: 'No.', align: 'start', key: 'number' },
          { title: 'Category', align: 'start', key: 'name' },
          { title: 'Status', align: 'start', key: 'active_flag' },
          { title: 'Actions', key: 'actions', sortable: false },
        ],
        editedItem: {
          item_name: '',
          item_code: '',
          item_type: '',
          category_id: '',
          category: '',
          cost_of_goods_sold: 0,
          selling_price: 0,
          in_stock: '',
          active_flag: '',
        },
        item_type : [
          {
            name: "ASSET",
          },
          {
            name: "ITEM",
          },
        ],
        categoryData: [],
        categoryItems: [],
        editCategory: [],
        masterItems: [],
        dialog: false,
        dialogUpdateItem: false,
        dialogCategory: false,
        dialogEditCategory: false,
        dialogInactive: false,
        editedIndex: -1,
        hasSaved: false,
        loadingData: true,
        alert: true,
        error:'',
        }
    },

    created() {
      
      this.getAllData();
      this.getAllCategory();
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
      dialogUpdateItem(val) {
        val || this.closeUpdateStatus()
      },
    },

    methods: {
      editItem(item) {
        console.log(item);
        this.editedIndex = this.masterItems.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      updateItem(item) {
        this.editedIndex = this.masterItems.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogUpdateItem = true
        
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        })
      },

      closeUpdateStatus() {
        this.dialogUpdateItem = false
        this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        })
      },

      editCategories(item) {
        this.dialogEditCategory = true;
        this.editCategory = item;
        console.log(this.editCategory);
      },

      updateStatusCategory(item) {
        this.editCategory = item;
        this.dialogInactive = true;
      },

      async getAllData() {

        try {

          await AxiosInstance.get(`http://127.0.0.1:8000/api/masteritems/all`,
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

                if(response.data.data[i].in_stock =='N') {
                  response.data.data[i].in_stock = null;
                }
              }

            this.masterItems = response.data.data;
            this.loadingData = false;
          }
        })
        }catch (error) {
          this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],)
          this.alert = true
        } 
      },

      async getAllCategory() {

        try {
          await AxiosInstance
           .get('http://127.0.0.1:8000/api/categoryitems/all',
              {
              headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
              },
            })
            .then((response) => {

              if(response.status == 200){
                  for(let i=0; i<response.data.data.length; i++) {
                    if(response.data.data[i].active_flag =='N') {
                      response.data.data[i].active_flag = null;
                    }
                      this.categoryItems = response.data.data[i];
                }
                  this.categoryItems = response.data.data;
              }
            })
        } catch(error) {
          this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
          this.alert = true;
        }
      },

      async save() {
        if (this.editedIndex > -1) {
          let postData = this.editedItem;

        try{ 
          let response = '';

          response = await AxiosInstance
          .put('http://127.0.0.1:8000/api/masteritems/'+this.editedItem.id, postData,
              {
              headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
              },
          })
            if (response.status == 200) {
              Object.assign(this.masterItems[this.editedIndex], this.editedItem);
              this.close();
              this.hasSaved = true;
            }
            // console.log(this.editedItem)
        }catch (error) {
          this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
          this.alert = true
        }
        } else {
          let postData = this.editedItem;

        try{ 
          let response = '';
            response = await AxiosInstance
            .post('http://127.0.0.1:8000/api/masteritems', postData, {
              headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
              },
            })

              if (response.status == 201) {
                this.masterItems.push(this.editedItem);
                this.close();
                this.hasSaved = true;
              }
        }catch (error) {
          this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
          this.alert = true
        }
      }
    },

    async updateStatusItem() {
      try{ 
        await AxiosInstance
        .patch('http://127.0.0.1:8000/api/masteritems/inactive/'+this.editedItem.id, [],
            {
            headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            },
          })
          .then((response) => {
            if(response.status == 200) {
              this.getAllData();
            }
          });
        this.masterItems.splice(this.editedIndex, 1)
        } catch (error) {this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
        }
          this.closeUpdateStatus()
      },

    async createCategory() {
      try{ 
        let postData = {
         name: this.categoryData.name,
        };

        console.log(this.categoryData);

        await AxiosInstance
        .post('http://127.0.0.1:8000/api/categoryitems', postData,
            {
            headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            },
          })
          .then((response) => {
            if(response.status == 200) {
              this.getAllCategory();
            }
          });

        } catch (error) {this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
        }
      },

    async updateCategory() {
      try{ 
        let postData = {
         name: this.editCategory.name,
        };

        console.log(this.categoryData);

        await AxiosInstance
        .patch('http://127.0.0.1:8000/api/categoryitems/'+this.editCategory.id, postData,
            {
            headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            },
          })
          .then((response) => {
            if(response.status == 200) {
              this.getAllCategory();
              this.dialogEditCategory = false;
            }
          });

        } catch (error) {this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
        }
      },

      async updateStatusCategoryConfirm() {
        try{ 
          await AxiosInstance
          .patch('http://127.0.0.1:8000/api/categoryitems/inactive/'+this.editCategory.id, [],
            {
              headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
              },
          })
          .then((response) => {

            if(response.status == 200){
              this.dialogInactive = false;
              this.getAllCategory();
            }
          });
        } catch (error) {
        this.error = Validations.getErrorMessageFromCodeCustomer(error.response.data.errors[0],);
        this.alert = true
        }    
      },

    },
}
</script>