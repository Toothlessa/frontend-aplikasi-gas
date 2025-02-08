<template>
    <v-container class="bg-">
        <v-row no-gutters>
            <v-col>
                <v-card
                    align="center"
                    class="elevation-12"
                    color="blue-grey-lighten-5"
                    width="280"
                >
                <v-card-title class="text-h6 font-weight-regular bg-grey-darken-1">
                    <v-icon size="30">mdi-basket-fill</v-icon>&nbsp;Input Stock
                </v-card-title>
                    <v-col cols="12">
                        <v-autocomplete
                            label="Item"
                            v-model="selectedItem"
                            :items="mItems"
                            item-title="item_name"
                            item-value="id"
                            variant="outlined"
                            color="black"
                        >
                        </v-autocomplete>
                        <v-text-field
                            v-model="input"
                            label="Stock"
                            type="number"
                            variant="outlined"
                            color="black"
                        >
                        </v-text-field>
                        <v-snackbar
                            class="text-center"
                            v-model="hasSaved"
                            color="orange"
                            :timeout="2000"
                            location="top center"
                        >
                        Data telah tesimpan
                        </v-snackbar>
                    <v-col class="text-right">
                        <v-btn
                            class="text-white"
                            absolute
                            color="grey-darken-1"
                            rounded="lg"
                            :disabled="isSaveDisabled"
                            :loading="loadingButton"
                            @click="inputStock"
                        >
                        Input
                        </v-btn>
                    </v-col>
                </v-col>
                </v-card>
            </v-col>
            <v-col>
                <v-card 
                    class="elevation-12 font-weight-regular" 
                    width="810" 
                    variant="elevated"
                    color="#f0f5ff"
                >
                <v-card-title class="text-h6 font-weight-regular bg-grey-darken-1">
                    <v-icon size="30">mdi-google-circles-group</v-icon>&nbsp; Current Stock
                </v-card-title>
                    <v-data-table
                        class="text-black bg-blue-grey-lighten-5"
                        :headers="headers"
                        :items="stocks"
                        :search="search"
                        loading-text="Loading... Please wait"
                        :loading="loadingData"
                    >
                    <template v-slot:[`item.action`]="{item}">
                        <v-icon size="20" @click="detailsStock(item)">mdi-developer-board </v-icon>
                    </template>
                    </v-data-table>
                    <v-dialog v-model="dialogDetails" width="800">
                            <v-card
                                class="elevation-12"
                                variant="elevated"
                            >
                            <v-table class="mt-n2">
                            <template v-slot:default>
                                <thead class="bg-grey-darken-1">
                                <tr>
                                    <th class="text-left">No</th>
                                    <th class="text-left">Nama Barang</th>
                                    <th class="text-left">Kode Barang</th>
                                    <th class="text-left">Kategori</th>
                                    <th class="text-left">Stock Input</th>
                                    <th class="text-left">Tanggal</th>
                                    <th class="text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="item in detailStock" :key="item.id">
                                    <td>{{ item.id }}</td>
                                    <td>{{ item.item_name }}</td>
                                    <td>{{ item.item_code }}</td>
                                    <td>{{ item.category }}</td>
                                    <td>{{ item.stock }}</td>
                                    <td>{{ item.created_at }}</td>
                                    <td>
                                        <v-btn
                                            variant="text"
                                            @click="editStock(item)"
                                        >
                                        <v-icon size="20">mdi-update</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                                </tbody>
                            </template>
                            </v-table>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogUpdate" max-width="340">
                                <v-card
                                    align="center"
                                    class="elevation-12"
                                    color="blue-grey-lighten-5"
                                    width="300"
                                >
                                <v-card-title class="text-h6 font-weight-regular bg-grey-darken-1">
                                    <v-icon size="30">mdi-google-circles-group1</v-icon>&nbsp;Update Stock
                                </v-card-title>
                                <v-col cols="12">
                                    <v-autocomplete
                                        label="Item"
                                        v-model="editedStock.item_id"
                                        :items="mItems"
                                        item-title="item_name"
                                        item-value="id"
                                        variant="outlined"
                                        color="black"
                                    >
                                    </v-autocomplete>
                                    <v-text-field
                                        v-model="editedStock.stock"
                                        label="Stock"
                                        type="number"
                                        variant="outlined"
                                        color="black"
                                    >
                                    </v-text-field>
                                </v-col>
                                    <v-card-actions>
                                        <v-btn class="text-white mb-2" color="grey-darken-1" variant="elevated"  @click="dialogUpdate = false">
                                        Cancel
                                        </v-btn>
                                        <v-btn class="text-white mb-2" color="grey-darken-1" variant="elevated" @click="updateStock">
                                        Update
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
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

