<template>
     <!-- <v-parallax src="https://img.freepik.com/free-vector/futuristic-technological-wallpaper_79603-1093.jpg?t=st=1737270463~exp=1737274063~hmac=4888f5d5592a95935d0de49819ba6f4e799ea777454dff05e1112138e377d444&w=1380"> -->
    <v-container class="bg-">
        <v-row no-gutters>
            <v-col>
                <v-card
                    align="center"
                    class="elevation-12"
                    color="#f0f5ff"
                    width="280"
                >
                <v-card-title class="text-h6 font-weight-regular bg-grey-darken-1">
                    <v-icon size="30">mdi-archive</v-icon>&nbsp;Input Stock
                </v-card-title>
                    <v-col cols="12">
                        <v-autocomplete
                            label="Item"
                            v-model="selectedItem"
                            :items="mItems"
                            item-title="item_name"
                            item-value="id"
                            align="center"
                            variant="outlined"
                            color="black"
                        >
                        </v-autocomplete>
                        <v-text-field
                            v-model="input"
                            label="Stock"
                            type="number"
                            align="center"
                            variant="outlined"
                            color="black"
                        >
                        </v-text-field>
                        <v-snackbar
                            class="text-center"
                            v-model="hasSaved"
                            :timeout="2000"
                            location="top left"
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
                    class="elevation-12 
                    font-weight-regular bg-blue-grey" 
                    width="810" 
                    variant="elevated"
                >
                    <v-data-table
                        :headers="headers"
                        :items="stocks"
                        :search="search"
                        loading-text="Loading... Please wait"
                        :loading="loadingData"
                    >
                    </v-data-table>
            </v-card>
        </v-col>
        </v-row>
    </v-container>
<!-- </v-parallax> -->
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
        ],
        search: '',
        selectedItem: '',
        input: '',
        hasSaved: false,
        loadingData: true,
        loadingButton: false,
        error: '',
        stocks:[],
        mItems:[],
    }),

    computed: {
        isSaveDisabled(){
            return !(this.selectedItem && this.input);
        }
    },

    mounted() {
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

        //get Current Stock
        AxiosInstance.get(`http://127.0.0.1:8000/api/stockitems/currentstock`,
        {
            headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            }
          }
        )
            .then((response) => {
                this.getCurrStock(response.data.data);
            
                if(response.status == 200){
                this.loadingData = false
            }
        });
    },

    methods : {
        getMItemData(mItems) {
            for(let key in mItems) {
                this.mItems.push({ ...mItems[key],})
            }
        },
        getCurrStock(stocks) {
            for(let key in stocks) {
                this.stocks.push({ ...stocks[key],})
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
                // Object.assign(this.mItems, response.data)
                this.hasSaved = true
                this.selectedItem = null
                this.input = null
            }

            } catch (error) {
            this.error = Validations.getErrorMessageFromCode(
                error.response.data.errors[0],
            );
            }
            this.loadingButton = true
            setTimeout(() => (this.loadingButton = false), 500)
        }
    },
}
</script>

<style scoped>
    .border {
    border: 2px solid #2ebfaf !important;
    }
</style>