export default{
    data:() => ({
        headers: [
          {
            align: 'start',
            key: 'item_name',
            title: 'Nama Barang',
          },
          { key: 'item_code', title: 'Kode Barang', },
          { key: 'category', title: 'Kategori' },
          { key: 'cogs', title: 'Harga Modal', align: 'center' },
          { key: 'selling_price', title: 'Harga Jual', align: 'center' },
          { key: 'total_stock', title: 'Running Stock', align: 'center' },
          { key: 'action', title: 'Details', sortable: false },
        ],
        search: '',
        selectedItem: null,
        input: '',
        hasSaved: false,
        dialogDetails: false,
        dialogUpdate: false,
        loadingData: true,
        loadingButton: false,
        error: '',
        stocks:[],
        mItems:[],
        detailStock:[],
        editedStock: {
            item_id: null,
            stock: null,
        },
    }),

    computed: {
        isSaveDisabled(){
            return !(this.selectedItem && this.input);
        }
    },

    created() {
        this.getMasterItem();
        this.getCurrentStockSummary();
    },

    methods : {

        async getMasterItem() {

            try{
                await AxiosInstance.get(`http://127.0.0.1:8000/api/masteritems/all`,
                {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    }})
                    .then((response) => {
                        this.mItems = response.data.data;
                });
            } catch(error) {
                this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
                this.alert = true
            }
        },

        async getCurrentStockSummary() {

            try {
                await AxiosInstance.get(`http://127.0.0.1:8000/api/stockitems/currentstock`,
                {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    }
                }
                )
                    .then((response) => {
                        this.stocks = response.data.data;

                        if(response.status == 200){
                        this.loadingData = false
                    }});
            } catch(error) {
                this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
                this.alert = true
            }
        },

        async inputStock() {
            let postData = {
                stock : this.input,
            }
            try{ 

            let response = ''
            response = 
                await AxiosInstance
                .post('http://127.0.0.1:8000/api/stockitems/'+this.selectedItem, postData,
                    {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    },
                })
                    console.log(this.mItems)
                    console.log(response.data)
                if (response.status == 201) {
                    this.stocks = Object.assign(this.stocks, response.data.data);
                    this.hasSaved = true
                    this.selectedItem = null
                    this.input = null
                    this.getCurrentStockSummary();
                }

                } catch (error) {
                this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
                this.alert = true;
                }

                this.loadingButton = true
                setTimeout(() => (this.loadingButton = false), 500)
        },

        async detailsStock(item) {

            this.detailStock = Object.assign({}, item);
            try{
                await AxiosInstance
                .get('http://127.0.0.1:8000/api/stockitems/detailstock/' +this.detailStock.item_id, 
                {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    },
                }).then((response) => {
                    this.detailStock = response.data.data;
                })
            } catch (error) {
                this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0], );
                this.alert = true;
            }
            this.dialogDetails = true;
        },

        editStock(item) {

            this.editedStock = Object.assign({}, item);
            console.log(this.editedStock);
            this.alert = true;
            this.dialogUpdate = true;
        },

        async updateStock() {

            let postData = this.editedStock;
            try {
                await AxiosInstance
                .put('http://127.0.0.1:8000/api/stockitems/' +this.editedStock.id, postData,
                {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    },
                }).then((response) => {

                if(response.status === 200) {
                    this.detailsStock(postData);
                    this.getCurrentStockSummary();
                    this.hasSaved = true;
                }
                });
            } catch(error) {
                this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0],);
                this.alert = true;
            }

            this.dialogUpdate = false;
        },

    },
}
</script>

<style scoped>
    .border {
    border: 2px solid #2ebfaf !important;
    }
</style>